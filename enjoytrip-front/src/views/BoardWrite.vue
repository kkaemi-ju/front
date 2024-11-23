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

        <!-- 지도-->
        <section
          class="bg-white rounded-lg shadow-md p-6"
          v-if="boardType === '2'"
        >
          <h1 class="text-3xl font-bold text-[#00712D] mb-6">지도 검색</h1>

          <div class="mb-8">
            <div
              ref="mapContainer"
              id="mapContainer"
              class="w-full h-[500px] bg-gray-200 rounded-lg"
            ></div>

            <!-- 검색창 -->
            <div class="mt-3">
              <div class="flex items-center">
                <input
                  v-model="searchKeyword"
                  type="text"
                  class="w-1/2 px-4 py-2 border rounded-md text-black text-lg focus:outline-none focus:ring-2 focus:ring-[#00712D]"
                  placeholder="검색어를 입력하세요"
                />
                <button
                  @click="searchPlaces"
                  class="ml-4 px-4 py-2 bg-[#00712D] text-white text-lg rounded-md hover:bg-[#FF9100] transition-colors"
                >
                  검색
                </button>
              </div>
            </div>
          </div>

          <!-- 검색 결과 -->
          <div class="mt-1 bg-white p-4 rounded-lg shadow-md">
            <h2 class="text-xl font-medium mb-4">검색 결과</h2>
            <p v-if="selectedPlace !== null" class="text-lg text-gray-800 mb-4">
              <span class="font-semibold text-[#00712D]">선택된 지역:</span>
              {{ places[selectedPlace]?.place_name || "선택되지 않음" }}
            </p>
            <div
              id="scrollableList"
              class="overflow-y-auto max-h-80 border rounded-md"
            >
              <ul id="placesList" class="divide-y divide-gray-200">
                <li
                  v-for="(place, index) in places"
                  :key="index"
                  class="p-4 cursor-pointer hover:bg-gray-50"
                  @click="highlightPlace(index)"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3
                        :class="{
                          'text-[#FF9100]': selectedPlace === index,
                          'text-[#00712D]': selectedPlace !== index,
                        }"
                        class="text-lg font-bold mb-2"
                      >
                        {{ place.place_name }}
                      </h3>
                      <p class="text-gray-600 mb-1">
                        {{ place.road_address_name || "도로명 주소 없음" }}
                      </p>
                      <p class="text-gray-500 text-sm">
                        {{ place.phone || "전화번호 없음" }}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div
              id="pagination"
              class="mt-4 flex justify-center space-x-2"
            ></div>
          </div>
        </section>
        <!-- 사진 업로드 -->
        <div class="mb-6 py-5">
          <label class="block text-lg font-medium text-gray-800 mb-2 ml-4"
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
              class="px-4 py-2 bg-[#00712D] text-white rounded-md cursor-pointer hover:bg-[##FF9100]/90"
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
import { onMounted, ref, watch, nextTick } from "vue";
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

// 지도
const searchKeyword = ref("");
const mapContainer = ref(null);
const map = ref(null);
const places = ref([]);
const markers = ref([]);
const infowindow = ref(null);
let ps = null;
const selectedPlace = ref(null);
const markerImageSrc =
  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; // 마커 이미지 URL

// 지도 관련
// 카카오맵 초기화
const initMap = async () => {
  if (!mapContainer.value) return;
  await nextTick(); // DOM 업데이트가 완료될 때까지 대기
  if (map.value) return;
  const options = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567),
    level: 1,
  };

  map.value = new kakao.maps.Map(mapContainer.value, options);
  infowindow.value = new kakao.maps.InfoWindow({ zIndex: 1 });
  ps = new kakao.maps.services.Places();
};

// 장소 검색
const searchPlaces = () => {
  if (!searchKeyword.value.trim()) {
    alert("검색어를 입력해주세요.");
    return;
  }

  ps.keywordSearch(searchKeyword.value, placesSearchCB);
};

// 검색 결과 콜백
const placesSearchCB = (data, status, pagination) => {
  if (status === kakao.maps.services.Status.OK) {
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid data format:", data);
      return;
    }
    places.value = data;
    displayPlaces(data);
    displayPagination(pagination);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 없습니다.");
  } else {
    alert("검색 중 오류가 발생했습니다.");
    console.error("Error status:", status);
  }
};

