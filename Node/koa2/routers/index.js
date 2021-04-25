// 引入router
const Router = require("koa-router");
const router = new Router();
// 引入子路由
const home = require("./home");
const list = require("./list");
const login = require("./login");
const error404 = require("./404");

router.use("/home", home.routes(), home.allowedMethods());
router.use("/list", list.routes(), list.allowedMethods());
router.use("/login", login.routes(), login.allowedMethods());
router.use("/404", error404.routes(), error404.allowedMethods());

// 重定向
router.redirect("/", "/home");

module.exports = router;
