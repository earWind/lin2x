/**
 * 思考
 * 1.当调用 proxyObj.count = proxyObj.count++ 时，会陷入 track -> trigger -> track -> ...的死循环
 */

// 收集副作用函数 WeakMap 是以对象为key，可以避免内存泄漏
let targetMap = new WeakMap();

// 保存当前注册的副作用函数
let activeEffect;
// 嵌套effect栈 - 确保栈的执行顺序始终是从栈底位置执行
let effectStack = [];

// 注册副作用函数
function effect(fn) {
  // console.log(fn); // 打印副作用函数注册顺序
  const effectFn = () => {
    // 触发副作用函数前清空对该副作用函数的收集
    cleanup(effectFn);
    activeEffect = effectFn;

    // 将当前副作用函数压入栈内
    effectStack.push(effectFn);
    // 执行副作用函数后又会从新收集副作用函数
    fn();
    // 删除栈的最后一个
    effectStack.pop();
    // 取栈的最后一个
    activeEffect = effectStack.at(-1);
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
      newEffects.forEach((fn) => {
        // 避免陷入 track -> trigger -> track 的死循环
        if (fn !== activeEffect) fn();
      });
    }
  }
}

let obj = {
  count: 0,
  show: false,
  text: "this is obj",
};

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

effect(function effect1() {
  console.log("执行 effect1");

  // 会无限循环
  proxyObj.count = proxyObj.count++;
});
