const Sequelize = require("sequelize")
const db = require("../database/db")

const schema = {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    service_id: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    role_id: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    wallet_id: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    is_blocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
}

module.exports = db.define("user_roles", schema, { paranoid: true, })
