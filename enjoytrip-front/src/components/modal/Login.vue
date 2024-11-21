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
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF9100] focus:ring focus:ring-[#FF9100] focus:ring-opacity-50"
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
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF9100] focus:ring focus:ring-[#FF9100] focus:ring-opacity-50"
          />
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
import router from "@/router";

const userStore = useUserStore();
const {isLoggedIn} = storeToRefs(userStore)
const { userLogin, getUserInfo } = userStore;
const loginUser = ref({
  userId: "",
  userPwd: "",
});
const email = ref("");
const password = ref("");
const login = async () => {
  await userLogin(loginUser.value);
  let token = sessionStorage.getItem("accessToken")
  console.log(token)
  console.log("isLogin: "+isLoggedIn.value)
  if(isLoggedIn.value){
    await getUserInfo(token)
    //changemenu

  }
};

onMounted(() => {
  console.log("페이지 로드 완료");
});
</script>
<style>
/* Scoped 스타일에 추가하지 말고, 글로벌 스타일로 설정 */
input {
  color: black; /* 모든 input의 텍스트 색상을 검정으로 설정 */
}
</style>