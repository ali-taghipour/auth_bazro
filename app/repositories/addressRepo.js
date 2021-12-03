const { v4: uuidv4 } = require("uuid");
const { address } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class AddressRepo extends BaseRepo {
    constructor() {
        super(address)
    }
    async addNewAddress(fields, user_id, user_type) {
        return await this.create({
            userable_id: user_id,
            userable_type: user_type,
            name: fields.name,
            stat: fields.stat,
            city: fields.city,
            neighborhood: fields.neighborhood,
            street: fields.street,
            alley: fields.alley,
            house_number: fields.house_number,
            others: fields.others,
        })
    }
    async getByUserId(user_id, user_type) {
        return await this.getAll({
            userable_id: user_id,
            userable_type: user_type,
        })
    }
    async updateAddress(id, fields) {
        const updateData = {}
        if (fields.name) updateData["name"] = fields.name
        if (fields.stat) updateData["stat"] = fields.stat
        if (fields.city) updateData["city"] = fields.city
        if (fields.neighborhood) updateData["neighborhood"] = fields.neighborhood
        if (fields.street) updateData["street"] = fields.street
        if (fields.alley) updateData["alley"] = fields.alley
        if (fields.house_number) updateData["house_number"] = fields.house_number
        if (fields.others) updateData["others"] = fields.others
        return await this.updateById(id, updateData)
    }

    async updateOrCreateByUserId(user_id, user_type, name, fields) {
        const updateData = {}
        if (fields.stat) updateData["stat"] = fields.stat
        if (fields.city) updateData["city"] = fields.city
        if (fields.neighborhood) updateData["neighborhood"] = fields.neighborhood
        if (fields.street) updateData["street"] = fields.street
        if (fields.alley) updateData["alley"] = fields.alley
        if (fields.house_number) updateData["house_number"] = fields.house_number
        if (fields.others) updateData["others"] = fields.others


        return await this.updateOrCreate({
            userable_id: user_id,
            userable_type: user_type,
            name: name
        }, updateData);
    }

}

module.exports = new AddressRepo()
