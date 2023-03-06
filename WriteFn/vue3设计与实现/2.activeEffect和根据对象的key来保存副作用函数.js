// 收集副作用函数 WeakMap 是以对象为key
let targetMap = new WeakMap();

let obj = {
  count: 0,
};

// 保存当前注册的副作用函数
let activeEffect;

// 注册副作用函数
function effect(fn) {
  activeEffect = fn;
  fn();
}

let proxyObj = new Proxy(obj, {
  get(target, key, receiver) {
    if (activeEffect) {
      /**
       * 有多个对象，一个对象可能有多个key，一个key可能有多个副作用函数
       */
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
      }

      let deps = depsMap.get(key);
      if (!deps) {
        deps = new Set();
        depsMap.set(key, deps);
      }
      deps.add(activeEffect);
    }

    let ret = Reflect.get(target, key, receiver);
    return ret;
  },
  set(target, key, value, receiver) {
    let ret = Reflect.set(target, key, value, receiver);
    let depsMap = targetMap.get(target);

    if (depsMap) {
      let effects = depsMap.get(key);
      if (effects) {
        effects.forEach((fn) => fn());
      }
    }

    return ret;
  },
});

function setText() {
  console.log("trigger count effect");
  document.getElementById("app").innerText = proxyObj.count;
}

effect(setText);

setTimeout(() => {
  proxyObj.count = 1;
  // proxyObj.text = "hello";
}, 3000);

/**
 * 思考
 * 1.effect是一个写死的方法
 * 2.改变proxyObj其他属性也会触发副作用函数（如：proxyObj.text = 'hello'）
 */
