# 源码目录结构

```js
├── benchmarks                  性能、基准测试
├── dist                        构建打包的输出目录
├── examples                    案例目录
├── flow                        flow 语法的类型声明
├── packages                    一些额外的包
│   ├── vue-server-renderer     负责服务端渲染的包
│   ├── vue-template-compiler   配合 vue-loader 使用的的
│   ├── weex-template-compiler  weex 相关的
│   └── weex-vue-framework
├── scripts                     所有的配置文件的存放位置，比如 rollup 的配置文件
├── src                         vue 源码目录
│   ├── compiler                编译器
│   ├── core                    运行时的核心包
│   │   ├── components          全局组件，比如 keep-alive
│   │   ├── config.js           一些默认配置项
│   │   ├── global-api          全局 API，比如熟悉的：Vue.use()、Vue.component() 等
│   │   ├── instance            Vue 实例相关的，比如 Vue 构造函数就在这个目录下
│   │   ├── observer            响应式原理
│   │   ├── util                工具方法
│   │   └── vdom                虚拟 DOM 相关，比如熟悉的 patch 算法就在这儿
│   ├── platforms               平台相关的编译器代码
│   │   ├── web
│   │   └── weex
│   ├── server                  服务端渲染相关
├── test                        测试目录
├── types                       TS 类型声明
```

关于怎么生成 tree

```js
// 在命令行中输入
// 按当前目录中的文件夹生成树
tree > tree.txt;
// 按当前目录中的全部文件生成树
tree / f > tree.txt;
// 就会在目录下生成tree.txt文件
```

# 准备

## 本地调试

### 在 package.json scripts dev 添加 --sourcemap

```js
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev",
```

### 找到打包入口 及 出口 文件

- 一是通过 rollup 配置文件找

```js
// 由以下可以看出
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev"
// 执行 yarn dev 时 是通过rollup 即 scripts/config.js 目录文件下 环境变量TARGET = "web-full-dev" 的配置
```

- 二是直接在 new Vue() 前打断点，往下走就可以找到

### 在 examples 文件下创建测试文件夹 test

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../../dist/vue.js"></script>
  </head>
  <body>
    <div id="app">
      <span>{{ msg }}</span>
    </div>

    <script>
      const vm = new Vue({
        el: "#app",
        data: {
          msg: "msg",
        },
      });
    </script>
  </body>
</html>
```

### Then start debugging

- 启动 vue：yarn dev 主要是用于热更新
- 用 live-serve 打开 test.html

# vue 初始化过程 （new Vue(options)）都做了什么

- 处理组件配置项

  - 初始化根组件时进行了选项合并操作，将全局配置合并到根组件的局部配置上

  - 初始化每个子组件时做了一些性能优化，将组件配置对象上的一些深层次属性放到 vm.$options 选项中，以提高代码的执行效率

* 初始化组件实例的关系属性，比如 $parent、$children、$root、$refs 等

* 处理自定义事件

* 调用 beforeCreate 钩子函数

* 初始化组件的 inject 配置项，得到 ret[key] = val 形式的配置对象，然后对该配置对象进行响应式处理，并代理每个 key 到 vm 实例上

* 数据响应式，处理 props、methods、data、computed、watch 等选项

* 解析组件配置项上的 provide 对象，将其挂载到 vm.\_provided 属性上

* 调用 created 钩子函数

* 如果发现配置项上有 el 选项，则自动调用 $mount 方法，也就是说有了 el 选项，就不需要再手动调用 $mount 方法，反之，没提供 el 选项则必须调用 $mount

* 接下来则进入挂载阶段
