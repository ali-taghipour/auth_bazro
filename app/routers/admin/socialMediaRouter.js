const express = require("express")
const router = express.Router()
const socialMediaController = require("../../controllers/socialMediaController")
const accessByToken = require("../../middlewares/accessByToken")

//get admin socialMedia by his/her self
router
    .route("/social-media/my")
    .get(
        accessByToken.isAdmin,
        socialMediaController.getMy
    )

//set admin socialMedia by his/her self
router
    .route("/social-media/my")
    .post(
        accessByToken.isAdmin,
        socialMediaController.setMy
    )

//get all socialMedia(all admins,users)
router
    .route("/social-media")
    .post(
        accessByToken.isAdmin,
        socialMediaController.getAll
    )


//get one socialMedia by socialMediaId
router
    .route("/social-media/:socialMediaId")
    .get(
        accessByToken.isAdmin,
        socialMediaController.getById
    )

//update socialMedia by socialMediaId
router
    .route("/social-media/:socialMediaId")
    .post(
        accessByToken.isAdmin,
        socialMediaController.update
    )

module.exports = router