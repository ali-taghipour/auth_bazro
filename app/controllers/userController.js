const { checkPasswordBoolean } = require("../helpers/hash");
const response = require("../helpers/responseHelper");
const userRepo = require("../repositories/userRepo");
const roleRepo = require("../repositories/roleRepo");
const tokenService = require("../services/tokenService");
const otpService = require("../services/otpService");
const userRoleRepo = require("../repositories/userRoleRepo");
const { Op } = require("sequelize");
const userService = require("../services/userService");
const sessionService = require("../services/sessionService");
const walletService = require("../services/walletService");
const validate = require("../validations/userAuthValidation");
const { role: roleModel, service, userRole: userRoleModel, info, } = require("../models");
const JWT = require("../helpers/JWTHelper");

//login user by username and password
module.exports.loginByUserAndPass = async (req, res) => {
    try {
        validate.paramsLogin(req.params) //roleId,serviceId
        validate.loginByUserAndPass(req.body) //username,password,
        const user = await userRepo.getByUsername(req.body.username)
        if (!user)
            return response.error(res, "username or password was incorrected")

        if (!await checkPasswordBoolean(req.body.password, user.password))
            return response.error(res, "username or password was incorrected")

        await sessionService.setSessionForUser(req, user.id)//setting user_id in session & add session to SessionModel

        const role = await roleRepo.getById(req.params.roleId, { include: [roleModel.service, { association: roleModel.userRoles, where: { user_id: user.id } }] })
        if (!role)
            return response.error(res, "role is not founded")

        if (!role.user_roles[0] || role.user_roles[0].is_blocked)
            return response.error(res, "user is blocked")

        if (!role.service && role.service.id != req.body.serviceId)
            return response.error(res, "service is not founded")

        //getting or making roleUser(connection of user and role) for getting wallet_id 
        let userRole
        if (role.is_permission != true) {
            userRole = await userRoleRepo.findOrCreateByRoleUserIds(user.id, role.id, role.service_id)
        } else {
            userRole = await userRoleRepo.findByRoleAndUserId(user.id, role.id, role.service_id)
            if (!userRole)
                return response.error(res, "access to this role is denied")
        }

        //genearting token for user by role informaion
        const { token } = await tokenService.generatTokenUser(
            user.id,
            user.username,
            userRole.wallet_id,
            role.service.id,
            role.id,
            role.service.packet_id)
        const refreshToken = await tokenService.makeRefreshToken(user.id, "user", role.service.id, userRole.id)
        const wallet = await walletService.setNewWallet(
            user.username,
            role.service.id,
            role.id,
            userRole.wallet_id,
            user.id,
            "user",
            role.service.name,
            role.name,
        )
        return response.success(res, { token, refreshToken, wallet: wallet })

    } catch (e) {
        return response.exception(res, e);
    }
}

//login user by phone_number and sending code to the phone
module.exports.requestLoginByPhoneNumber = async (req, res) => {
    try {
        validate.paramsLogin(req.params) //roleId,serviceId        
        validate.requestLoginByPhoneNumber(req.body)//phone_number
        const user = await userRepo.getByPhoneNumber(req.body.phone_number)
        if (!user)
            return response.error(res, "user with this number not found")

        const role = await roleRepo.getById(req.params.roleId, { include: [roleModel.service, { association: roleModel.userRoles, where: { user_id: user.id } }] })

        if (!role)
            return response.error(res, "role is not founded")

        if (!role.user_roles[0] || role.user_roles[0].is_blocked)
            return response.error(res, "user is blocked")

        if (!role.service && role.service.id != req.body.serviceId)
            return response.error(res, "service is not founded")



        await sessionService.setSessionForUser(req, user.id)//setting user_id in session & add session to SessionModel

        const phone = await otpService.sendOtpByPhone(user.phone_number, user.id, "user")
        if (!phone)
            return response.error(res, "your phone number blocked for 2 hours (too many try)")
        return response.success(res, { phone_number: req.body.phone_number })

    } catch (e) {
        return response.exception(res, e);
    }
}

