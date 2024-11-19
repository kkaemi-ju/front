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

      <!-- Search Section -->
      <div class="container mx-auto py-6 px-4">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold text-[#00712D]">{{ activeBoard }}</h1>
          <!-- 검색 필터 -->
          <div class="flex space-x-4 items-center ml-auto">
            <select
              v-model="selectedFilter"
              class="p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#00712D]"
            >
              <option value="title">제목</option>
              <option value="author">작성자</option>
              <option value="content">내용</option>
            </select>
            <!-- 검색 입력 -->
            <input
              v-model="searchQuery"
              type="text"
              placeholder="검색어를 입력하세요"
              class="p-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#00712D]"
            />
            <!-- 검색 버튼 -->
            <button
              @click="searchPosts"
              class="px-4 py-2 bg-[#00712D] text-white rounded-md hover:bg-[#00712D]/90 transition-colors"
            >
              검색
            </button>
          </div>
        </div>
      </div>

      <!-- Board Content -->
      <div class="container mx-auto py-6 px-4">
        <!-- Board Header -->
        <div class="flex justify-between items-center mb-6">
          <button
            @click="goToPage('boardwrite')"
            class="ml-auto px-4 py-2 bg-[#00712D] text-white rounded-md hover:bg-[#00712D]/90 transition-colors"
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
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'

  const router = useRouter()

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

  const selectedFilter = ref('title') // 검색 필터
  const searchQuery = ref('') // 검색어

  const setActiveBoard = (boardName) => {
    activeBoard.value = boardName
  }

  const goToPage = (page, data = null) => {
    if (data) {
      router.push({ name: page, params: { id: data } })
    } else {
      router.push({ name: page })
    }
  }

  const searchPosts = () => {
    console.log('검색 필터:', selectedFilter.value)
    console.log('검색어:', searchQuery.value)
  }

  onMounted(() => {
    console.log('페이지 로드 완료')
  })
  </script>

  <style scoped>
  .menu-wrapper {
    margin-top: 1rem;
  }
  </style>
