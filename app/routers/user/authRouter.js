const express = require("express")
const router = express.Router()
const userController = require("../../controllers/userController")
const deleteUserAccountController = require("../../controllers/deleteUserAccountController")
const accessByToken = require("../../middlewares/accessByToken")

router
    .route("/register/:roleId/:serviceId")
    .post(userController.registerNewUser)
router
    .route("/login/:roleId/:serviceId")
    .post(userController.loginByUserAndPass)
router
    .route("/login/by-phone/:roleId/:serviceId")
    .post(userController.requestLoginByPhoneNumber)
router
    .route("/login/by-phone/verify/:roleId/:serviceId")
    .post(userController.verifyLoginByPhoneNumber)
router
    .route("/me")
    .post(
        accessByToken.isUser,
        userController.getMe
    )
router
    .route("/verify/:token/email")
    .post(
        accessByToken.isUser,
        userController.verifyEmail
    )
router
    .route("/me/update")
    .post(
        accessByToken.isUser,
        userController.updateUser
    )
router
    .route("/logout")
    .post(
        accessByToken.isUser,
        userController.logOut
    )

router
    .route('/delete-my-account')
    .delete(
        accessByToken.isUser,
        deleteUserAccountController.removeUserWithAllInformations
    )





module.exports = router