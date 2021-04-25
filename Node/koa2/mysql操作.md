## 前言

本课程只讲部分必要的增删改查操作，mysql 操作数据库的语句和方法有较多，需要同学们自己做知识扩展。

## 一、Navicat 安装

`Navicat for MySQL` 是一套全面的前端工具为数据库管理、开发和维护提供了一款直观而强大的图形界面，能同时连接 MySQL 和 MariaDB 数据库。

有关 `Navicat for MySQL` 软件的下载和安装，大家可以百度搜索，当然，我这里也给大家找到一篇文章：

https://www.cnblogs.com/yanghongtao/p/10976526.html

至于想要 m1 mac 版的童鞋，可以私信我。

## 二、MySQL 安装

这里提供菜鸟教程的安装指引，含 win、mac、linux:

https://www.runoob.com/mysql/mysql-install.html

如果有纠结版本问题的话，可以直接默认最新版，本教程用的是版本 5.6 以上。

## 三、数据库基本操作语句

### 1、数据库操作

连接数据库：

```js
// 这里默认用户名是root，密码请先设置为简单的123456即可
mysql - uroot - p123456;
```

创建、删除与显示数据库：

```js
// 创建数据库
mysql> create database test;

// 删除数据库（不要轻易使用）
mysql> drop database test;

// 显示数据库
mysql> show databases;

+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| selectTest         |
| sys                |
| test               |
+--------------------+
8 rows in set (0.04 sec)
```

### 2、表操作

表的查看、创建与删除：

```js
// 创建表(假设创建一张banner表，其中包含id和imgUrl字段)
/*
	INT 						整数型
	PRIMARY KEY   	主键约束
	AUTO_INCREMENT	自增约束
	VARCHAR					长字符串
	COMMENT					字段注释
*/
mysql> create table banner (
	id INT PRIMARY KEY AUTO_INCREMENT,
  imgUrl VARCHAR(100) COMMENT '轮播图地址'
);

// 删除表（不要轻易使用）
mysql> drop table banner;

// 查看表
mysql> show tables;

+-----------------+
| Tables_in_kdlzx |
+-----------------+
| banner          |
+-----------------+
1 row in set (0.00 sec)

// 查看banner表字段（描述）
mysql> describe banner;

+--------+--------------+------+-----+---------+----------------+
| Field  | Type         | Null | Key | Default | Extra          |
+--------+--------------+------+-----+---------+----------------+
| id     | int(11)      | NO   | PRI | NULL    | auto_increment |
| imgUrl | varchar(100) | YES  |     | NULL    |                |
+--------+--------------+------+-----+---------+----------------+
2 rows in set (0.01 sec)
```

### 3、增删改查

```js
// 往表里增加一条数据
mysql> insert into banner values (0, '/assets/images/banner1.png');

// 查看表中所有数据
mysql> select * from banner;

+----+-------------+
| id | imgUrl      |
+----+-------------+
|  1 | banner1.png |
+----+-------------+
1 row in set (0.00 sec)

// 专门针对某个字段进行数据添加
// 由于id是一个自增字段，因此可以不用设置该字段的值，该字段即可自增
mysql> INSERT INTO banner SET imgUrl = 'banner2.png';

+----+-------------+
| id | imgUrl      |
+----+-------------+
|  1 | banner1.png |
|  2 | banner2.png |
+----+-------------+
2 rows in set (0.00 sec)

// 清空表数据（不要轻易使用）
mysql> delete from banner;

// 更新一条数据
mysql> UPDATE banner SET imgUrl="banner3.png" WHERE id=1;
```

## 四、往数据库中添加项目所需数据

#### banner 数据：

```js
// 创建banner表格(终端运行)
create table banner (
    id INT NOT NULL PRIMARY KEY,
    imgUrl VARCHAR(100) NOT NULL
);

// 添加数据
const db = require('./db')
const data = [
    {id: 0, imgUrl: '/images/banner1.png'},
    {id: 1, imgUrl: '/images/banner2.png'},
    {id: 2, imgUrl: '/images/banner3.png'}
]

data.map(val=>{
	  // 这里记住，如果是字符串，必须在变量外层套一个引号，否则会出现sql语句报错
    let sql = `INSERT INTO banner VALUES (${val.id}, '${val.imgUrl}')`;
    db.query(sql, (err, data)=>{
        if(err) console.log(err);
        console.log(data)
    })
})

// 运行这份js文件
node xxx.js
```

