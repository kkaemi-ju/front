import { createRouter, createWebHistory } from "vue-router";
import AppVue from "../App.vue";
import Mypage from "../views/Mypage.vue";
import MainVue from "../views/Main.vue";
import BoardList from "../views/BoardList.vue"
import BoardDetail from "../views/BoardDetail.vue"
import BoardWrite from "../views/BoardWrite.vue"
import Attractions from "@/views/Attraction.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainVue,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/AboutView.vue'),
    },
    { path: "/board", name:"boardlist", component:BoardList},
    { path: "/boardwrite", name:"boardwrite", component:BoardWrite},
    { path: "/boarddetail", name:"boarddetail", component:BoardDetail},
    { path: "/mypage", name: "mypage", component: Mypage },
    { path: "/attractions", name: "attractions", component: Attractions },
  ],
});

export default router;
