<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4 text-green-700">로그인</h2>
      <form @submit.prevent="login">
        <!-- 기본 동작 방지 -->
        <div class="mb-4">
          <label for="userid" class="block text-sm font-medium text-gray-700"
            >아이디</label
          >
          <input
            type="text"
            id="userid"
            required
            v-model="loginUser.userId"
            class="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF9100] focus:ring focus:ring-[#FF9100] focus:ring-opacity-50"
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >비밀번호</label
          >
          <input
            type="password"
            id="password"
            v-model="loginUser.userPwd"
            required
            class="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF9100] focus:ring focus:ring-[#FF9100] focus:ring-opacity-50"
          />
        </div>
        <div class="flex items-center mb-4">
          <!-- 귀여운 토글 스위치 -->
          <input
            type="checkbox"
            id="rememberId"
            v-model="rememberId"
            class="hidden"
          />
          <label
            for="rememberId"
            class="toggle-switch cursor-pointer relative inline-block w-12 h-6"
          >
            <span class="slider"></span>
          </label>
          <span class="ml-2 text-sm text-gray-700">아이디 저장</span>
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="px-4 py-2 bg-[#00712D] hover:bg-[#FF9100]/90 text-white rounded"
          >
            로그인
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { userLogin, getUserInfo } = userStore;
const loginUser = ref({
  userId: "",
  userPwd: "",
});
const rememberId = ref(false); // 아이디 저장 여부 상태

// 로그인 로직
const login = async () => {
  await userLogin(loginUser.value);
  let token = sessionStorage.getItem("accessToken");
  console.log(token);
  console.log("isLogin: " + isLoggedIn.value);

  if (isLoggedIn.value) {
    await getUserInfo(token);

    // 아이디 저장 로직
    if (rememberId.value) {
      localStorage.setItem("savedUserId", loginUser.value.userId);
    } else {
      localStorage.removeItem("savedUserId");
    }
  }
};

// 페이지 로드 시 저장된 아이디 불러오기
onMounted(() => {
  console.log("페이지 로드 완료");
  const savedUserId = localStorage.getItem("savedUserId");
  if (savedUserId) {
    loginUser.value.userId = savedUserId; // 저장된 아이디 불러오기
    rememberId.value = true; // 저장 상태 체크
  }
});
</script>

<style scoped>
/* 토글 스위치 스타일 */
.toggle-switch {
  background-color: #ddd;
  border-radius: 20px;
  position: relative;
  transition: background-color 0.3s ease;
}
.toggle-switch .slider {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
input:checked + .toggle-switch {
  background-color: #ff9100;
}
input:checked + .toggle-switch .slider {
  transform: translateX(24px);
}
</style>
