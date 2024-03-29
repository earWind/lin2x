const Router = require("koa-router");
const router = new Router();
const db = require("../../utils/db");

router.get("/", async (ctx) => {
  ctx.body = "home";
});

router.get("/banner", async (ctx) => {
  await db.query("select * from banner").then((res) => {
    ctx.body = res;
  });
});

module.exports = router;
