const Router = require("koa-router");
const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = "list";
});

router.get("/news", async (ctx) => {
  ctx.body = "list-news";
});

router.get("/music", async (ctx) => {
  ctx.body = "list-music";
});

module.exports = router;
