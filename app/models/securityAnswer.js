const Sequelize = require("sequelize")
const db = require("../database/db")

const schema = {
    security_question_id: {
        type: Sequelize.UUID,
    },
    user_id: {
        type: Sequelize.UUID,
    },
    answer: {
        type: Sequelize.TEXT
    },
}

module.exports = db.define("security_answer", schema)