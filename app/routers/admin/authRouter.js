const express = require("express")
const router = express.Router()
const adminController = require("../../controllers/adminController")
const accessByToken = require("../../middlewares/accessByToken")

router
    .route("/login")
    .post(adminController.loginByUserAndPass)
router
    .route("/login/by-phone")
    .post(adminController.requestLoginByPhoneNumber)
router
    .route("/login/by-phone/verify")
    .post(adminController.verifyLoginByPhoneNumber)

router
    .route("/me")
    .post(
        accessByToken.isAdmin,
        adminController.getMe
    )
router
    .route("/me/update")
    .post(
        accessByToken.isAdmin,
        adminController.updateAdmin
    )

router
    .route("/logout")
    .post(
        accessByToken.isAdmin,
        adminController.logOut
    )




module.exports = router