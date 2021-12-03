const Sequelize = require("sequelize")
const db = require("../database/db")

const schema = {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.TEXT
    },
    packet_id: {
        type: Sequelize.UUID,
        allowNull: false,
    },
}

module.exports = db.define("services", schema)
