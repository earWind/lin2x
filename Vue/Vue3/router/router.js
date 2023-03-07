/**
 * 测试时手动更改路由地址
 */

const { defineComponent, h, ref } = Vue;

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
        },
        slots.default()
      );
    };
  },
});

const RouterView = defineComponent({
  name: "RouterView",
  inheritAttrs: false,
  setup(props, { slots }) {
    return () => {
      const { routes, current } = VueRouter;

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
    // 怎么在RouterView中获取$router
    const router = this;
    app.config.globalProperties.$router = router;

    app.component("RouterLink", RouterLink);
    app.component("RouterView", RouterView);
  },
};
