# 前言

本篇幅用于练习用 webpack4 搭建 vue 开发环境，主要从以下几点入手

1. webpack 的安装
2. 跟着[官网文档](https://v4.webpack.docschina.org/loaders/)搭建一个 webpack 管理的项目，了解几个重要概念：入口、输出、loader、plugin
3. 安装 vue、vue-router、vuex、element-ui 等
4. 着手性能优化，提升打包构建速度，减小输体积等
5. 本文收录在[GitHub](https://github.com/earWind/llin2x/tree/main/Webpack/vueDemo#readme)有什么问题欢迎 Issues

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

# 管理资源（配置 loader）

## style-loader css-loader

```js
// 安装
yarn add style-loader css-loader -dev
// 在 webpack.config.js 文件中添加
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

## vue-loader

```js
// 安装vue
yarn add vue
yarn add vue-loader css-loader vue-template-compiler --dev
// 在 webpack.config.js 文件中添加
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
}
```

## babel-loader

```js
// 安装
yarn add babel-loader @babel/core @babel/preset-env --dev
// 在 webpack.config.js 文件中添加
module: {
  rules: [
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
// 安装
yarn add vue-router
// 新建router/index文件
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
// 相关配置可以参考
// https://github.com/PanJiaChen/vue-element-admin/tree/master/src/router
```

## vuex

```js
// 安装
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
// 安装
yarn add element-ui
// 在main.js中添加
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
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
// 在webpack.config.js 中引入
devtool: "inline-source-map",
```

## 使用 webpack-dev-server

> 热更新 实时重新加载

```js
// 安装
yarn add webpack-dev-server --dev
// 在 webpack.config.js 中引入
devServer: {
   contentBase: './dist',
},
// 在 package.json 中添加
"scripts": {
   "start": "webpack server --open"
},
```

# 配置热模块替换

```js
// 在 webpack.config.js 中添加
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
// 将文件标记为 side-effect-free(无副作用)
// 在 package.json 中添加
{
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

# 代码分离

```js
// webpack.common.js 中添加
optimization: {
  //  插件可以将公共的依赖模块提取到已有的 entry chunk 中，或者提取到一个新生成的 chunk, 提取公共资源
  splitChunks: {
    chunks: "all";
  }
}
```

面试该怎么回答参考  
[当面试官问 Webpack 的时候他想知道什么](https://juejin.cn/post/6943468761575849992#heading-0)  
[「吐血整理」再来一打 Webpack 面试题](https://juejin.cn/post/6844904094281236487#heading-0)
