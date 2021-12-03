const { v4: uuidv4 } = require("uuid");
const { service } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class ServiceRepo extends BaseRepo {
    constructor() {
        super(service)
    }
    async checkServiceIsAvailble(fields) {
        const count = await this.count({
            name: fields.name,
        })
        if (count > 0) {
            throw Exception.setError("this service is available now")
        }
    }
    async addNewService(fields) {
        return await this.create({
            id: uuidv4(),
            name: fields.name,
            packet_id: uuidv4(),
        })
    }
    async updateService(id, fields) {
        const updateData = {}
        if (fields.name) updateData["name"] = fields.name
        return await this.updateById(id, updateData)
    }

}

module.exports = new ServiceRepo()
