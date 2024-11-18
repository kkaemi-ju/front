<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <!-- Close button -->
      <button 
        @click="closeForm" 
        class="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
      >
        <XIcon class="w-5 h-5" />
      </button>

      <!-- Header -->
      <div class="flex items-center gap-2 mb-6">
        <MessageSquareIcon class="w-6 h-6 text-blue-400" />
        <h1 class="text-xl font-medium text-gray-800">회원가입</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">이름 :</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="하세경"
          />
        </div>

        <!-- ID -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">아이디 :</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="ssafyy"
          />
          <p v-if="form.username === 'ssafyy'" class="mt-1 text-sm text-yellow-500">
            ssafyy는 사용할 수 없습니다.
          </p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">비밀번호 :</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="••••"
          />
        </div>

        <!-- Password Confirmation -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">비밀번호확인 :</label>
          <input
            v-model="form.passwordConfirm"
            type="password"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="••••"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">이메일 :</label>
          <div class="flex items-center gap-2">
            <input
              v-model="form.emailPrefix"
              type="text"
              class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="jaekyungha"
            />
            <span class="text-gray-500">@</span>
            <select
              v-model="form.emailDomain"
              class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="gmail.com">gmail.com</option>
              <option value="naver.com">naver.com</option>
              <option value="daum.net">daum.net</option>
            </select>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-4 mt-6">
          <button
            type="submit"
            class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            확인
          </button>
          <button
            type="button"
            @click="closeForm"
            class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { XIcon, MessageSquareIcon } from 'lucide-vue-next'

const form = ref({
  name: '',
  username: '',
  password: '',
  passwordConfirm: '',
  emailPrefix: '',
  emailDomain: 'gmail.com'
})

const closeForm = () => {
  // Implement close functionality
  console.log('Close form clicked')
}

const handleSubmit = () => {
  // Implement form submission
  console.log('Form submitted:', {
    ...form.value,
    email: `${form.value.emailPrefix}@${form.value.emailDomain}`
  })
}
</script>