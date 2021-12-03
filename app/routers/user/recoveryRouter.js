const express = require("express")
const router = express.Router()
const recoveryController = require("../../controllers/recoveryController")
const accessByToken = require("../../middlewares/accessByToken")

//get all security questions
router
    .route("/security-questions")
    .get(
        accessByToken.isUser,
        recoveryController.getAllSecurityQuestions
    )
//set a security answer
router
    .route("/security-answer")
    .post(
        accessByToken.isUser,
        recoveryController.createNewSecurityAnswer
    )

router
    .route("/recovery/by-last-password")
    .post(
        accessByToken.isUser,
        recoveryController.recoverByLastPasword
    )
//confirm user by security question and username and step1(lastpassword) and set new password
router
    .route("/recovery/new-password")
    .post(
        accessByToken.isUser,
        recoveryController.newPasswordAndConfirmUser
    )

module.exports = router