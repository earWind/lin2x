/**
 * 3种状态
 * pending 等待
 * fulfilled 成功
 * rejected 失败
 * 只能是 pending -> fulfilled 或者 pending -> rejected
 */
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const resolvePromise = (p, x, resolve, reject) => {
  // 不能为自己
  if (p === x) {
    reject(new TypeError("x is self"));
    return;
  }
  if (x instanceof _Promise) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
};

const isFunc = (v) => typeof v === "function";

class _Promise {
  status = PENDING; // 当前状态
  value = null; // 成功返回的结果
  reason = null; // 失败的原因
  fulfilledQueue = []; // 存储成功回调队列
  rejectedQueue = []; // 存储失败回调队列
  constructor(fn) {
    const { resolve, reject } = this;
    // 立即执行 捕获异常
    try {
      fn(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  /**
   * resolve 静态方法 _Promise.resolve()
   * @param {*} value
   * @returns _Promise
   */
  static resolve(value) {
    // 如果传入 _Promise 就直接返回
    if (value instanceof _Promise) {
      return value;
    }
    // 转成常规方式
    return new _Promise((resolve, _) => resolve(value));
  }
  /**
   * reject 静态方法 _Promise.reject()
   * @param {*} reason
   * @returns _Promise
   */
  static reject(reason) {
    return new _Promise((_, reject) => reject(reason));
  }
  // 箭头函数是让 this 指向当前实例对象
  resolve = (val) => {
    let { status, fulfilledQueue } = this;
    if (status !== PENDING) return;
    this.status = FULFILLED;
    this.value = val;
    // 异步回调 依次从队列中取
    while (fulfilledQueue.length) {
      let fn = fulfilledQueue.shift();
      fn(val);
    }
  };
  reject = (val) => {
    let { status, rejectedQueue } = this;
    if (status !== PENDING) return;
    this.status = REJECTED;
    this.reason = val;
    // 异步回调
    while (rejectedQueue.length) {
      let fn = rejectedQueue.shift();
      fn(val);
    }
  };
  then = (onFulfilled, onRejected) => {
    if (!isFunc(onFulfilled)) {
      onFulfilled = (v) => v;
    }
    if (!isFunc(onRejected)) {
      onRejected = (r) => {
        throw r;
      };
    }
    // then链式调用，返回_promise
    const p = new _Promise((resolve, reject) => {
      const fulfilledAsync = () => {
        // 创建一个微任务等待 p 完成初始化
        setTimeout(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = onFulfilled(this.value);
            resolvePromise(p, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };
      const rejectedAsync = () => {
        // 创建一个微任务等待 p 完成初始化
        setTimeout(() => {
          try {
            // 获取失败回调函数的执行结果
            const x = onRejected(this.reason);
            resolvePromise(p, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };
      switch (this.status) {
        case FULFILLED:
          fulfilledAsync();
          break;
        case REJECTED:
          rejectedAsync();
          break;
        case PENDING:
          // 异步的时候会进这里
          this.fulfilledQueue.push(fulfilledAsync);
          this.rejectedQueue.push(rejectedAsync);
          break;
      }
    });
    return p;
  };
}

/* =========测试========= */
// new _Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(1);
//   }, 0);
// }).then(
//   (res) => {
//     console.log(res);
//   },
//   (err) => {
//     console.log(err);
//   }
// );
// p.then().then(
//   (res) => {
//     console.log(res);
//   },
//   (err) => {
//     console.log(err);
//   }
// );

/* =========测试1========= */
_Promise
  .resolve()
  .then(() => {
    console.log(0);
    return Promise.resolve();
  })
  .then(() => {
    console.log(4);
  });
_Promise
  .resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });

/* =========测试2========= */
// let p = new _Promise((resolve, reject) => {
//   resolve();
//   // reject();
//   // throw new Error();
// });
// p.then(
//   () => {
//     console.log(1);
//   },
//   () => {
//     console.log(2);
//   }
// ).catch(() => {
//   console.log(3);
// });

// 参考 https://juejin.cn/post/6945319439772434469#heading-21
