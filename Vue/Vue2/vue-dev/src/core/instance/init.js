/* @flow */

import config from "../config";
import { initProxy } from "./proxy";
import { initState } from "./state";
import { initRender } from "./render";
import { initEvents } from "./events";
import { mark, measure } from "../util/perf";
import { initLifecycle, callHook } from "./lifecycle";
import { initProvide, initInjections } from "./inject";
import { extend, mergeOptions, formatComponentName } from "../util/index";

let uid = 0;

/**
 * 定义 Vue.prototype._init 方法
 * @param {*} Vue Vue构造函数
 */
export function initMixin(Vue: Class<Component>) {
  // 负责 Vue 的初始化过程
  Vue.prototype._init = function (options?: Object) {
    console.log(options);
    // vue 实例
    const vm: Component = this;
    // 每个 vue 实例都有一个 _uid，并且是依次递增的，每执行一次uid就会加一
    vm._uid = uid++;

    /* istanbul ignore if */
    // 开始测性能 提供高精度的时间戳，可以更加精准的计算脚本运行的时间，测量被包裹的代码运行执行时间
    let startTag, endTag;
    if (process.env.NODE_ENV !== "production" && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`;
      endTag = `vue-perf-end:${vm._uid}`;
      mark(startTag);
    }

    // 一个防止vm实例自身被观察的标志位
    vm._isVue = true;
    /**
     * 合并组件配置项
     * 由这个判断可以看出 new Vue() 发生在两个地方
     * 1、外部调用 使用者创建
     * 2、子组件内部调用
     */
    if (options && options._isComponent) {
      /**
       * _isComponent 是否是组件
       * 将组件配置对象上的一些深层次属性放到 vm.$options 选项中，以提高代码的执行效率
       */
      initInternalComponent(vm, options);
    } else {
      /**
       * 非组件，合并 Vue 的全局配置到根组件的局部配置，比如 Vue.component 注册的全局组件会合并到 根实例的 components 选项中
       * 至于每个子组件的选项合并则发生在两个地方：
       *   1、Vue.component 方法注册的全局组件在注册时做了选项合并
       *   2、{ components: { xx } } 方式注册的局部组件在执行编译器生成的 render 函数时做了选项合并，包括根组件中的 components 配置
       */
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== "production") {
      // 设置代理，将vm实例上的属性代理到vm._renderProxy
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // this指向问题
    vm._self = vm;
    // 初始化组件实例关系属性，比如 $parent、$children、$root、$refs 。。
    initLifecycle(vm);
    // 初始化自定义事件
    initEvents(vm);
    // 解析组件的插槽信息，得到 vm.$slot；处理渲染函数，得到 vm.$createElement 方法，即 h 函数
    initRender(vm);
    // 调用beforeCreate钩子函数并且触发beforeCreate钩子事件
    callHook(vm, "beforeCreate");
    // 初始化inject 得到 result[key] = val 形式的配置对象，然后对结果数据进行响应式处理，并代理每个 key 到 vm 实例
    initInjections(vm); // resolve injections before data/props
    // 数据响应式，初始化props、methods、data、computed与watch
    initState(vm);
    // 解析组件配置项上的 provide 对象，将其挂载到 vm._provided 属性上
    initProvide(vm); // resolve provide after data/props
    // 调用created钩子函数并且触发created钩子事件
    callHook(vm, "created");

    /* istanbul ignore if */
    // 结束测性能，得出结果 measure
    if (process.env.NODE_ENV !== "production" && config.performance && mark) {
      // 格式化组件名
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(`vue ${vm._name} init`, startTag, endTag);
    }

    /*
     * 如果发现配置项上有 el 选项，则自动调用 $mount 方法，也就是说有了 el 选项，就不需要再手动调用 $mount
     * 反之，没有 el 则必须手动调用 $mount
     */
    if (vm.$options.el) {
      // 挂载组件
      vm.$mount(vm.$options.el);
    }
  };
}

/**
 * 把组件的 options 和 构造函数options 里的属性拿出来放在组件$options上 方便读取
 * @param {*} vm 组件实例
 * @param {*} options 选项/配置项
 */
export function initInternalComponent(
  vm: Component,
  options: InternalComponentOptions
) {
  // 问题1. options 主要存储的是其父组件相关数据
  // 问题2. vm.constructor.options 这才是组件options -- 为什么要从构造函数上取
  // 定义 vm.$options 其原型对象为 vm 构造函数的配置选项
  const opts = (vm.$options = Object.create(vm.constructor.options));
  // 接下来所有做的就是把 组件配置选项 的一些嵌套深的属性拿出来放在 vm.$options 上面
  const parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  const vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

/**
 * 从组件构造函数中解析配置对象 options，并合并父类选项 
 * 子组件的选项合并发生在 父组件的 beforeMounted 阶段
 * @param {*} Ctor
 * @returns
 */
export function resolveConstructorOptions(Ctor: Class<Component>) {
  // 配置项
  let options = Ctor.options;
  // console.log(options)

  // 如果存在父类 Ctor 是 Vue.extend 构建的子类
  if (Ctor.super) {
    // 递归父类，获取父类的options
    const superOptions = resolveConstructorOptions(Ctor.super);
    // 之前已经缓存起来的父类的options，用以检测是否更新
    const cachedSuperOptions = Ctor.superOptions;
    // 对比当前父类的option以及缓存中的option，两个不一样则代表已经被更新
    if (superOptions !== cachedSuperOptions) {
      /*
       * 父类的opiton已经被改变，需要去处理新的option
       * 把新的option缓存起来
       */
      Ctor.superOptions = superOptions;
      // 检查 Ctor.options 上是否有任何后期修改/附加的选项
      const modifiedOptions = resolveModifiedOptions(Ctor);
      // 如果存在被修改或增加的选项，则合并两个选项
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      // 选项合并，将合并结果赋值为 Ctor.options
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options;
}

/**
 * 解析构造函数选项中后续被修改或者增加的选项
 * @param {Class<Component>} Ctor
 * @return {*}  {?Object}
 */
function resolveModifiedOptions(Ctor: Class<Component>): ?Object {
  let modified;
  /* 构造函数选项 */
  const latest = Ctor.options;
  /* 保存的构造函数选项，备份 */
  const sealed = Ctor.sealedOptions;
  /* 对比两个选项，记录不一致的选项 */
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {};
      modified[key] = latest[key];
    }
  }
  return modified;
}
