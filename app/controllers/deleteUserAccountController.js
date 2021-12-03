const { checkPasswordBoolean } = require("../helpers/hash");
const response = require("../helpers/responseHelper");
const userRepo = require("../repositories/userRepo");
const userRoleRepo = require("../repositories/userRoleRepo");
const addressRepo = require("../repositories/addressRepo");
const companyRepo = require("../repositories/companyRepo");
const infoRepo = require("../repositories/infoRepo");
const socialMediaRepo = require("../repositories/socialMediaRepo");
const tokenService = require("../services/tokenService");
const validate = require("../validations/userAuthValidation");
const sessionRepo = require("../repositories/sessionRepo");
const { redisSessionStoreDestroy } = require("../services/sessionService");

module.exports.removeUserWithAllInformations = async (req, res) => {
    try {
        validate.removeUser(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        const userId = decode_token.id
        const user = await userRepo.getById(userId)
        if (!user)
            return response.error(res, "access denied !")//wrong username

        if (!await checkPasswordBoolean(req.body.password, user.password))
            return response.error(res, "access denied !!")//wrong password


        await userRepo.removeByid(userId)
        await userRoleRepo.remove({ user_id: userId })
        await addressRepo.remove({ userable_id: userId, userable_type: "user" })
        await companyRepo.remove({ userable_id: userId, userable_type: "user" })
        await infoRepo.remove({ userable_id: userId, userable_type: "user" })
        await socialMediaRepo.remove({ userable_id: userId, userable_type: "user" })

        const sessions = sessionRepo.getAll({ user_id: userId })
        if (sessions && sessions.length > 0) {
            for (let i = 0; i < sessions.length; i++) {
                await redisSessionStoreDestroy(sessions[i].id)
            }
            await sessionRepo.remove({ user_id: userId })
        }
        await tokenService.logout()

        return response.success(res, [])

    } catch (e) {
        return response.exception(res, e);
    }
}