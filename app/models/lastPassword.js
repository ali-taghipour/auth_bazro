const Sequelize = require("sequelize")
const db = require("../database/db")

const schema = {
    user_id: {
        type: Sequelize.UUID,
    },
    password: {
        type: Sequelize.TEXT,
    }
}

module.exports = db.define("last_password", schema)