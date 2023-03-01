'use strict';
/**
 * 入口文件
 */
// 公共方法
var utils = require('./utils');
// 手写bind 返回一个方法
var bind = require('./helpers/bind');
// Axios 类
var Axios = require('./core/Axios');
// 合并对象
var mergeConfig = require('./core/mergeConfig');
// 默认配置
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 * 创建一个基于Axios实例创建的实例方法，
 * 用作方法时就是直接调用的request方法，用作实例对象时可以有Axios的所有属性方法
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  // 创建一个实例对象
  var context = new Axios(defaultConfig);
  // 实例方法 将 Axios.prototype.request 的 this 指向 context，
  // instance 当做方法使用就是调用的 Axios.prototype.request 方法
  var instance = bind(Axios.prototype.request, context);

  // instance 是方法，但也是对象，以下将 Axios.prototype 和 context 的属性都 copy 到 instance 上

  // Copy axios.prototype to instance
  // 将 Axios.prototype 的属性 copy 到 instance 上 如果属性是方法 则调用 bind 方法将方法的 this 指向 context
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  // 将 context 的属性 copy 到instance上
  utils.extend(instance, context);

  return instance;
}
// Create the default instance to be exported
// 基于默认配置创建的axios实例
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
// 挂载 Axios类，允许继承
axios.Axios = Axios;

// Factory for creating new instances
// 挂载一个工厂函数，用于创建新的axios实例 const instance = axios.create({...})
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
// 挂载取消请求的对象
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
// 就是Promise.all
axios.all = function all(promises) {
  return Promise.all(promises);
};

// 挂载 spread(function(x, y, z) {})([1, 2, 3])
/**
 * const spreadFn = axios.spread(function (x, y, z) {
 *   console.log(x, y, z);
 * });
 * spreadFn([1, 2, 3]); // 1 2 3
*/
axios.spread = require('./helpers/spread');

// Expose isAxiosError
// 挂载是否是axios错误
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;
