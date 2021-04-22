// 引入koa
const Koa = require("koa2");
const app = new Koa();
// 引入路由
const router = require("./routers");
// 端口号
const port = 3000;

/**
 * router.routes() 启动路由
 * router.allowedMethods() 允许任何请求（get，post，put）
 */
app.use(router.routes(), router.allowedMethods());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
