<template>
  <div v-if="isReady">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import Header from "./components/common/Header.vue";
import Footer from "./components/common/Footer.vue";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const { getUserInfo } = userStore;

const isReady = ref(false); // 데이터 로딩 상태

onBeforeMount(async () => {
  let token = sessionStorage.getItem("accessToken");
  if (token) {
    await getUserInfo(token); // 사용자 정보 로드
  }
  isReady.value = true; // 데이터 로딩 완료 후 렌더링
});
</script>
