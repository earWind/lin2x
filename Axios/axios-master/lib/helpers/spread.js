'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 * 语法糖，用于调用函数和展开数组作为参数
 *
 * Common use case would be to use `Function.prototype.apply`.
 * 常见的用例是使用' Function.prototype.apply '
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 * 通过“spread”，这个例子可以被重写
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};
