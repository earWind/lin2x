/**
 * 思考
 * 1.什么是响应式数据
 * 2.什么是副作用函数
 */

// 收集副作用函数
let effects = new Set();

let obj = {
  count: 0,
};

// 响应式数据 -- 当数据改变会自动触发使用改变量的方法
let proxyObj = new Proxy(obj, {
  get(target, key, receiver) {
    effects.add(effect);
    const ret = Reflect.get(target, key, receiver);
    return ret;
  },
  set(target, key, value, receiver) {
    const ret = Reflect.set(target, key, value, receiver);
    effects.forEach((fn) => fn());
    return ret;
  },
});

// 副作用函数 -- 如果一个函数的运行，可能会影响到其他函数或变量，那么这种影响就是一种副作用
function effect() {
  console.log("trigger count effect");
  document.getElementById("app").innerText = proxyObj.count;
}
effect();

setTimeout(() => {
  proxyObj.count = 1;
  // proxyObj.text = 1;
}, 3000);
