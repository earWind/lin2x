import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import HelloWorld from "../views/HelloWorld";

const routes = [
  {
    path: "/",
    component: HelloWorld,
  },
];

const createRouter = () => {
  return new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes,
  });
};

const router = createRouter();

export default router;
