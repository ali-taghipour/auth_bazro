const response = require("../helpers/responseHelper");
const socialMediaRepo = require("../repositories/socialMediaRepo");
const validate = require("../validations/socialMediaValidation");
const tokenService = require("../services/tokenService");
const { Op } = require("sequelize");
const { makeSearchableFilter } = require("../helpers/searchHelper");
const userService = require("../services/userService")

const modelFieldsArray = ["id", "userable_id", "userable_type", "email", "phone_number", "name", "family_name", "birthday", "national_id", "gender", "job", "state", "city",]
const modelNoParsialSearchFields = ["id", "userable_id", "userable_type"]

//getting all record by filter and pagination parameters (available for superAdmin/admin)
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
            if (reqFilter.userable_type) {
                filter["userable_type"] = reqFilter.userable_type
            } else {
                filter["userable_type"] = { [Op.in]: ["user", "admin", "super_admin"] }
            }
        }
        if (decode_token.role == "admin") {
            filter["userable_type"] = "user"
            const userIds = await userService.getAllAdminUsersByService(decode_token.service)
            if (!filter.userable_id) {
                filter["userable_id"] = { [Op.in]: userIds }
            } else {
                filter["userable_id"] = { [Op.in]: userIds, ...filter["userable_id"] }
            }
        }

        const result = await socialMediaRepo.getAll(filter, orderBy, orderType, offset, limit)
        return response.success(res, result)

    } catch (e) {
        return response.exception(res, e);
    }
}

//getting one socialMedia by socialMediaId (available for superAdmin/admin)
module.exports.getById = async (req, res) => {
    try {
        validate.params(req.params)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        const socialMedia = await socialMediaRepo.getById(req.params.socialMediaId)
        if (!socialMedia) return response.error(res, "socialMedia not founded")
        if (decode_token.role == "admin") {
            const userIds = await userService.getAllAdminUsersByService(decode_token.service)
            if (!(
                (socialMedia.userable_type == "user" && userIds.includes(socialMedia.userable_id)) ||
                (socialMedia.userable_type == "admin" && socialMedia.userable_id == decode_token.id)
            )) {
                return response.error(res, "access denied")
            }
        }
        return response.success(res, socialMedia)
    } catch (e) {
        return response.exception(res, e);
    }
}

//get all his/her socialMedia by his/her self(available for superAdmin/admin/user)
module.exports.getMy = async (req, res) => {
    try {
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        const socialMedia = await socialMediaRepo.getByUserId(decode_token.id, decode_token.role)
        if (!socialMedia) return response.error(res, "socialMedia not founded")
        return response.success(res, socialMedia)
    } catch (e) {
        return response.exception(res, e);
    }
}

//update socialMedia (available just for socialMedia owner)(available for superAdmin/admin/user)
module.exports.setMy = async (req, res) => {
    try {
        validate.update(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        const socialMedia = await socialMediaRepo.updateOrCreateByUserId(decode_token.id, decode_token.role, req.body)
        if (!socialMedia) return response.error(res, "error in saving data")
        return response.success(res, socialMedia)
    } catch (e) {
        return response.exception(res, e);
    }
}

//update one socialMedia by socialMediaId (available for superAdmin/admin/user)
module.exports.update = async (req, res) => {
    try {
        validate.params(req.params)
        validate.update(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        const socialMedia = await socialMediaRepo.getById(req.params.socialMediaId)
        if (!socialMedia)
            return response.error(res, "socialMedia not founded")
        if (decode_token.role == "admin") {
            const userIds = await userService.getAllAdminUsersByService(decode_token.service)
            if (!(
                (socialMedia.userable_type == "user" && userIds.includes(socialMedia.userable_id)) ||
                (socialMedia.userable_type == "admin" && socialMedia.userable_id == decode_token.id)
            )) {
                return response.error(res, "access denied")
            }
        }
        if (decode_token.role == "user") {
            if (decode_token.id != socialMedia.userable_id)
                return response.error(res, "access denied")
        }
        const result = await socialMediaRepo.updateSocialMedia(socialMedia.id, req.body)
        return response.success(res, [])
    } catch (e) {
        return response.exception(res, e);
    }
}
