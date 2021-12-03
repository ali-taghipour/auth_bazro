const { v4: uuidv4 } = require("uuid");
const { info } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class InfoRepo extends BaseRepo {
    constructor() {
        super(info)
    }
    async addNewInfo(fields, user_id, user_type) {
        return await this.create({
            userable_id: user_id,
            userable_type: user_type,
            email: fields.email,
            phone_number: fields.phone_number,
            configurations: fields.configurations,
            name: fields.name,
            family_name: fields.family_name,
            birthday: fields.birthday,
            national_id: fields.national_id,
            gender: fields.gender,
            job: fields.job,
            state: fields.state,
            city: fields.city,
            others: fields.others,
        })
    }
    async getByUserId(user_id, user_type) {
        return await this.findOrCreate({
            userable_id: user_id,
            userable_type: user_type,
        }, {});
    }
    async updateInfo(id, fields) {
        const updateData = {}
        if (fields.email) updateData["email"] = fields.email
        if (fields.phone_number) updateData["phone_number"] = fields.phone_number
        if (fields.configurations) updateData["configurations"] = fields.configurations
        if (fields.name) updateData["name"] = fields.name
        if (fields.family_name) updateData["family_name"] = fields.family_name
        if (fields.birthday) updateData["birthday"] = fields.birthday
        if (fields.national_id) updateData["national_id"] = fields.national_id
        if (fields.gender) updateData["gender"] = fields.gender
        if (fields.job) updateData["job"] = fields.job
        if (fields.state) updateData["state"] = fields.state
        if (fields.city) updateData["city"] = fields.city
        if (fields.others) updateData["others"] = fields.others
        return await this.updateById(id, updateData)
    }
    async updateOrCreateByUserId(user_id, user_type, fields) {
        const updateData = {}
        if (fields.email) updateData["email"] = fields.email
        if (fields.phone_number) updateData["phone_number"] = fields.phone_number
        if (fields.configurations) updateData["configurations"] = fields.configurations
        if (fields.name) updateData["name"] = fields.name
        if (fields.family_name) updateData["family_name"] = fields.family_name
        if (fields.birthday) updateData["birthday"] = fields.birthday
        if (fields.national_id) updateData["national_id"] = fields.national_id
        if (fields.gender) updateData["gender"] = fields.gender
        if (fields.job) updateData["job"] = fields.job
        if (fields.state) updateData["state"] = fields.state
        if (fields.city) updateData["city"] = fields.city
        if (fields.others) updateData["others"] = fields.others

        return await this.updateOrCreate({
            userable_id: user_id,
            userable_type: user_type,
        }, updateData);
    }

}

module.exports = new InfoRepo()
