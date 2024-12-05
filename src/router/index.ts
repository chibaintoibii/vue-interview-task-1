import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Home,
    children: [
      {
        path: "/",
        redirect: "/posts",
      },
      {
        path: "/posts",
        component: () => import("@/views/Posts/PostsList.vue"),
      },
      {
        path: "/todos",
        component: () => import("@/views/Todos/TodosList.vue"),
      },
      {
        path: "/photos",
        component: () => import("@/views/Photos/PhotosList.vue"),
      },
    ],
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
