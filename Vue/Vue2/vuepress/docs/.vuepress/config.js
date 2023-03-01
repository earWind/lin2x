// 配置文件的入口文件

module.exports = {
  title: "前端知识汇总",
  base: "./", // 打包时开启
  // dest: "./dist", // 打包路径
  description: "Just playing around",
  themeConfig: {
    logo: "/img/header-logo.png",
    search: false,
    searchMaxSuggestions: 10,
    nav: [
      { text: "主页", link: "/" },
      {
        text: "foo",
        items: [
          { text: "one", link: "/foo/one/" },
          { text: "two", link: "/foo/two/" },
        ],
      },
      { text: "bar", link: "/bar/" },
    ],
    sidebar: {
      "/bar/": ["", "three", "four"],
      "/": [""],
    },
  },
};
