import { createRouter, createWebHistory } from "vue-router";
import AppVue from "../App.vue";
import Mypage from "../views/Mypage.vue";
import MainVue from "../views/Main.vue";
import BoardList from "../views/BoardList.vue";
import BoardDetail from "../views/BoardDetail.vue";
import BoardWrite from "../views/BoardWrite.vue";
import Attractions from "@/views/Attraction.vue";
import TripClip from "@/views/VideoList.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/user";
const onlyAuthUser = async (to, from, next) => {
  const userStore = useUserStore();
  const { userInfo, isValidToken } = storeToRefs(userStore);
  const { getUserInfo } = userStore;

  let token = sessionStorage.getItem("accessToken");

  if (userInfo.value != null && token) {
    await getUserInfo(token);
  }
  if (!isValidToken.value || userInfo.value === null) {
    alert("로그인 후 이용하실 수 있습니다.");
    next({ name: "main" });
  } else {
    next();
  }
};
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
    {
      path: "/board",
      name: "boardlist",
      beforeEnter: onlyAuthUser,
      component: BoardList,
    },
    { path: "/boardwrite", name: "boardwrite", component: BoardWrite },
    {
      path: "/boarddetail/:id",
      name: "boarddetail",
      component: BoardDetail,
    },
    {
      path: "/mypage",
      name: "mypage",
      beforeEnter: onlyAuthUser,
      component: Mypage,
    },
    {
      path: "/planlist",
      name: "planlist",
      component: () => import("../views/PlanList.vue"),
    },
    {
      path: "/plandetail",
      name: "plandetail",
      component: () => import("../views/PlanDetail.vue"),
    },
    {
      path: "/planmake",
      name: "planmake",
      component: () => import("../views/PlanMake.vue"),
    },
    { path: "/attractions", name: "attractions", component: Attractions },
    { path: "/tripclip", name: "tripclip", component: TripClip },
  ],
});

export default router;
