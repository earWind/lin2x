// 引入koa
const Koa = require("koa2");
const app = new Koa();
// 引入路由
const router = require("./routers");
// 端口号
const port = 3000;
// 跨域
const cors = require("koa2-cors");

app.use(
  cors({
    origin: function (ctx) {
      return "*"; // 允许来自所有域名请求
    },
    maxAge: 5, // 指定本次预检请求的有效期，单位为秒。
    credentials: true, // 是否允许发送Cookie
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 设置所允许的HTTP请求方法'
    allowHeaders: ["Content-Type", "Authorization", "Accept"], // 设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], // 设置获取其他自定义字段
  })
);

/**
 * router.routes() 启动路由
 * router.allowedMethods() 允许任何请求（get，post，put）
 */
app.use(router.routes(), router.allowedMethods());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
