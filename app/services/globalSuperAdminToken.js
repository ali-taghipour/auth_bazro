const superAdminRepo = require("../repositories/superAdminRepo");
const tokenService = require("./tokenService");


//make a general superAdmin token for connecting to other micriservices(wallet,...)
module.exports.makeNew = async () => {
    console.log("---generating started")
    const superAdmin = await superAdminRepo.getOne({})
    if (!superAdmin) {
        throw new Error("superAdmin not founded ...")
    }
    const tokenObj = await tokenService.generatTokenSuperAdmin(superAdmin)
    // console.log("old:" + global.superAdminToken)
    global.superAdminToken = tokenObj.token
    // console.log("new:" + global.superAdminToken)
    console.log("super_admin's global token has been generated")
}