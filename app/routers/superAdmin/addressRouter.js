const express = require("express")
const router = express.Router()
const addressController = require("../../controllers/addressController")
const accessByToken = require("../../middlewares/accessByToken")

//get superAdmin Addresses by his/her self
router
    .route("/address/my")
    .get(
        accessByToken.isSuperAdmin,
        addressController.getMy
    )

//set superAdmin Address by his/her self 
router
    .route("/address/my")
    .post(
        accessByToken.isSuperAdmin,
        addressController.setMy
    )

//get all addresses(all admins,users)
router
    .route("/address")
    .post(
        accessByToken.isSuperAdmin,
        addressController.getAll
    )

//get one address by addressId
router
    .route("/address/:addressId")
    .get(
        accessByToken.isSuperAdmin,
        addressController.getById
    )

//update address by addressId
router
    .route("/address/:addressId")
    .post(
        accessByToken.isSuperAdmin,
        addressController.update
    )

module.exports = router