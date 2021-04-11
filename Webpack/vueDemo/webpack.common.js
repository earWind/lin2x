const path = require("path");
const webpack = require("webpack");
// 自定义的plugin
const ConsoleLogOnBuildWebpackPlugin = require("./plugins/ConsoleLogOnBuildWebpackPlugin");
// 是否是生产环境
const isProduction = process.env.NODE_ENV === "production";
/**
 * 1.自动在内存中根据指定页面生成一个内存页面
 * 2.自动把打包好的bundel.js追加到页面中
 */
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 清除dist文件
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// vue
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  // 入口 指示 webpack 应该使用哪个模块，来作为构建其内部 依赖图(dependency graph) 的开始
  // 进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。
  entry: {
    app: "./src/main.js",
  },
  // 输出 告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。
  output: {
    // 输出文件的文件名
    // [name] 据入口起点定义的名称(entry的key)，动态生成
    // [hash] 将根据资源内容创建出唯一 hash
    filename: "[name].[hash].js",
    // 输出路径 __dirname 目录的绝对路径
    path: path.resolve(__dirname, "dist"),
    // 外部访问静态资源文件的路径
    publicPath: "/",
    // 每次构建前清理 /dist 文件夹
    clean: true,
  },
  // 优化
  optimization: {
    // 模块标识符 确保 hash 都应该保持一致
    moduleIds: "deterministic",
    // 代码分离（将公共的依赖模块提取到已有的 entry chunk 中，或者提取到一个新生成的 chunk），防止重复
    splitChunks: {
      chunks: "all",
    },
  },
  // 缓存生成的 webpack 模块和 chunk，来改善构建速度
  cache: true,
  // 模块解析 告诉 webpack 如何寻找模块对应的文件
  resolve: {
    // 别名
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": path.resolve(__dirname, "./src"),
    },
    // 方便我们引入依赖或者文件的时候可以省略后缀
    extensions: ["*", ".js", ".json", ".vue"],
  },
  // 模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块
  module: {
    // webpack 只能理解 JavaScript 和 JSON 文件
    // loader 可以将文件从不同的语言解析为 webpack能处理的语言
    rules: [
      {
        // 识别出哪些文件会被转换
        test: /\.css$/,
        // 定义出在进行转换时，应该使用哪个 loader
        // use 数组中loader执行顺序：从上到下依次执行
        use: [
          "vue-style-loader",
          "css-loader",
          "postcss-loader"
        ],
      },
      {
        test: /\.less$/,
        use: [
          "vue-style-loader",
          "css-loader",
          "postcss-loader", 
          "less-loader"
        ],
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
      {
        test: /\.js$/,
        exclude: (file) => /node_modules/.test(file) && !/\.vue\.js/.test(file),
        // 仅将 loader 应用在实际需要将其转换的模块
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|jpg|svg|jpeg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // 低于这个limit就直接转成base64插入到style里，不然以name的方式命名存放
              // 这里的单位时bit
              // 优点：减小请求次数(减轻服务器压力)
              // 缺点：图片体积会更大(下载速度慢)
              limit: 6 * 1024,
              name: "static/images/[hash:8].[name].[ext]",
            },
          },
        ],
      },
      {
        // 字体图标啥的，跟图片分处理方式一样
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "static/font/[hash:8].[name].[ext]",
            },
          },
        ],
      },
      // webpack5新增-内置的用于替换url-loader file-loader
      // {
      //   test: /\.(png|svg|jpg|jpeg|gif)$/i,
      //   type: 'asset/resource',
      // },
      // {
      //   test: /\.(woff|woff2|eot|ttf|otf)$/i,
      //   type: 'asset/resource',
      // },
    ],
  },
  // 插件 插件目的在于解决 loader 无法实现的其他事：打包优化，资源管理，注入环境变量。
  plugins: [
    new HtmlWebpackPlugin({
      // 生成html文件的标题
      title: "管理输出",
      // 就是html文件的文件名，默认是index.html
      template: "index.html",
      // cript标签位于html文件的 head/body
      inject: true,
    }),
    // 清除dist文件
    // new CleanWebpackPlugin(), // webpack5用不着了 配置output.clean就行
    // vue loader
    new VueLoaderPlugin(),
    // 提取公共代码
    // new webpack.optimize.SplitChunksPlugin(), // 直接配置在optimization里就行
    // 自定义plugin
    new ConsoleLogOnBuildWebpackPlugin(),
    // 定义全局变量
    new webpack.ProvidePlugin({
      Vue: ["vue", "default"],
    }),
  ],
};
