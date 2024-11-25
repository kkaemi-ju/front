<template>
  <!-- Footer -->
  <footer class="bg-[#00712D] text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">떠나GO</h3>
          <p class="text-sm text-[#D5ED9F]">당신의 특별한 여행 파트너</p>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">연락처</h4>
          <p class="text-sm">이메일: sunju701@gmail.com</p>
          <p class="text-sm">이메일: jaekyungha97@gmail.com</p>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">주소</h4>
          <p class="text-sm">경북 구미시 임수동</p>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">소셜 미디어</h4>
          <div class="flex gap-4"></div>
        </div>
      </div>
      <div class="mt-4 pt-4 border-t border-white/20 text-center text-sm">
        <p>
          &copy; {{ new Date().getFullYear() }} 떠나GO. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
