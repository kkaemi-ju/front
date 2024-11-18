<template>
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <div class="flex items-center gap-6">
          <router-link to="/" class="text-2xl font-bold text-[#00712D]">
            TravelGo
          </router-link>
        </div>
        <div class="flex items-center gap-4">
          <router-link to="/login" class="text-sm font-medium hover:text-[#00712D]">
            로그인
          </router-link>
          <router-link to="/signup">
            <button class="px-4 py-2 bg-[#00712D] hover:bg-[#00712D]/90 text-white rounded">회원가입</button>
          </router-link>
          <button class="md:hidden p-2">
            <Menu class="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
</template>