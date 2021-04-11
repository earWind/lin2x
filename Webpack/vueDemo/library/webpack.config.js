const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "webpack-numbers.js",
    // 配置项暴露从入口导出的内容
    library: {
      name: "webpackNumbers",
      type: "umd",
    },
  },
  // webpack 中的 externals 配置提供了不从 bundle 中引用依赖的方式。解决的是，所创建的 bundle 依赖于那些存在于用户环境(consumer environment)中的依赖。
  // 将不怎么需要更新的第三方库脱离webpack打包，不被打入bundle中，从而减少打包时间，但又不影响运用第三方库的方式，例如import方式等
  externals: {
    // 外部化 lodash 
    lodash: {
      commonjs: "lodash",
      commonjs2: "lodash",
      amd: "lodash",
      root: "_",
    },
  },
};
