<template>
    <div class="min-h-screen bg-[#FFFBE6]/30">
      <!-- Board Categories -->
      <div class="w-full border-b mt-8">
        <div class="container mx-auto flex justify-center">
          <div class="inline-flex w-full max-w-4xl justify-around border-b border-gray-300">
            <button
              v-for="board in boards"
              :key="board.id"
              @click="setActiveBoard(board.name)"
              :class="[
                'flex-1 text-center py-2 text-sm font-medium transition-colors',
                activeBoard === board.name
                  ? 'text-white bg-[#00712D] hover:bg-[#00712D]/90'
                  : 'text-gray-600 hover:text-[#00712D] bg-white hover:bg-[#D5ED9F]/30'
              ]"
            >
              {{ board.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Board Content -->
      <div class="container mx-auto py-6 px-4">
        <!-- Board Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-[#00712D]">{{ activeBoard }}</h1>
          <button
            @click="goToPage('boardwrite')"
            class="px-4 py-2 bg-[#00712D] text-white rounded-md hover:bg-[#00712D]/90 transition-colors"
          >
            글쓰기
          </button>
        </div>

        <!-- Board Table -->
        <div class="overflow-x-auto bg-white rounded-lg shadow">
          <table class="min-w-full">
            <thead>
              <tr class="bg-[#D5ED9F]/30 text-[#00712D]">
                <th class="px-6 py-3 text-left text-sm font-medium">No</th>
                <th class="px-6 py-3 text-left text-sm font-medium">제목</th>
                <th class="px-6 py-3 text-left text-sm font-medium">글쓴이</th>
                <th class="px-6 py-3 text-left text-sm font-medium">작성시간</th>
                <th class="px-6 py-3 text-left text-sm font-medium">조회수</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="post in posts"
                :key="post.id"
                @click="goToPage('boarddetail', post.id)"
                class="hover:bg-[#FFFBE6]/50 transition-colors"

              >
                <td class="px-6 py-4 text-sm text-gray-600">{{ post.id }}</td>
                <td class="px-6 py-4">
                  <a href="#" class="text-gray-900 hover:text-[#00712D]">
                    {{ post.title }}
                  </a>
                  <span
                    v-if="post.isNew"
                    class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FF9100] text-white"
                  >
                    New
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ post.author }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ post.date }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ post.views }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center mt-6 gap-2 items-center">
          <button
            class="p-2 rounded-full hover:bg-[#D5ED9F]/30 text-[#00712D]"
            @click="changePage(Math.max(1, currentPage - 1))"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 rounded-md text-sm',
              currentPage === page
                ? 'bg-[#00712D] text-white'
                : 'bg-white text-gray-600 hover:bg-[#D5ED9F]/30'
            ]"
          >
            {{ page }}
          </button>
          <button
            class="p-2 rounded-full hover:bg-[#D5ED9F]/30 text-[#00712D]"
            @click="changePage(Math.min(totalPages, currentPage + 1))"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router' // Vue Router 사용
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const router = useRouter() // Router 인스턴스 생성

const activeBoard = ref('자유게시판')

const boards = [
  { id: 'free', name: '자유게시판' },
  { id: 'hot', name: '핫플게시판' },
  { id: 'notice', name: '공지사항' }
]

const posts = ref([...Array(5)].map((_, index) => ({
  id: 10 - index,
  title: '여행 후기입니다',
  author: '사용자',
  date: '2023-12-17',
  views: 0,
  isNew: index < 2
})))

const currentPage = ref(1)
const totalPages = 5

const setActiveBoard = (boardName) => {
  activeBoard.value = boardName
}

const changePage = (page) => {
  currentPage.value = page
}

// 페이지 이동 함수
const goToPage = (page, data = null) => {
  if (data) {
    // 데이터가 있을 경우 params를 사용하여 전달
    router.push({ name: page, params: { id: data } })
  } else {
    // 데이터가 없을 경우 단순 이동
    router.push({ name: page })
  }
}
const fetchPosts = async () => {
  try {
    const response = await axios.get('http://localhost/api/posts')
    // posts.value = response.data.posts // 서버에서 가져온 데이터를 posts에 저장
    console.log(response.data)
  } catch (error) {
    console.error('게시글 데이터를 가져오는 데 실패했습니다:', error)
  }
}
onMounted(() => {
    fetchPosts();
})
</script>

  <style scoped>
  .menu-wrapper {
    margin-top: 1rem; /* 메뉴 위 여백 */
  }
  </style>
