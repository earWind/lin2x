const db = require("../utils/db");

const list = [
  {
    title: "《物种起源》",
    author: "达尔文",
  },
  {
    title: "《全球通史》",
    author: "斯塔夫里阿诺斯",
  },
  {
    title: "《孙子兵法》",
    author: "孙武",
  },
  {
    title: "《三国演义》",
    author: "罗贯中",
  },
  {
    title: "《老人与海》",
    author: "海明威",
  },
  {
    title: "《钢铁是怎样炼成的》",
    author: "尼·奥斯特洛夫斯基",
  },
];

list.map(({ title, author }) => {
  let sql = `insert into banner (title, author, submission_date) VALUES ("${title} ${author}", "菜鸟教程", NOW())`;
  db.query(sql, (err, data) => {
    if (err) throw err;
    console.log(data);
  });
});
