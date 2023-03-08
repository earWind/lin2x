
<!-- 
问题

虚拟dom是什么? 原理? 优缺点?
vue 和 react 在虚拟dom的diff上，做了哪些改进使得速度很快?
vue 和 react 里的key的作用是什么? 为什么不能用Index？用了会怎样? 如果不加key会怎样?
vue 双向绑定的原理是什么?
vue 的keep-alive的作用是什么？怎么实现的？如何刷新的?
vue 是怎么解析template的? template会变成什么?
如何解析指令? 模板变量? html标签
用过vue 的render吗? render和template有什么关系
 -->

# vue

## vue-router hash和history的区别

一. hash模式

1. hash 就是指 url 后面的 # 号以及后面的字符。
2. 由于 `hash` 值变化不会导致浏览器向服务器发出请求，而且 hash 改变会触发 `hashchange` 事件；虽然hash路径出现在URL中，但是不会出现在HTTP请求中，对后端完全没有影响，因此改变hash值不会重新加载页面。

二. history模式

1. 利用H5的 history 中新增的两个API `pushState` 和 `replaceState` 允许开发者直接更改前端路由，即更新浏览器 URL 地址而不重新发起请求；和一个事件 `onpopstate` 监听URL变化。
2. history模式存在问题：当URL改变是非以上两个API执行的就会导致浏览器向服务端发起请求，就需要服务端适配URL规则，否则会报错。
