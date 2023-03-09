// 参考：https://zhuanlan.zhihu.com/p/578093950

/**
 * 1.with + Function 沙箱
 */
// function sandbox(code) {
//   code = "with (sandbox) {" + code + "}";
//   return new Function("sandbox", code);
// }
// const code = `
//   let a = 1;
//   window.name="张三";
//   console.log(a);
// `;
// sandbox(code)({});
// console.log(window.name); // '张三'

/**
 * 2.SnapshotSandbox(快照沙箱)
 * 需要遍历window上的所有属性，性能差
 */
class Sanapshotbox {
  windowSnapshot = {};
  modifyPropsMap = {};
  // 激活
  active() {
    // 保存 window 对象上所有属性的状态
    for (const prop in window) {
      this.windowSnapshot[prop] = window[prop];
    }
    // 恢复上一次在运行微应用的时候改过的 window 上的属性
    Object.keys(this.modifyPropsMap).forEach((prop) => {
      window[prop] = this.modifyPropsMap[prop];
    });
  }
  // 失活
  inactive() {
    // 记录修改 window 上的哪些属性
    for (const prop in window) {
      if (window[prop] !== this.windowSnapshot[prop]) {
        this.modifyPropsMap[prop] = window[prop];
        // 将 window 上的属性状态 还原至微应用之前的状态
        window[prop] = this.windowSnapshot[prop];
      }
    }
  }
}
// window.city = "beijing"; // 初始值
// let sanapshotbox = new Sanapshotbox();
// console.log("111", window.city);
// sanapshotbox.active(); // 微应用运行
// window.city = "上海";
// console.log("22222", window.city);
// sanapshotbox.inactive(); // 微应用卸载了
// console.log("3333", window.city);

/**
 * 3.基于 Proxy 实现的沙箱(单例代理沙箱 - LegacySandbox)
 */
class LegacySandbox {
  // 持续记录新增和修改的全局变量
  currentUpdatePropsValueMap = new Map();
  // 沙箱期间更新的全局变量
  modifiedPropsOriginalValueMapInSandbox = new Map();
  // 沙箱期间新增的全局变量
  addedPropsMapInSandbox = new Map();
  propsWindow = {};
  // 核心逻辑
  constructor() {
    const fakeWindow = Object.create(null);
    // 设置值或者获取值
    this.propsWindow = new Proxy(fakeWindow, {
      set: (target, prop, value, receiver) => {
        const originValue = window[prop];
        if (!window.hasOwnProperty(prop)) {
          this.addedPropsMapInSandbox.set(prop, value);
        } else if (!this.modifiedPropsOriginalValueMapInSandbox.has(prop)) {
          this.modifiedPropsOriginalValueMapInSandbox.set(prop, originValue);
        }
        this.currentUpdatePropsValueMap.set(prop, value);
        window[prop] = value;
      },
      get: (target, prop, receiver) => {
        return window[prop];
      },
    });
  }
  setWindowProp(prop, value, isToDelete) {
    if (value === undefined && isToDelete) {
      delete window[prop];
    } else {
      window[prop] = value;
    }
  }
  // 激活
  active() {
    // 恢复上一次该微应用处于运行状态时，对 window 上做的所有应用的修改
    this.currentUpdatePropsValueMap.forEach((value, prop) => {
      this.setWindowProp(prop, value);
    });
  }
  // 失活
  inactive() {
    // 还原window上的属性
    this.modifiedPropsOriginalValueMapInSandbox.forEach((value, prop) => {
      this.setWindowProp(prop, value);
    });
    // 删除在微应用运行期间 window 新增的属性
    this.addedPropsMapInSandbox.forEach((_, prop) => {
      this.setWindowProp(prop, undefined, true);
    });
  }
}
// window.city = "beijing";
// let legacySandbox = new LegacySandbox();
// console.log("11111", window.city);
// legacySandbox.active();
// legacySandbox.propsWindow.city = "shanghai";
// console.log("2222", window.city);
// legacySandbox.inactive();
// console.log("3333", window.city);

/**
 * 4.ProxySandbox(多例代理沙箱)
 */
class ProxySandbox {
  proxyWindow;
  isRunning = false;
  constructor() {
    const fakeWindow = Object.create(null);
    this.proxyWindow = new Proxy(fakeWindow, {
      set: (target, prop, value, receiver) => {
        if (this.isRunning) {
          target[prop] = value;
        }
      },
      get: (target, prop, receiver) => {
        return prop in target ? target[prop] : window[prop];
      },
    });
  }
  active() {
    this.isRunning = true;
  }
  inactive() {
    this.isRunning = false;
  }
}
// window.city = "beijing";
// let proxySandboxA = new ProxySandbox();
// let proxySandboxB = new ProxySandbox();
// proxySandboxA.active();
// proxySandboxB.active();
// proxySandboxA.proxyWindow.city = "shanghai";
// proxySandboxB.proxyWindow.city = "chengdu";
// console.log("111111", window.city);
// console.log("222222", proxySandboxA.proxyWindow.city);
// console.log("333333", proxySandboxA.proxyWindow.city);
// proxySandboxA.inactive();
// proxySandboxB.inactive();
// console.log("111111", window.city);
// console.log("222222", proxySandboxA.proxyWindow.city);
// console.log("333333", proxySandboxA.proxyWindow.city);
