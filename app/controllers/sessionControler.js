const response = require("../helpers/responseHelper");
const sessionRepo = require("../repositories/sessionRepo");
const validate = require("../validations/sessionValidation");
const tokenService = require("../services/tokenService");
const { Op } = require("sequelize");
const { makeSearchableFilter } = require("../helpers/searchHelper");
const userService = require("../services/userService");
const sessionService = require('../services/sessionService');

//sessionModel's fields for making searchable query
const modelFieldsArray = ["id", "user_id", "session_id", "block_status"]
const modelNoParsialSearchFields = ["id", "user_id", "block_status"]

//getting all row by filter and pagination parameters
module.exports.getAll = async (req, res) => {
    try {
        validate.getAll(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        let filter = {}
        let reqFilter = {}
        if (req.body.filter) {
            reqFilter = typeof req.body.filter === String ? JSON.parse(req.body.filter) : req.body.filter
            filter = makeSearchableFilter(modelFieldsArray, modelNoParsialSearchFields, reqFilter)
        }

        const orderBy = req.body.sort_by ? req.body.sort_by : "id";
        const orderType = req.body.sort_type && req.body.sort_type == 1 ? "ASC" : "DESC";
        const limit = req.body.per_page ? req.body.per_page : 10;
        const offset = req.body.page ? (req.body.page > 0 ? req.body.page - 1 : 0) * limit : 0;

        if (decode_token.role == "super_admin") {

        }
        if (decode_token.role == "admin") {
            const userIds = await userService.getAllAdminUsersByService(decode_token.service)
            if (!filter.userable_id) {
                filter["user_id"] = { [Op.in]: userIds }
            } else {
                filter["user_id"] = { [Op.in]: userIds, ...filter["user_id"] }
            }
        }
        if (decode_token.role == "user") {
            filter["user_id"] = decode_token.id
        }

        const result = await sessionRepo.getAll(filter, orderBy, orderType, offset, limit)
        return response.success(res, result)

    } catch (e) {
        return response.exception(res, e);
    }
}

//update block_status by sessionId (available only for admin/superAdmin)
module.exports.update = async (req, res) => {
    try {
        validate.params(req.params) //sessionId
        validate.update(req.body) //block_status
        const block_status = req.body.block_status == true ? true : false
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        const session = await sessionRepo.getById(req.params.sessionId)
        if (!session)
            return response.error(res, "session not founded")
        if (decode_token.role == "super_admin") {

        }
        if (decode_token.role == "admin") {
            const userIds = await userService.getAllAdminUsersByService(decode_token.service)
            if (!userIds.includes(session.user_id)) {
                return response.error(res, "access denied")
            }
        }
        const result = await sessionRepo.updateSessionStatus(session.id, block_status) //change session's block_status in model
        await sessionService.setSessionBlockStatusBySessonModel(session, block_status) //change session's block_status in sessionStorage(redis)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

//remove one session by id 
module.exports.remove = async (req, res) => {
    try {
        validate.params(req.params) //sessionId
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        const session = await sessionRepo.getById(req.params.sessionId)
        if (!session)
            return response.error(res, "session not founded")
        if (decode_token.role == "super_admin") {

        }
        if (decode_token.role == "admin") {
            const userIds = await userService.getAllAdminUsersByService(decode_token.service)
            if (!userIds.includes(session.user_id)) {
                return response.error(res, "access denied")
            }
        }
        if (decode_token.role == "user") {
            if (session.user_id != decode_token.id)
                return response.error(res, "access denied")
        }
        const result = await sessionRepo.removeSession(session.id)//removing session from model
        await sessionService.redisSessionStoreDestroy(session.session_id) //removing session from sessionStorage(redis)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}
