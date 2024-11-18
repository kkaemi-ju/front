<template>
    <div class="min-h-screen bg-[#FFFBE6]/30 py-8">
      <div class="container mx-auto px-4 max-w-4xl">
        <button class="mb-4 flex items-center text-[#00712D] hover:underline">
          <ChevronLeft class="w-5 h-5 mr-1" />
          목록으로 돌아가기
        </button>

        <article class="bg-white rounded-lg shadow-md p-6 mb-8">
          <!-- 제목 -->
          <h1 class="text-3xl font-bold text-[#00712D] mb-4">{{ post.title }}</h1>
          <!-- 작성자, 날짜, 조회수 -->
          <div class="flex items-center text-sm text-gray-800 mb-6">
            <span class="mr-4">작성자: {{ post.author }}</span>
            <span class="mr-4">{{ post.date }}</span>
            <span>조회수: {{ post.views }}</span>
          </div>
          <!-- 본문 내용 -->
          <div class="prose max-w-none mb-6 text-black">
            <p class="whitespace-pre-line">{{ post.content }}</p>
          </div>
          <!-- 이미지 -->
          <img :src="post.image" :alt="post.title" class="w-full rounded-lg mb-6">
          <!-- 추천 및 댓글 버튼 -->
          <div class="flex items-center justify-end space-x-4">
            <button class="flex items-center text-gray-800 hover:text-[#00712D]">
              <ThumbsUp class="w-5 h-5 mr-1" />
              추천
            </button>
            <button class="flex items-center text-gray-800 hover:text-[#00712D]">
              <MessageSquare class="w-5 h-5 mr-1" />
              댓글
            </button>
          </div>
        </article>

        <!-- 댓글 섹션 -->
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-[#00712D] mb-4">댓글</h2>
          <ul class="space-y-4 mb-6">
            <li v-for="comment in comments" :key="comment.id" class="border-b pb-4 last:border-b-0">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-black">{{ comment.author }}</span>
                <span class="text-sm text-gray-800">{{ comment.date }}</span>
              </div>
              <p class="text-black">{{ comment.content }}</p>
            </li>
          </ul>
          <!-- 댓글 입력 -->
          <form @submit.prevent="addComment" class="flex items-start space-x-4">
            <textarea
              v-model="newComment"
              rows="3"
              class="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00712D]"
              placeholder="댓글을 입력하세요..."
            ></textarea>
            <button
              type="submit"
              class="px-4 py-2 bg-[#00712D] text-white rounded-md hover:bg-[#00712D]/90 transition-colors"
            >
              댓글 작성
            </button>
          </form>
        </section>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue'
  import { ChevronLeft, MessageSquare, ThumbsUp } from 'lucide-vue-next'

  const post = ref({
    id: 1,
    title: '제주도 여행 후기: 아름다운 섬에서의 5일간의 모험',
    author: '제주러버',
    date: '2023-12-20',
    views: 1234,
    content: `제주도에서 보낸 5일간의 여행은 정말 잊을 수 없는 경험이었습니다.
    푸른 바다, 오름, 그리고 맛있는 음식들... 제주의 모든 것이 아름다웠습니다.

    첫째 날, 우리는 성산일출봉을 올랐습니다. 정상에서 바라본 일출은 그야말로 장관이었죠.
    둘째 날에는 우도로 향했습니다. 우도의 하얀 모래해변과 에메랄드빛 바다는 정말 환상적이었어요.

    제주 여행을 계획하고 계신 분들께 꼭 추천드리고 싶습니다!`,
    image: '/placeholder.svg?height=400&width=600'
  })

  const comments = ref([
    { id: 1, author: '여행마니아', date: '2023-12-21', content: '정말 좋은 후기네요! 저도 꼭 가보고 싶어요.' },
    { id: 2, author: '맛집탐험가', date: '2023-12-22', content: '제주도 맛집 추천 좀 해주세요!' }
  ])

  const newComment = ref('')

  const addComment = () => {
    if (newComment.value.trim()) {
      comments.value.push({
        id: comments.value.length + 1,
        author: '현재사용자',
        date: new Date().toISOString().split('T')[0],
        content: newComment.value.trim()
      })
      newComment.value = ''
    }
  }
  </script>

  <style scoped>
  /* 필요한 경우 추가적인 스타일 */
  </style>
