# 前言

本篇幅用于练习用 webpack4 搭建 vue 开发环境，主要从以下几点入手

1. webpack 的安装
2. 跟着[官网文档](https://v4.webpack.docschina.org/loaders/)搭建一个 webpack 管理的项目，了解几个重要概念：入口、输出、loader、plugin
3. 安装 vue、vue-router、vuex、element-ui 等
4. 着手性能优化，提升打包构建速度，减小输体积等

# 安装/起步

## 安装 webpack

- yarn install -y
- yarn add webpack --dev
- yarn add webpack webpack-cli --dev

按照 webpack 官网示例 [起步](https://v4.webpack.docschina.org/guides/getting-started/)

# 管理资源（配置 loader）

- yarn add style-loader css-loader -dev
- 在 webpack.config.js 文件中添加

```js
 module: {
    // 配置 loader
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  }
```

- 然后在 index.js 中就可以引入 css 文件了

```js
import "./style.css";
```

# 管理输出

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
// 安装
yarn add html-webpack-plugin --dev

// 在webpack.config.js 中引入
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
    new HtmlWebpackPlugin({
        title: '管理输出'
    })
]
```

## 清理 /dist 文件夹 clean-webpack-plugin

```js
// 安装
yarn add clean-webpack-plugin --dev

// 在webpack.config.js 中引入
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

plugins: [
    new CleanWebpackPlugin(),
]
```

# 配置开发环境

## 使用 source map

> 当 webpack 打包源代码时，可能会很难追踪到 error(错误) 和 warning(警告) 在源代码中的原始位置。

```js
devtool: "inline-source-map",
```

## 使用 webpack-dev-server

> 热更新 实时重新加载

```js
// 安装
yarn add webpack-dev-server --dev
// 在webpack.config.js 中引入
devServer: {
   contentBase: './dist',
},
// 在package.json中添加
"scripts": {
   "start": "webpack server --open"
},
```

# 配置热模块替换

- 在 webpack.config.js 中

```js
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

- 将文件标记为 side-effect-free(无副作用)

```js
// package.json
{
  "name": "your-project",
  "sideEffects": false
}
```

- 压缩输出结果
  通过 import 和 export 语法，我们已经找出需要删除的“未引用代码(dead code)”，然而，不仅仅是要找出，还要在 bundle 中删除它们。

# 配置生产环境

## 安装 merge

```js
yarn add webpack-merge --dev
```

## 为每个环境编写彼此独立的 webpack 配置

```js
webpack.common.js;
webpack.dev.js;
webpack.prod.js;

// 在.dev 和 .prod文件中引入
const { merge } = require("webpack-merge");
module.exports = merge(common, {
  mode: "development",
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

# 代码分离

## webpack.common.js 中添加

```js
optimization: {
  //  插件可以将公共的依赖模块提取到已有的 entry chunk 中，或者提取到一个新生成的 chunk, 提取公共资源
  splitChunks: {
    chunks: "all";
  }
}
```

# 配置 vue

## webpack 配置

```js
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
  ];
}
```

## 安装 vue 依赖

```js
// vue运行时的库
yarn add vue
// 构建所需依赖
yarn add vue-loader css-loader vue-template-compiler --dev
```

## 安装 babel-loader

```js
yarn add babel-loader @babel/core @babel/preset-env --dev
```

在根目录下创建 .babelrc 文件

```js
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

## 安装 vue-router

```js
// 安装依赖
yarn add vue-router
// 新建router/index文件
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
// 相关配置可以参考
// https://github.com/PanJiaChen/vue-element-admin/tree/master/src/router
```

## 安装 vuex

```js
// 安装依赖
yarn add vuex
// 新建store/index文件
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
// 相关配置可以参考
// https://github.com/PanJiaChen/vue-element-admin/tree/master/src/store
```
