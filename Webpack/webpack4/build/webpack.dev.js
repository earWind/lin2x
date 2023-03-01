const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  // 模式
  mode: "development",
  // 问题定位
  devtool: "inline-source-map",
  // 服务
  devServer: {
    // 环境目录
    contentBase: "./dist",
    // 热更
    hot: true,
  },
});
