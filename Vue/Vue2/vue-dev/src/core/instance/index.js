import { initMixin } from "./init";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { eventsMixin } from "./events";
import { lifecycleMixin } from "./lifecycle";
// import { warn } from '../util/index'

// vue构造函数
function Vue(options) {
  // ignore 以后这种 非功能性代码 我都注释掉，避免影响阅读
  // if (process.env.NODE_ENV !== 'production' &&
  //   !(this instanceof Vue)
  // ) {
  //   warn('Vue is a constructor and should be called with the `new` keyword')
  // }
  /* 初始化 vue */
  this._init(options);
}

/* 在Vue的原型上增加_init方法，构造Vue实例的时候会调用这个_init方法来初始化Vue实例 */
initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;
