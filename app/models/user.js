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
    email_verify_at: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    email_verify_token: {
        type: Sequelize.STRING,
        allowNull: true,
    }
}

module.exports = db.define("users", schema)
