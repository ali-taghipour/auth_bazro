const Sequelize = require("sequelize")
const db = require("../database/db")

const schema = {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: Sequelize.TEXT
    },
    username: {
        type: Sequelize.TEXT
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    phone_number: {
        type: Sequelize.TEXT
    },
    service_id: {
        type: Sequelize.UUID
    },
    wallet_id: {
        type: Sequelize.UUID
    }
}

module.exports = db.define("admins", schema)
