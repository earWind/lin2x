# vue3-源码

## 源码导读

故事还得从$\color{#4285f4}{package.json}$讲起

1. 调试脚本：`"dev": "node scripts/dev.js"`

  ```js
  // 因为dev命令没有传参  target默认vue
  const target = args._[0] || 'vue'

  build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)], // 入口文件 ../packages/vue/src/index.ts
    sourcemap: true, // 源码调试
  })
  ```

2. Vue.createApp 是在 `packages\runtime-dom\src\index.ts` 里申明的

  在 `packages/vue/src/index.ts` 里 `export * from '@vue/runtime-dom'`

3. 测试demo

  在`packages\vue\examples`下
