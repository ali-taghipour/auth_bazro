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
    email: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    phone_number: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    configurations: {
        type: Sequelize.JSON,
        allowNull: true,
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    family_name: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    birthday: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    national_id: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    gender: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    job: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    state: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    city: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    others: {
        type: Sequelize.JSON,
        allowNull: true,
    }
}

module.exports = db.define("company_info", schema)