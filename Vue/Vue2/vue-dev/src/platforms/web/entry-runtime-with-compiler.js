/* @flow */

import config from "core/config";
import { warn, cached } from "core/util/index";
import { mark, measure } from "core/util/perf";

import Vue from "./runtime/index";
import { query } from "./util/index";
import { compileToFunctions } from "./compiler/index";
import {
  shouldDecodeNewlines,
  shouldDecodeNewlinesForHref,
} from "./util/compat";

const idToTemplate = cached((id) => {
  const el = query(id);
  return el && el.innerHTML;
});

// 把原本不带编译的$mount方法保存下来，在最后会调用
const mount = Vue.prototype.$mount;

// 挂载组件，带模板编译
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  debugger
  // 获取 DOM 实例对象
  el = el && query(el);

  // el 不能为 html 和 body
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== "production" &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      );
    return this;
  }

  const options = this.$options;
  // 处理模板templete，编译成render函数，render不存在的时候才会编译template，否则优先使用render
  if (!options.render) {
    let template = options.template;
    // template存在的时候取template，不存在的时候取el的outerHTML
    if (template) {
      // 当template是字符串的时候
      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          template = idToTemplate(template);
        }
      } else if (template.nodeType) {
        // 当template为DOM节点的时候
        template = template.innerHTML;
      } else {
        // 报错
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } else if (el) {
      // 获取element的outerHTML
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile");
      }

      /*
       * 将template编译成render函数，这里会有render以及staticRenderFns两个返回，
       * 这是vue的编译时优化，static静态不需要在VNode更新时进行patch，优化性能
       */
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== "production",
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      );
      // this.$options.render 将template编译成render函数挂载到 vm 上
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile end");
        measure(`vue ${this._name} compile`, "compile", "compile end");
      }
    }
  }
  // 调用const mount = Vue.prototype.$mount 保存下来的不带编译的 mount
  return mount.call(this, el, hydrating);
};

// 获取element的outerHTML
function getOuterHTML(el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    const container = document.createElement("div");
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

Vue.compile = compileToFunctions;

export default Vue;
