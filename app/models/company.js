const Sequelize = require("sequelize")
const db = require("../database/db")
const schema = {
    userable_id: {
        type: Sequelize.UUID,
        allowNull: true,
    },
    userable_type: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    economic_code: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    national_code: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    registeration_id: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    telephone_number: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    field_of_activity: {
        type: Sequelize.TEXT,
        allowNull: true,
    }
}

module.exports = db.define("company", schema)