#### subject 数据：

```js
// 创建subject表格(终端运行)
create table subject (
    id INT NOT NULL PRIMARY KEY,
    icon VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL
);

// 添加数据
const db = require('./db')
const data = [
    {id: 0, icon: '/images/subjectIcons1.png', title: "Java EE"},
    {id: 1, icon: '/images/subjectIcons2.png', title: "全栈UI设计"},
    {id: 2, icon: '/images/subjectIcons3.png', title: "H5前端"},
    {id: 3, icon: '/images/subjectIcons4.png', title: "Python"},
    {id: 4, icon: '/images/subjectIcons5.png', title: "iOS"},
    {id: 5, icon: '/images/subjectIcons6.png', title: "大数据"},
    {id: 6, icon: '/images/subjectIcons7.png', title: "C++"}
]

data.map(val=>{
    let sql = `INSERT INTO subject VALUES (${val.id}, '${val.icon}', '${val.title}')`;
    db.query(sql, (err, data)=>{
        if(err) console.log(err);
        console.log(data)
    })
})
```

## 五、联表查询

这里我们通过对首页资讯模块与文章页进行联表数据处理。

### 1、文章数据录入

我们先录入三篇文章，创建三份 txt 文件放在 assets 中：

#### \* vue.txt 内容：

```html
<p>
  Vue
  提出的渐进式框架的理念，也即是『既是框架，又不是框架』，取决于你想怎么用。最近跟
  Yehuda Katz 的聊天的时候，他表示 Ember 团队关注 Vue
  已经有一阵子，并且觉得在框架/模块化的平衡这一点上 Vue
  做到了他们一直想做的。他们也在试图把 Ember
  的各个部件做得更解耦更容易被单独使用。
</p>
<p>
  Vue 有一个其他框架真的都没有的理念，同时也是我觉得真正关系到 Vue
  的成功的一点，那就是『把高大上的思想变得平易近人』。每个喜欢 Vue
  的用户，都会提到容易上手和文档友好。我想说，易用性不是偶然的，做到易用而强大也不是简单的事情，不信你可以试试。对我来说，衡量
  Vue
  的成功不在于它能让多少人拿来装逼，而是它能让多少人更快更有效率地开发出应用，更早下班回家陪老婆孩子。
</p>
```

#### \* angular.txt 内容:

```html
<p>
  在最近开发的一个功能中，我们无法在 T 项目中通过某个 Angular 组件触发另一个
  AngularJS
  组件的展示。我们经过很长时间才弄清楚了其中的来龙去脉。就像我在之前某封 aha
  moment
  邮件里说的那样，避免写出错误代码的方式是真正理解你编写的代码。所以在这里我不会仅仅给出解决方案，还会详细叙述这个问题背后的机理。如果以后你遇到了相似的问题，希望这篇文章能给你带来帮助。
</p>
<p>
  很多年前我听过一个笑话，说如果你拿一个疑问去问专家，你的一个疑问会变成三个疑问，因为他会用另外两个你更不明白的词来解释这个疑问。但后来我发现这不是笑话而是绝大部分我自己面临的现状。所以在解释这个问题的过程中，我不可避免的需要引入更多的知识进行，好在它们都易于理解，只是有些冗长。
</p>
<p>
  无论是 Angular 还是 AngularJS ，其中最重要的一个机制是判断当前 UI
  是否要进行更新。我们可以把这种机制统一解读为
  “脏检查”，即判断数据是否发生了变化。但是在 Angular 和 AngularJS 中字面上的
  “脏检查” 背后的逻辑却大相径庭。在 Angular 中这种机制称之为 change
  detection（以下我们简称 CD），而在 AngularJS 中这种机制称之为 dirty
  checking（以下简称 DC）
</p>
<p>
  想象一个最简单的场景：你在页面上点击了一个按钮。但如果你在点击事件的回调函数中更改了一些数值，Angular
  是怎么知道的？
</p>
<p>
  因为 Angular 采用 monkey patch 的方式重写并覆盖了浏览器的 addEventListenter
  接口，在调用回调函数的同时手动触发了 CD。
</p>
```

#### \* react.txt 内容：

