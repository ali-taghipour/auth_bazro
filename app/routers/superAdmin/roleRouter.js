const express = require("express")
const router = express.Router()
const roleController = require("../../controllers/roleController")
const accessByToken = require("../../middlewares/accessByToken")

//get all session
router
    .route("/role")
    .post(
        accessByToken.isSuperAdmin,
        roleController.getAllRole
    )

//create new session
router
    .route("/role/new")
    .post(
        accessByToken.isSuperAdmin,
        roleController.addNewRole
    )

//set permissional rote to user
router
    .route("/role/:roleId/set-role-to-user")
    .post(
        accessByToken.isSuperAdmin,
        roleController.setRolePermissionToUser
    )
//remove permissional rote from user
router
    .route("/role/:roleId/remove-role-from-user")
    .post(
        accessByToken.isSuperAdmin,
        roleController.unsetRolePermissionFromUser
    )

//get one session
router
    .route("/role/:roleId")
    .get(
        accessByToken.isSuperAdmin,
        roleController.getById
    )

//update one session
router
    .route("/role/:roleId")
    .post(
        accessByToken.isSuperAdmin,
        roleController.updateRole
    )



module.exports = router