<template>
  <div>
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b bg-[#FFFBE6]">
      <div
        class="container mx-auto flex h-16 items-center justify-between px-4"
      >
        <div class="flex items-center gap-6">
          <router-link to="/" class="text-2xl font-bold text-[#00712D]">
            TravelGo
          </router-link>
        </div>
        <!-- Navigation Menu (Centered) -->
        <nav class="hidden md:flex flex-1 justify-center items-center gap-8">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="text-sm font-medium text-[#00712D] hover:text-[#FF9100] transition-colors"
          >
            {{ item.name }}
          </router-link>
          <!-- 마이페이지 (로그인 상태에서만 표시) -->
          <router-link
            v-if="isLoggedIn"
            to="/Mypage"
            class="text-sm font-medium text-[#00712D] hover:text-[#FF9100] transition-colors"
          >
            마이페이지
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
    <JoinModal v-if="showJoinModal" @close="closeJoinModal" />
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import LoginModal from "../modal/Login.vue";
import JoinModal from "../modal/Join.vue";

const isLoggedIn = ref(true);
const showLoginModal = ref(false); // 모달 표시 상태
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
  { name: "여행계획", path: "/plan" },
  { name: "관광지 조회", path: "/attractions" },
  { name: "게시판", path: "/board" },
  { name: "트립클립", path: "/tripclip" },
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
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 로그인 API 호출 시뮬레이션
    isLoggedIn.value = true;
    showLoginModal.value = false;
    loginForm.email = "";
    loginForm.password = "";
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// 로그아웃 처리
const handleLogout = () => {
  isLoggedIn.value = false;
};
</script>
