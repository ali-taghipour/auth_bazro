const response = require("../helpers/responseHelper");
const { makeTokenByRefreshToken } = require("../services/tokenService")


module.exports.generateTokenByRefreshToken = async (req, res) => {
    try {
        if (!req.body.refresh_token)
            return response.error(res, "refresh_token required")

        const result = await makeTokenByRefreshToken(req.body.refresh_token)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}