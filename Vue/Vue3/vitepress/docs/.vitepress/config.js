// 配置文件
module.exports = {
  // https://earwind.github.io/vue-press/ 放在vue-press目录下
  base: "/vue-press",
  title: "earwind..",
  // dest: "/dist",
  // 主题配置
  themeConfig: {
    // 头部导航
    nav: [
      { text: "首页", link: "/" },
      { text: "技术概要", link: "/summary/" },
      { text: "电影", link: "/movie" },
      {
        text: "联系",
        items: [
          { text: "github", link: "/foo/one/" },
          { text: "掘金", link: "/foo/two/" },
        ],
      },
    ],
    // 侧边导航
    sidebar: {
      "/summary/": [
        { text: "数据结构与算法", link: "/" },
        {
          text: "正则",
          children: [
            { text: "regex", link: "/summary/regex" },
          ],
        },
        { text: "位运算", link: "/" },
        { text: "计算机网络", link: "/" },
        { text: "Vue", link: "/" },
        { text: "Css", link: "/" },
        { text: "JavaScript", link: "/" },
      ],
    },
  },
};
