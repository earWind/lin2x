/**
 * 原理：
 *  1.监听URL改变
 *  2.找到URL对应的组件，然后渲染
 * 参考：https://www.bilibili.com/video/BV14y4y1C7F2/?spm_id_from=333.337.search-card.all.click&vd_source=882cc41e5b4d1de7ca7d872e4b8a766f
 */

const { defineComponent, h, ref, getCurrentInstance } = Vue;

const RouterLink = defineComponent({
  name: "RouterLink",
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => {
      return h(
        "a",
        {
          href: props.to,
          onclick: (e) => {
            e.preventDefault();
            location.replace(location.pathname + "#" + props.to);
          },
        },
        slots.default()
      );
    };
  },
});

const RouterView = defineComponent({
  name: "RouterView",
  inheritAttrs: false,
  setup() {
    const { proxy } = getCurrentInstance();

    return () => {
      const { routes, current } = proxy.$router;

      let component;
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].path === current.value) {
          component = routes[i].component;
        }
      }
      return h(component);
    };
  },
});

const VueRouter = {
  routes: [],
  current: ref("/about"),
  createRouter({ routes }) {
    this.routes = routes;

    window.addEventListener("hashchange", () => {
      this.current.value = window.location.hash.slice(1) || "/";
    });

    return this;
  },
  install(app) {
    const router = this;
    app.config.globalProperties.$router = router;

    app.component("RouterLink", RouterLink);
    app.component("RouterView", RouterView);
  },
};
