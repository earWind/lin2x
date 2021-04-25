const Router = require("koa-router");
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "404页面不存在";
});

module.exports = router;
