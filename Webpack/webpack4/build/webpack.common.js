const path = require("path");
const webpack = require("webpack");
// 配置index.html
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 入口
  entry: {
    app: "./src/index.js",
    common: "./src/utils/common.js",
  },
  // 出口
  output: {
    filename: "[name].bundle.js",
    // import 动态导入
    chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname, "../dist"),
  },
  // 优化
  optimization: {
    // 代码分离
    splitChunks: {
      chunks: "all",
    },
  },
  // 模块
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"],
      },
    ],
  },
  // 插件
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: "管理输出",
      filename: "index.html",
      template: "./index.html",
    }),
  ],
};
