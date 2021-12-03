const express = require("express")
const router = express.Router()

router.use(require("./authRouter"));
router.use(require("./roleRouter"));
router.use(require("./addressRouter"));
router.use(require("./infoRouter"));
router.use(require("./companyRouter"));
router.use(require("./socialMediaRouter"));
router.use(require("./sessionRouter"));
router.use(require("./userManagmentRouter"));
router.use(require("./userActionRouter"));

module.exports = router