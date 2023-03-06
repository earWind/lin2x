// 收集副作用函数
let effects = new Set();

let obj = {
  count: 0,
};

/**
 * target 代理对象
 * proxy 相当于一层拦截器
 */
let proxyObj = new Proxy(obj, {
  get(target, key, receiver) {
    effects.add(effect);
    console.log("get:", target, key);
    const ret = Reflect.get(target, key, receiver);
    // return 1;
    return ret;
  },
  set(target, key, value, receiver) {
    console.log("set:", target, key);
    const ret = Reflect.set(target, key, value, receiver);
    effects.forEach((fn) => fn());
    return ret;
  },
});

// 对obj操作不会触发set get
// obj.count++
// proxyObj.count++;

// 读取不会触发set get
// console.log(obj, proxyObj);

function effect() {
  console.log(proxyObj);
  document.getElementById("app").innerText = proxyObj.count;
}
effect();

setTimeout(() => {
  proxyObj.count = 1111;
}, 3000);
