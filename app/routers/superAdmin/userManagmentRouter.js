const express = require("express")
const router = express.Router()
const userController = require("../../controllers/userController")
const accessByToken = require("../../middlewares/accessByToken")

//get all users
router
    .route("/users")
    .post(
        accessByToken.isSuperAdmin,
        userController.getAllUsers
    )


//get one user by wallet
router
    .route("/users/user-by-wallet/:walletId")
    .get(
        accessByToken.isSuperAdmin,
        userController.getUserByWalletId
    )

//get one user
router
    .route("/users/:userId")
    .get(
        accessByToken.isSuperAdmin,
        userController.getUserById
    )

//update one user
router
    .route("/users/:userId")
    .post(
        accessByToken.isSuperAdmin,
        userController.updateUser
    )

module.exports = router
