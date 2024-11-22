<template>
  <div class="min-h-screen bg-[#FFFBE6]/30 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- 헤더 -->
      <button
        class="mb-6 flex items-center text-[#00712D] hover:underline"
        @click="
          route.query.modify === 'true'
            ? goBackToDetail('boarddetail')
            : goBackToBoard()
        "
      >
        <ChevronLeft class="w-5 h-5 mr-1" />
        {{
          route.query.modify === "true"
            ? "이전으로 돌아가기"
            : "목록으로 돌아가기"
        }}
      </button>

      <!-- 글 작성 섹션 -->
      <section class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-3xl font-bold text-[#00712D] mb-6">
          {{ route.query.modify === "true" ? "게시글 수정" : "게시글 작성" }}
        </h1>
        <!-- 작성자 -->
        <div class="mb-6">
          <label
            for="author"
            class="block text-lg font-medium text-gray-800 mb-2"
            >작성자</label
          >
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
          <label
            for="title"
            class="block text-lg font-medium text-gray-800 mb-2"
            >제목</label
          >
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
          <label
            for="content"
            class="block text-lg font-medium text-gray-800 mb-2"
            >내용</label
          >
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
          <label class="block text-lg font-medium text-gray-800 mb-2"
            >사진 업로드</label
          >
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
            @click="
              route.query.modify === 'true' ? submitModify() : submitPost()
            "
            class="px-6 py-3 bg-[#00712D] text-white text-lg rounded-md hover:bg-[#00712D]/90 transition-colors"
          >
            {{ route.query.modify === "true" ? "수정 완료" : "게시글 작성" }}
          </button>
        </div>
      </section>
    </div>

    <!-- 이미지 모달 -->
    <div
      v-if="isImageModalOpen"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <img
        :src="selectedImage"
        alt="이미지 보기"
        class="max-w-full max-h-full rounded-md"
      />
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
import { onMounted, ref, watch } from "vue";
import { ChevronLeft } from "lucide-vue-next";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const boardId = ref("");
const { userInfo } = useUserStore(); // Pinia 스토어에서 직접 가져오기
console.log("userInfo: ", userInfo);
const author = ref(userInfo.userId);
const title = ref("");
const content = ref("");
const uploadedImages = ref([]); // 여러 이미지를 저장
const isImageModalOpen = ref(false);
const selectedImage = ref(null);
const boardType = ref("");

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImages.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1);
};

const openImageModal = (image) => {
  selectedImage.value = image;
  isImageModalOpen.value = true;
};

const closeImageModal = () => {
  isImageModalOpen.value = false;
  selectedImage.value = null;
};

const submitPost = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    alert("제목과 내용을 입력해주세요!");
    return;
  }

  // 게시글 데이터 준비
  const postData = {
    userId: userInfo.userId,
    title: title.value,
    content: content.value,
    boardId: boardId.value, // 게시판 타입
  };

  // fileDto: uploadedImages.value.map((image) => ({
  //   fileUrl: image,
  // })),
  try {
    // POST 요청
    const response = await axios.post("http://localhost/board", postData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      console.log("게시글 작성 성공:", response.data);
    }

    fileUpload(response.data.boardId);
    alert("게시글이 작성되었습니다!");
    router.push({ path: "/board", query: { boardId: postData.boardId } });
  } catch (error) {
    // 오류 처리
    if (error.response) {
      console.error("서버 응답 오류:", error.response.data);
      // alert(error.response.data.error || "게시글 작성 중 오류 발생");
    } else {
      console.error("네트워크 오류:", error.message);
      // alert("네트워크 오류가 발생했습니다.");
    }
  }
};

