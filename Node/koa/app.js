// 创建koa实例
const Koa = require("koa");
const app = new Koa();
// 端口
const port = 3900;
// 路由
const router = require("./routers");
const { koaBody } = require("koa-body");

// 使用中间件
app.use(koaBody());

/**
 * router.routes() 启动路由
 * router.allowedMethods() 允许任何请求（get/post/put）
 */
app.use(router.routes(), router.allowedMethods());

app.use(async (ctx, next) => {
  // 匹配不到的页面 跳到404
  if (parseInt(ctx.status) === 404) {
    ctx.response.redirect("/404");
  }
});

// 异常
app.on("error", (err) => {
  console.error("server error", err);
});

// 监听端口
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
