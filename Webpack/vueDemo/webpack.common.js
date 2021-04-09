const path = require("path");
// 是否是生产环境
const isProduction = process.env.NODE_ENV === "production";
/**
 * 1.自动在内存中根据指定页面生成一个内存页面
 * 2.自动把打包好的bundel.js追加到页面中
 */
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 清除dist文件
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// vue
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  // 入口文件(需要打包的文件)
  entry: {
    app: "./src/main.js",
  },
  // 输出打包后的文件(管理输出)
  output: {
    // 输出文件的文件名
    // [name] 据入口起点定义的名称(entry的key)，动态生成
    // [hash] 将根据资源内容创建出唯一 hash
    filename: "[name].[hash].js",
    // 输出路径
    path: path.resolve(__dirname, "dist"),
    // 外部访问静态资源文件的路径
    // publicPath: "./",
  },
  // 优化(最佳化)
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
    // 配置 loader 将其他语言编译成js能够识别的
    rules: [
      {
        test: /\.css$/,
        use: [
          "vue-style-loader",
          { loader: "css-loader", options: { sourceMap: true } },
          { loader: "postcss-loader", options: { sourceMap: true } },
        ],
      },
      {
        test: /\.less$/,
        use: [
          "vue-style-loader",
          { loader: "css-loader", options: { sourceMap: true } },
          { loader: "postcss-loader", options: { sourceMap: true } },
          { loader: "less-loader", options: { sourceMap: true } },
        ],
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              loaders: {
                css: [
                  // isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                  "vue-style-loader",
                  {
                    loader: "css-loader",
                    options: { sourceMap: !isProduction },
                  },
                  {
                    loader: "postcss-loader",
                    options: { sourceMap: !isProduction },
                  },
                ],
                postcss: [
                  "vue-style-loader",
                  {
                    loader: "css-loader",
                    options: { sourceMap: !isProduction },
                  },
                  {
                    loader: "postcss-loader",
                    options: { sourceMap: !isProduction },
                  },
                ],
                less: [
                  "vue-style-loader",
                  {
                    loader: "css-loader",
                    options: { sourceMap: !isProduction },
                  },
                  {
                    loader: "postcss-loader",
                    options: { sourceMap: !isProduction },
                  },
                  {
                    loader: "less-loader",
                    options: { sourceMap: !isProduction },
                  },
                ],
              },
              cssSourceMap: !isProduction,
              // If you have problems debugging vue-files in devtools,
              // set this to false - it *may* help
              // https://vue-loader.vuejs.org/en/options.html#cachebusting
              cacheBusting: true,
              transformToRequire: {
                video: ["src", "poster"],
                source: "src",
                img: "src",
                image: "xlink:href",
              },
            },
          },
        ],
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
    // vue loader
    new VueLoaderPlugin(),
  ],
};
