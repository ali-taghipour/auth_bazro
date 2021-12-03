const express = require("express")
const router = express.Router()
const sessionControler = require("../../controllers/sessionControler")
const accessByToken = require("../../middlewares/accessByToken")

router
    .route("/session")
    .post(
        accessByToken.isUser,
        sessionControler.getAll
    )

router
    .route("/session/:sessionId")
    .delete(
        accessByToken.isUser,
        sessionControler.remove
    )

module.exports = router