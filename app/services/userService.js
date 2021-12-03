const userRoleRepo = require("../repositories/userRoleRepo");

//generate array of user_id's by service_id (which register or login by this service_id)
module.exports.getAllAdminUsersByService = async (serviceId, page = false) => {
    const userIds = [];
    let limit = 0;

    limit = await userRoleRepo.count({ service_id: serviceId });

    const roleUsers = await userRoleRepo.getAll({ "service_id": serviceId }, 'id', 'desc', 0, limit)


    if (roleUsers.length > 0) {
        roleUsers.forEach(roleUser => {
            if (userIds.indexOf(roleUser.user_id) === -1)
                userIds.push(roleUser.user_id)
        });
    }
    return userIds
}