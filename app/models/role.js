const Sequelize = require("sequelize")
const db = require("../database/db")

const schema = {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    service_id: {
        type: Sequelize.UUID
    },
    name: {
        type: Sequelize.TEXT
    },
    is_permission: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
}

module.exports = db.define("roles", schema)