// 검색 결과 목록과 마커 표시
const displayPlaces = (placesData) => {
  clearMarkers();

  const bounds = new kakao.maps.LatLngBounds();
  placesData.forEach((place, index) => {
    const position = new kakao.maps.LatLng(
      parseFloat(place.y),
      parseFloat(place.x)
    );
    if (!position) {
      console.warn("Invalid place coordinates:", place);
      return;
    }

    const marker = addMarker(position, index);
    if (marker) {
      markers.value.push(marker);
      bounds.extend(position);
    }
  });

  map.value.setBounds(bounds);
};

// 마커 추가
const addMarker = (position, index) => {
  if (!position || !(position instanceof kakao.maps.LatLng)) {
    console.error("Invalid position:", position);
    return;
  }

  const imageSize = new kakao.maps.Size(24, 35);
  const markerImage = new kakao.maps.MarkerImage(markerImageSrc, imageSize);
  const marker = new kakao.maps.Marker({
    position,
    map: map.value,
    title: places.value[index].place_name,
    image: markerImage,
  });

  kakao.maps.event.addListener(marker, "mouseover", () => {
    const content = `<div style="padding:5px; color: black;">${places.value[index].place_name}</div>`;
    infowindow.value.setContent(content);
    infowindow.value.open(map.value, marker);
  });

  kakao.maps.event.addListener(marker, "mouseout", () => {
    infowindow.value.close();
  });
  map.value.setLevel(2);
  marker.setMap(map.value);
  return marker;
};

// 검색 결과 강조
const highlightPlace = (index) => {
  const place = places.value[index];
  const position = new kakao.maps.LatLng(place.y, place.x);
  selectedPlace.value = index;
  map.value.setLevel(2);
  map.value.setCenter(position);
  infowindow.value.setContent(
    `<div style="padding:10px;">${place.place_name}</div>`
  );
  infowindow.value.open(map.value, markers.value[index]);
};

// 마커 제거
const clearMarkers = () => {
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];
};

// 페이지네이션
const displayPagination = (pagination) => {
  const paginationEl = document.getElementById("pagination");
  while (paginationEl.hasChildNodes())
    paginationEl.removeChild(paginationEl.lastChild);

  for (let i = 1; i <= pagination.last; i++) {
    const pageEl = document.createElement("a");
    pageEl.innerHTML = i;
    pageEl.href = "#";
    pageEl.className =
      i === pagination.current ? "on text-green-500" : "text-gray-500";
    pageEl.addEventListener("click", () => pagination.gotoPage(i));
    paginationEl.appendChild(pageEl);
  }
};

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
    boardId: boardType.value, // 게시판 타입
    attractionUrl: places.value[selectedPlace.value].address_name,
    attractionName: places.value[selectedPlace.value].place_name,
  };

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
  router.push({ path: "/board", query: { boardId: route.query.boardType } });
};

// 상세 글 페이지로 돌아가기(수정모드)
const goBackToDetail = (page) => {
  const confirmResult = confirm("수정을 끝내고 돌아가시겠습니까?");
  if (confirmResult) {
    router.push({
      name: page,
      query: { boardType: boardType.value },
      params: { id: boardId.value },
    });
  }
};

const article = ref();
// 글 수정
const modifyArticle = async () => {
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
    fileUpload(boardId);
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

  if (boardType.value === "2") {
    // Kakao Maps SDK가 로드되지 않았다면 로드
    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement("script");
      script.onload = () => {
        // SDK가 로드되면 지도 초기화
        kakao.maps.load(() => {
          initMap();
        });
      };
      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=80a51ca8893edecb0612a0ba5858c1ad&libraries=services";
      document.head.appendChild(script);
    } else {
      // 이미 SDK가 로드된 경우 바로 지도 초기화
      kakao.maps.load(() => {
        initMap();
      });
    }
  }

  if (route.query.modify === "true") {
    // 게시글 수정
    modifyArticle();
    fetchImages();
  }
});

watch(boardType, async (newType) => {
  if (newType === "2") {
    await nextTick(); // DOM 렌더링 완료 대기
    initMap(); // 지도 초기화
  }
});
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 500px;
}

#pagination a {
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0 5px;
}

#pagination a.on {
  background-color: #00712d;
  color: white;
}

#scrollableList::-webkit-scrollbar {
  width: 8px;
}
#scrollableList::-webkit-scrollbar-thumb {
  background: #00712d;
  border-radius: 4px;
}
#scrollableList::-webkit-scrollbar-track {
  background: #f3f4f6;
}
</style>
