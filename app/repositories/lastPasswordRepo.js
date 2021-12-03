const { v4: uuidv4 } = require("uuid");
const { lastPassword } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");
const userRepo = require("./userRepo")

class LastPasswordRepo extends BaseRepo {
    constructor() {
        super(lastPassword)
    }
    async addNew(user_id, password) {
        return await this.create({
            user_id: user_id,
            password: password,
        })
    }
    async findByUser(user) {
        return await this.getAllWithPass({
            user_id: user.id,
        })
    }


}

module.exports = new LastPasswordRepo()
