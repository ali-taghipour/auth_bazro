const { v4: uuidv4 } = require("uuid");
const { session } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class SessionRepo extends BaseRepo {
    constructor() {
        super(session)
    }
    async addNewSession(user_id, session_id) {
        return await this.create({
            user_id: user_id,
            session_id: session_id,
            // block_status: fields.block_status,
        })
    }
    async getNumberOfUserSessions(user_id) {
        return await this.count({ user_id: user_id })
    }
    async updateSessionStatus(id, block_status) {
        return await this.update({ id: id }, { block_status: block_status }, false)
    }
    async getUserSessions(user_id) {
        return await this.getAll({ user_id: user_id })
    }
    async removeSession(id, session_id) {
        return await this.remove({ id: id })
    }
    async removeSessionByUserId(id, session_id) {
        return await this.remove({ user_id: id })
    }
}

module.exports = new SessionRepo()
