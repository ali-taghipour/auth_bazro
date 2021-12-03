const response = require("../helpers/responseHelper");


module.exports = (req, res, next) => {
    try {
        if (req.session && req.session.block_status && req.session.block_status == true) {
            return response.error(res, "you are blocked")
        } else {
            return next()
        }
    } catch (e) {
        return response.exception(res, e);
    }
}



