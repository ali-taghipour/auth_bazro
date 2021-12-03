const express = require("express")
const router = express.Router()
const adminController = require("../../controllers/adminController")
const roleController = require("../../controllers/roleController")
const accessByToken = require("../../middlewares/accessByToken")

// get all admins
router
    .route("/admins")
    .post(
        accessByToken.isSuperAdmin,
        adminController.getAllAdmins
    )

//register new admin
router
    .route("/admins/new")
    .post(
        accessByToken.isSuperAdmin,
        adminController.registerNewAdmin
    )

//get one admin
router
    .route("/admins/:adminId")
    .get(
        accessByToken.isSuperAdmin,
        adminController.getAdminById
    )

//get one admin's role
router
    .route("/admins/:adminId/role")
    .post(
        accessByToken.isSuperAdmin,
        roleController.getOneAdminRoles
    )

//update one admin
router
    .route("/admins/:adminId")
    .post(
        accessByToken.isSuperAdmin,
        adminController.updateAdmin
    )

module.exports = router
