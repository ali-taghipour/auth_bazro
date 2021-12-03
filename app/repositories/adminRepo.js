const { v4: uuidv4 } = require("uuid");
const { admin, user, service } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const { passwordHasher } = require("../helpers/hash");
const Exception = require("../helpers/errorHelper");

class AdminRepo extends BaseRepo {
    constructor() {
        super(admin)
    }
    async checkAdminIsAvailble(username, phone_number) {
        const admin = await this.getOne({
            [Op.or]:
                [
                    { username: username },
                    { phone_number: phone_number }
                ],
        });
        if (admin) {
            if (admin.username == username) {
                throw Exception.setError("this username is available now")
            } else {
                throw Exception.setError("this phone number is available now")
            }
        }
    }
    async addNewAdmin(fields) {
        return await this.create({
            id: uuidv4(),
            password: await passwordHasher(fields.password),
            username: fields.username,
            email: fields.email,
            phone_number: fields.phone_number,
            service_id: fields.service_id,
            wallet_id: uuidv4(),

            addresses: [{ userable_type: "admin" }],
            companies: [{ userable_type: "admin" }],
            info: { userable_type: "admin" },
            socialMedia: { userable_type: "admin" },
        }, {
            include: [admin.addresses, admin.companies, admin.info, admin.socialMedia]
        })
    }

    async getByIdWithRelations(id) {
        return await this.getById(id, {
            include: [admin.addresses, admin.companies, admin.info, admin.socialMedia]
        })
    }
    async updateAdmin(id, fields, role) {
        const updateData = {}
        if (fields.password) updateData["password"] = await passwordHasher(fields.password)
        if (fields.username) updateData["username"] = fields.username
        if (fields.email) updateData["email"] = fields.email
        if (fields.phone_number) updateData["phone_number"] = fields.phone_number
        if (role == "super_admin") {
            if (fields.service_id) updateData["service_id"] = fields.service_id
        }

        return await this.updateById(id, updateData)
    }

    async getByUsername(username) {
        return await this.getOne({ username: username }, null, null, { include: [admin.service] })
    }
    async getByPhoneNumber(phone) {
        return await this.getOne({ phone_number: phone }, null, null, { include: [admin.service] })
    }
}

module.exports = new AdminRepo()
