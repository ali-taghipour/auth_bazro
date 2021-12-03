const Sequelize = require("sequelize")
const db = require("../database/db")

const schema = {
    code: {
        type: Sequelize.TEXT
    },
    phone_number: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    userable_id: {
        type: Sequelize.UUID
    },
    userable_type: {
        type: Sequelize.STRING
    },
    send_at: {
        type: Sequelize.DATE,
        allowNull: true
    },
    status: {
        type: Sequelize.STRING
    }
}

module.exports = db.define("otps", schema)
