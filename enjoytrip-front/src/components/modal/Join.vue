<template>
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-lg w-96 p-6">
      <h2 class="text-xl font-bold mb-4 text-[#00712D]">회원가입</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-[#00712D]">아이디</label>
          <input 
            v-model="joinForm.id" 
            type="text" 
            placeholder="아이디 입력" 
            class="w-full border rounded px-3 py-2"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-[#00712D]">비밀번호</label>
          <input 
            v-model="joinForm.password" 
            type="password" 
            placeholder="비밀번호 입력" 
            class="w-full border rounded px-3 py-2"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-[#00712D]">이름</label>
          <input 
            v-model="joinForm.name" 
            type="text" 
            placeholder="이름 입력" 
            class="w-full border rounded px-3 py-2"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-[#00712D]">이메일</label>
          <input 
            v-model="joinForm.email" 
            type="email" 
            placeholder="이메일 입력" 
            class="w-full border rounded px-3 py-2"
          />
        </div>
        <div class="flex justify-end gap-4">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 bg-gray-200 text-black hover:bg-gray-300 rounded"
          >
            취소
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 bg-[#00712D] text-white hover:bg-[#FF9100] rounded"
          >
            가입하기
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const joinForm = ref({
  id: '',
  password: '',
  name: '',
  email: ''
})

const handleSubmit = () => {
  console.log('회원가입 데이터:', joinForm.value)
  joinForm.value = {
    id: '',
    password: '',
    name: '',
    email: ''
  }
}
</script>