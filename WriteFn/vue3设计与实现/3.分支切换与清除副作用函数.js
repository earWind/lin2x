/**
 * 思考
 * 1.将存储副作用函数的方法封装
 * 2.如果存在判断条件是需要判断是否需要收集当前副作用函数：
 *   document.getElementById("app").innerText = proxyObj.show ? proxyObj.count : '';
 */

let obj = {
  count: 0,
  show: false,
  text: "this is obj",
};

// 收集副作用函数 WeakMap 是以对象为key，可以避免内存泄漏
let targetMap = new WeakMap();

// 保存当前注册的副作用函数
let activeEffect;

// 注册副作用函数
function effect(fn) {
  const effectFn = () => {
    // 触发副作用函数前清空对该副作用函数的收集
    cleanup(effectFn);
    activeEffect = effectFn;

    // 执行副作用函数后又会从新收集副作用函数
    fn();
  };
  effectFn.deps = [];
  effectFn();
}

// 从所有收集了该副作用函数的deps中清除该副作用函数
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    let deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

// 收集副作用函数
function track(target, key) {
  if (activeEffect) {
    /**
     * 有多个对象，一个对象可能有多个key，一个key可能有多个副作用函数
     * WeakMap来存对象，Map存key，Set存副作用函数
     * obj -> key1 -> effect1
     *     -> key2 -> effect2
     *             -> effect3
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

    console.log(`track effect by ${key}`);

    deps.add(activeEffect);
    // 副作用函数上存有哪些deps收集了当前副作用函数，以便后面可以从这些deps中清除该副作用函数
    activeEffect.deps.push(deps);
  }
}

// 触发副作用函数
function trigger(target, key) {
  let depsMap = targetMap.get(target);
  if (depsMap) {
    let effects = depsMap.get(key);
    if (effects) {
      console.log(`trigger effect by ${key}`);

      // 避免cleanup时出现 删除副作用 -> 触发收集副作用 -> 删除副作用 -> ... 的死循环
      const newEffects = new Set(effects);
      newEffects.forEach((fn) => fn());
    }
  }
}

let proxyObj = new Proxy(obj, {
  get(target, key, receiver) {
    track(target, key);
    let ret = Reflect.get(target, key, receiver);
    return ret;
  },
  set(target, key, value, receiver) {
    let ret = Reflect.set(target, key, value, receiver);
    trigger(target, key);
    return ret;
  },
});

function setText() {
  console.log("trigger setText effectFn");

  /**
   * 类似三元或者if...else... 就叫做分支切换
   * 当show为false时，修改text的值是不应该触发副作用函数（可是现在触发了），怎么做呢?
   *    => 执行副作用函数前从所有收集了该副作用函数的 deps 里清除此副作用函数，并且从新收集此副作用函数
   */
  document.getElementById("app").innerText = proxyObj.show ? proxyObj.text : "";
}

effect(setText);
