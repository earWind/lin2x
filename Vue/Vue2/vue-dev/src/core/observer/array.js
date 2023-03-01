/**
 * 定义 arrayMethods 对象，用于增强 Array.prototype
 * 当访问 arrayMethods 对象上的那七个方法时会被拦截，以实现数组响应式
 */

import { def } from "../util/index";

// 取得原生数组的原型
const arrayProto = Array.prototype;
// 创建一个新的数组对象，修改该对象上的数组的七个方法，防止污染原生数组方法
export const arrayMethods = Object.create(arrayProto);

// 操作数组的七个方法，这七个方法可以改变数组自身
const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];

/**
 * 这里重写了数组的这些方法，在保证不污染原生数组原型的情况下重写数组的这些方法，
 * 截获数组的成员发生的变化，执行原生数组操作的同时dep通知关联的所有观察者进行响应式处理
 */
methodsToPatch.forEach(function (method) {
  // 缓存原生方法，比如 push
  const original = arrayProto[method];
  // def 就是 Object.defineProperty，拦截 arrayMethods.method 的访问
  def(arrayMethods, method, function mutator(...args) {
    // 先执行原生方法，比如 push.apply(this, args)
    const result = original.apply(this, args);
    // __ob__ 指的就是 Observer
    const ob = this.__ob__;
    // 如果 method 是以下三个之一，说明是新插入了元素
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
    }
    // 对新插入的元素做响应式处理
    if (inserted) ob.observeArray(inserted);
    // dep通知所有注册的观察者进行响应式处理
    ob.dep.notify();
    return result;
  });
});
