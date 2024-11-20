<template>
  <div>
    <Header />

    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import Header from "./components/common/Header.vue";
import Footer from "./components/common/Footer.vue";
</script>

<style>
/* Scoped 스타일에 추가하지 말고, 글로벌 스타일로 설정 */
input {
  color: black; /* 모든 input의 텍스트 색상을 검정으로 설정 */
}
</style>
