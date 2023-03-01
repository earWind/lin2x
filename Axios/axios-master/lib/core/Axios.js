'use strict';

// 公共方法
var utils = require('./../utils');
// 构建URL
var buildURL = require('../helpers/buildURL');
// 拦截器
var InterceptorManager = require('./InterceptorManager');
// 使用适配器发送请求
var dispatchRequest = require('./dispatchRequest');
// 合并
var mergeConfig = require('./mergeConfig');
// 验证器
var validator = require('../helpers/validator');

var validators = validator.validators;
/**
 * Create a new instance of Axios
 * Axios 构造函数
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  // 配置对象
  this.defaults = instanceConfig;
  // 设置请求和响应拦截器
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 * 发送请求
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  // 允许传入的是一个字符串参数
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  // 合并参数
  config = mergeConfig(this.defaults, config);

  // Set config.method
  // 将方法名字母都转成小写，没有方法的话默认get请求
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // 版本相关
  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  // 过滤掉被跳过的拦截器

  // then之前 拦截器
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  // 遍历所有注册的拦截器 forEach方法时拦截器对象提供的
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  // catch之前 拦截器
  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  // 创建一个promise
  var promise;

  if (!synchronousRequestInterceptors) {
    // 创建拦截器中间件  第一个参数用来发送请求, 第二个为 undefined 用来补位
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain.concat(responseInterceptorChain);

    // 创建一个成功的 promise 且成功的值为合并后的请求配置
    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }

  // 执行拦截器，返回被拦截器处理过后新的数据
  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  // 调用 dispatchRequest 发送请求，如果异常则直接返回 Promise.reject
  try {
    // 发送请求 重点
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  // 返回一个promise对象
  return promise;
};

// 获取URL
Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
// 为支持的请求方法提供别名 但其实都是调用的request方法
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  // 参数为请求地址+配置项
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  // 参数为请求地址+请求参数+配置项
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;
