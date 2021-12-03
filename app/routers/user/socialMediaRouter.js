const express = require("express")
const router = express.Router()
const socialMediaController = require("../../controllers/socialMediaController")
const accessByToken = require("../../middlewares/accessByToken")

//get user socialMedia by his/her self
router
    .route("/social-media")
    .get(
        accessByToken.isUser,
        socialMediaController.getMy
    )

//set user socialMedia by his/her self
router
    .route("/social-media")
    .post(
        accessByToken.isUser,
        socialMediaController.setMy
    )


module.exports = router