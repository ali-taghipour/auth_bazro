const express = require("express")
const router = express.Router()
const userController = require("../../controllers/userController")
const accessByToken = require("../../middlewares/accessByToken")

//get all admin's users
router
    .route("/users")
    .post(
        accessByToken.isAdmin,
        userController.getAllUsers
    )

//get one user by wallet
router
    .route("/users/user-by-wallet/:walletId")
    .get(
        accessByToken.isAdmin,
        userController.getUserByWalletId
    )

//get one user
router
    .route("/users/:userId")
    .get(
        accessByToken.isAdmin,
        userController.getUserById
    )

//get one user
router
    .route("/users/:userId")
    .delete(
        accessByToken.isAdmin,
        userController.deleteUser
    )


module.exports = router
