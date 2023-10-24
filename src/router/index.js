import { createRouter, createWebHistory } from "vue-router";
const Index = () => import("@/views/IndexVue.vue");
const NotFound = () => import("@/views/NotFound.vue");
const Login = () => import("@/views/LoginVue.vue");
const Home = () => import("@/views/homePage/HomePage.vue");
const Data = () => import("@/views/data/Data.vue");
const Carousel = () => import("@/views/content/CarouselManage.vue");
const HotSearch = () => import("@/views/content/HotSearchManage.vue");
const Ranking = () => import("@/views/content/RankingManage.vue");
const Tag = () => import("@/views/content/TagManage.vue");
const Video = () => import("@/views/audit/VideoAudit.vue");
const Article = () => import("@/views/audit/ArticleAudit.vue");
const Avatar = () => import("@/views/audit/AvatarAudit.vue");
const Dynamic = () => import("@/views/audit/DynamicAudit.vue");
const Comment = () => import("@/views/audit/CommentAudit.vue");
const Danmu = () => import("@/views/audit/DanmuAudit.vue");
const Report = () => import("@/views/case/ReportCase.vue");
const Appeal = () => import("@/views/case/AppealCase.vue");
const User = () => import("@/views/system/UserManage.vue");
const Role = () => import("@/views/system/RoleManage.vue");

const routes = [
  { path: "/", redirect: "" },
  {
    path: "",
    redirect: "/home",
    component: Index,
    meta: { requestAuth: true },
    children: [
      { path: '/home', component: Home, meta: { requestAuth: true } },
      { path: '/data', component: Data, meta: { requestAuth: true } },
      {
        path: '/content',
        redirect: '/content/carousel',
        children: [
          { path: '/content/carousel', component: Carousel, meta: { requestAuth: true } },
          { path: '/content/hot-search', component: HotSearch, meta: { requestAuth: true } },
          { path: '/content/ranking', component: Ranking, meta: { requestAuth: true } },
          { path: '/content/tag', component: Tag, meta: { requestAuth: true } },
        ]
      },
      {
        path: '/audit',
        redirect: '/audit/video',
        children: [
          { path: '/audit/video', component: Video, meta: { requestAuth: true } },
          { path: '/audit/article', component: Article, meta: { requestAuth: true } },
          { path: '/audit/avatar', component: Avatar, meta: { requestAuth: true } },
          { path: '/audit/dynamic', component: Dynamic, meta: { requestAuth: true } },
          { path: '/audit/comment', component: Comment, meta: { requestAuth: true } },
          { path: '/audit/danmu', component: Danmu, meta: { requestAuth: true } },
        ]
      },
      {
        path: '/case',
        redirect: '/case/report',
        children: [
          { path: '/case/report', component: Report, meta: { requestAuth: true } },
          { path: '/case/appeal', component: Appeal, meta: { requestAuth: true } },
        ]
      },
      {
        path: '/system',
        redirect: '/system/user',
        children: [
          { path: '/system/user', component: User, meta: { requestAuth: true } },
          { path: '/system/role', component: Role, meta: { requestAuth: true } },
        ]
      },
    ]
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
