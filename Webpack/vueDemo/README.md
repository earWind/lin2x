# 本篇幅用于练习用 webpack4 搭建 vue 开发环境

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

* 将文件标记为 side-effect-free(无副作用) 
```js
// package.json
{
  "name": "your-project",
  "sideEffects": false
}
```

* 压缩输出结果 
通过 import 和 export 语法，我们已经找出需要删除的“未引用代码(dead code)”，然而，不仅仅是要找出，还要在 bundle 中删除它们。

# 配置生产环境..