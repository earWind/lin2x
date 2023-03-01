# 前言

用 webpack 搭建 vue 开发环境，主要从以下几点入手

1. webpack 的安装
2. 跟着[官网文档](https://webpack.docschina.org/)搭建一个 webpack 管理的项目，了解几个重要概念：

- 入口(entry)
- 输出(output)
- loader
- 插件(plugin)
- 模式(mode)
- 浏览器兼容性(browser compatibility) , webpack 的 import() 和 require.ensure() 需要 Promise。如果你想要支持旧版本浏览器，在使用这些表达式之前，还需要 提前加载 polyfill。
- 环境(environment)

3. 安装 vue、vue-router、vuex、element-ui 。。
4. 着手性能优化，提升打包构建速度，减小输出体积 。。
5. 本文收录在[GitHub](https://github.com/earWind/llin2x/tree/main/Webpack/vueDemo#readme)上，有什么问题欢迎 Issues！！！

# 概念

本质上，webpack 是一个用于现代 JavaScript 应用程序的 静态模块打包工具。当 webpack 处理应用程序时，它会在内部构建一个 依赖图(dependency graph)，此依赖图对应映射到项目所需的每个模块，并生成一个或多个 bundle。

# 安装/起步

## 安装 webpack

```js
// 初始化 yarn
yarn init -y
// 本地安装 webpack
yarn add webpack --dev
// 安装webpack脚手架
yarn add webpack webpack-cli --dev
```

## 创建配置文件

- 目录

```js
webpack-demo
  |- /src
    |- main.js
    |- App.vue
  |- package.json
+ |- webpack.config.js
  |- index.html
```

- webpack.config.js

```js
const path = require("path");
module.exports = {
  entry: {
    app: "./src/main.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

- index.html

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

- main.js

```js
import Vue from "vue";
import App from "./App";

const vm = new Vue({
  el: "#app",
  render: (h) => h(App),
});
```

- App.vue

```js
<template>
  <div id="app">
    <router-view> </router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
```

# 管理资源 / loader

## style-loader css-loader

```js
// yarn
yarn add style-loader css-loader -dev
// webpack.config.js
module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
}
// 然后在 main.js 中就可以引入 css 文件了
import "./style.css";
```

## less-loader
```js
// yarn
yarn add less less-loader --dev
// webpack.config.js
rules: [
  {
    test: /\.less$/,
    use: [
      "css-loader",
      "less-loader",
    ],
  }
]
```
## url-loader file-loader

## postcss-loader 
> 用 JavaScript 代码来处理 CSS。它负责把 CSS 代码解析成抽象语法树结构（Abstract Syntax Tree，AST），再交由插件来进行处理。
```js
// yarn
yarn ostcss-loader postcss autoprefixer

// webpack.common.js
rules: [
  {
    test: /\.css$/i,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: { importLoaders: 1 },
      },
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            plugins: [
              [
                // 添加浏览器前缀
                "autoprefixer",
              ],
            ],
          },
        },
      },
    ]
  }
]
```

## vue-loader

[Vue Loader 官网](https://vue-loader.vuejs.org/zh/)
> 如果你在开发一个库或多项目仓库 (monorepo)，请注意导入 CSS 是具有副作用的。请确保在 package.json 中移除 "sideEffects": false，否则 CSS 代码块会在生产环境构建时被 webpack 丢掉。
```js
// yarn
yarn add vue-loader vue-template-compiler --dev
// webpack.config.js
const { VueLoaderPlugin } = require('vue-loader')
module: {
  rules: [
    {
      test: /\.vue$/,
      use: ["vue-loader"],
    },
    {
      test: /\.css$/,
      use: ["vue-style-loader", "css-loader"],
    },
  ];
},
plugins: [
  new VueLoaderPlugin()
]
```

## babel-loader

```js
// yarn
yarn add babel-loader @babel/core @babel/preset-env --dev
// webpack.config.js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    },
  ];
}
// 在根目录下创建 .babelrc 文件
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }]
  ]
}
```

## vue-router

```js
// yarn
yarn add vue vue-router
// 新建router/index文件
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
// 相关配置可以参考
// https://github.com/PanJiaChen/vue-element-admin/tree/master/src/router
```

## vuex

```js
// yarn
yarn add vuex
// 新建store/index文件
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
// 相关配置可以参考
// https://github.com/PanJiaChen/vue-element-admin/tree/master/src/store
```

## element-ui

```js
// yarn
yarn add element-ui
// main.js
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
```

# 管理输出 / plugin

## 配置输出

```js
// [name] 据入口起点定义的名称，动态地产生 bundle 名称
output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
}
```

## 添加 HtmlWebpackPlugin 生成一个内存 html 并把打包好的 js 文件路径追加到 html 页面中

```js
// yarn
yarn add html-webpack-plugin --dev

// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
  new HtmlWebpackPlugin({
      title: '管理输出'
  })
]
```

## 清理 /dist 文件夹 clean-webpack-plugin

```js
// yarn
yarn add clean-webpack-plugin --dev

// webpack.config.js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

plugins: [
  new CleanWebpackPlugin(),
]
```

## MiniCssExtractPlugin 分离样式文件，将CSS 提取为独立文件，支持按需加载

> 将css样式从js文件中提取出来最终合成一个css文件

```js
// webpack.prod.js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module: {
  rules: [
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, "css-loader"],
    },
  ],
},
plugins: [
  new MiniCssExtractPlugin({
    filename: "css/[name].css",
    chunkFilename: "css/[name].css"
  }),
],
```
## optimization.SplitChunks 代码分离

```js
// webpack.common.js
optimization: {
  // 插件可以将公共的依赖模块提取到已有的 entry chunk 中，或者提取到一个新生成的 chunk, 提取公共资源
  splitChunks: {
    chunks: "all";
  }
}
```
## DefinePlugin 注入全局变量，一般用在环境变量上

```js
new Webpack.DefinePlugin({
  "process.env": {
    NODE_ENV: "development",
    API_URL: "http://xxx/",
  },
})
```

## ProvidePlugin 定义全局变量

```js
new Webpack.ProvidePlugin({
  "Vue": ["vue", "default"] 
})
```

## IgnorePlugin 过滤打包文件，减少打包体积大小

```js
// webpack.prod.js
plugins: [
  new Webpack.IgnorePlugin(/.\/lib/, /element-ui/)
]
```

## uglifyjs-webpack-plugin 压缩js文件 
> 用于生产环境打包

```js
// yarn
yarn add uglifyjs-webpack-plugin --dev

// webpack.prod.js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
optimization: {
  minimizer: [
    new UglifyJsPlugin({
      test: /\.js(\?.*)?$/i,
      exclude: /node_modules/
    })
  ],
}
```

## copy-webpack-plugin 将文件拷贝到某个目录下

```js
// yarn
yarn add copy-webpack-plugin --dev

// webpack.prod.js
const CopyWebpackPlugin=require('copy-webpack-plugin');
plugins: [
  new CopyWebpackPlugin({
    patterns: [{ from: "static", to: "./static/json" }],
  })
]

// form to 都是从根节点开始
```

## optimize-css-assets-webpack-plugin 压缩css样式
```js
// yarn
yarn add optimize-css-assets-webpack-plugin --dev

// webpack.prod.js
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin")
plugins: [
  new OptimizeCssAssetsWebpackPlugin(),
]
```

## image-minimizer-webpack-plugin 优化图像
```js
// yarn 
yarn add image-minimizer-webpack-plugin --dev

// webpack.prod.js
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
plugins: [
  new ImageMinimizerPlugin({
    test: /\.(jpe?g|png|gif|svg)$/i,
  }),
]
```

## friendly-errors-webpack-plugin 友好错误提示

```js
// yarn
yarn add friendly-errors-webpack-plugin --dev

// webpack.dev.js
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
plugins: [
	new FriendlyErrorsWebpackPlugin({
		compilationSuccessInfo: {
      messages: [
        "App running at:",
        "local: http://localhost:8080",
        "network: http://192.168.101.7:9998",
      ],
    },
  })
],
```

# 配置开发环境

## 使用 source map

> 当 webpack 打包源代码时，可能会很难追踪到 error(错误) 和 warning(警告) 在源代码中的原始位置。

```js
// webpack.dev.js
devtool: "inline-source-map",
```

## 使用 webpack-dev-server

> 热更新 实时重新加载

```js
// yarn
yarn add webpack-dev-server --dev
// webpack.dev.js
devServer: {
   contentBase: './dist',
},
// package.json
"scripts": {
   "start": "webpack server --open"
},
```

# 配置热模块替换

```js
// webpack.config.js
const webpack = require('webpack');

