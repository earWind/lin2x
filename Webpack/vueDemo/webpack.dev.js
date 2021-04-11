/**
 * 开发环境配置
 */

// 将common配置合并在一起
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const os = require("os");

// 识别某些类别的webpack错误，并清理，聚合和优先级，以提供更好的开发人员体验。
const friendlyErrorsPlugin = require("friendly-errors-webpack-plugin");

const config = {
  // 模式 指定生产环境
  mode: "development",
  // 为了更容易地追踪 error 和 warning在源代码中的原始位置
  devtool: "eval-cheap-module-source-map",
  output: {
    // 输出结果不携带路径信息
    pathinfo: false,
  },
  // 优化
  optimization: {
    // 确保在生成 entry chunk 时，尽量减少其体积以提高性能；为运行时代码创建了一个额外的 chunk，所以它的生成代价较低
    runtimeChunk: true,
  },
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
    // dev server在静默的状态中启动（主要是为了去掉多余的日志）
    quiet: true,
  },
  // 配置插件
  plugins: [
    // 热更新
    new webpack.HotModuleReplacementPlugin(),
    // 环境变量
    new webpack.DefinePlugin({
      name: "dev"
    }),
  ],
};

const devWebpackConfig = merge(common, config);

// 获取网络IP
const getNetworkIp = () => {
  let needHost = "";
  try {
    let network = os.networkInterfaces();
    for (let dev in network) {
      let iface = network[dev];
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i];
        if (
          alias.family === "IPv4" &&
          alias.address !== "127.0.0.1" &&
          !alias.internal
        ) {
          needHost = alias.address;
        }
      }
    }
  } catch (e) {
    needHost = "localhost";
  }
  return needHost;
};

module.exports = new Promise((resolve, reject) => {
  // 自动获取端口
  const portfinder = require("portfinder");
  // 添加桌面通知
  const notifier = require("node-notifier");
  const PORT = process.env.PORT && Number(process.env.PORT);
  portfinder.basePort = process.env.PORT || 9998;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;
      // Add friendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new friendlyErrorsPlugin({
          // 运行成功
          compilationSuccessInfo: {
            messages: [
              "App running at:",
              `local: http://localhost:${port}`,
              `network: http://${getNetworkIp()}:${port}`,
            ],
            // notes: ['some tips !']
          },
          // 运行错误
          onErrors: (severity, errors) => {
            if (severity !== "error") return;
            const error = errors[0];
            const filename = error.file && error.file.split("!").pop();
            notifier.notify({
              title: packageConfig.name,
              message: severity + ": " + error.name,
              subtitle: filename || "",
              icon: path.join(__dirname, "logo.png"),
            });
          },
          // 是否每次编译之间清除控制台
          clearConsole: true,
        })
      );
      resolve(devWebpackConfig);
    }
  });
});
