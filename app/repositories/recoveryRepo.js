const { v4: uuidv4 } = require("uuid");
const { recovery } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");
const userRepo = require("./userRepo")
const moment = require('moment');

class RecoveryRepo extends BaseRepo {
    constructor() {
        super(recovery)
    }
    async addNew(user_id, recovery_type) {
        return await this.create({
            user_id: user_id,
            recovery_type: recovery_type,
        })
    }
    async findByUsername(username) {
        const user = await userRepo.getByUsername(username)
        if (!user)
            Exception.setError("user was not founded with this username")
        return await this.getOne({
            user_id: user.id,
            recovery_type: "lastPassword",
            createdAt: { [Op.gte]: moment().subtract(30, "minutes").toDate() },
        }, "id", "DESC")
    }
    async removeRecveryById(id) {
        return await this.removeByid(id)
    }


}

module.exports = new RecoveryRepo()
