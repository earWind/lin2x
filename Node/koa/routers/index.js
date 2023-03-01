// 引入router
const Router = require("koa-router");
const router = new Router();
// 引入子路由
const home = require("./modules/home");
const login = require("./modules/login");
const list = require("./modules/list");
const error404 = require("./modules/404");

router.use("/home", home.routes(), home.allowedMethods());
router.use("/login", login.routes(), login.allowedMethods());
router.use("/list", list.routes(), list.allowedMethods());
router.use("/404", error404.routes(), error404.allowedMethods());

// 重定向
router.redirect("/", "/home");

module.exports = router;
