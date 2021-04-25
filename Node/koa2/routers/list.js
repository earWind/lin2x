const Router = require("koa-router");
const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = "列表-首页";
});

router.get("/news", async (ctx) => {
  ctx.body = "列表-新闻";
});

router.get("/music", async (ctx) => {
  ctx.body = "列表-音乐";
});

module.exports = router
