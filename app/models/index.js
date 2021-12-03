const superAdmin = require("./superAdmin")
const service = require("./service")
const admin = require("./admin")
const role = require("./role")
const user = require("./user")
const userRole = require("./userRole")
const otp = require("./otp")
const address = require("./address")
const company = require("./company")
const info = require("./info")
const socialMedia = require("./socialMedia")
const securityQuestion = require("./securityQuestion")
const securityAnswer = require("./securityAnswer")
const session = require("./session")
const lastPassword = require("./lastPassword")
const recovery = require("./recovery")
const refreshToken = require("./refresh_token")

service.roles = service.hasMany(role, { sourceKey: "id", foreignKey: "service_id", constraints: false })
service.userRoles = service.hasMany(userRole, { sourceKey: "id", foreignKey: "service_id", constraints: false })

service.admin = service.hasOne(admin, { sourceKey: "id", foreignKey: "service_id", constraints: false })
admin.service = admin.belongsTo(service, { targetkey: "id", foreignKey: "service_id", constraints: false })

role.service = role.belongsTo(service, { targetkey: "id", foreignKey: "service_id", constraints: false })
role.userRoles = role.hasMany(userRole, { sourceKey: "id", foreignKey: "role_id", constraints: false })

superAdmin.addresses = superAdmin.hasMany(address, { as: "addresses", sourceKey: "id", foreignKey: "userable_id", where: { userable_type: "super_admin" }, constraints: false })
address.superAdmin = address.belongsTo(superAdmin, { as: "super_admin", targetKey: "id", foreignKey: "userable_id", scope: { userable_type: "super_admin" }, constraints: false })
admin.addresses = admin.hasMany(address, { as: "addresses", sourceKey: "id", foreignKey: "userable_id", where: { userable_type: "admin" }, constraints: false })
address.admin = address.belongsTo(admin, { as: "admin", targetKey: "id", foreignKey: "userable_id", scope: { userable_type: "admin" }, constraints: false })
user.addresses = user.hasMany(address, { as: "addresses", sourceKey: "id", foreignKey: "userable_id", where: { userable_type: "user" }, constraints: false })
address.user = address.belongsTo(user, { as: "user", targetKey: "id", foreignKey: "userable_id", scope: { userable_type: "user" }, constraints: false })

superAdmin.companies = superAdmin.hasMany(company, { as: "companies", sourceKey: "id", foreignKey: "userable_id", scope: { userable_type: "super_admin" }, constraints: false })
company.superAdmin = company.belongsTo(superAdmin, { as: "super_admin", targetKey: "id", foreignKey: "userable_id", scope: { userable_type: "super_admin" }, constraints: false })
admin.companies = admin.hasMany(company, { as: "companies", sourceKey: "id", foreignKey: "userable_id", scope: { userable_type: "admin" }, constraints: false })
company.admin = company.belongsTo(admin, { as: "admin", targetKey: "id", foreignKey: "userable_id", scope: { userable_type: "admin" }, constraints: false })
user.companies = user.hasMany(company, { as: "companies", sourceKey: "id", foreignKey: "userable_id", scope: { userable_type: "user" }, constraints: false })
company.user = company.belongsTo(user, { as: "user", targetKey: "id", foreignKey: "userable_id", scope: { userable_type: "user" }, constraints: false })

superAdmin.info = superAdmin.hasOne(info, { as: "info", sourceKey: "id", foreignKey: "userable_id", scope: { userable_type: "super_admin" }, constraints: false })
info.superAdmin = info.belongsTo(superAdmin, { as: "super_admin", targetKey: "id", foreignKey: "userable_id", scope: { userable_type: "super_admin" }, constraints: false })
admin.info = admin.hasOne(info, { as: "info", sourceKey: "id", foreignKey: "userable_id", scope: { userable_type: "admin" }, constraints: false })
info.admin = info.belongsTo(admin, { as: "admin", targetKey: "id", foreignKey: "userable_id", scope: { userable_type: "admin" }, constraints: false })
user.info = user.hasOne(info, { as: "info", sourceKey: "id", foreignKey: "userable_id", scope: { userable_type: "user" }, constraints: false })
info.user = info.belongsTo(user, { as: "user", targetKey: "id", foreignKey: "userable_id", scope: { userable_type: "user" }, constraints: false })

superAdmin.socialMedia = superAdmin.hasOne(socialMedia, { as: "socialMedia", sourceKey: "id", foreignKey: "userable_id", scope: { userable_type: "super_admin" }, constraints: false })
socialMedia.superAdmin = socialMedia.belongsTo(superAdmin, { as: "super_admin", targetKey: "id", foreignKey: "userable_id", scope: { userable_type: "super_admin" }, constraints: false })
admin.socialMedia = admin.hasOne(socialMedia, { as: "socialMedia", sourceKey: "id", foreignKey: "userable_id", scope: { userable_type: "admin" }, constraints: false })
socialMedia.admin = socialMedia.belongsTo(admin, { as: "admin", targetKey: "id", foreignKey: "userable_id", scope: { userable_type: "admin" }, constraints: false })
user.socialMedia = user.hasOne(socialMedia, { as: "socialMedia", sourceKey: "id", foreignKey: "userable_id", scope: { userable_type: "user" }, constraints: false })
socialMedia.user = socialMedia.belongsTo(user, { as: "user", targetKey: "id", foreignKey: "userable_id", scope: { userable_type: "user" }, constraints: false })


user.userRoles = user.hasMany(userRole, { sourceKey: "id", foreignKey: "user_id", constraints: false })
admin.userRoles = admin.hasMany(userRole, { sourceKey: "service_id", foreignKey: "service_id", constraints: false })

admin.roles = admin.hasMany(role, { sourceKey: "service_id", foreignKey: "service_id", constraints: false })


userRole.user = userRole.belongsTo(user, { targetkey: "id", foreignKey: "user_id", constraints: false })
userRole.role = userRole.belongsTo(role, { targetkey: "id", foreignKey: "role_id", constraints: false })
userRole.service = userRole.belongsTo(service, { targetkey: "id", foreignKey: "service_id", constraints: false })

refreshToken.service = refreshToken.belongsTo(service, { targetkey: "id", foreignKey: "service_id", constraints: false })
refreshToken.userRole = refreshToken.belongsTo(userRole, { targetkey: "id", foreignKey: "user_role_id", constraints: false })


module.exports = {
    superAdmin,
    service,
    admin,
    role,
    user,
    userRole,
    otp,
    address,
    company,
    info,
    socialMedia,
    securityQuestion,
    securityAnswer,
    session,
    lastPassword,
    recovery,
    refreshToken,
}