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

// 判断 then 传递的成功和失败回调 返回的值是
const resolvePromise = (p, x, resolve, reject) => {
  // 如果返回的值就是当前的Promise则返回
  if (p === x) {
    reject(new TypeError("x is self"));
    return;
  }
  if (x instanceof _Promise) {
    // 如果是Promise则执行.then
    x.then(resolve, reject);
  } else {
    // 如果不是则执行resolve
    resolve(x);
  }
};

const isFunc = (v) => typeof v === "function";

/**
 * Promise 接收一个回调，这个回调需要传入两个参数resolve和reject用来更改当前状态的方法
 * 首先，有三个状态等待、成功、失败
 * 1.初始化的时候就需要立即执行传入的方法
 * 2.then调用时会先判断当前状态：if 等待则会往队列里面搜集成功和失败的回调 else 立即执行成功或者失败的回调
 * 3.status只会从等待变为成功或者失败中的一种，且状态不可逆
 * 4.链式调用 .resolve()/.reject()/.then()就是返回一个 new Promise
 * 5.resolve和reject用箭头函数是因为链式调用返回的是一个新的Promise，
 */
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
    return new _Promise((resolve, _) => {
      resolve(value);
    });
  }
  /**
   * reject 静态方法 _Promise.reject()
   * @param {*} reason
   * @returns _Promise
   */
  static reject(reason) {
    return new _Promise((_, reject) => {
      reject(reason);
    });
  }
  // 改变当前状态 并执行then搜集的回调
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
  // 改变当前状态 并执行then搜集的回调
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
        queueMicrotask(() => {
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
        queueMicrotask(() => {
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
new _Promise((resolve, reject) => {
  console.log(0);
  setTimeout(() => {
    resolve(1);
  }, 0);
})
  .then(
    (res) => {
      console.log(res);
      return 2;
    },
    (err) => {
      console.log(err);
    }
  )
  .then((res) => {
    console.log(res);
  });
// p.then().then(
//   (res) => {
//     console.log(res);
//   },
//   (err) => {
//     console.log(err);
//   }
// );

/* =========测试1========= */
// _Promise
//   .resolve(1)
//   .then((r) => {
//     console.log(0, r);
//     return Promise.resolve();
//   })
//   .then(() => {
//     console.log(4);
//   });
// _Promise
//   .resolve()
//   .then(() => {
//     console.log(1);
//   })
//   .then(() => {
//     console.log(2);
//   })
//   .then(() => {
//     console.log(3);
//   })
//   .then(() => {
//     console.log(5);
//   })
//   .then(() => {
//     console.log(6);
//   });

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
