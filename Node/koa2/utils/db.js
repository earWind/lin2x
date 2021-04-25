const mysql = require("mysql");

// 连接池
const pool = mysql.createPool({
  host: "localhost", // 连接服务器（代码上线后，需改成内网IP）,
  port: "3306", // mysql运行端口
  database: "test", // 库
  user: "root", // 用户名
  password: "123456", // 用户密码
});

/**
 * 对数据库进行增删改查
 *
 * @param {*} sql 操作指令
 */
function query(sql) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
          // 释放连接
          connection.release();
        });
      }
    });
  });
}

module.exports = {
  query,
};
