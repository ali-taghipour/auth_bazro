const { otp } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const moment = require("moment");

class OtpRepo extends BaseRepo {
    constructor() {
        super(otp)
    }
    async storeNewCode(mobile, code, userId, userType) {
        return await this.create({
            code: code,
            phone_number: mobile,
            userable_id: userId,
            userable_type: userType,
            send_at: null,
            status: "sending"
        })
    }
    async changeStatusToSended(mobile, code) {
        return await this.update({
            code: code,
            phone_number: mobile,
        }, {
            send_at: Date.now(),
            status: "sended"
        })
    }
    async getByPhoneAndCode(phone, code) {
        return await this.getOne({
            code: code,
            phone_number: phone,
            send_at: { [Op.gte]: moment().subtract(5, "minutes").toDate() }
        }, "id", "DESC")
    }
    async changeStatusToDone(id) {
        return await this.update({
            id: id
        }, {
            status: "done"
        })
    }
    async changeStatusToExpire(time) {
        return await this.update({
            send_at: {
                [Op.gte]: time
            }
        }, {
            status: "expire"
        })
    }

    async deleteOlderThan(time) {
        return await this.remove({
            createdAt: {
                [Op.gte]: time
            }
        })
    }
}

module.exports = new OtpRepo()
