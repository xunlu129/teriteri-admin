import { createRouter, createWebHistory } from "vue-router";
const Index = () => import("views/IndexVue.vue");
const NotFound = () => import("@/views/NotFound.vue");
const Login = () => import("@/views/LoginVue.vue");

const routes = [
  { path: "/", redirect: "" },
  {
    path: "",
    component: Index,
    meta: { requestAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { requestAuth: false },
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
    meta: { requestAuth: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 本地没有token就跳到登录界面
router.beforeEach((to, from, next) => {
  if (to.meta.requestAuth && !localStorage.getItem("teri_token")) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
