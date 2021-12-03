
const response = require("../helpers/responseHelper");
const securityQuestionRepo = require("../repositories/securityQuestionRepo");
const securityAnswerRepo = require("../repositories/securityAnswerRepo");
const validate = require("../validations/recoveryValidation");
const tokenService = require("../services/tokenService");
const lastPasswordRepo = require("../repositories/lastPasswordRepo");
const { checkPasswordBoolean } = require("../helpers/hash");
const recoveryRepo = require("../repositories/recoveryRepo");
const userRepo = require("../repositories/userRepo");

module.exports.createNewSecurityQuestion = async (req, res) => {
    try {
        validate.createSecurityQuestion(req.body)
        const securityQuestion = await securityQuestionRepo.addNew(req.body)

        return response.success(res, securityQuestion)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getAllSecurityQuestions = async (req, res) => {
    try {
        const securityQuestions = await securityQuestionRepo.getAll({})
        return response.success(res, securityQuestions)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.updateSecurityQuestion = async (req, res) => {
    try {
        validate.params(req.params)
        validate.updateSecurityQuestion(req.body)
        const securityQuestion = await securityQuestionRepo.getById(req.params.securityQuestionId)
        if (!securityQuestion)
            return response.error(res, "securityQuestion not founded")
        const result = await securityQuestionRepo.updateSecurityQuestion(securityQuestion.id, req.body)
        return response.success(res, [])
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.createNewSecurityAnswer = async (req, res) => {
    try {
        validate.createSecurityAnswer(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        const securityQuestion = await securityAnswerRepo.checkIsAvailbleOrCraete(req.body, decode_token.id)
        return response.success(res, securityQuestion[0])
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.recoverByLastPasword = async (req, res) => {
    try {
        validate.recoverByLastPasword(req.body)
        const user = await userRepo.getOne({ username: req.body.username })
        if (!user)
            return response.error(res, "user was not founded with this username")
        const allLastPassword = await lastPasswordRepo.findByUser(user)
        if (!allLastPassword)
            return response.error(res, "user has not any last password !")
        if (allLastPassword.length == 0)
            return response.error(res, "user has not any last password !!")
        let findLastPassword = false
        for (let i = 0; i < allLastPassword.length; i++) {
            // console.log("bodypass", req.body.last_password)
            // console.log("pass", allLastPassword[i].password)
            const isMatch = await checkPasswordBoolean(req.body.last_password, allLastPassword[i].password)
            if (isMatch) {
                findLastPassword = true
            }
        }
        if (!findLastPassword)
            return response.error(res, "last password does not match")
        await recoveryRepo.addNew(allLastPassword[0].user_id, "lastPassword")
        return response.success(res, [])
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.newPasswordAndConfirmUser = async (req, res) => {
    try {
        validate.confirmUser(req.body)
        const lastRecovery = await recoveryRepo.findByUsername(req.body.username)
        if (!lastRecovery)
            return response.error(res, "user was not start any recovery !")
        await userRepo.updatePasswordById(lastRecovery.user_id, req.body.new_password)
        await recoveryRepo.removeRecveryById(lastRecovery.id)
        return response.success(res, [])
    } catch (e) {
        return response.exception(res, e);
    }
}