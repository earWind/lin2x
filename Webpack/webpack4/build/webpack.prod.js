const merge = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common.js");

// 清理dist文件
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
  // 模式
  mode: "production",
  devtool: "source-map",
  plugins: [new CleanWebpackPlugin()],
});
