const path = require("path");
/**
 * 1.自动在内存中根据指定页面生成一个内存页面
 * 2.自动把打包好的bundel.js追加到页面中
 */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  // 入口文件(需要打包的文件)
  entry: {
    app: "./src/index.js",
  },
  // 输出打包后的文件(管理输出)
  // [name] 据入口起点定义的名称，动态地产生 bundle 名称
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  // 为了更容易地追踪 error 和 warning在源代码中的原始位置
  devtool: "inline-source-map",
  // 一个简单的 web server，并且具有 live reloading(实时重新加载) 功能
  devServer: {
    // 告诉 dev server，从什么位置查找文件
    contentBase: "./dist",
    // 启用模块热替换
    hot: true,
  },
  // 开发环境
  mode: "development",
  optimization: {
    usedExports: true,
  },
  // 模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块
  module: {
    // 配置 loader
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  // 配置插件
  plugins: [
    new HtmlWebpackPlugin({
      // 生成html文件的标题
      title: "管理输出",
      // 就是html文件的文件名，默认是index.html
      template: "index.html",
      // true 默认值，script标签位于html文件的 body 底部
      inject: true,
    }),
    // 清除dist文件
    new CleanWebpackPlugin(),
    // 热更新
    new webpack.HotModuleReplacementPlugin(),
  ],
};
