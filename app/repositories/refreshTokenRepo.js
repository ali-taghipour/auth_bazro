const { v4: uuidv4 } = require("uuid");
const { refreshToken, service } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class RefreshTokenRepo extends BaseRepo {
    constructor() {
        super(refreshToken)
    }

    async addNew(userId, userType, serviceId, userRoleId, refreshToken) {
        return await this.create({
            user_id: userId,
            user_type: userType,
            service_id: serviceId,
            user_role_id: userRoleId,
            refresh_token: refreshToken,
        })
    }

    async getUserByRefreshToken(refresh_token) {
        return await this.getOne({ refresh_token: refresh_token }, null, null, {
            include: [
                // refreshToken.user,
                { association: "service", include: [service.admin] },
                refreshToken.userRole,
                // userRole.role,
                // service.admin,
            ]
        })
    }


}

module.exports = new RefreshTokenRepo()
