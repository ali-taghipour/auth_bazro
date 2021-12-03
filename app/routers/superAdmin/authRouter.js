const express = require("express")
const router = express.Router()
const superAdminController = require("../../controllers/superAdminController")
const accessByToken = require("../../middlewares/accessByToken")

router
    .route("/login")
    .post(superAdminController.loginByUserAndPass)
router
    .route("/login/by-phone")
    .post(superAdminController.requestLoginByPhoneNumber)
router
    .route("/login/by-phone/verify")
    .post(superAdminController.verifyLoginByPhoneNumber)

router
    .route("/me")
    .post(
        accessByToken.isSuperAdmin,
        superAdminController.getMe
    )
router
    .route("/me/update")
    .post(
        accessByToken.isSuperAdmin,
        superAdminController.update
    )
router
    .route("/logout")
    .post(
        accessByToken.isSuperAdmin,
        superAdminController.logOut
    )





module.exports = router