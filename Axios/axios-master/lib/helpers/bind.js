'use strict';
/**
 * 手写实现bind 很多手写方法难道是为了兼容低版本浏览器？
 *
 * @param {*} fn 方法
 * @param {*} thisArg 实例对象
 * @return {*} 返回一个新方法
 */
function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
}

module.exports = bind;
