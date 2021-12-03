const express = require("express")
const app = express()
const session = require("express-session");
const sequelize = require("./database/db");
const redisSessionStore = require("./database/redisSessionStore");
const firstTimeInstall = require("./services/firstTimeInstall");
const globalSuperAdminToken = require("./services/globalSuperAdminToken");

(async () => {
  const data = {}
  if (app.get("env") === "development") {
    data["force"] = process.env.FORCE_DATA ? process.env.FORCE_DATA : true
  }
  require("./models")
  await sequelize.sync(data);
  await firstTimeInstall();
  console.log("firstTime superAdmin token generation----------")
  await globalSuperAdminToken.makeNew();
  console.log("firstTime superAdmin token generation end------")
})();

// const t = 60000 * 60
app.use(session({
  secret: "keyboard cat",
  store: redisSessionStore,
  cookie: {
    // maxAge: t * 6
    expires: new Date(253402300000000)
  },
  saveUninitialized: true,
  resave: true
}))


app.use(express.json())
app.use(express.urlencoded({ extended: false }));

require("./routers")(app)



module.exports = app
