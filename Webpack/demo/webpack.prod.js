/**
 * 生产环境配置
 */

// 将common配置合并在一起
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  // 指定开发环境
  mode: "production",
  // 为了更容易地追踪 error 和 warning在源代码中的原始位置
  devtool: "nosources-source-map",
});
