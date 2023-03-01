/* @flow */

import { toNumber, toString, looseEqual, looseIndexOf } from "shared/util";
import { createTextVNode, createEmptyVNode } from "core/vdom/vnode";
import { renderList } from "./render-list";
import { renderSlot } from "./render-slot";
import { resolveFilter } from "./resolve-filter";
import { checkKeyCodes } from "./check-keycodes";
import { bindObjectProps } from "./bind-object-props";
import { renderStatic, markOnce } from "./render-static";
import { bindObjectListeners } from "./bind-object-listeners";
import { resolveScopedSlots } from "./resolve-scoped-slots";
import { bindDynamicKeys, prependModifier } from "./bind-dynamic-keys";

/**
 * 在实例上挂载简写的渲染工具函数
 * @param {*} target Vue 实例
 * 该方法负责在实例上安装大量和渲染相关的简写的工具函数，这些工具函数用在编译器生成的渲染函数中，
 * 比如 v-for 编译后的 vm._l，还有大家最熟悉的 h 函数（vm._c)，不过它没在这里声明，是在 initRender 函数中声明的。
 */
export function installRenderHelpers(target: any) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}