//verify phone_number by sended code (otp) and login user
module.exports.verifyLoginByPhoneNumber = async (req, res) => {
    try {
        validate.paramsLogin(req.params) //roleId,serviceId   
        validate.verifyLoginByPhoneNumber(req.body)//phone_number,code

        const otp = await otpService.verifyOtpByPhone(req.body.phone_number, req.body.code)
        if (otp instanceof Error)
            throw otp
        if (!otp.userable_type == "user")//otp should for users
            return response.error(res, "access denid !!")
        const user = await userRepo.getById(otp.userable_id)
        if (!user)
            return response.error(res, "user not founded !!")

        await sessionService.setSessionForUser(req, user.id)//setting user_id in session & add session to SessionModel

        const role = await roleRepo.getById(req.params.roleId, { include: [service] })
        if (!role)
            return response.error(res, "role is not founded")
        if (!role.service && role.service.id != req.body.serviceId)
            return response.error(res, "service is not founded")

        //getting or making roleUser(connection of user and role) for getting wallet_id 
        let userRole
        if (role.is_permission != true) {
            userRole = await userRoleRepo.findOrCreateByRoleUserIds(user.id, role.id, role.service_id)
        } else {
            userRole = await userRoleRepo.findByRoleAndUserId(user.id, role.id, role.service_id)
            if (!userRole)
                return response.error(res, "access to this role is denied")
        }
        //genearting token for user by role informaion
        const { token } = await tokenService.generatTokenUser(
            user.id,
            user.username,
            userRole.wallet_id,
            role.service.id,
            role.id,
            role.service.packet_id)
        const refreshToken = await tokenService.makeRefreshToken(user.id, "user", role.service.id, userRole.id)
        const wallet = await walletService.setNewWallet(
            user.username,
            role.service.id,
            role.id,
            userRole.wallet_id,
            user.id,
            "user",
            role.service.name,
            role.name,
        )
        return response.success(res, { token, refreshToken, wallet: wallet })

    } catch (e) {
        return response.exception(res, e);
    }
}

//get all admin list (with fiter and pagination) by superAdmin or admin
module.exports.getAllUsers = async (req, res) => {
    try {
        validate.getAll(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)

        const filter = req.body.filter ? typeof req.body.filter === String ? JSON.parse(req.body.filter) : req.body.filter : {};
        const orderBy = req.body.sort_by ? req.body.sort_by : "id";
        const orderType = req.body.sort_type && req.body.sort_type == 1 ? "ASC" : "DESC";
        const limit = req.body.per_page ? req.body.per_page : 10;
        const offset = req.body.page ? (req.body.page > 0 ? req.body.page - 1 : 0) * limit : 0;
        if (decode_token.role == "super_admin") {

        }
        if (decode_token.role == "admin") {
            const userIds = await userService.getAllAdminUsersByService(decode_token.service)
            if (!filter.id) {
                filter["id"] = { [Op.in]: userIds }
            } else {
                filter["id"] = { [Op.in]: userIds, ...filter["id"] }
            }
        }
        let count = await userRepo.count(filter)
        let data = [];
        if (count > 0)
            data = await userRepo.getAll(filter, orderBy, orderType, offset, limit, { include: { model: info, as: 'info'}})
        return response.success(res, data)
    } catch (e) {
        return response.exception(res, e);
    }
}

