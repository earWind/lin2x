const fs = require("../utils/fs");
const db = require("../utils/db");

// 给表 zixun 添加数据
const zixun = [
  {
    id: 0,
    icon: "/images/angular.gif",
    subtitle:
      "学会用 Angular 构建应用，把这些代码和能力复用在多种不同平台的应用上",
    title: "一套框架多种平台 移动端&桌面端",
  },
  {
    id: 1,
    icon: "/images/vue.gif",
    subtitle: "不断繁荣的生态系统，可以在一个库和一套完整框架之间自如伸缩",
    title: "渐进式的JavaScript 框架",
  },
  {
    id: 2,
    icon: "/images/react.gif",
    subtitle:
      "组件逻辑使用 JavaScript 编写而非模版，你可以轻松地在应用中传递数据，并使得状态与 DOM 分离",
    title: "用于构建用户界面的 JavaScript 库",
  },
];

zixun.map(({ id, title, subtitle, icon }) => {
  let sql = `INSERT INTO zixun VALUES (${id}, '${title}', '${subtitle}', '${icon}')`;
  db.query(sql, (err, data) => {
    if (err) throw err;
    console.log(data);
  });
});

// 添加 article 表数据
(async () => {
  // 分别读取这几份txt文件
  const vueContent = await fs.readFile("../assets/txt/vue.txt");
  const reactContent = await fs.readFile("../assets/txt/react.txt");
  const angularContent = await fs.readFile("../assets/txt/angular.txt");

  let article = [
    {
      id: 0,
      title: "一套框架多种平台 移动端&桌面端",
      author: "张三丰",
      date: "2013-03-22",
      imgUrl: "/images/dt.png",
      content: angularContent,
    },
    {
      id: 1,
      title: "渐进式的JavaScript 框架",
      author: "小鱼儿",
      date: "2014-04-23",
      imgUrl: "/images/dt.png",
      content: vueContent,
    },
    {
      id: 2,
      title: "一套框架多种平台 移动端&桌面端",
      author: "花无缺",
      date: "2015-05-24",
      imgUrl: "/images/dt.png",
      content: reactContent,
    },
  ];

  article.map((item) => {
    const { id, title, author, date, imgUrl, content } = item;
    let sql = `INSERT INTO article VALUES (${id}, '${title}', '${author}', '${date}', '${imgUrl}', '${content}')`;
    db.query(sql, (err, data) => {
      if (err) throw err;
      console.log(data);
    });
  });
})();

// 因为 zixun 和 article 是关联表，要先加xixun;
