const Sequelize = require("sequelize")
const db = require("../database/db")

const schema = {
    user_id: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    user_type: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    service_id: {
        type: Sequelize.UUID,
        allowNull: true,
    },
    user_role_id: {
        type: Sequelize.UUID,
        allowNull: true,
    },
    refresh_token: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
}

module.exports = db.define("refresh_token", schema)
