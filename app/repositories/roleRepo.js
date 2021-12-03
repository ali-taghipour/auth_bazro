const { v4: uuidv4 } = require("uuid");
const { role } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class RoleRepo extends BaseRepo {
    constructor() {
        super(role)
    }
    async checkRoleIsAvailble(fields) {
        const count = await this.count({
            service_id: fields.service_id,
            name: fields.name,
        })
        if (count > 0) {
            throw Exception.setError("this role is available now")
        }
    }
    async addNewRole(fields) {
        return await this.create({
            id: uuidv4(),
            service_id: fields.service_id,
            name: fields.name,
            is_permission: fields.is_permission ? fields.is_permission : false,
        })
    }
    async updateRole(id, fields) {
        const updateData = {}
        if (fields.name) updateData["name"] = fields.name
        if (fields.is_permission) updateData["is_permission"] = fields.is_permission ? fields.is_permission : false
        return await this.updateById(id, updateData)
    }

    async getAllByServiceId(service_id, fields) {
        const filter = { service_id: service_id }
        if (fields.id) filter["id"] = fields.id
        if (fields.name) filter["name"] = { [Op.like]: `%${fields.name}%` }
        if (fields.is_permission) filter["is_permission"] = fields.is_permission

        return await this.getAll(filter, "createdAt", "ASC", 0, 200)
    }
}

module.exports = new RoleRepo()