```html
<p>
  Props、State的概念都很清晰，组件的普通属性是指在组件中直接挂载到this下的属性。其实，Props和State也是组件的两个普通属性，因为我们可以通过this.props
  和 this.state 直接获取到。那么Props、State 和
  组件的其他普通属性，分别应该在什么场景下使用呢？
</p>
<p>
  Props和State都是用于组件渲染的，也就是说，一个组件最终长成什么样，取决于这个组件的Props和State。Props和State的变化都会触发组件的render方法。但这两者也是有区别的。Props是只读的数据，它是由父组件传递过来的；而State是组件内部自己维护的状态，是可变的。State可以根据Props的变化而变化。如果组件中还需要其他属性，而这个属性又与组件的渲染无关（也就是render方法中不会用到），那么就可以把这个属性直接挂在到this下，而不是作为组件的一个状态。
</p>
<p>
  例如，组件中需要一个定时器，每隔几秒改变一下组件的状态，就可以定义一个this.timer属性，以备在componentWillUnmount时，清除定时器。
</p>
<p>
  父组件每次render方法被调用，或者组件自己每次调用setState方法，都会触发组件的render方法（前提是shouldComponentUpdate使用默认行为，总是返回true）。那么组件每次render，是不是都会导致实体DOM的重新创建呢？答案是，不是！
</p>
<p>
  React之所以比直接操作DOM的JS库快，原因是React在实体DOM之上，抽象出一层虚拟DOM，render方法执行后，得到的是虚拟DOM，React
  会把组将当前的虚拟DOM结构和前一次的虚拟DOM结构做比较，只有存在差异性，React才会把差异的内容同步到实体DOM上。如果两次render后的虚拟DOM结构保持一致，并不会触发实体DOM的修改。
</p>
```

### 2、文件读取

#### \* 先测试文件读取

```js
const fs = require("fs");

// 测试读取vue.txt文件
fs.readFile(`../assets/vue.txt`, (err, data) => {
  if (err) throw err;
  console.log(data.toString()); // 这里读取到的文件是二进制文件流，因此要转字符串
});
```

#### \* 封装文件读取函数

如果上面这一步可以成功，那就把这个方法封装一下，方便我们调用：

```js
const fs = require("fs");

// 读取文件的函数
function readFileFn(subject) {
  return new Promise((resolve, reject) => {
    fs.readFile(`../assets/${subject}.txt`, (err, data) => {
      if (err) throw err;
      resolve(data.toString());
    });
  });
}
```

### 3、建表

建立 `zixun` 与 `article` 两张表

```mysql
// 创建联表数据（，终端运行）
CREATE TABLE zixun(
	id INT PRIMARY KEY COMMENT '资讯id',
    title VARCHAR(100) COMMENT '标题',
    subtitle VARCHAR(100) COMMENT '子标题',
    icon VARCHAR(100) NOT NULL COMMENT 'logo'
);

CREATE TABLE article(
	id INT PRIMARY KEY COMMENT '资讯id',
    title VARCHAR(20) COMMENT '标题',
    author VARCHAR(20) COMMENT '作者',
    date VARCHAR(20) COMMENT '日期',
    imgUrl VARCHAR(100) COMMENT '配图',
    content LONGTEXT COMMENT '内容-存储html标签',
	FOREIGN KEY (id) REFERENCES zixun(id)
);
```

#### \* 添加 zixun 表数据：

```js
// 给表zixun添加数据
const db = require("./db");
const data = [
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

data.map((val) => {
  let sql = `INSERT INTO zixun VALUES (${val.id}, '${val.title}', '${val.subtitle}', '${val.icon}')`;
  db.query(sql, (err, data) => {
    if (err) console.log(err);
    console.log(data);
  });
});
```

#### \* 添加 article 表数据：

```js
const db = require("./db");
const fs = require("fs");

// 读取文件的函数
function readFileFn(subject) {
  return new Promise((resolve, reject) => {
    fs.readFile(`../assets/${subject}.txt`, (err, data) => {
      if (err) throw err;
      resolve(data.toString());
    });
  });
}

let vueContent, reactContent, angularContent;
var fn = async () => {
  // 分别读取这几份txt文件
  vueContent = await readFileFn("vue");
  reactContent = await readFileFn("react");
  angularContent = await readFileFn("angular");

  let data = [
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

  data.map((val) => {
    let sql = `INSERT INTO article VALUES (${val.id}, '${val.title}', '${val.author}', '${val.date}', '${val.imgUrl}', '${val.content}')`;
    db.query(sql, (err, data) => {
      if (err) console.log(err);
      console.log(data);
    });
  });
};
fn();
```
