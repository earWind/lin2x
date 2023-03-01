import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/news",
    name: "News",
    component: () => import("../components/news.vue"),
  },
];

export default routes;
