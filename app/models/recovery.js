const Sequelize = require("sequelize")
const db = require("../database/db")

const schema = {
    user_id: {
        type: Sequelize.UUID,
    },
    recovery_type: {
        type: Sequelize.TEXT,
    },
}

module.exports = db.define("recovery", schema)