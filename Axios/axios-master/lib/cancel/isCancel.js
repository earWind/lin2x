'use strict';
/**
 * 判断是否是Cancel对象
*/

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};
