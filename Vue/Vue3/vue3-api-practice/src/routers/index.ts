import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Home from "@/views/home.vue";
import Login from "@/views/login.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/login", component: Login },

  { path: "/", component: Home },
  { path: "/about", component: () => import("@/views/about.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
