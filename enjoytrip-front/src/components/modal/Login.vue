<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4 text-green-700">로그인</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="userid" class="block text-sm font-medium text-gray-700">아이디</label>
            <input type="text" id="userid" v-model="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF9100] focus:ring focus:ring-[#FF9100] focus:ring-opacity-50">
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">비밀번호</label>
            <input type="password" id="password" v-model="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF9100] focus:ring focus:ring-[#FF9100] focus:ring-opacity-50">
          </div>
          <div class="flex items-center justify-between">
            <button type="submit" class="px-4 py-2 bg-[#00712D] hover:bg-[#FF9100]/90 text-white rounded">
              로그인
            </button>
            <button @click="$emit('close')" class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const email = ref('')
  const password = ref('')
  
  const handleLogin = () => {
    console.log('Login attempted with:', email.value, password.value)
    emit('close')
  }
  </script>