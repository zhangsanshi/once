var NS = require('./ns.js');

module.exports = {
  toString: NS.toString,
  isFunction: function isFunction(obj) {
    return obj && this.toString.call(obj) === '[object Function]';
  },
  isPromise: function isPromise(obj) {
    // 简单判断对象是不是 Promise 对象
    return obj && this.isFunction(obj.then);
  }
};
