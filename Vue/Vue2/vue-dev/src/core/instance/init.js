/* @flow */

// import config from '../config'
import { initProxy } from "./proxy";
import { initState } from "./state";
import { initRender } from "./render";
import { initEvents } from "./events";
// import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from "./lifecycle";
import { initProvide, initInjections } from "./inject";
import {
  extend,
  mergeOptions,
  // formatComponentName
} from "../util/index";

let uid = 0;

/**
 * 定义 Vue.prototype._init 方法
 * @param {*} Vue Vue构造函数
 */
export function initMixin(Vue: Class<Component>) {
  /* 负责 Vue 的初始化过程 (options:) */
  Vue.prototype._init = function (options?: Object) {
    /* vue 实例 */
    const vm: Component = this;
    // a uid
    /* 每个 vue 实例都有一个 _uid，并且是依次递增的 */
    vm._uid = uid++;

    /* 开始测性能 提供高精度的时间戳，可以更加精准的计算脚本运行的时间，测量被包裹的代码运行执行时间 */
    // let startTag, endTag
    // /* istanbul ignore if */
    // if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    //   startTag = `vue-perf-start:${vm._uid}`
    //   endTag = `vue-perf-end:${vm._uid}`
    //   mark(startTag)
    // }

    // a flag to avoid this being observed
    /* 一个防止vm实例自身被观察的标志位 */
    vm._isVue = true;
    // merge options
    /* 合并组件配置项 */
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      /* 如果是子组件走这里，性能优化 */
      /* 将组件配置对象上的一些深层次属性放到 vm.$options 选项中，以提高代码的执行效率 */
      initInternalComponent(vm, options);
    } else {
      /**
       * 如果是根组件走这里，合并 Vue 的全局配置到根组件的局部配置，比如 Vue.component 注册的全局组件会合并到 根实例的 components 选项中
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
      /* 设置代理，将 vm 实例上的属性代理到 vm._renderProxy */
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    /* 初始化组件实例关系属性，比如 $parent、$children、$root、$refs 等 */
    initLifecycle(vm);
    /**
     * 初始化自定义事件，我们在 <comp @click="handleClick" /> 上注册的事件，监听者不是父组件，
     * 而是子组件本身，也就是说事件的派发和监听者都是子组件本身，和父组件无关
     */
    initEvents(vm);
    /* 解析组件的插槽信息，得到 vm.$slot，处理渲染函数，得到 vm.$createElement 方法，即 h 函数 */
    initRender(vm);
    /* 调用 beforeCreate 钩子函数 */
    callHook(vm, "beforeCreate");
    /* 初始化组件的 inject 配置项，得到 result[key] = val 形式的配置对象，然后对结果数据进行响应式处理，并代理每个 key 到 vm 实例 */
    initInjections(vm); // resolve injections before data/props
    /* 数据响应式的重点，处理 props、methods、data、computed、watch */
    initState(vm);
    /* 解析组件配置项上的 provide 对象，将其挂载到 vm._provided 属性上 */
    initProvide(vm); // resolve provide after data/props
    /* 调用 created 钩子函数 */
    callHook(vm, "created");

    /* 结束测性能，得出结果 measure */
    /* istanbul ignore if */
    // if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    //   vm._name = formatComponentName(vm, false)
    //   mark(endTag)
    //   measure(`vue ${vm._name} init`, startTag, endTag)
    // }

    /* 如果发现配置项上有 el 选项，则自动调用 $mount 方法，也就是说有了 el 选项，就不需要再手动调用 $mount，反之，没有 el 则必须手动调用 $mount */
    if (vm.$options.el) {
      /* 调用 $mount 方法，进入挂载阶段 */
      vm.$mount(vm.$options.el);
    }
  };
}

/**
 * 初始化内部组件
 * @param {*} vm vue组件实例
 * @param {*} options 选项/配置项
 */
export function initInternalComponent(
  vm: Component,
  options: InternalComponentOptions
) {
  const opts = (vm.$options = Object.create(vm.constructor.options));
  // doing this because it's faster than dynamic enumeration.
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
 * @param {*} Ctor
 * @returns
 */
export function resolveConstructorOptions(Ctor: Class<Component>) {
  /* 配置项 */
  let options = Ctor.options;
  /* 如果存在父类 */
  if (Ctor.super) {
    /* 递归父类，获取父类的options */
    const superOptions = resolveConstructorOptions(Ctor.super);
    /* 之前已经缓存起来的父类的options，用以检测是否更新 */
    const cachedSuperOptions = Ctor.superOptions;
    /* 对比当前父类的option以及缓存中的option，两个不一样则代表已经被更新 */
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      /* 父类的opiton已经被改变，需要去处理新的option */
      /* 把新的option缓存起来 */
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      // 检查 Ctor.options 上是否有任何后期修改/附加的选项
      const modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      /* 如果存在被修改或增加的选项，则合并两个选项 */
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      /* 选项合并，将合并结果赋值为 Ctor.options */
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
