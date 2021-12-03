const express = require("express")
const router = express.Router()
const socialMediaController = require("../../controllers/socialMediaController")
const accessByToken = require("../../middlewares/accessByToken")

//get superAdmin socialMedia by his/her self
router
    .route("/social-media/my")
    .get(
        accessByToken.isSuperAdmin,
        socialMediaController.getMy
    )

//set superAdmin socialMedia by his/her self
router
    .route("/social-media/my")
    .post(
        accessByToken.isSuperAdmin,
        socialMediaController.setMy
    )

//get all socialMedia(all admins,users)
router
    .route("/social-media")
    .post(
        accessByToken.isSuperAdmin,
        socialMediaController.getAll
    )


//get one socialMedia by socialMediaId
router
    .route("/social-media/:socialMediaId")
    .get(
        accessByToken.isSuperAdmin,
        socialMediaController.getById
    )

//update socialMedia by socialMediaId
router
    .route("/social-media/:socialMediaId")
    .post(
        accessByToken.isSuperAdmin,
        socialMediaController.update
    )

module.exports = router