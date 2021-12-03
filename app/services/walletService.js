const axios = require("axios")
const Exception = require("../helpers/errorHelper")

const makeBasicAuthentication = () => {
    return 'Basic ' + Buffer.from(process.env.BASICAUTH_USERNAME + ':' + process.env.BASICAUTH_PASSWORD).toString('base64')
}
const getFromWalletServer = async (Method, route, body, otherHeader = {}) => {
    // console.log(process.env.WALLET_SERVICE_ADDRESS + route)
    // console.log(body)
    // console.log({ "authorization": 'Bearer ' + global.superAdminToken })
    const axiosHeader = await axios.create({
        headers: {
            "auth_basic": makeBasicAuthentication(),
            "authorization": 'Bearer ' + global.superAdminToken,
            ...otherHeader
        }
    })
    try {
        let res
        if (Method == "POST") {
            res = await axiosHeader.post(process.env.WALLET_SERVICE_ADDRESS + route, body)
        } else if (Method == "GET") {
            res = await axiosHeader.get(process.env.WALLET_SERVICE_ADDRESS + route)
        }
        // console.log(res)
        return res ? (res.data ? (res.data.data ? res.data.data : res.data) : res) : res
    } catch (error) {
        // console.log(error.response.data)
        // if (error.response.status)
        if (error.response && error.response.data)
            throw new Error(`Wallet Service problem on ${route}  msg:${error.response.data.message}`)
        throw new Error(`Wallet Service problem on ${route} ` + error.message)
    }
}
module.exports.makePacketByPacketId = async (serviceModel) => {
    const body = {
        id: serviceModel.packet_id,//packet_id,
        name: serviceModel.name + "_packet",//servicName,
        service_id: serviceModel.id,
    }
    const result = await getFromWalletServer("POST", '/packet/new', body)
    if (!result) {
        throw new Error("connecting to Wallet Service has been failed (create packet)")
    }
    return result
}
module.exports.setNewWallet = async (username, servicId, roleId, wallet_id, user_id, user_type, servicName, roleName) => {
    const body = {
        id: wallet_id,
        user_id: user_id,
        user_type: user_type,
        service_id: servicId,
        role_id: roleId,
        name: `${username}_${servicName}_${roleName}`,
        // pocket_id: packet_id,
    }
    const result = await getFromWalletServer("POST", '/wallet/new', body)
    if (!result) {
        throw new Error("connecting to Wallet Service has been failed (create wallet)")
    }
    return result
}

module.exports.getWalletById = async (walletId) => {
    const result = await getFromWalletServer("GET", '/wallet/' + walletId)
    if (!result) {
        throw new Error("connecting to Wallet Service has been failed (create wallet)")
    }
    return result
}