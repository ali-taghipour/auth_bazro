const response = require("../helpers/responseHelper");
const userRoleRepo = require("../repositories/userRoleRepo");
const tokenService = require("../services/tokenService");


exports.isSuperAdmin = async (req, res, next) => {
    try {
        await tokenService.tokenValidate(req.headers.authorization)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        if (decode_token && decode_token.role == "super_admin") {
            return next()
        }
        return response.error(res, "access denied,you are not super admin")
    } catch (e) {
        return response.exception(res, e);
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        await tokenService.tokenValidate(req.headers.authorization)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        if (decode_token && decode_token.role == "admin") {
            return next()
        }
        return response.error(res, "access denied,you are not admin")


    } catch (e) {
        return response.exception(res, e);
    }
}

exports.isUser = async (req, res, next) => {
    try {
        await tokenService.tokenValidate(req.headers.authorization)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)

        const userRole = await userRoleRepo.findByWalletId(decode_token.wallet_id)

        if (!userRole || userRole.is_blocked) {
            return response.error(res, "user is blocked")
        }
        if (decode_token && decode_token.role == "user") {
            return next()
        }
        return response.error(res, "access denied,you are not user")

    } catch (e) {
        return response.exception(res, e);
    }
}

