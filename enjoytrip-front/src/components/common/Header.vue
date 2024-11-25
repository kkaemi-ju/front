<template>
  <div>
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b bg-white">
      <div
        class="container mx-auto flex h-16 items-center justify-between px-4"
      >
        <div class="flex items-center gap-6">
          <router-link to="/" class="text-2xl font-bold text-[#00712D]">
            <img
              src="/src/assets/img/logo_white.png"
              height="230"
              width="130"
            />
          </router-link>
        </div>
        <!-- Navigation Menu (Centered) -->
        <nav class="hidden md:flex flex-1 justify-center items-center gap-8">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="
              item.path === '/board'
                ? { path: item.path, query: { boardId: 1 } }
                : { path: item.path }
            "
            class="text-sm font-medium text-[#00712D] hover:text-[#FF9100] transition-colors"
          >
            <div
              class="relative flex items-center justify-center rounded overflow-hidden hover:scale-150"
              :style="{
                width:
                  item.path === '/attractions' ? '80px' : `${item.width}px`,
                height:
                  item.path === '/attractions' ? '40px' : `${item.height}px`,
              }"
            >
              <img
                v-if="item.image"
                :src="item.image"
                alt=""
                class="w-full h-full object-contain"
              />
            </div>
            <!-- {{ item.name }} -->
          </router-link>
          <!-- 마이페이지 (로그인 상태에서만 표시) -->
          <router-link
            v-if="isLoggedIn"
            to="/mypage"
            class="text-sm font-medium text-[#00712D] hover:text-[#FF9100] transition-colors hover:scale-150"
          >
            <img
              src="/src/assets/img/mypage_white.png"
              width="80"
              height="85"
            />
          </router-link>
        </nav>
        <div class="flex items-center gap-4">
          <!-- 로그인/회원가입 버튼 (로그인되지 않은 상태) -->
          <template v-if="!isLoggedIn">
            <button
              @click="openLoginModal"
              class="text-sm font-medium text-[#00712D] hover:text-[#FF9100]"
            >
              로그인
            </button>
            <button
              @click="openJoinModal"
              class="px-4 py-2 bg-[#00712D] hover:bg-[#FF9100]/90 text-white rounded"
            >
              회원가입
            </button>
          </template>
          <!-- 로그아웃 버튼 (로그인된 상태) -->
          <button
            v-else
            @click="handleLogout"
            class="text-sm font-medium text-[#00712D] hover:text-[#FF9100]"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>

    <!-- Login Modal -->
    <LoginModal v-if="showLoginModal" @close="closeLoginModal" />
    <!-- Join Modal -->
    <JoinModal v-if="showJoinModal" @close="showJoinModal = false" />
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import LoginModal from "../modal/Login.vue";
import JoinModal from "../modal/Join.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const { userLogin, userLogout, getUserInfo } = userStore;
const { isLoggedIn, showLoginModal, userInfo } = storeToRefs(userStore);

const showJoinModal = ref(false);

const loginForm = reactive({
  email: "",
  password: "",
});

const joinForm = reactive({
  id: "",
  password: "",
  name: "",
  email: "",
});

// 메뉴 항목
const menuItems = [
  {
    name: "여행계획",
    path: "/planlist",
    image: "src/assets/img/plan_white.png",
    width: 100,
    height: 25,
  },
  {
    name: "관광지 조회",
    path: "/attractions",
    image: "src/assets/img/attraction_white.png",
    width: 170,
    height: 70,
  },
  {
    name: "게시판",
    path: "/board",
    image: "src/assets/img/board_white.png",
    width: 90,
    height: 20,
  },
  {
    name: "트립클립",
    path: "/tripclip",
    image: "src/assets/img/tripclip_white.png",
    width: 100,
    height: 30,
  },
];

// 로그인
const openLoginModal = () => {
  showLoginModal.value = true;
};

// 모달 닫기
const closeLoginModal = () => {
  showLoginModal.value = false;
};

// 회원가입
const openJoinModal = () => {
  showJoinModal.value = true;
};

const closeJoinModal = () => {
  showJoinModal.value = false;
};

// 로그인 처리
const handleLogin = async () => {
  try {
    await userLogin({
      email: loginForm.email,
      password: loginForm.password,
    });

    loginForm.email = "";
    loginForm.password = "";
    console.log("로그인 성공!");
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// 로그아웃 처리
const handleLogout = () => {
  userLogout();
  //메뉴 체인지
};

onMounted(async () => {});
</script>
