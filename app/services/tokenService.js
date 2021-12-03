
const JWT = require("../helpers/JWTHelper")
const Exception = require("../helpers/errorHelper")
const serviceRepo = require("../repositories/serviceRepo")
const refreshTokenRepo = require("../repositories/refreshTokenRepo")
const adminRepo = require("../repositories/adminRepo")
const { admin } = require("../models")
const userRepo = require("../repositories/userRepo")

//validating accessToken(jwt) or make a exception error
exports.tokenValidate = async (token) => {
    if (!token)
        return Exception.setError("unauthorized")
    if (token.startsWith("Bearer "))
        token = token.substr("Bearer ".length)
    try {
        return await JWT.verify(token)
    } catch (e) {
        return Exception.setError("your token is not valid")
    }

}

//extracting information from token or make a exception error
exports.decodeToken = async (token) => {
    if (!token)
        return Exception.setError("unauthorized")
    if (token.startsWith("Bearer "))
        token = token.substr("Bearer ".length)
    return await JWT.decode(token);
}

//generating accessToken(accessToken) for super-admin by super-admin's informations (from super-admin model) 
exports.generatTokenSuperAdmin = async (superAdmin) => {
    const body = {
        id: superAdmin.id.toString(),
        role: "super_admin",
    }
    return {
        token: await JWT.sign(body)
    }
}

//generating accessToken(accessToken) for admin by admin's informations (from admin model)
exports.generatTokenAdmin = async (admin) => {
    const body = {
        id: admin.id.toString(),
        role: "admin",
        service: admin.service_id.toString(),
        packet_id: admin.service.packet_id.toString(),
        username: admin.username,
        wallet_id: admin.wallet_id.toString(),
    }
    return {
        token: await JWT.sign(body)
    }
}

//generating accessToken(accessToken) for user by user's informations (from user,role,userRole models)
exports.generatTokenUser = async (user_id, username, wallet_id, service_id, role_id, packet_id) => {
    const body = {
        id: user_id.toString(),
        role: "user",
        service: service_id.toString(),
        role_id: role_id.toString(),
        username: username,
        wallet_id: wallet_id.toString(),
        packet_id: packet_id.toString(),
    }
    return {
        token: await JWT.sign(body)
    }
}

exports.makeRefreshToken = async (userId, userType, serviceId = null, userRoleId = null) => {
    const body = {
        user_id: userId,
        user_type: userType,
    }
    const refresh_token = await JWT.sign(body, 30 * 24 * 3600)
    await refreshTokenRepo.addNew(userId, userType, serviceId, userRoleId, refresh_token)
    return refresh_token;
}

exports.checkRefreshTokenExpirationTime = async (tokenBody, refreshToken, refreshTokenDbRow) => {
    const milisecPerDay = 24 * 3600 * 1000
    if (Number(tokenBody.exp) * 1000 - milisecPerDay > Date.now().valueOf()) {
        return refreshToken
    }
    const body = {
        user_id: tokenBody.user_id,
        user_type: tokenBody.user_type,
    }
    const newRefreshToken = await JWT.sign(body, 30 * 24 * 3600)
    await refreshTokenRepo.updateById(refreshTokenDbRow.id, {
        refresh_token: newRefreshToken
    })
    return newRefreshToken
}

exports.makeTokenByRefreshToken = async (refresh_token) => {
    const decoded = await JWT.decode(refresh_token)
    if (!decoded && !decoded.user_id)
        throw Exception.setError("refresh_token is invalid")
    const userInformation = await refreshTokenRepo.getUserByRefreshToken(refresh_token)
    // console.log(userInformation)
    if (!userInformation)
        throw Exception.setError("refresh_token was not in database")
    if (userInformation.user_id != decoded.user_id)
        throw Exception.setError("refresh_token not matched")

    let accessTokenObject;
    if (userInformation.user_type == "super_admin") {
        accessTokenObject = await this.generatTokenSuperAdmin({ id: userInformation.user_id })
    }
    if (userInformation.user_type == "admin") {
        const adminObject = await adminRepo.getById(userInformation.user_id, { include: [admin.service] })
        accessTokenObject = await this.generatTokenAdmin(adminObject)
    }
    if (userInformation.user_type == "user") {
        const user = await userRepo.getById(userInformation.user_id)
        accessTokenObject = await this.generatTokenUser(
            user.id,
            user.username,
            userInformation.user_role.wallet_id,
            userInformation.service.id,
            userInformation.user_role.role_id,
            userInformation.service.packet_id
        )
    }
    accessTokenObject.refresh_token = await this.checkRefreshTokenExpirationTime(decoded, refresh_token, userInformation)
    return accessTokenObject;
}

//destroying accessToken(accessToken)
module.exports.logout = async (token) => {
    return await JWT.destroy(token)
}


