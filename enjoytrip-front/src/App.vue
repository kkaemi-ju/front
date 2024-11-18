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

<style></style>
