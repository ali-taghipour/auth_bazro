module.exports = (app) => {
    app.use(require("../middlewares/checkingBasicAuthentication"))
    app.use("/", require("./user"));
    app.use("/admin", require("./admin"));
    app.use("/super-admin", require("./superAdmin"));
    app.post("/update-token", require("../controllers/refreshTokenController").generateTokenByRefreshToken)
    app.use((req, res, next) => {
        res.status(404).send("oops ! 404")
    })
}