const response = require("../helpers/responseHelper");
const adminRepo = require("../repositories/adminRepo");
const roleRepo = require("../repositories/roleRepo");
const tokenService = require("../services/tokenService");
const validate = require("../validations/roleValidation");
const { Op } = require("sequelize");
const serviceRepo = require("../repositories/serviceRepo");
const userRoleRepo = require("../repositories/userRoleRepo");

module.exports.getAllRole = async (req, res) => {
    try {
        validate.getAll(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        let filter = {}
        if (req.body.filter) {
            const tempFilter = typeof req.body.filter === String ? JSON.parse(req.body.filter) : req.body.filter
            if (tempFilter.id) filter["id"] = tempFilter.id
            if (tempFilter.name) filter["name"] = { [Op.like]: `%${tempFilter.name}%` }
            if (decode_token.role == "super_admin") {
                if (tempFilter.service_id) filter["service_id"] = tempFilter.service_id
            }
            if (decode_token.role == "admin") {
                filter["service_id"] = decode_token.service
            }
        }
        const orderBy = req.body.sort_by ? req.body.sort_by : "id";
        const orderType = req.body.sort_type && req.body.sort_type == 1 ? "ASC" : "DESC";
        const limit = req.body.per_page ? req.body.per_page : 10;
        const offset = req.body.page ? (req.body.page > 0 ? req.body.page - 1 : 0) * limit : 0;
        const result = await roleRepo.getAll(filter, orderBy, orderType, offset, limit)
        return response.success(res, result)

    } catch (e) {
        return response.exception(res, e);
    }
}

//getting one role by roleId (available for superAdmin/admin)
module.exports.getById = async (req, res) => {
    try {
        validate.params(req.params)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        const result = await roleRepo.getById(req.params.roleId)
        if (!result) return response.error(res, "role not founded")

        if (decode_token.role == "admin") {
            const service = decode_token.service
            if (!service && result.service_id != service)
                return response.error(res, "access denied")
        }
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getOneAdminRoles = async (req, res) => {
    try {
        validate.getOneAdminRole(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        let serviceId;
        if (decode_token.role == "super_admin") {
            validate.paramsAdmin(req.params)
            const admin = await adminRepo.getById(req.params.adminId)
            if (!admin)
                return response.error(res, "admin not founded in system")
            serviceId = admin.service_id
        }
        if (decode_token.role == "admin") {
            serviceId = decode_token.service
            if (!serviceId)
                return response.error(res, "access denied")
        }
        const result = await roleRepo.getAllByServiceId(serviceId, req.body)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.addNewRole = async (req, res) => {

    try {
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        let service_id;
        if (decode_token.role == "super_admin") {
            validate.addNewRole(req.body)
            service_id = req.body.service_id
        }
        if (decode_token.role == "admin") {
            validate.addNewRoleOnlyName(req.body)
            service_id = decode_token.service
        }
        await roleRepo.checkRoleIsAvailble({ name: req.body.name, service_id: service_id })
        const service = await serviceRepo.getById(service_id)
        if (!service)
            return response.error(res, "service not founded")
        const result = await roleRepo.addNewRole({ name: req.body.name, service_id: service.id, is_permission: req.body.is_permission })
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.updateRole = async (req, res) => {
    try {
        validate.params(req.params)
        validate.updateRole(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)

        let service;
        if (decode_token.role == "admin") {
            service = decode_token.service
            if (!service)
                return response.error(res, "access denied")
        }

        const role = await roleRepo.getById(req.params.roleId)
        if (!role)
            return response.error(res, "role not founded")
        if (decode_token.role == "admin" && service != role.service_id)
            return response.error(res, "access denied")

        const result = await roleRepo.updateRole(role.id, req.body)
        return response.success(res, [])
    } catch (e) {
        return response.exception(res, e);
    }
}


module.exports.setRolePermissionToUser = async (req, res) => {
    try {
        validate.params(req.params)
        validate.setRolePermissionToUser(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        console.log(req.params.roleId);

        const role = await roleRepo.getById(req.params.roleId)
        if (!role)
            return response.error(res, "role not founded")

        if (decode_token.role == "admin" && decode_token.service != role.service_id)
            return response.error(res, "access denied")

        if (role.is_permission != true)
            return response.error(res, "this role is not permissional")

        const userRole = await userRoleRepo.findOrCreateByRoleUserIds(req.body.user_id, role.id, role.service_id, true)
        if (userRole.deletedAt != null) {
            await userRole.restore()
        }
        return response.success(res, userRole)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.unsetRolePermissionFromUser = async (req, res) => {
    try {
        validate.params(req.params)
        validate.unsetRolePermissionFromUser(req.body)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)

        const role = await roleRepo.getById(req.params.roleId)
        if (!role)
            return response.error(res, "role not founded")

        if (decode_token.role == "admin" && decode_token.service != role.service_id)
            return response.error(res, "access denied")

        if (role.is_permission != true)
            return response.error(res, "this role is not permissional")

        const userRole = await userRoleRepo.findByRoleUserIds(req.body.user_id, role.id, role.service_id)
        if (!userRole)
            return response.error(res, "this user has not this role")
        const result = await userRoleRepo.removeByid(userRole.id)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}
