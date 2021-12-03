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
    stat: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    city: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    neighborhood: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    street: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    alley: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    house_number: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    others: {
        type: Sequelize.JSON,
        allowNull: true,
    }
}

module.exports = db.define("address", schema)