'use strict';
/**
 * 拦截器
*/

var utils = require('./../utils');
function InterceptorManager() {
  // 用于存储 拦截操作，使用数组来存储是为了解决异步调用（和promise实现相似）
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 * 向堆栈中添加一个新的拦截器
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  // 在请求或响应被 then 或 catch 处理前拦截它们
  this.handlers.push({
    fulfilled: fulfilled, // then之前 做点什么
    rejected: rejected, // catch之前 做点什么
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 * 从堆栈中移除拦截器
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 * 遍历所有注册的拦截器
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 * 这种方法对于跳过任何
 * 拦截器可能已经成为' null '调用' eject '
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;
