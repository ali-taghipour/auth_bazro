const express = require("express")
const router = express.Router()
// const securityQuestionController = require("../../controllers/securityQuestionController")
const recoveryController = require("../../controllers/recoveryController")
const accessByToken = require("../../middlewares/accessByToken")

//get all security questions
router
    .route("/security-question")
    .get(
        accessByToken.isSuperAdmin,
        recoveryController.getAllSecurityQuestions
    )

//create new security question
router
    .route("/security-question")
    .post(
        accessByToken.isSuperAdmin,
        recoveryController.createNewSecurityQuestion
    )

//update security question
router
    .route("/security-question/:securityQuestionId")
    .post(
        accessByToken.isSuperAdmin,
        recoveryController.updateSecurityQuestion
    )

module.exports = router