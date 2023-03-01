/* @flow */

import {
  tip,
  toArray,
  hyphenate,
  formatComponentName,
  invokeWithErrorHandling,
} from "../util/index";
import { updateListeners } from "../vdom/helpers/index";

// 初始化事件
export function initEvents(vm: Component) {
  // 在vm上创建一个_events对象，用来存放事件
  vm._events = Object.create(null);
  // 这个bool标志位来表明是否存在钩子，而不需要通过哈希表的方法来查找是否有钩子，这样做可以减少不必要的开销，优化性能
  vm._hasHookEvent = false;
  // init parent attached events
  // 初始化父组件attach的事件
  const listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

let target: any;
// 注册事件方法
function add(event, fn) {
  target.$on(event, fn);
}

// 销毁事件方法
function remove(event, fn) {
  target.$off(event, fn);
}

// 注册只调用一次的事件方法
function createOnceHandler(event, fn) {
  const _target = target;
  return function onceHandler() {
    const res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  };
}

// 更新组件的监听事件
export function updateComponentListeners(
  vm: Component,
  listeners: Object,
  oldListeners: ?Object
) {
  target = vm;
  updateListeners(
    listeners,
    oldListeners || {},
    add,
    remove,
    createOnceHandler,
    vm
  );
  target = undefined;
}

// 为Vue原型加入操作事件的方法
export function eventsMixin(Vue: Class<Component>) {
  const hookRE = /^hook:/;
  /**
   * 监听当前实例上的自定义事件。事件可以由 vm.$emit 触发。回调函数会接收所有传入事件触发函数的额外参数
   * @param {*} event 单个的事件名称或者有多个事件名组成的数组
   * @param {*} fn 当 event 被触发时执行的回调函数
   * @returns
   */
  Vue.prototype.$on = function (
    event: string | Array<string>,
    fn: Function
  ): Component {
    const vm: Component = this;
    // 如果是数组的时候，则递归$on，为每一个成员都绑定上方法
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      // 将注册的事件和回调以键值对的形式存储到 vm._event 对象中 vm._event = { eventName: [fn1, ...] }
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // hookEvent，提供从外部为组件实例注入声明周期方法的机会
      // 比如从组件外部为组件的 mounted 方法注入额外的逻辑
      // 该能力是结合 callhook 方法实现的
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm;
  };

  // 监听一个自定义事件，但是只触发一次。一旦触发之后，监听器就会被移除。
  Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this;
    function on() {
      // 在第一次执行的时候将该事件销毁
      vm.$off(event, on);
      // 执行注册的方法
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm;
  };

  /**
   * 移除自定义事件监听器。
   * 如果没有提供参数，则移除所有的事件监听器；
   * 如果只提供了事件，则移除该事件所有的监听器；
   * 如果同时提供了事件与回调，则只移除这个回调的监听器。
   */
  Vue.prototype.$off = function (
    event?: string | Array<string>,
    fn?: Function
  ): Component {
    const vm: Component = this;
    // 如果不传参数则注销所有事件
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm;
    }
    // 如果event是数组则递归注销事件
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$off(event[i], fn);
      }
      return vm;
    }
    // 除了 vm.$off() 之外，最终都会走到这里，移除指定事件
    const cbs = vm._events[event];
    // 本身不存在该事件则直接返回
    if (!cbs) {
      return vm;
    }
    // 如果只传了event参数则移除该事件的所有回调函数
    if (!fn) {
      vm._events[event] = null;
      return vm;
    }
    // 移除指定事件的指定回调函数，就是从事件的回调数组中找到该回调函数，然后删除
    let cb;
    let i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }
    return vm;
  };

  // 触发当前实例上的事件。附加参数都会传给监听器回调。
  Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this;
    if (process.env.NODE_ENV !== "production") {
      // 将事件名转换为小写
      const lowerCaseEvent = event.toLowerCase();
      // 意思是说，HTML 属性不区分大小写，所以你不能使用 v-on 监听小驼峰形式的事件名（eventName），而应该使用连字符形式的事件名（event-name)
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
            `${formatComponentName(
              vm
            )} but the handler is registered for "${event}". ` +
            `Note that HTML attributes are case-insensitive and you cannot use ` +
            `v-on to listen to camelCase events when using in-DOM templates. ` +
            `You should probably use "${hyphenate(
              event
            )}" instead of "${event}".`
        );
      }
    }
    // 从 vm._event 对象上拿到当前事件的回调函数数组，并一次调用数组中的回调函数，并且传递提供的参数
    let cbs = vm._events[event];
    // 将类数组的对象转换成数组
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      const args = toArray(arguments, 1);
      const info = `event handler for "${event}"`;
      // 遍历执行
      for (let i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm;
  };
}
