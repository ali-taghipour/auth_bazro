const Sequelize = require("sequelize")
const db = require("../database/db")

const schema = {
    user_id: {
        type: Sequelize.UUID,
    },
    session_id: {
        type: Sequelize.TEXT
    },
    block_status: {
        type: Sequelize.BOOLEAN,
        default: false,
    }
}

module.exports = db.define("session", schema)