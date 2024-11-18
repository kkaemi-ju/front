<template>
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
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
        </nav>
        <div class="flex items-center gap-4">
          <router-link to="/login" class="text-sm font-medium text-[#00712D] hover:text-[#FF9100]">
            로그인
          </router-link>
          <router-link to="/signup">
            <button class="px-4 py-2 bg-[#00712D] hover:bg-[#00712D]/90 text-white rounded">회원가입</button>
          </router-link>
        </div>
      </div>
    </header>
</template>

<script setup>
import { ref, reactive } from 'vue'

const isLoggedIn = ref(false)
const showLoginModal = ref(false)
const loginForm = reactive({
  email: '',
  password: ''
})

const menuItems = [
  { name: '여행계획', path: '/plan' },
  { name: '관광지 조회', path: '/attractions' },
  { name: '게시판', path: '/board' },
  { name: '트립클립', path: '/tripclip' }
]

const handleLogin = async () => {
  // Simulate login API call
  try {
    // Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    isLoggedIn.value = true
    showLoginModal.value = false
    loginForm.email = ''
    loginForm.password = ''
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const handleLogout = () => {
  isLoggedIn.value = false
}
</script>
