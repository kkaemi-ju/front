<template>
  <div class="min-h-screen bg-[#FFFBE6]/30">
    <!-- Board Categories -->
    <div class="w-full border-b mt-8">
      <div class="container mx-auto flex justify-center">
        <div
          class="inline-flex w-full max-w-4xl justify-around border-b border-gray-300"
        >
          <button
            v-for="board in boards"
            :key="board.id"
            @click="setActiveBoard(board.name)"
            :class="[
              'flex-1 text-center py-2 text-sm font-medium transition-colors',
              activeBoard === board.name
                ? 'text-white bg-[#00712D] hover:bg-[#00712D]/90'
                : 'text-gray-600 hover:text-[#00712D] bg-white hover:bg-[#D5ED9F]/30',
            ]"
          >
            {{ board.name }}
          </button>
        </div>
      </div>
    </div>

    <!--Board Title Section -->
    <div class="container mx-auto py-3 px-4">
      <div class="flex justify-between items-center mb-1">
        <h1 class="text-2xl font-bold text-[#00712D]" style="margin-top: 2rem">
          {{ activeBoardName }}
        </h1>
      </div>
    </div>

    <!-- Board Content -->
    <div class="container mx-auto py-6 px-4">
      <!-- Board Header -->
      <div class="flex justify-between items-center mb-6">
        <!-- Search Section -->
        <div class="flex items-center space-x-4">
          <select
            v-model="selectedFilter"
            class="p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#00712D]"
          >
            <option value="title">제목</option>
            <option value="author">작성자</option>
            <option value="content">내용</option>
          </select>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="검색어를 입력하세요"
            class="p-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#00712D]"
          />
          <button
            @click="searchPosts"
            class="px-4 py-2 bg-[#00712D] text-white rounded-md hover:bg-[#00712D]/90 transition-colors"
          >
            검색
          </button>
        </div>

        <!-- 글쓰기 버튼 -->
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
              v-for="post in paginatedPosts"
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
    <!-- Pagination Section -->
    <div class="flex justify-center mt-6">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 mx-1 text-white bg-[#00712D] rounded-md hover:bg-[#00712D]/90"
      >
        이전
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="[
          'px-4 py-2 mx-1 rounded-md',
          page === currentPage
            ? 'bg-[#D5ED9F]/30 text-[#00712D]'
            : 'text-gray-600 bg-white hover:bg-[#D5ED9F]/30',
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 mx-1 text-white bg-[#00712D] rounded-md hover:bg-[#00712D]/90"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const boards = [
  { id: "1", name: "자유게시판" },
  { id: "2", name: "핫플게시판" },
  { id: "3", name: "공지사항" },
];

const selectedFilter = ref("title"); // 검색 필터
const searchQuery = ref(""); // 검색어
const activeBoard = ref(""); // 활성 게시판 ID 설정
const posts = ref([]); // 게시글 데이터
const currentPage = ref(1); // 현재 페이지 번호
const postsPerPage = 15; // 페이지당 게시글 개수

const goToPage = (page, data = null) => {
  if (page === "boardwrite") {
    // 글쓰기 넘어갈 때
    router.push({ name: page, query: { boardId: activeBoard.value } }); // 현재 선택된 게시판 ID를 query로 전달
  } else if (data) {
    // 상세보기 넘어갈 때
    router.push({
      name: page,
      query: { boardId: activeBoard.value },
      params: { id: data },
    }); // 게시글 ID를 params로 전달
  } else {
    router.push({ name: page });
  }
};

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage;
  const end = start + postsPerPage;
  return posts.value.slice(start, end); // 현재 페이지에 해당하는 데이터만 반환
});

const totalPages = computed(() => {
  return Math.ceil(posts.value.length / postsPerPage); // 총 페이지 수 계산
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page; // 페이지 번호 업데이트
  }
};

const searchPosts = async () => {
  console.log("검색 필터:", selectedFilter.value);
  console.log("검색어:", searchQuery.value);
  await getBoard();
};

// 활성화된 게시판의 이름을 계산
const activeBoardName = computed(() => {
  const board = boards.find((b) => b.id === activeBoard.value);
  return board ? board.name : "게시판";
});

// 게시판 변경 시 실행
const setActiveBoard = async (boardName) => {
  const board = boards.find((b) => b.name === boardName);
  if (board) {
    activeBoard.value = board.id; // 활성 게시판 ID 업데이트
    router.push({ query: { boardId: activeBoard.value } }); // URL 쿼리에 boardId 추가
    await getBoard(); // 게시판 데이터 가져오기
  }
};

// 서버로 요청을 보내 게시글 데이터를 가져오는 함수
const getBoard = async () => {
  try {
    const boardId = activeBoard.value || route.query.boardId || "1";
    activeBoard.value = boardId;

    const endpoint = `/board/load/${boardId}`;
    console.log("endpoint:", endpoint);

    const response = await axios.get(`http://localhost${endpoint}`, {
      params: {
        key: selectedFilter.value,
        word: searchQuery.value,
        pgno: currentPage.value, // 현재 페이지 전달
      },
    });

    if (response.status === 200) {
      console.log("게시글 데이터 가져오기 성공:", response.data.articles);
      posts.value = response.data.articles.map((article, index) => ({
        id: article.boardId,
        title: article.title,
        author: article.userId,
        date: article.createdAt,
        views: article.view,
        isNew: index < 3,
      }));
      currentPage.value = 1; // 새 데이터 로드 시 페이지 초기화
    } else {
      console.error("게시글 데이터 가져오기 실패:", response.statusText);
    }
  } catch (error) {
    console.error("서버 요청 중 오류 발생:", error.message);
  }
};

onMounted(() => {
  const boardId = route.query.boardId || "1"; // 쿼리에서 boardId 가져오기, 없으면 기본값 1

  activeBoard.value = boardId; // 활성 게시판 설정
  getBoard(); // 기본 게시판 데이터
});
</script>
<style scoped>
.menu-wrapper {
  margin-top: 1rem;
}
</style>
