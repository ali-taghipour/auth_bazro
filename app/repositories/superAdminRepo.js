const { v4: uuidv4 } = require("uuid");
const { superAdmin } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { passwordHasher } = require("../helpers/hash");

class SuperAdminRepo extends BaseRepo {
    constructor() {
        super(superAdmin)
    }

    async getByUsername(username) {
        return await this.getOne({ username: username })
    }
    async getByPhoneNumber(phone) {
        return await this.getOne({ phone_number: phone })
    }
    async addNew(fields) {
        const newPass = await passwordHasher(fields.password)
        return await this.create({
            id: uuidv4(),
            password: newPass,
            username: fields.username,
            email: fields.email,
            phone_number: fields.phone_number,

            addresses: [{ userable_type: "super_admin" }],
            companies: [{ userable_type: "super_admin" }],
            info: { userable_type: "super_admin" },
            socialMedia: { userable_type: "super_admin" },
        }, {
            include: [superAdmin.addresses, superAdmin.companies, superAdmin.info, superAdmin.socialMedia]
        })
    }
    async getByIdWithRelations(id) {
        return await this.getById(id, {
            include: [superAdmin.addresses, superAdmin.companies, superAdmin.info, superAdmin.socialMedia]
        })
    }
    async updateSuperAdmin(superAdmin, fields) {
        const updateData = {}
        if (fields.password) updateData["password"] = await passwordHasher(fields.password)
        if (fields.username) updateData["username"] = fields.username
        if (fields.email) updateData["email"] = fields.email
        if (fields.phone_number) updateData["phone_number"] = fields.phone_number
        return await this.updateById(superAdmin.id, updateData)
    }
}

module.exports = new SuperAdminRepo()
