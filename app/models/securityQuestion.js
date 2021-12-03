const Sequelize = require("sequelize")
const db = require("../database/db")

const schema = {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    question: {
        type: Sequelize.TEXT
    },
}

module.exports = db.define("security_question", schema)