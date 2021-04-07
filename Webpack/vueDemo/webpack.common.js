const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
/**
 * 1.自动在内存中根据指定页面生成一个内存页面
 * 2.自动把打包好的bundel.js追加到页面中
 */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  // 入口文件(需要打包的文件)
  entry: {
    app: "./src/main.js",
  },
  // 输出打包后的文件(管理输出)
  // [name] 据入口起点定义的名称，动态地产生 bundle 名称
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  // 最佳化
  optimization: {
    // 代码分离（将公共的依赖模块提取到已有的 entry chunk 中，或者提取到一个新生成的 chunk），防止重复
    splitChunks: {
      chunks: "all",
    },
  },
  // 配置webpack如何寻找模块对应的文件
  resolve: {
    // 别名
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": path.resolve(__dirname, "../src"),
    },
    // 方便我们引入依赖或者文件的时候可以省略后缀
    extensions: ["*", ".js", ".json", ".vue"],
  },
  // 模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块
  module: {
    // 配置 loader
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "vue-style-loader"],
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
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
      // cript标签位于html文件的 head/body
      inject: "body",
    }),
    // 清除dist文件
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
  ],
};
