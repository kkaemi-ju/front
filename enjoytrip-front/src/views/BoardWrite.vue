<template>
    <div class="min-h-screen bg-[#FFFBE6]/30 py-8">
      <div class="container mx-auto px-4 max-w-4xl">
        <!-- 헤더 -->
        <button class="mb-6 flex items-center text-[#00712D] hover:underline">
          <ChevronLeft class="w-5 h-5 mr-1" />
          목록으로 돌아가기
        </button>

        <!-- 글 작성 섹션 -->
        <section class="bg-white rounded-lg shadow-md p-6">
          <h1 class="text-3xl font-bold text-[#00712D] mb-6">게시글 작성</h1>
          <!-- 작성자 -->
          <div class="mb-6">
            <label for="author" class="block text-lg font-medium text-gray-800 mb-2">작성자</label>
            <input
              id="author"
              v-model="author"
              type="text"
              class="w-full p-4 border rounded-md bg-gray-100 text-black text-lg"
              readonly
            />
          </div>
          <!-- 제목 -->
          <div class="mb-6">
            <label for="title" class="block text-lg font-medium text-gray-800 mb-2">제목</label>
            <input
              id="title"
              v-model="title"
              type="text"
              class="w-full p-4 border rounded-md text-black text-lg focus:outline-none focus:ring-2 focus:ring-[#00712D]"
              placeholder="제목을 입력하세요"
            />
          </div>
          <!-- 글 내용 -->
          <div class="mb-6">
            <label for="content" class="block text-lg font-medium text-gray-800 mb-2">내용</label>
            <textarea
              id="content"
              v-model="content"
              rows="5"
              class="w-full p-4 border rounded-md text-black text-lg focus:outline-none focus:ring-2 focus:ring-[#00712D]"
              placeholder="내용을 입력하세요"
            ></textarea>
          </div>
          <!-- 사진 업로드 -->
          <div class="mb-6">
            <label class="block text-lg font-medium text-gray-800 mb-2">사진 업로드</label>
            <div class="flex items-center space-x-4">
              <input
                type="file"
                id="file"
                class="hidden"
                accept="image/*"
                multiple
                @change="handleFileUpload"
              />
              <label
                for="file"
                class="px-4 py-2 bg-[#00712D] text-white rounded-md cursor-pointer hover:bg-[#00712D]/90"
              >
                파일 선택
              </label>
            </div>
            <!-- 미리보기 이미지 -->
            <div v-if="uploadedImages.length" class="mt-4 flex space-x-4">
              <div
                v-for="(image, index) in uploadedImages"
                :key="index"
                class="relative"
              >
                <img
                  :src="image"
                  alt="미리보기"
                  class="w-24 h-24 object-cover rounded-md border cursor-pointer"
                  @click="openImageModal(image)"
                />
                <!-- 삭제 버튼 -->
                <button
                  @click="removeImage(index)"
                  class="absolute top-1 right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
          <!-- 제출 버튼 -->
          <div class="flex justify-end">
            <button
              @click="submitPost"
              class="px-6 py-3 bg-[#00712D] text-white text-lg rounded-md hover:bg-[#00712D]/90 transition-colors"
            >
              게시글 작성
            </button>
          </div>
        </section>
      </div>

      <!-- 이미지 모달 -->
      <div v-if="isImageModalOpen" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <img :src="selectedImage" alt="이미지 보기" class="max-w-full max-h-full rounded-md">
        <button
          class="absolute top-4 right-4 text-white text-xl"
          @click="closeImageModal"
        >
          ×
        </button>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue'
  import { ChevronLeft } from 'lucide-vue-next'

  const author = ref('현재사용자') // 로그인된 사용자 이름
  const title = ref('')
  const content = ref('')
  const uploadedImages = ref([]) // 여러 이미지를 저장
  const isImageModalOpen = ref(false)
  const selectedImage = ref(null)

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        uploadedImages.value.push(e.target.result)
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    uploadedImages.value.splice(index, 1)
  }

  const openImageModal = (image) => {
    selectedImage.value = image
    isImageModalOpen.value = true
  }

  const closeImageModal = () => {
    isImageModalOpen.value = false
    selectedImage.value = null
  }

  const submitPost = () => {
    if (!title.value.trim() || !content.value.trim()) {
      alert('제목과 내용을 입력해주세요!')
      return
    }
    alert('게시글이 작성되었습니다!')
  }
  </script>

  <style scoped>
  /* 스타일 추가 */
  </style>
