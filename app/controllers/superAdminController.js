const response = require("../helpers/responseHelper");
const superAdminRepo = require("../repositories/superAdminRepo")
const tokenService = require("../services/tokenService");
const otpService = require("../services/otpService");
const { checkPasswordBoolean } = require("../helpers/hash");
const validate = require("../validations/superAdminValidation");
const JWT = require("../helpers/JWTHelper")
const sessionService = require("../services/sessionService")

//login superAdmin by username and password
module.exports.loginByUserAndPass = async (req, res) => {
    try {
        validate.loginByUserAndPass(req.body)
        const superAdmin = await superAdminRepo.getByUsername(req.body.username)
        if (!superAdmin)
            return response.error(res, "username or password was incorrected")

        if (!await checkPasswordBoolean(req.body.password, superAdmin.password))//matching password and saved hashedPassword in database
            return response.error(res, "username or password was incorrected")

        const refreshToken = await tokenService.makeRefreshToken(superAdmin.id, "super_admin")
        const { token } = await tokenService.generatTokenSuperAdmin(superAdmin)//making JWT AccessToken for superAdmin
        return response.success(res, { token, refreshToken })

    } catch (e) {
        return response.exception(res, e);
    }
}

//login superAdmin by phone_number and sending code to the phone
module.exports.requestLoginByPhoneNumber = async (req, res) => {
    try {
        validate.requestLoginByPhoneNumber(req.body)
        const superAdmin = await superAdminRepo.getByPhoneNumber(req.body.phone_number)

        if (!superAdmin)
            return response.error(res, "super-admin with this number not found")

        const phone = await otpService.sendOtpByPhone(superAdmin.phone_number, superAdmin.id, "super_admin")//make and send random code to the phone for verification
        if (!phone)
            return response.error(res, "your phone number blocked for 2 hours (too many try)")
        return response.success(res, { phone_number: req.body.phone_number })

    } catch (e) {
        return response.exception(res, e);
    }
}

//verify phone_number by sended code (otp) and login superAdmin
module.exports.verifyLoginByPhoneNumber = async (req, res) => {
    try {
        validate.verifyLoginByPhoneNumber(req.body)
        const otp = await otpService.verifyOtpByPhone(req.body.phone_number, req.body.code)
        if (otp instanceof Error)
            throw otp
        if (!otp.userable_type == "super_admin")//otp should for superAdmins
            return response.error(res, "access denid !!")
        const superAdmin = await superAdminRepo.getById(otp.userable_id)
        if (!superAdmin)
            return response.error(res, "super-admin not founded !!")

        const refreshToken = await tokenService.makeRefreshToken(superAdmin.id, "super_admin")
        const { token } = await tokenService.generatTokenSuperAdmin(superAdmin)//making JWT AccessToken for superAdmin
        return response.success(res, { token, refreshToken })

    } catch (e) {
        return response.exception(res, e);
    }
}

//getting all superAdmin information by his/her self (superAdmin users)
//including superAdminModel &(addresses - companies - info - socialMedia)
module.exports.getMe = async (req, res) => {
    try {
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        const id = decode_token.id
        const data = await superAdminRepo.getByIdWithRelations(id)
        if (!data)
            return response.error(res, "access denied")
        data.password = null
        return response.success(res, data)
    } catch (e) {
        return response.exception(res, e);
    }
}


//upadate superAdmin record in superAdminModel by his/her self(for superAdmin)
module.exports.update = async (req, res) => {
    try {
        validate.update(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        let id = decode_token.id
        const superAdmin = await superAdminRepo.getById(id)

        if (!superAdmin)
            return response.error(res, "super-admin not founded")
        const result = await superAdminRepo.updateSuperAdmin(superAdmin, req.body)
        return response.success(res, [])
    } catch (e) {
        return response.exception(res, e);
    }
}



//superAdmin logout = remove session and dstroy 
module.exports.logOut = async (req, res) => {
    try {
        await sessionService.deleteSession(req)
        await JWT.destroy(req.headers.authorization)
        return response.success(res, [])
    } catch (e) {
        return response.exception(res, e);
    }
}




