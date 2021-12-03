const express = require("express")
const router = express.Router()
const companyController = require("../../controllers/companyController")
const accessByToken = require("../../middlewares/accessByToken")

//get admin companies by his/her self
router
    .route("/company/my")
    .get(
        accessByToken.isAdmin,
        companyController.getMy
    )

//set admin company by his/her self
router
    .route("/company/my")
    .post(
        accessByToken.isAdmin,
        companyController.setMy
    )

//get all companies
router
    .route("/company")
    .post(
        accessByToken.isAdmin,
        companyController.getAll
    )

//get one company by companyId
router
    .route("/company/:companyId")
    .get(
        accessByToken.isAdmin,
        companyController.getById
    )

//update company by companyId
router
    .route("/company/:companyId")
    .post(
        accessByToken.isAdmin,
        companyController.update
    )

module.exports = router