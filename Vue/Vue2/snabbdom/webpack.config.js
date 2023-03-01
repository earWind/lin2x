const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: "bundel.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "管理输出",
      template: "index.html",
      inject: true,
    }),
  ],
};