//get all admin list (with fiter and pagination) by superAdmin or admin
module.exports.deleteUser = async (req, res) => {
    try {
        validate.getAll(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        let user = null;

        if (decode_token.role == "admin") {
            user = await userRoleRepo.getOne({ service_id: decode_token.service, user_id: req.params.userId })
        }

        if (!user) {
            return response.error(res, "access to this user is denied")
        }

        user.destroy();

        data = await userRepo.removeByid(user.id)

        return response.success(res, data)
    } catch (e) {
        return response.exception(res, e);
    }
}

//get one user by userId (available for superAdmin/admin)
module.exports.getUserById = async (req, res) => {
    try {
        validate.params(req.params)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        if (decode_token.role == "super_admin") {

        }
        if (decode_token.role == "admin") {
            const userIds = await userService.getAllAdminUsersByService(decode_token.service)
            if (!userIds.includes(req.params.userId)) {
                return response.error(res, "access denied")
            }
        }
        const data = await userRepo.getById(req.params.userId, { attributes: { exclude: ['password'] } })
        if (!data)
            return response.error(res, "user not founded")
        return response.success(res, data)
    } catch (e) {
        return response.exception(res, e);
    }
}

//get one user by walletId (available for superAdmin/admin)
module.exports.getUserByWalletId = async (req, res) => {
    try {
        validate.getByWalletId(req.params)
        const userRole = await userRoleRepo.findByWalletId(req.params.walletId)
        if (!userRole)
            return response.error(res, "wallet_id not founded")
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        if (decode_token.role == "super_admin") {
        }
        if (decode_token.role == "admin") {
            if (userRole.service_id != decode_token.service)
                return response.error(res, "access denied")
        }

        const wallet = await walletService.getWalletById(req.params.walletId)
        return response.success(res, { userRole, wallet: wallet })
    } catch (e) {
        return response.exception(res, e);
    }
}

//getting all user information by his/her self (admim users)
//including userModel &(addresses - companies - info - socialMedia)
module.exports.getMe = async (req, res) => {
    try {
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        const data = await userRepo.getByIdWithRelations(decode_token.id)
        data.password = null
        return response.success(res, data)
    } catch (e) {
        return response.exception(res, e);
    }
}

//getting all user information by his/her self (admim users)
//including userModel &(addresses - companies - info - socialMedia)
module.exports.verifyEmail = async (req, res) => {
    try {
        let decode_token = await tokenService.decodeToken(req.headers.authorization)
        let data = await userRepo.getByIdWithRelations(decode_token.id)
        data = await userRepo.verifyEmail(data, req.params.token);

        if (!data)
            return response.error(res, 'user not verify')

        return response.success(res, data)
    } catch (e) {
        return response.exception(res, e);
    }
}



//upadate one user record in userModel by his/her self(for user) or by userId (for superAdmin or admin)
module.exports.updateUser = async (req, res) => {
    try {
        validate.update(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        let id;

        if (decode_token.role == "super_admin") {
            validate.params(req.params)
            id = req.params.userId
        }
        if (decode_token.role == "admin") {
            validate.params(req.params)
            const userIds = await userService.getAllAdminUsersByService(decode_token.service)
            if (!userIds.includes(req.params.userId)) {
                return response.error(res, "access denied")
            }
            id = req.params.userId
        }
        if (decode_token.role == "user") {
            id = decode_token.id
        }
        const user = await userRepo.getById(id)
        if (!user)
            return response.error(res, "user not founded")

        await userRepo.checkUserInfoIsAvailable(req.body, user)//check username or phoneNumber or email was used before

        const result = await userRepo.updateUser(user, req.body)
        return response.success(res, [])
    } catch (e) {
        return response.exception(res, e);
    }
}
//register New User by creditionals and roleId and serviceId
module.exports.registerNewUser = async (req, res) => {
    try {
        validate.paramsLogin(req.params) //roleId,serviceId
        validate.register(req.body) //username,password,phone_number,email(optional),
        await userRepo.checkUserIsAvailble(req.body.username, req.body.phone_number, req.body.email)

        const role = await roleRepo.getById(req.params.roleId, { include: [service] })
        if (!role)
            return response.error(res, "role is not founded")
        if (!role.service && role.service.id != req.body.serviceId)
            return response.error(res, "service is not founded")

        //adding new user to dataBase and creating some table(company,address,socialMedia,info) for him/her
        const user = await userRepo.addNewUser(req.body)

        await sessionService.setSessionForUser(req, user.id)//setting user_id in session & add session to SessionModel

        //getting or making roleUser(connection of user and role) for getting wallet_id 
        let userRole
        if (role.is_permission != true) {
            userRole = await userRoleRepo.findOrCreateByRoleUserIds(user.id, role.id, role.service_id)
        } else {
            userRole = await userRoleRepo.findByRoleAndUserId(user.id, role.id, role.service_id)
            if (!userRole)
                return response.error(res, "access to this role is denied")
        }
        //genearting token for user by role informaion
        const { token } = await tokenService.generatTokenUser(
            user.id,
            user.username,
            userRole.wallet_id,
            role.service.id,
            role.id,
            role.service.packet_id)
        const refreshToken = await tokenService.makeRefreshToken(user.id, "user", role.service.id, userRole.id)
        const wallet = await walletService.setNewWallet(
            user.username,
            role.service.id,
            role.id,
            userRole.wallet_id,
            user.id,
            "user",
            role.service.name,
            role.name,
        )
        return response.success(res, { token, refreshToken, wallet: wallet })
    } catch (e) {
        return response.exception(res, e);
    }
}

//user logout = remove session and dstroy 
module.exports.logOut = async (req, res) => {
    try {
        await sessionService.deleteSession(req)
        await JWT.destroy(req.headers.authorization)
        return response.success(res, [])
    } catch (e) {
        return response.exception(res, e);
    }
}

//block one user by walletId (available for admin)
module.exports.blockUserWithWalletId = async (req, res) => {
    try {
        validate.getByWalletId(req.params)
        const userRole = await userRoleRepo.findByWalletId(req.params.walletId)

        if (!userRole)
            return response.error(res, "wallet_id not founded")

        const decode_token = await tokenService.decodeToken(req.headers.authorization)

        if (userRole.service_id != decode_token.service)
            return response.error(res, "access denied")

        userRole.is_blocked = true;
        userRole.save();

        return response.success(res, { userRole })
    } catch (e) {
        return response.exception(res, e);
    }
}

//un block one user by walletId (available for admin)
module.exports.unBlockUserWithWalletId = async (req, res) => {
    try {
        validate.getByWalletId(req.params)
        const userRole = await userRoleRepo.findByWalletId(req.params.walletId)

        if (!userRole)
            return response.error(res, "wallet_id not founded")

        const decode_token = await tokenService.decodeToken(req.headers.authorization)

        if (userRole.service_id != decode_token.service)
            return response.error(res, "access denied")

        userRole.is_blocked = false;
        userRole.save();

        return response.success(res, { userRole })
    } catch (e) {
        return response.exception(res, e);
    }
}


//un block one user by walletId (available for admin)
module.exports.blackListUser = async (req, res) => {
    try {
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        const users = await userRoleRepo.getBlackList(decode_token.service)

        return response.success(res, { users })
    } catch (e) {
        return response.exception(res, e);
    }
}




