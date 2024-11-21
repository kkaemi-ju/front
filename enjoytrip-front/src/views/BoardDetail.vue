<template>
  <div v-if="article" class="min-h-screen bg-[#FFFBE6]/30 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <button
        class="mb-4 flex items-center text-[#00712D] hover:underline"
        @click="goBackToBoard"
      >
        <ChevronLeft class="w-5 h-5 mr-1" />
        목록으로 돌아가기
      </button>

      <article class="bg-white rounded-lg shadow-md p-6 mb-8">
        <!-- 제목 -->
        <h1 class="text-3xl font-bold text-[#00712D] mb-4">
          {{ article.title }}
        </h1>
        <!-- 작성자, 날짜, 조회수 -->
        <div class="flex items-center text-sm text-gray-800 mb-6">
          <span class="mr-4 text-1xl">작성자: {{ article.userId }}</span>
          <span class="mr-4">{{ article.createdAt }}</span>
          <span>조회수: {{ article.view }}</span>
        </div>
        <!-- 본문 내용 -->
        <div class="prose max-w-none mb-6 text-black text-2xl">
          <p class="whitespace-pre-line">{{ article.content }}</p>
        </div>
        <!-- 이미지 -->
        <div v-if="article.imageUrls && article.imageUrls.length" class="image-container">
  <img
    v-for="(imageUrl, index) in article.imageUrls"
    :key="index"
    :src="imageUrl"
    alt="게시글 이미지"
    class="w-full rounded-lg mb-4"
  />
</div>
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
          <li
            v-for="comment in comments"
            :key="comment.id"
            class="border-b pb-4 last:border-b-0"
          >
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
  <div v-else>
    <p>로딩 중...</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ChevronLeft, MessageSquare, ThumbsUp } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();

const comments = ref([
  {
    id: 1,
    author: "여행마니아",
    date: "2023-12-21",
    content: "정말 좋은 후기네요! 저도 꼭 가보고 싶어요.",
  },
  {
    id: 2,
    author: "맛집탐험가",
    date: "2023-12-22",
    content: "제주도 맛집 추천 좀 해주세요!",
  },
]);

const newComment = ref("");
const article = ref({
  imageUrls: [] // 초기값 설정
});

const addComment = () => {
  if (newComment.value.trim()) {
    comments.value.push({
      id: comments.value.length + 1,
      author: "현재사용자",
      date: new Date().toISOString().split("T")[0],
      content: newComment.value.trim(),
    });
    newComment.value = "";
  }
};

const goBackToBoard = () => {
  router.push({ path: "/board", query: { boardId: route.query.boardId } });
};

// 게시글 받아옴
const getArticle = async () => {
  try {
    const boardId = route.params.id;

    // 게시글 데이터 가져오기
    const response = await axios.get(`http://localhost/board/${boardId}`);
    article.value = response.data;

    if (response.status === 200) {
      console.log("게시글 데이터 가져오기 성공:", response.data);
    } else {
      console.error("게시글 못 불러옴:", response.statusText);
    }

    // 파일 데이터 가져오기
    fetchImages();
  } catch (error) {
    if (error.response) {
      console.error("서버 응답 오류:", error.response.data);
    } else {
      console.error("네트워크 오류 발생:", error.message);
    }
  }
};

const fetchImages = async () => {
  try {
    const boardId = route.params.id;

    // 이미지 파일 목록 가져오기
    const fileResponse = await axios.get(
      `http://localhost/board/loadfile/${boardId}`
    );

    if (fileResponse.status === 200) {
      // API에서 반환된 로컬 경로를 브라우저에서 접근 가능한 URL로 변환
      article.value.imageUrls = fileResponse.data.map((filePath) => {
        // 파일명 추출
        const fileName = filePath.split("/").pop();
        // 서빙 가능한 URL로 변환
        return `http://localhost/board/file/${boardId}/${fileName}`;
      });

      console.log("이미지 경로 로드 성공:", article.value.imageUrls);
    } else {
      console.error("이미지 경로 로드 실패:", fileResponse.statusText);
    }
  } catch (error) {
    console.error("이미지 로드 중 오류 발생", error.message);
  }
};

onMounted(() => {
  getArticle();
});
</script>

<style scoped>
/* 필요한 경우 추가적인 스타일 */
</style>
