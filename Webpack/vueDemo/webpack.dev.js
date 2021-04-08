/**
 * 开发环境配置
 */

// 将common配置合并在一起
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");

module.exports = merge(common, {
  // 指定生产环境
  mode: "development",
  // 为了更容易地追踪 error 和 warning在源代码中的原始位置
  devtool: "inline-source-map",
  // 一个简单的 web server，并且具有 live reloading(实时重新加载) 功能
  devServer: {
    // 告诉 dev server，从什么位置查找文件
    contentBase: "./dist",
    // 启用模块热替换
    hot: true,
    // 端口
    port: 8081,
    // 自动打开浏览器
    open: false,
    // gzip 压缩
    compress: true, 
  },
  // 配置插件
  plugins: [
    // 热更新
    new webpack.HotModuleReplacementPlugin(),
  ],
});
