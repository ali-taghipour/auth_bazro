const { v4: uuidv4 } = require("uuid");
const { company } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class CompanyRepo extends BaseRepo {
    constructor() {
        super(company)
    }
    async addNewCompany(fields, user_id, user_type) {
        return await this.create({
            userable_id: user_id,
            userable_type: user_type,
            name: fields.name,
            economic_code: fields.economic_code,
            national_code: fields.national_code,
            registeration_id: fields.registeration_id,
            telephone_number: fields.telephone_number,
            field_of_activity: fields.field_of_activity,
        })
    }
    async getByUserId(user_id, user_type) {
        return await this.getAll({
            userable_id: user_id,
            userable_type: user_type,
        });
    }
    async updateCompany(id, fields) {
        const updateData = {}
        if (fields.name) updateData["name"] = fields.name
        if (fields.economic_code) updateData["economic_code"] = fields.economic_code
        if (fields.national_code) updateData["national_code"] = fields.national_code
        if (fields.registeration_id) updateData["registeration_id"] = fields.registeration_id
        if (fields.telephone_number) updateData["telephone_number"] = fields.telephone_number
        if (fields.field_of_activity) updateData["field_of_activity"] = fields.field_of_activity
        return await this.updateById(id, updateData)
    }

    async updateOrCreateByUserId(user_id, user_type, name, fields) {
        const updateData = {}
        if (fields.economic_code) updateData["economic_code"] = fields.economic_code
        if (fields.national_code) updateData["national_code"] = fields.national_code
        if (fields.registeration_id) updateData["registeration_id"] = fields.registeration_id
        if (fields.telephone_number) updateData["telephone_number"] = fields.telephone_number
        if (fields.field_of_activity) updateData["field_of_activity"] = fields.field_of_activity

        return await this.updateOrCreate({
            userable_id: user_id,
            userable_type: user_type,
            name: name
        }, updateData);
    }

}

module.exports = new CompanyRepo()
