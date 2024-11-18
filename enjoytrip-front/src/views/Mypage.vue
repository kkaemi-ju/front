<template>
  <div class="max-w-2xl mx-auto p-6">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Name Field -->
      <div class="space-y-2">
        <label class="block text-gray-700 text-sm font-medium">이름</label>
        <input
          type="text"
          v-model="form.name"
          placeholder="이름"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <!-- ID Field -->
      <div class="space-y-2">
        <label class="block text-gray-700 text-sm font-medium">아이디</label>
        <input
          type="text"
          v-model="form.id"
          placeholder="아이디"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <!-- Password Field -->
      <div class="space-y-2">
        <label class="block text-gray-700 text-sm font-medium">패스워드</label>
        <input
          type="password"
          v-model="form.password"
          placeholder="••••"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <!-- Password Change Button -->
      <button
        type="button"
        class="text-white bg-[#00712D] hover:bg-[#FF9100] px-6 py-2 rounded-full text-sm transition-colors duration-200"
      >
        패스워드 변경
      </button>

      <!-- Email Field -->
      <div class="space-y-2">
        <label class="block text-gray-700 text-sm font-medium">이메일</label>
        <input
          type="email"
          v-model="form.email"
          placeholder="이메일"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          @click="handleDelete"
          class="px-6 py-2 text-gray-700 rounded-lg border border-gray-500 hover:bg-gray-100 transition-colors duration-200"
        >
          삭제
        </button>
        <button
          type="submit"
          class="px-6 py-2 text-white rounded-lg transition-colors duration-200"
          :style="{
            backgroundColor: '#00712D',
            ':hover': {
              backgroundColor: '#FF9100',
            },
          }"
        >
          수정
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  name: "",
  id: "",
  password: "",
  email: "",
  region1: "",
  region2: "",
});

const handleSubmit = () => {
  console.log("Form submitted:", form.value);
};

const handleDelete = () => {
  console.log("Delete clicked");
};
</script>

<style scoped>
button[type="submit"]:hover {
  background-color: #ff9100 !important;
}

input:focus {
  outline: none;
}
</style>
