const express = require("express")
const router = express.Router()
const companyController = require("../../controllers/companyController")
const accessByToken = require("../../middlewares/accessByToken")

//get superAdmin companies by his/her self
router
    .route("/company/my")
    .get(
        accessByToken.isSuperAdmin,
        companyController.getMy
    )

//set superAdmin company by his/her self
router
    .route("/company/my")
    .post(
        accessByToken.isSuperAdmin,
        companyController.setMy
    )

//get all companies
router
    .route("/company")
    .post(
        accessByToken.isSuperAdmin,
        companyController.getAll
    )

//get one company by companyId
router
    .route("/company/:companyId")
    .get(
        accessByToken.isSuperAdmin,
        companyController.getById
    )

//update company by companyId
router
    .route("/company/:companyId")
    .post(
        accessByToken.isSuperAdmin,
        companyController.update
    )

module.exports = router