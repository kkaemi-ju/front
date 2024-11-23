<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
    <p>로딩 중...</p>
  </div>
  <div v-else-if="article" class="min-h-screen bg-[#FFFBE6]/30 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <button
        class="mb-4 flex items-center text-[#00712D] hover:underline"
        @click="goBackToBoard"
      >
        <ChevronLeft class="w-5 h-5 mr-1" />
        목록으로 돌아가기
      </button>

      <article class="bg-white rounded-lg shadow-md p-6 mb-8">
        <!-- 제목과 햄버거 버튼 -->
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-3xl font-bold text-[#00712D]">
            {{ article.title }}
          </h1>
          <div class="relative" v-if="article.userId === userInfo.userId">
            <!-- 햄버거 버튼 -->
            <button
              @click="toggleMenu"
              class="flex flex-col justify-center items-center w-6 h-6 focus:outline-none"
            >
              <span
                class="block w-4 h-0.5 bg-black mb-0.5 transition-transform"
                :class="{ 'rotate-45 translate-y-1': menuOpen }"
              ></span>
              <span
                class="block w-4 h-0.5 bg-black mb-0.5 transition-opacity"
                :class="{ 'opacity-0': menuOpen }"
              ></span>
              <span
                class="block w-4 h-0.5 bg-black transition-transform"
                :class="{ '-rotate-45 -translate-y-1': menuOpen }"
              ></span>
            </button>

            <!-- 메뉴 -->
            <div
              v-if="menuOpen"
              class="absolute top-8 right-0 bg-white shadow-md rounded-md border w-32"
            >
              <button
                @click="modifyArticle"
                class="block px-4 py-2 text-left text-black hover:bg-gray-100 transition-colors w-full"
              >
                수정
              </button>
              <button
                @click="deleteArticle"
                class="block px-4 py-2 text-left text-black hover:bg-gray-100 transition-colors w-full"
              >
                삭제
              </button>
            </div>
          </div>
        </div>

        <!-- 작성자, 날짜, 조회수 -->
        <div class="flex items-center text-sm text-gray-800 mb-6">
          <span class="mr-4 text-1xl">작성자: {{ article.userId }}</span>
          <span class="mr-4">{{ article.createdAt }}</span>
          <span>조회수: {{ article.view }}</span>
        </div>
        <!-- 본문 내용 -->
        <div class="prose max-w-none mb-6 text-black text-1xl">
          <p class="whitespace-pre-line">{{ article.content }}</p>
        </div>
        <!-- 이미지 -->
        <div
          v-if="article.imageUrls && article.imageUrls.length"
          class="image-container"
        >
          <img
            v-for="(imageUrl, index) in article.imageUrls"
            :key="index"
            :src="imageUrl"
            alt="게시글 이미지"
            class="w-1/2 rounded-lg mb-4"
          />
        </div>
        <!-- 지도 -->
        <div class="mb-8" v-if="boardType === '2' && article">
          <div
            ref="mapContainer"
            id="mapContainer"
            class="w-full h-[500px] bg-gray-200 rounded-lg"
          ></div>
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
        <h2 class="text-2xl font-bold text-[#00712D] mb-4">댓글</h2>
        <ul class="space-y-4 mb-6">
          <li
            v-for="comment in comments"
            :key="comment.commentId"
            class="border-b pb-4 last:border-b-0"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-black font-bold">{{ comment.userId }}</span>
              <div class="flex flex-col items-end">
                <span class="text-sm text-gray-800">{{
                  comment.createdAt
                }}</span>
                <button
                  @click="deleteComment(comment.commentId)"
                  class="text-[#00712D] text-sm hover:underline hover:text-[#FF9100] mt-1"
                  v-if="comment.userId === userInfo.userId"
                >
                  X
                </button>
              </div>
            </div>
            <p class="text-black">{{ comment.content }}</p>
          </li>
        </ul>
        <!-- 댓글 입력 -->
        <form @submit.prevent="addComment" class="flex items-start space-x-4">
          <textarea
            v-model="newComment"
            rows="3"
            class="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00712D] text-black"
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
import { onMounted, ref, nextTick, watch } from "vue";
import { ChevronLeft, MessageSquare, ThumbsUp } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import axios from "axios";

const { userInfo } = useUserStore(); // 현재 사용자
const router = useRouter();
const route = useRoute();
const boardType = ref("");
const boardId = ref("");
const menuOpen = ref(false);
const isLoading = ref(true); // 로딩 상태 확인
const markerImageSrc =
  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; // 마커 이미지 URL

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
const comments = ref([]);

const newComment = ref("");
const article = ref({
  imageUrls: [], // 초기값 설정
});

const map = ref(null);
const mapContainer = ref(null);
let geocoder = null; // 전역 변수로 선언

//지도 관련
const initMap = async () => {
  // Geocoder 객체 초기화
  geocoder = new kakao.maps.services.Geocoder();
  if (!mapContainer.value || map.value) return;

  const options = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567),
    level: 2,
  };

  map.value = new kakao.maps.Map(mapContainer.value, options);
};

// 받아온 attractionUrl로 마커 표시

