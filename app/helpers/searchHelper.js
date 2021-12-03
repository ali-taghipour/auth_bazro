const { Op } = require("sequelize")

module.exports.makeSearchableFilter = (fieldsArray, UUIDFiels, reqFilters) => {
    const returnField = {}
    fieldsArray.forEach((field) => {
        if (reqFilters[field]) {
            if (!UUIDFiels.includes(field)) {
                returnField[field] = { [Op.like]: `%${reqFilters[field]}%` }
            } else {
                returnField[field] = reqFilters[field]
            }
        }
    })
    return returnField;
}