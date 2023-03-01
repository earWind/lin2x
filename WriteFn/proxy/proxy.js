let obj = {
  count: 0,
};

/**
 * target 代理对象
 * proxy 相当于一层拦截器
 */
let proxyObj = new Proxy(obj, {
  get(target, key, ret) {
    console.log("get:", target, key);
    // return 1;
    return Reflect.get(target, key, ret);
  },
  set(target, key, ret) {
    console.log("set:", target, key);
    return Reflect.set(target, key, ret);
  },
});

// 对obj操作不会触发set get
// obj.count++

proxyObj.count++;

// 读取不会触发set get
console.log(obj, proxyObj);
