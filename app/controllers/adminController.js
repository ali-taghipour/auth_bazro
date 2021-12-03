const { checkPasswordBoolean } = require("../helpers/hash");
const response = require("../helpers/responseHelper");
const adminRepo = require("../repositories/adminRepo");
const serviceRepo = require("../repositories/serviceRepo");
const tokenService = require("../services/tokenService");
const walletService = require("../services/walletService");
const otpService = require("../services/otpService");
const validate = require("../validations/adminAuthValidation");
const JWT = require("../helpers/JWTHelper")
const sessionService = require("../services/sessionService")

//login admin by username and password
module.exports.loginByUserAndPass = async (req, res) => {
    try {
        validate.loginByUserAndPass(req.body)
        const admin = await adminRepo.getByUsername(req.body.username)
        if (!admin)
            return response.error(res, "username or password was incorrected")
        if (!await checkPasswordBoolean(req.body.password, admin.password))//matching password and saved hashedPassword in database
            return response.error(res, "username or password was incorrected")
        const { token } = await tokenService.generatTokenAdmin(admin) //making JWT AccessToken for Admin
        const refreshToken = await tokenService.makeRefreshToken(admin.id, "admin", admin.service_id)
        sessionService.setSessionForUser(req, admin.id)//setting user_id in session & add session to SessionModel
        const wallet = await walletService.setNewWallet(
            admin.username,
            admin.service_id,
            null,
            admin.wallet_id,
            admin.id,
            "admin",
        )
        return response.success(res, { token, refreshToken, wallet: wallet })

    } catch (e) {
        return response.exception(res, e);
    }
}
//login admin by phone_number and sending code to the phone
module.exports.requestLoginByPhoneNumber = async (req, res) => {
    try {
        validate.requestLoginByPhoneNumber(req.body)
        const admin = await adminRepo.getByPhoneNumber(req.body.phone_number)
        if (!admin)
            return response.error(res, "admin with this number not found")

        const phone = await otpService.sendOtpByPhone(admin.phone_number, admin.id, "admin")//make and send random code to the phone for verification
        if (!phone)
            return response.error(res, "your phone number blocked for 2 hours (too many try)")
        return response.success(res, { phone_number: req.body.phone_number })

    } catch (e) {
        return response.exception(res, e);
    }
}

//verify phone_number by sended code (otp) and login admin
module.exports.verifyLoginByPhoneNumber = async (req, res) => {
    try {
        validate.verifyLoginByPhoneNumber(req.body)

        const otp = await otpService.verifyOtpByPhone(req.body.phone_number, req.body.code)
        if (otp instanceof Error)
            throw otp
        if (!otp.userable_type == "admin") //otp should for admins
            return response.error(res, "access denid !!")
        const admin = await adminRepo.getById(otp.userable_id)

        if (!admin)
            return response.error(res, "admin not founded !!")

        sessionService.setSessionForUser(req, admin.id)
        const { token } = await tokenService.generatTokenAdmin(admin)//making JWT AccessToken for Admin
        const refreshToken = await tokenService.makeRefreshToken(admin.id, "admin", admin.service_id)

        const wallet = await walletService.setNewWallet(
            admin.username,
            admin.service_id,
            null,
            admin.wallet_id,
            admin.id,
            "admin",
        )
        return response.success(res, { token, refreshToken, wallet: wallet })

    } catch (e) {
        return response.exception(res, e);
    }
}

//admin logout = remove session and dstroy jwt
module.exports.logOut = async (req, res) => {
    try {
        await sessionService.deleteSession(req)
        await JWT.destroy(req.headers.authorization)
        return response.success(res, [])
    } catch (e) {
        return response.exception(res, e);
    }
}

//get all admin list (with fiter and pagination) by superAdmin
module.exports.getAllAdmins = async (req, res) => {
    try {
        validate.getAll(req.body)
        const filter = req.body.filter ? typeof req.body.filter === String ? JSON.parse(req.body.filter) : req.body.filter : {};
        const orderBy = req.body.sort_by ? req.body.sort_by : "id";
        const orderType = req.body.sort_type && req.body.sort_type == 1 ? "ASC" : "DESC";
        const limit = req.body.per_page ? req.body.per_page : 10;
        const offset = req.body.page ? (req.body.page > 0 ? req.body.page - 1 : 0) * limit : 0;

        let count = await adminRepo.count(filter)
        let data = [];
        if (count > 0)
            data = await adminRepo.getAll(filter, orderBy, orderType, offset, limit)
        return response.success(res, data)
    } catch (e) {
        return response.exception(res, e);
    }
}

//get one admin by adminId by superAdmin
module.exports.getAdminById = async (req, res) => {
    try {
        validate.params(req.params)
        const data = await adminRepo.getById(req.params.adminId)
        if (!data)
            return response.error(res, "admin not founded")
        delete data.password
        return response.success(res, data)
    } catch (e) {
        return response.exception(res, e);
    }
}

//getting all admin information by his/her self (admim users)
//including adminModel &(addresses - companies - info - socialMedia)
module.exports.getMe = async (req, res) => {
    try {
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        const id = decode_token.id
        const data = await adminRepo.getByIdWithRelations(id)
        if (!data)
            return response.error(res, "access denied")
        data.password = null
        return response.success(res, data)
    } catch (e) {
        return response.exception(res, e);
    }
}


//upadate one admin record in adminModel by  his/her self(for admin) or by adminId (for superAdmin)
module.exports.updateAdmin = async (req, res) => {
    try {
        validate.update(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        let id = null
        if (decode_token.role == "super_admin") {
            validate.params(req.params)
            id = req.params.adminId
        }
        if (decode_token.role == "admin") {
            id = decode_token.id
        }

        const admin = await adminRepo.getById(id)

        if (!admin)
            return response.error(res, "admin not founded")
        const result = await adminRepo.updateAdmin(admin.id, req.body, decode_token.role)
        return response.success(res, [])
    } catch (e) {
        return response.exception(res, e);
    }
}

//add a new admin (available only for superAdmin)
module.exports.registerNewAdmin = async (req, res) => {
    try {
        validate.register(req.body)
        await adminRepo.checkAdminIsAvailble(req.body.username, req.body.phone_number)//check username or phoneNumber was used before
        const service = await serviceRepo.getById(req.body.service_id)//get service service by service_id
        if (!service)
            return response.error(res, "service is not founded")
        const result = await adminRepo.addNewAdmin(req.body)
        const wallet = await walletService.setNewWallet(
            result.username,
            service.id,
            null,
            result.wallet_id,
            result.id,
            "admin",
        )
        return response.success(res, { admin: result, wallet: wallet })
    } catch (e) {
        return response.exception(res, e);
    }
}




