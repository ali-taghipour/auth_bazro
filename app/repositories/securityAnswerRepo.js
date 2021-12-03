const { v4: uuidv4 } = require("uuid");
const { securityAnswer } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class SecurityAnswerRepo extends BaseRepo {
    constructor() {
        super(securityAnswer)
    }
    async checkIsAvailbleOrCraete(fields, user_id) {
        return await this.findOrCreate({
            security_question_id: fields.security_question_id,
            user_id: user_id,
        }, {
            answer: fields.answer,
        }, true)
    }

    // async updateSecurityAnswer(id, fields) {
    //     const updateData = {}
    //     if (fields.answer) updateData["answer"] = fields.answer
    //     return await this.updateById(id, updateData)
    // }

    async checkIsCorrect(fields, user_id, user_type) {
        return await this.getOne({
            userable_id: user_id,
            userable_type: user_type,
            security_question_id: fields.security_question_id,
            answer: fields.answer,
        })
    }

}

module.exports = new SecurityAnswerRepo()