// 마커 추가 함수
const addMarker = (address, attractionName) => {
  if (!map.value || !geocoder) {
    console.error("Map or geocoder is not initialized.");
    return;
  }

  // 주소를 좌표로 변환
  geocoder.addressSearch(address, (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      // 마커 생성

      map.value.setLevel(map.value.getLevel() - 1);
      const imageSize = new kakao.maps.Size(24, 35);
      const markerImage = new kakao.maps.MarkerImage(markerImageSrc, imageSize);
      const marker = new kakao.maps.Marker({
        map: map.value,
        position: coords,
        image: markerImage,
      });

      // 인포윈도우 생성
      const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="width:150px;text-align:center;padding:6px 0; color: black;">${address} <br> ${attractionName}</div>`,
      });
      infowindow.open(map.value, marker);

      // 지도 중심 이동
      map.value.setCenter(coords);
      // 지도 확대
      map.value.setLevel(2);
      console.log("Marker added and map centered:", coords);
    } else {
      console.error("Failed to convert address to coordinates:", status);
    }
  });
};

// 게시글 수정
const modifyArticle = () => {
  router.push({
    path: "/boardwrite",
    query: {
      modify: "true",
      boardId: route.params.id,
      boardType: boardType.value,
    }, // 수정모드, 게시글 id, 게시판 타입 전송
  });
};

const deleteArticle = async () => {
  const confirmResult = confirm("정말로 삭제하시겠습니까?");
  if (confirmResult) {
    const response = await axios.delete(
      `http://localhost/board/${boardId.value}`
    );
    if (response.status === 200) {
      alert("삭제되었습니다!");
      goBackToBoard();
    } else {
      console.error("삭제실패");
    }
  }
};

const addComment = async () => {
  if (newComment.value.trim()) {
    const postData = {
      userId: userInfo.userId,
      content: newComment.value.trim(),
      boardId: boardId.value,
    };

    const response = await axios.post(
      `http://localhost/board/comment`,
      postData
    );

    if (response.status === 201) {
      getComments();
    } else {
      console.error("error 발생", error.message);
    }

    // 초기화
    newComment.value = "";
  }
};

const goBackToBoard = () => {
  router.push({ path: "/board", query: { boardId: route.query.boardType } });
};

// 게시글 받아옴
const getArticle = async () => {
  try {
    // 게시글 데이터 가져오기
    const response = await axios.get(`http://localhost/board/${boardId.value}`);
    article.value = response.data;
    console.log("article : " + article.value);
    if (boardType.value === "2" && article.value.attractionUrl) {
      await nextTick();
      await initMap();
      addMarker(article.value.attractionUrl, article.value.attractionName);
    }
    // 파일 데이터 가져오기
    await fetchImages();
    isLoading.value = false;
  } catch (error) {
    if (error.response) {
      console.error("서버 응답 오류:", error.response.data);
    } else {
      console.error("네트워크 오류 발생:", error.message);
    }
  }
};

// 이미지 받아오기
const fetchImages = async () => {
  try {
    // 이미지 파일 목록 가져오기
    const fileResponse = await axios.get(
      `http://localhost/board/loadfile/${boardId.value}`
    );

    if (fileResponse.status === 200) {
      // API에서 반환된 로컬 경로를 브라우저에서 접근 가능한 URL로 변환
      article.value.imageUrls = fileResponse.data.map((filePath) => {
        // 파일명 추출
        const fileName = filePath.split("/").pop();
        // 서빙 가능한 URL로 변환
        return `http://localhost/board/file/${boardId.value}/${fileName}`;
      });
    } else {
      console.error("이미지 경로 로드 실패:", fileResponse.statusText);
    }
  } catch (error) {
    console.error("이미지 로드 중 오류 발생", error.message);
  }
};

// 댓글 받아오기
const getComments = async () => {
  try {
    const response = await axios.get(
      `http://localhost/board/comment/${boardId.value}`
    );
    if (response.status === 200) {
      comments.value = response.data;
    }
  } catch (error) {
    console.error("오류 발생", error.message);
  }
};

// 댓글 삭제
const deleteComment = async (commentId) => {
  const confirmResult = confirm("정말 삭제하시겠습니까?");

  if (confirmResult) {
    try {
      const response = await axios.delete(
        `http://localhost/board/comment/${commentId}`
      );

      if (response.status === 200) {
        getComments();
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생", error.message);
    }
  } else {
    return;
  }
};

onMounted(async () => {
  boardId.value = route.params.id;
  boardType.value = route.query.boardType;
  console.log(boardId.value);
  console.log(boardType.value);
  await getArticle();
  if (boardType.value === "2") {
    // Kakao Maps SDK가 로드되지 않았다면 로드
    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement("script");

      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=80a51ca8893edecb0612a0ba5858c1ad&libraries=services";
      script.onload = async () => {
        kakao.maps.load(async () => {
          await getArticle();
        });
      };
      document.head.appendChild(script);
    } else {
      // 이미 SDK가 로드된 경우 바로 지도 초기화
      kakao.maps.load(async () => {
        await getArticle();
      });
    }
  }
});

// DOM 렌더링 되기 전에 지도 안띄우게
// watch(boardType, async (newType) => {
//   if (newType === "2") {
//     await nextTick(); // DOM 렌더링 완료 대기
//     initMap(); // 지도 초기화
//   }
// });

// watch(
//   () => article.value.attractionUrl,
//   (newUrl) => {
//     if (newUrl && map.value) {
//       addMarker(address, attractionName);
//     }
//   }
// );
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 500px;
}
</style>
