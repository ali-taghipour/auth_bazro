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
    facebook: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    twitter: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    linkedIn: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    youtube: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    aparat: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    instagram: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    telegram: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    others: {
        type: Sequelize.JSON,
        allowNull: true,
    }
}

module.exports = db.define("social_media", schema)