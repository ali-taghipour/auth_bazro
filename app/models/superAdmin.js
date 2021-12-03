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
}

module.exports = db.define("super_admins", schema)
