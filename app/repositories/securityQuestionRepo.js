const { v4: uuidv4 } = require("uuid");
const { securityQuestion } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class SecurityQuestionRepo extends BaseRepo {
    constructor() {
        super(securityQuestion)
    }
    async checkIsAvailbleOrCraete(fields) {
        return await this.findOrCreate({
            question: fields.question,
        }, {}, true)
    }
    async addNew(fields) {
        return await this.create({
            id: uuidv4(),
            question: fields.question,
        })
    }
    async updateSecurityQuestion(id, fields) {
        const updateData = {}
        if (fields.question) updateData["question"] = fields.question
        return await this.updateById(id, updateData)
    }

}

module.exports = new SecurityQuestionRepo()
