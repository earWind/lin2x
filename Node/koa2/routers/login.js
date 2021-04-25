const Router = require("koa-router");
const router = new Router();
const db = require("../utils/db");
// 用于获取post请求数据
const bodyParser = require("koa-bodyparser");
// 用于生成token
const jwt = require("jsonwebtoken");

router.use(bodyParser());

router.post("/register", async (ctx) => {
  const { account, pwd } = ctx.request.body;
  const sql = `SELECT * FROM users WHERE account='${account}'`;
  const res = await db.query(sql);

  if (Array.isArray(res) && res.length) {
    // 能找到对应的账号
    if (res[0].pwd == pwd) {
      // 账号密码正确，返回token
      ctx.body = {
        token: res[0],
        msg: "登录成功",
        account: account,
      };
    } else {
      // 密码错误
      ctx.body = {
        msg: "密码错误",
        account: account,
      };
    }
  } else {
    // 找不到对应的账号，直接插入一个

    // 生成token
    const token = jwt.sign({ account, pwd: pwd }, "secret", {
      expiresIn: 3600,
    });

    const res = db.query(
      `INSERT INTO users (account, pwd, token) values ('${account}', '${pwd}', '${token}')`
    );

    if (res) {
      let ret = {
        token,
        msg: "登录成功",
        account: account,
      };
      ctx.body = ret;
    } else {
      throw res;
    }
  }
});

module.exports = router;
