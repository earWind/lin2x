'use strict';
/**
 * 默认配置
*/

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');
var enhanceError = require('./core/enhanceError');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

// 设置ContentType
function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

// 根据环境适配 选择是创建 XMLHttpRequest 还是 http 请求
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

// 默认配置对象
var defaults = {

  // 过渡
  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  /**
   * 适配器
   *
   * 默认根据环境选择创建 XMLHttpRequest 还是 http 请求
   *
   * 如果是用户传入的话，允许自定义处理请求，以使测试更轻松
   * 返回一个 promise 并应用一个有效的响应
  */
  adapter: getDefaultAdapter(),

  // 请求 允许在向服务器发送前，修改请求数据
  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return JSON.stringify(data);
    }
    return data;
  }],

  // 响应 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   * 超时时间设置 超时中断请求
   */
  timeout: 0,

  // 防止xsrf攻击的检测字符串
  // 是用作 xsrf token 的值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN',
  // 是携带xsrf令牌值的http头文件的名称
  xsrfHeaderName: 'X-XSRF-TOKEN',

  // 定义允许的响应内容的最大尺寸
  maxContentLength: -1,
  maxBodyLength: -1,

  // 校验响应状态码 是2开头的就表示成功
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

// 添加默认的请求头信息
defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

// defaults.headers 添加属性
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;
