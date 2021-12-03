const express = require("express")
const router = express.Router()
const infoController = require("../../controllers/infoController")
const accessByToken = require("../../middlewares/accessByToken")

//get user info by his/her self
router
    .route("/info")
    .get(
        accessByToken.isUser,
        infoController.getMy
    )

//set user info by his/her self
router
    .route("/info")
    .post(
        accessByToken.isUser,
        infoController.setMy
    )


module.exports = router