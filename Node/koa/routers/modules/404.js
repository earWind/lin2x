const Router = require("koa-router");
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "404";
});

module.exports = router;
