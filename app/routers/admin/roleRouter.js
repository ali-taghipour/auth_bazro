const express = require("express")
const router = express.Router()
const roleController = require("../../controllers/roleController")
const accessByToken = require("../../middlewares/accessByToken")

//get all roles by his/her self (admin)
router
    .route("/role")
    .post(
        accessByToken.isAdmin,
        roleController.getOneAdminRoles
    )

//create new role
router
    .route("/role/new")
    .post(
        accessByToken.isAdmin,
        roleController.addNewRole
    )
//set permissional rote to user
router
    .route("/role/:roleId/set-role-to-user")
    .post(
        accessByToken.isAdmin,
        roleController.setRolePermissionToUser
    )
//remove permissional rote from user
router
    .route("/role/:roleId/remove-role-from-user")
    .post(
        accessByToken.isAdmin,
        roleController.unsetRolePermissionFromUser
    )
//get one role
router
    .route("/role/:roleId")
    .get(
        accessByToken.isAdmin,
        roleController.getById
    )

//update one role 
router
    .route("/role/:roleId")
    .post(
        accessByToken.isAdmin,
        roleController.updateRole
    )

module.exports = router