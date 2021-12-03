const { v4: uuidv4 } = require("uuid");
const { userRole } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class UserRoleRepo extends BaseRepo {
    constructor() {
        super(userRole)
    }
    // async checkUserRoleIsAvailble(fields) {
    //     const count = await this.count({
    //         role_id: fields.role_id,
    //         user_id: fields.user_id,
    //     })
    //     if (count > 0) {
    //         throw Exception.setError("this UserRole is available now")
    //     }
    // }
    async addNew(fields) {
        return await this.create({
            id: uuidv4(),
            service_id: fields.service_id,
            role_id: fields.role_id,
            user_id: fields.user_id,
            wallet_id: uuidv4(),

        })
    }
    // async updateUserRole(id, fields) {
    //     const updateData = {}
    //     if (fields.name) updateData["name"] = fields.name
    //     return await this.updateById(id, updateData)
    // }

    async getAllByServiceId(service_id, fields) {
        const newFilter = {}
        if (fields.id) newFilter["id"] = fields.id
        if (fields.role_id) newFilter["role_id"] = fields.role_id
        if (fields.user_id) newFilter["user_id"] = fields.user_id
        if (fields.wallet_id) newFilter["wallet_id"] = fields.wallet_id

        return await this.getAll({ service_id: service_id, ...newFilter })
    }

    async getAllByRoleId(role_id, fields) {
        const newFilter = {}
        if (fields.id) newFilter["id"] = fields.id
        if (fields.service_id) newFilter["service_id"] = fields.service_id
        if (fields.user_id) newFilter["user_id"] = fields.user_id
        if (fields.wallet_id) newFilter["wallet_id"] = fields.wallet_id

        return await this.getAll({ role_id: role_id, ...newFilter })
    }

    async getAllByUserId(user_id, fields) {
        const newFilter = {}
        if (fields.id) newFilter["id"] = fields.id
        if (fields.service_id) newFilter["service_id"] = fields.service_id
        if (fields.role_id) newFilter["role_id"] = fields.role_id
        if (fields.wallet_id) newFilter["wallet_id"] = fields.wallet_id

        return await this.getAll({ user_id: user_id, ...newFilter })
    }

    async findOrCreateByRoleUserIds(user_id, role_id, service_id, withDeletedItems = false) {
        return await this.findOrCreate({
            user_id: user_id,
            role_id: role_id,
            service_id: service_id,
        }, {
            id: uuidv4(),
            wallet_id: uuidv4(),
        },
            true,
            !withDeletedItems
        )
    }

    async findByRoleUserIds(user_id, role_id, service_id) {
        return await this.getOne({
            user_id: user_id,
            role_id: role_id,
            service_id: service_id,
        })
    }

    async findByRoleAndUserId(user_id, role_id, service_id) {
        return await this.getOne({
            user_id: user_id,
            role_id: role_id,
            service_id: service_id,
        })
    }

    async findByWalletId(walletId) {
        return await this.getOne({
            wallet_id: walletId
        }, null, null, {
            include: [
                userRole.user,
                userRole.role,
                userRole.service,
            ]
        })
    }


    async getBlackList(service_id) {
        return await this.getAll({
            is_blocked: true, service_id
        }, 'id', 'dec',null,null, {
            include: [
                userRole.user,
                userRole.role,
            ]
        })
    }
}

module.exports = new UserRoleRepo()
