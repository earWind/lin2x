const Router = require("koa-router");
const home = new Router();

home.get("/", async (ctx) => {
  ctx.body = "首页";
});

module.exports = home