const fileUpload = async (boardId) => {
  // 사진 저장
  const fileDtos = uploadedImages.value.length
    ? uploadedImages.value.map((image) => ({
        boardId: boardId,
        fileUrl: image,
      }))
    : null;

  if (fileDtos && fileDtos.length > 0) {
    const fileResponse = await axios.post(
      "http://localhost/board/fileUpload",
      fileDtos,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (fileResponse.status === 201) {
      console.log("파일 업로드 성공!!");
    } else {
      console.error("파일 업로드 실패", fileResponse.statusText);
    }
  }
};

const submitModify = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    alert("제목과 내용을 입력해주세요!");
    return;
  }

  boardId.value = route.query.boardId;

  // 게시글 내용 설정
  const postData = {
    userId: userInfo.userId,
    title: title.value,
    content: content.value,
    boardId: boardId.value,
  };

  const response = await axios.put(
    `http://localhost/board/${boardId.value}`,
    postData
  );

  fileUpload(route.query.boardId);
  if (response.status === 200) {
    alert("수정되었습니다!");
    router.push({ name: "boarddetail", params: { id: boardId.value } });
  } else {
    console.error("수정 실패");
  }
};

// 게시판으로 돌아가기
const goBackToBoard = () => {
  router.push({ path: "/board", query: { boardId: route.query.boardId } });
};

// 상세 글 페이지로 돌아가기(수정모드)
const goBackToDetail = (page) => {
  const confirmResult = confirm("수정을 끝내고 돌아가시겠습니까?");
  if (confirmResult) {
    router.push({
      name: page,
      query: { boardId: boardType.value },
      params: { id: boardId.value },
    });
  }
};

const article = ref();
// 글 수정
const modifyArticle = async () => {
  // 이전 데이터 가져와서 설정
  try {
    const boardId = route.query.boardId;
    const response = await axios.get(`http://localhost/board/${boardId}`);
    article.value = response.data;
    title.value = article.value.title; // 제목 설정
    content.value = article.value.content; // 내용 설정

    if (response.status === 200) {
      console.log("게시글 데이터 가져오기 성공:", response.data);
    } else {
      console.error("게시글 못 불러옴:", response.statusText);
    }
    fetchImages(boardId);
  } catch (error) {
    console.error("오류남!!");
  }
};

// 사진 가져오기
const fetchImages = async () => {
  try {
    const boardId = route.query.boardId;

    // 이미지 파일 목록 가져오기
    const fileResponse = await axios.get(
      `http://localhost/board/loadfile/${boardId}`
    );

    if (fileResponse.status === 200) {
      const fileData = fileResponse.data;

      if (Array.isArray(fileData) && fileData.length > 0) {
        // API에서 반환된 로컬 경로를 브라우저에서 접근 가능한 URL로 변환
        const imageUrls = fileData.map((filePath) => {
          // 파일명 추출
          const fileName = filePath.split("/").pop();
          // 서빙 가능한 URL로 변환
          return `http://localhost/board/file/${boardId}/${fileName}`;
        });

        // 받아온 이미지를 uploadedImages에 추가
        uploadedImages.value = imageUrls;
        console.log("이미지 경로 로드 성공:", uploadedImages.value);
      } else {
        // 데이터가 없을 경우 빈 배열로 초기화
        uploadedImages.value = [];
        console.warn("이미지 파일이 없습니다.");
      }
    } else {
      // 비정상 상태 코드 처리
      uploadedImages.value = [];
      console.warn("이미지 로드 실패: 상태 코드", fileResponse.status);
    }
  } catch (error) {
    // 요청 중 오류 발생 시
    uploadedImages.value = []; // 빈 배열로 초기화
    if (error.response) {
      if (error.response.status === 404) {
        console.warn("해당 boardId에 대한 파일이 없습니다.");
      } else {
        console.error(
          "서버 오류:",
          error.response.status,
          error.response.statusText
        );
      }
    } else {
      console.error("네트워크 오류 발생:", error.message);
    }
  }
};

onMounted(() => {
  boardId.value = route.query.boardId;
  boardType.value = route.query.boardType;

  if (route.query.modify === "true") {
    // 게시글 수정
    modifyArticle();
  }
});
</script>

<style scoped>
/* 스타일 추가 */
</style>
