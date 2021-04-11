/**
 * 生产环境配置
 */

// 将common配置合并在一起
const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");
const webpack = require("webpack");
// 分离样式文件，CSS 提取为独立文件，支持按需加载
// 请只在生产环境下使用 CSS 提取，这将便于你在开发环境下进行热重载
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩js文件
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// 将文件拷贝到某个目录下
const CopyWebpackPlugin = require("copy-webpack-plugin");
// 压缩css
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
// 优化图像
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = merge(common, {
  // 模式 指定开发环境
  mode: "production",
  // 为了更容易地追踪 error 和 warning在源代码中的原始位置
  devtool: "nosources-source-map",
  // 输出打包后的js
  output: {
    path: path.resolve(__dirname, "dist"),
    // 将输出的 js 都放在js目录下
    filename: "js/[name].[chunkhash].js",
    chunkFilename: "js/[id].[chunkhash].js",
  },
  // 优化
  optimization: {
    // 代码压缩
    minimize: true,
    minimizer: [
      // 对js文件进行压缩，从而减小js文件的大小，加速load速度,但是会拖慢webpack的编译速度
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        exclude: /node_modules/,
      }),
    ],
    runtimeChunk: "single",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    // 提取css
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[name].css",
    }),
    // 环境变量
    new webpack.DefinePlugin({
      name: "pro",
    }),
    // 过滤打包文件，减少打包体积大小
    new webpack.IgnorePlugin(/.\/lib/, /element-ui/),
    // copy custom static assets
    new CopyWebpackPlugin({
      patterns: [{ from: "static", to: "./static/json" }],
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    // 压缩图片
    new ImageMinimizerPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
    }),
  ],
});
