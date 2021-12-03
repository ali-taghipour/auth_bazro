const express = require("express")
const router = express.Router()
const companyController = require("../../controllers/companyController")
const accessByToken = require("../../middlewares/accessByToken")

//get user companies by his/her self
router
    .route("/company")
    .get(
        accessByToken.isUser,
        companyController.getMy
    )

//set user company by his/her self
router
    .route("/company")
    .post(
        accessByToken.isUser,
        companyController.setMy
    )

//update company by companyId
router
    .route("/company/:companyId")
    .post(
        accessByToken.isUser,
        companyController.update
    )

module.exports = router