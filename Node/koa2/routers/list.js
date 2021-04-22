const Router = require("koa-router");
const list = new Router();

list.get("/", async (ctx) => {
  ctx.body = "列表-首页";
});

list.get("/news", async (ctx) => {
  ctx.body = "列表-新闻";
});

list.get("/music", async (ctx) => {
  ctx.body = "列表-音乐";
});

module.exports = list
