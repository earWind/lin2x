const Router = require("koa-router");
const home = new Router();

home.get("/", async (ctx) => {
  ctx.body = {
    text: "首页",
  };
});

module.exports = home;