devServer: {
    contentBase: './dist',
    hot: true
},
plugins: [
    new webpack.HotModuleReplacementPlugin()
],
```

# tree shaking

> 移除 JavaScript 上下文中的未引用代码(dead-code)  

```js
// webpack.dev.js
// 在development环境打包 可以输出没有压缩过的代码；production环境打包会压缩代码
optimization: {
  // 告知 webpack 去决定每个模块使用的导出内容
  usedExports: true
}

// package.json
{
  "name": "your-project",
  /**
   * 将文件标记为 side-effect-free(无副作用)
   * sideEffects值为false 表明所有文件都没有副作用 可以尽情的把没用到的代码删除
   * sideEffects值也可以是数组，["*.css"] - 如果在项目中使用类似 css-loader 并 import 一个 CSS 文件，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除 
  */
  "sideEffects": false
}
```

虽然很有用的感觉，但是  [你的Tree-Shaking并没什么卵用](https://zhuanlan.zhihu.com/p/32831172)

# 配置生产环境

## 安装 merge

```js
// yarn
yarn add webpack-merge --dev
```

## 为每个环境编写彼此独立的 webpack 配置

```js
// 调整webpack配置文件
- webpack.config.js
+ webpack.common.js;
+ webpack.dev.js;
+ webpack.prod.js;

// 在 .dev 和 .prod 文件中引入
const { merge } = require("webpack-merge");
module.exports = merge(common, {
  mode: "development/production",
  ...配置信息
}
```

## 更改 package.json

```js
"scripts": {
  "start": "webpack server --open --config webpack.dev.js",
  "build": "webpack --config webpack.prod.js"
},
```
# 构建性能
[传送门](https://webpack.docschina.org/guides/build-performance/)
## 通用环境

### 更新到最新版本
使用最新的 webpack、node、npm/yarn 版本
### loader 
将 loader 应用于最少数量的必要模块,通过使用 include 字段，仅将 loader 应用在实际需要将其转换的模块
### 小即是快(smaller = faster)
> 减少编译结果的整体大小，以提高构建性能。尽量保持 chunk 体积小。

* 使用数量更少/体积更小的 library
* 在多页面应用程序中使用 SplitChunksPlugin
* 移除未引用代码

### cache
缓存生成的 webpack 模块和 chunk，来改善构建速度。

## 开发环境
### Devtool
在大多数情况下，最佳选择是 eval-cheap-module-source-map
### 最小化 entry chunk
```js
optimization: {
  runtimeChunk: true,
}
```
### 输出结果不携带路径信息
```js
output: {
  pathinfo: false,
}
```
## 生产环境
### Source Maps 是否有必要
# 总结

一开始学习webpack的时候感觉好干燥，官网那么多东西都不晓得从哪里开始看。不过现在呢我有了个不错的思路：
* 先跟着指南里的介绍从上往下配置一个简单的webpack，这时候你已经对配置有了大概的了解
* 然后呢再看概念，起到承上启下的作用，里面有对参数深入的解释
* 再然后就是配置结合loader和plugin一起学习
* 最后如果你打算更深层次的学习请看API

光会用还不够，你还得学会怎么把学到的东西表达出来：

* [当面试官问 Webpack 的时候他想知道什么](https://juejin.cn/post/6943468761575849992#heading-0)  
* [「吐血整理」再来一打 Webpack 面试题](https://juejin.cn/post/6844904094281236487#heading-0)  
* [看完webpack官方文档你还是一窍不通，那你就是傻逼](https://webpack.docschina.org/concepts/entry-points/)
* [[万字总结] 一文吃透 Webpack 核心原理](https://juejin.cn/post/6949040393165996040#heading-24)  
* [Webpack HMR 原理解析](https://zhuanlan.zhihu.com/p/30669007)

词汇：
* chunks 模块 在webpack里什么都可以看做是一个模块
