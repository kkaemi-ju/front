<template>
  <div class="min-h-screen bg-white">
    <!-- Top Date Selection Bar -->
    <header class="border-b">
      <div class="mx-auto px-2 sm:px-4 lg:px-6">
        <div
          class="py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div class="flex items-center space-x-3">
            <MapPinIcon
              class="mb-4 h-6 w-6 text-emerald-600 translate-y-[1px]"
            />
            <div class="flex items-center">
              <h1
                v-if="!isEditing"
                class="text-2xl font-semibold text-gray-900"
              >
                {{ tripPlan.tripName }}
              </h1>
              <input
                v-else
                v-model="editedTitle"
                class="text-2xl font-bold text-gray-900 border-b-2 border-emerald-300 focus:outline-none focus:border-emerald-500"
                @keyup.enter="saveTitle"
              />
              <button
                v-if="!isEditing"
                @click="startEditing"
                class="ml-2 text-emerald-600 hover:text-emerald-700 translate-y-[1px] mb-4"
                aria-label="제목 수정"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                v-else
                @click="saveTitle"
                class="ml-2 text-emerald-600 hover:text-emerald-700 translate-y-[1px]"
                aria-label="제목 저장"
              >
                <CheckIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div class="flex flex-col items-end">
            <div
              class="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-green-700"
            >
              <CalendarIcon class="h-5 w-5 text-green-700" />
              <div class="flex items-center text-base">
                {{ formatDateRange }}
              </div>
            </div>
            <span class="text-lg mt-1">{{
              sidoMapping[searchModel.selectedLocation] || "지역"
            }}</span>
          </div>
        </div>
      </div>
    </header>

    <div class="flex relative">
      <!-- Left Sidebar -->
      <div
        :class="['transition-all duration-300']"
        class="w-[500px] flex bg-white border-r overflow-hidden"
      >
        <!-- Steps Navigation -->
        <div class="w-[160px] bg-white border-r flex flex-col justify-between">
          <div class="p-4 space-y-4">
            <!-- Step 1 -->
            <div
              :class="[
                'p-3 rounded cursor-pointer',
                currentStep === 1
                  ? 'bg-[#00712D]/10 text-[#00712D]'
                  : 'hover:bg-gray-100',
              ]"
              @click="currentStep = 1"
            >
              <div class="text-sm text-[#00712D] mb-1">step1</div>
              <div class="font-medium">지역 선택</div>
            </div>
            <!-- Step 2 -->
            <div
              :class="[
                'p-3 rounded cursor-pointer',
                currentStep === 2
                  ? 'bg-[#00712D]/10 text-[#00712D]'
                  : 'hover:bg-gray-100',
              ]"
              @click="currentStep = 2"
            >
              <div class="text-sm text-[#00712D] mb-1">step2</div>
              <div class="font-medium">장소 선택</div>
            </div>
          </div>
          <!-- Save Button -->
          <div class="p-4">
            <button
              @click="saveTravel"
              class="w-full bg-[#FF9100] px-4 py-2 text-white rounded-md hover:bg-black/90 transition-colors"
            >
              저장
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 bg-white">
          <!-- Region Selection -->
          <div v-if="currentStep === 1" class="p-4">
            <h3 class="text-lg font-medium mb-4">지역</h3>
            <select
              v-model="searchModel.selectedLocation"
              class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00712D]"
            >
              <option
                v-for="item in originalLocations"
                :value="item.sido_code"
                :key="item.sido_code"
              >
                {{ item.sido_name }}
              </option>
            </select>

            <div
              class="bg-gradient-to-br from-[#FFFBE6] to-[#FFFBE6] rounded-3xl shadow-lg p-8 border border-[#00712D]/20"
              style="margin-top: 150px"
            >
              <!-- Chart Section -->
              <div
                class="text-center mb-8 flex flex-col items-center mt-10 canvas-container"
              >
                <h2
                  class="text-2xl font-extrabold text-[#00712D] mb-2 relative inline-block"
                >
                  떠나고GO의 추천
                </h2>
                <p class="text-gray-600 text-lg">
                  가장 핫한 지역 Top 3
                  <span class="inline-block animate-bounce ml-1">🔥</span>
                </p>
                <div
                  class="bg-white rounded-2xl p-6 shadow-inner border border-[#00712D]/10"
                >
                  <canvas id="chart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- Place Selection -->
          <div v-if="currentStep === 2" class="p-4">
            <div class="flex items-center justify-between mb-4">
              <!-- Left Side: Title -->
              <h3 class="text-lg">장소 선택</h3>
              <!-- Right Side: Button -->
              <button
                @click="openModal($event)"
                class="inline-flex items-center gap-2 px-4 py-2 text-[#FF9100] border border-[#FF9100] rounded-md hover:bg-[#fff7e4] transition-colors"
              >
                <span class="font-medium">추천 pick</span>
                <MousePointerClick class="w-4 h-4 text-[#FF9100]" />
              </button>
            </div>
            <div>
              <div class="flex justify-center mb-4">
                <select
                  v-model="selectedDay"
                  class="border border-gray rounded-md px-4 py-2 text-center"
                  style="width: 100%"
                >
                  <option
                    v-for="(day, index) in days"
                    :key="index"
                    :value="index"
                  >
                    {{ day }}
                  </option>
                </select>
              </div>

              <div class="flex items-center mb-4">
                <input
                  v-model="searchModel.searchTerm"
                  type="text"
                  placeholder="장소명을 입력하세요"
                  class="flex-1 border rounded-md px-4 py-2"
                />
                <button @click="handleSearch" class="ml-2">
                  <SearchIcon class="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div class="flex items-center space-x-2" style="width: 350px">
                <button @click="scrollLeft" class="p-2">
                  <ChevronLeftIcon class="h-5 w-5 text-gray-600" />
                </button>
                <div
                  ref="scrollContainer"
                  class="flex overflow-x-auto space-x-2"
                >
                  <button
                    v-for="(tag, index) in recommendationTypes"
                    :key="index"
                    @click="toggleTag(tag)"
                    :class="[
                      'flex-shrink-0 px-3 py-1 border rounded-full',
                      searchModel.selectedRecommendationType.content_type_id ===
                      tag.content_type_id
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-green-600',
                    ]"
                  >
                    {{ tag.content_type_name }}
                  </button>
                </div>
                <button @click="scrollRight" class="p-2">
                  <ChevronRightIcon class="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div
                class="h-screen flex flex-col p-4"
                v-if="updatedTripList.length > 0"
              >
                <div class="flex-1 overflow-y-auto">
                  <div
                    v-for="(item, index) in updatedTripList"
                    :key="`${item.title}-${index}`"
                    class="flex items-center mb-4 p-4 bg-white rounded-lg shadow border"
                  >
                    <img
                      :src="item.firstImage1 || 'src/assets/img/no-img.png'"
                      :alt="item.title"
                      class="w-20 h-20 rounded-lg object-cover mr-4"
                    />
                    <div class="flex-1">
                      <div class="flex items-center mb-1">
                        <h2 class="font-bold">{{ item.title }}</h2>
                      </div>
                      <p class="text-gray-600">
                        {{ item.addr1 }} {{ item.addr2 }}
                      </p>
                    </div>
                    <div>
                      <button
                        @click="toggleSelected(item, index)"
                        :class="
                          item.selected
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        "
                        class="p-2 rounded-full transition-colors duration-200"
                      >
                        <CheckIcon v-if="item.selected" class="w-4 h-4" />
                        <PlusIcon v-else class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List Sidebar for Step 2 -->
      <div
        v-if="currentStep === 2"
        :class="[
          'transition-all duration-300',
          sidebarOpen ? 'w-[350px]' : 'w-0',
        ]"
        class="bg-white border-r overflow-hidden"
      >
        <div class="h-screen flex flex-col p-4">
          <h3 class="text-xl mb-4">여행 리스트</h3>
          <div class="flex-1 overflow-y-auto">
            <TransitionGroup name="list" tag="div">
              <div
                v-for="(item, index) in items[selectedDay]"
                :key="item.no"
                class="border flex items-center mb-4 p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50"
                @click="setMapCenter(item)"
              >
                <div
                  class="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium -ml-2 mr-2"
                >
                  {{ index + 1 }}
                </div>

                <img
                  :src="item.firstImage1 || 'src/assets/img/no-img.png'"
                  alt="Item image"
                  class="w-20 h-20 rounded-lg object-cover mr-2"
                />
                <div class="flex-1">
                  <h2 class="font-bold text-base">{{ item.title }}</h2>
                  <!-- <p class="text-gray-600">{{ item.description }}</p> -->
                </div>
                <div class="flex flex-col items-center space-y-2 ml-4">
                  <button
                    @click="moveItem(index, -1)"
                    :disabled="index === 0"
                    class="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    <ChevronUpIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="moveItem(index, 1)"
                    :disabled="index === items.length - 1"
                    class="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    <ChevronDownIcon class="w-4 h-4" />
                  </button>
                </div>
                <button
                  @click="removeItem(item.no)"
                  class="ml-2 text-gray-500 hover:text-red-500"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>

      <!-- Collapse Button -->
      <button
        v-if="currentStep === 2"
        @click="toggleSidebar"
        :class="[
          'absolute w-6 h-16 bg-white border border-l-0 rounded-r flex items-center justify-center hover:bg-gray-50 z-10 transition-all duration-300',
          { 'left-0': !sidebarOpen },
        ]"
        :style="{
          left: sidebarOpen ? '850px' : '500px',
        }"
      >
        <ChevronLeftIcon v-if="sidebarOpen" class="h-5 w-5" />
        <ChevronRightIcon v-else class="h-5 w-5" />
      </button>

      <!-- Right Content Area (Map Placeholder) -->
      <div
        ref="mapContainer"
        :class="[
          'flex-1 bg-gray-50 min-h-[calc(100vh-64px)] rounded-lg',
          sidebarOpen ? '' : 'w-full',
        ]"
      ></div>
    </div>
    <!-- Modal -->
    <div
      v-if="isModalOpen"
      :style="{
        top: `${modalPosition.top}px`,
        left: `${modalPosition.left}px`,
      }"
      class="modal"
    >
      <div
        class="items-center text-center modal-content bg-gradient-to-br from-[#FFFBE6] to-[#FFFBE6] rounded-3xl shadow-lg p-8 border border-[#00712D]/20"
      >
        <button
          @click="closeModal"
          class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <X />
        </button>
        <h2
          class="text-2xl font-extrabold text-[#00712D] mb-2 relative inline-block"
        >
          떠나고GO의 추천
        </h2>
        <p class="text-gray-600 text-lg">
          {{ sidoMapping[searchModel.selectedLocation] }} Top
          {{ topSidoAttData.labels.length }} 장소
          <span class="inline-block animate-bounce ml-1">🔥</span>
        </p>
        <div
          class="bg-white rounded-2xl p-6 shadow-inner border border-[#00712D]/10"
        >
          <canvas id="chart2" width="20" height="20"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MousePointerClick,
  X,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
} from "lucide-vue-next";
import Chart from "chart.js/auto";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const router = useRouter();
const route = useRoute();

const sidebarOpen = ref(true);
const currentStep = ref(1);

const isModalOpen = ref(false);
const modalPosition = ref({ top: 0, left: 0 });

let chartInstance = null;
let chartInstance2 = null;
//api 요청을 위한 data
const bacgroundColor = ["#FAD6A5", "#FF7A7A", "#82E3C9", "#B7CBE8", "#CAA3EB"];
const days = Array.from(
  { length: Number(route.query.day) },
  (_, i) => `${i + 1}일차`
);
const selectedDay = ref(0); // 숫자 인덱스 (0, 1, 2)
const searchQuery = ref("");
const recommendationTypes = [
  { content_type_id: 12, content_type_name: "관광지" },
  { content_type_id: 14, content_type_name: "문화시설" },
  { content_type_id: 15, content_type_name: "축제공연행사" },
  { content_type_id: 25, content_type_name: "여행코스" },
  { content_type_id: 28, content_type_name: "레포츠" },
  { content_type_id: 32, content_type_name: "숙박" },
  { content_type_id: 38, content_type_name: "쇼핑" },
  { content_type_id: 39, content_type_name: "음식점" },
];

const originalLocations = [
  { sido_code: 1, sido_name: "서울" },
  { sido_code: 2, sido_name: "인천" },
  { sido_code: 3, sido_name: "대전" },
  { sido_code: 4, sido_name: "대구" },
  { sido_code: 5, sido_name: "광주" },
  { sido_code: 6, sido_name: "부산" },
  { sido_code: 7, sido_name: "울산" },
  { sido_code: 8, sido_name: "세종특별자치시" },
  { sido_code: 31, sido_name: "경기도" },
  { sido_code: 32, sido_name: "강원특별자치도" },
  { sido_code: 33, sido_name: "충청북도" },
  { sido_code: 34, sido_name: "충청남도" },
  { sido_code: 35, sido_name: "경상북도" },
  { sido_code: 36, sido_name: "경상남도" },
  { sido_code: 37, sido_name: "전북특별자치도" },
  { sido_code: 38, sido_name: "전라남도" },
  { sido_code: 39, sido_name: "제주도" },
];

const sidoMapping = originalLocations.reduce(
  (acc, { sido_code, sido_name }) => {
    acc[sido_code] = sido_name;
    return acc;
  },
  {}
);
// 지역별 중심좌표
const locationCoordinates = {
  서울: { lat: 37.5665, lng: 126.978 },
  인천: { lat: 37.4563, lng: 126.7052 },
  대전: { lat: 36.3504, lng: 127.3845 },
  대구: { lat: 35.8714, lng: 128.6014 },
  광주: { lat: 35.1595, lng: 126.8526 },
  부산: { lat: 35.1796, lng: 129.0756 },
  울산: { lat: 35.5395, lng: 129.3114 },
  세종특별자치시: { lat: 36.4803, lng: 127.289 },
  경기도: { lat: 37.4138, lng: 127.5183 },
  강원특별자치도: { lat: 37.8228, lng: 128.1555 },
  충청북도: { lat: 36.6356, lng: 127.4917 },
  충청남도: { lat: 36.5184, lng: 126.8 },
  경상북도: { lat: 36.4919, lng: 128.8886 },
  경상남도: { lat: 35.4606, lng: 128.2132 },
  전북특별자치도: { lat: 35.7175, lng: 127.153 },
  전라남도: { lat: 34.8679, lng: 126.991 },
  제주도: { lat: 33.4996, lng: 126.5312 },
};
const searchModel = ref({
  searchTerm: "",
  selectedLocation: 4,
  selectedRecommendationType: {
    content_type_id: null,
    content_type_name: "선택",
  },
});
const tripPlan = ref({
  tripName: "제목 입력",
  startDate: new Date(route.query.startdate).toISOString().split("T")[0],
  endDate: new Date(route.query.enddate).toISOString().split("T")[0],
  userId: userInfo.value.userId,
  days: [],
  sidoCode: searchModel.value.selectedLocation,
});
const topSidoData = ref({});
const topSidoAttData = ref({});
// 검색 결과 저장
const tripList = ref([]);
const updatedTripList = ref([]);
const markers = ref([]); // 마커들을 저장할 배열
const linePath = ref([]); // 경로 좌표 배열
const polylines = ref([]); // 폴리라인 객체
const distanceOverlays = ref([]); // 거리 정보 오버레이

const mapContainer = ref(null);
const map = ref(null);

const length = Number(route.query.day);
const items = ref(Array.from({ length }, () => [])); // 0: 1일차, 1: 2일차, 2: 3일차

const initMap = () => {
  if (!mapContainer.value) {
    console.error("mapContainer가 초기화되지 않았습니다.");
    return;
  }

  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // Default center
    level: 9, // Zoom level
  };

  map.value = new kakao.maps.Map(mapContainer.value, options);
};
const createNumberMarker = (position, number) => {
  const content = `
          <div style="
            position: relative;
            width: 30px;
            height: 30px;
            background: #FF9100;
            color: white;
            font-size: 14px;
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            font-weight: bold;
            box-shadow: 0px 2px 5px rgba(0,0,0,0.3);">
            ${number + 1}
          </div>
        `;
  const customOverlay = new kakao.maps.CustomOverlay({
    map: map.value,
    position: position,
    content: content,
    yAnchor: 0.5,
    xAnchor: 0.5,
  });
  distanceOverlays.value.push(customOverlay);
};
const createMarkersAndPolyline = () => {
  // 좌표를 기반으로 마커 및 선 생성
  clearMarkersAndPolyline();
  linePath.value = []; // 초기화

  items.value[selectedDay.value].forEach((coord, index) => {
    const position = new kakao.maps.LatLng(coord.latitude, coord.longitude);
    createNumberMarker(position, index);
  });
};

const clearMarkersAndPolyline = () => {
  // 기존 마커 제거
  markers.value.forEach((marker) => {
    if (marker && typeof marker.setMap === "function") {
      marker.setMap(null); // 지도에서 마커 거
    }
  });
  markers.value = []; // 빈 배열로 초기화하여 Vue 상태 업데이트

  // 선 제거
  polylines.value.forEach((polyline) => {
    if (polyline && typeof polyline.setMap === "function") {
      polyline.setMap(null); // 지도에서 선 제거
    }
  });
  polylines.value = []; // 초기화

  // 거리 오버레이 제거
  distanceOverlays.value.forEach((overlay) => {
    if (overlay && typeof overlay.setMap === "function") {
      overlay.setMap(null); // 지도에서 오버레이 제거
    }
  });
  distanceOverlays.value = []; // 초기화

  // 경로 초기화
  linePath.value = [];
};

const handleSearch = async () => {
  try {
    // console.log(`Search Term: ${searchModel.value.searchTerm}`);
    // console.log(`Selected Location: ${searchModel.value.selectedLocation}`);
    // console.log(
    //   `Recommendation Type: ${searchModel.value.selectedRecommendationType?.content_type_id}`
    // );

    const searchTerm = searchModel.value.searchTerm.trim();
    const selectedLocation = searchModel.value.selectedLocation;
    const selectedRecommendationType =
      searchModel.value.selectedRecommendationType?.content_type_id || null; // 수정

    let endpoint = "";
    let requestData = {};

    if (searchTerm && selectedLocation && selectedRecommendationType) {
      endpoint = "/sidotypetitlesearch";
      requestData = {
        areaCode: selectedLocation,
        contentTypeId: selectedRecommendationType,
        keyword: searchTerm,
      };
    } else if (searchTerm && selectedLocation) {
      endpoint = "/sidotitlesearch";
      requestData = {
        areaCode: selectedLocation,
        keyword: searchTerm,
      };
    } else if (selectedLocation && selectedRecommendationType) {
      endpoint = "/sidotypesearch";
      requestData = {
        areaCode: selectedLocation,
        contentTypeId: selectedRecommendationType,
      };
    } else if (selectedLocation) {
      endpoint = "/sidosearch";
      requestData = {
        areaCode: selectedLocation,
      };
    } else {
      throw new Error("올바른 검색 조건을 입력하세요.");
    }

    const response = await axios.post(
      `http://localhost/attraction${endpoint}`,
      requestData
    );

    tripList.value = response.data;
    updatedTripList.value = tripList.value.map((item, index) => ({
      ...item, // 기존 객체 내용 유지
      selected: false, // 새 key와 값 추가 (여기선 예시로 index + 2 사용)
    }));
    const coordinates =
      locationCoordinates[sidoMapping[searchModel.value.selectedLocation]];
    const newCenter = new kakao.maps.LatLng(coordinates.lat, coordinates.lng);

    map.value.setCenter(newCenter);
    // addMarkers();
  } catch (error) {
    console.error("검색 요청 중 오류 발생:", error);
  }
};

// 선택한 item과 새로운 tripList를 동기화
const syncSelectedState = () => {
  updatedTripList.value.forEach((item) => {
    item.selected = false; // selected를 false로 설정
  });
  for (let selectDayItem of items.value[selectedDay.value]) {
    for (let trip of updatedTripList.value) {
      if (selectDayItem.no === trip.no) {
        trip.selected = true; // 일치하는 경우 selected를 true로 설정
      }
    }
  }
};

const toggleSelected = (item, index) => {
  const itemData = items.value[selectedDay.value];
  let keyIndex = itemData.findIndex((data) => data.no === item.no);
  if (keyIndex != -1) {
    // 이미 선택한 아이 !!!
    items.value[selectedDay.value].splice(keyIndex, 1);
    updatedTripList.value[index].selected = false;
  } else {
    items.value[selectedDay.value].push(item);
    updatedTripList.value[index].selected = true;
    const newCenter = new kakao.maps.LatLng(item.latitude, item.longitude);

    map.value.setCenter(newCenter);
    // addCoordinate(item);
  }
  createMarkersAndPolyline();
};

const scrollContainer = ref(null);

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -100, behavior: "smooth" });
  }
};

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 100, behavior: "smooth" });
  }
};
// 태그 클릭 함수
const toggleTag = async (tag) => {
  if (
    searchModel.value.selectedRecommendationType.content_type_id ===
    tag.content_type_id
  ) {
    searchModel.value.selectedRecommendationType = {
      content_type_id: null,
      content_type_name: "선택",
    };
  } else {
    searchModel.value.selectedRecommendationType = tag;
  }
  await handleSearch();
  syncSelectedState();
};

const formatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "2-digit",
});
const formatDateRange = `${formatter.format(new Date(route.query.startdate))} ~
${formatter.format(new Date(route.query.enddate))}`;

const toggleSidebar = async () => {
  sidebarOpen.value = !sidebarOpen.value;

  if (chartInstance && sidebarOpen.value) {
    // Sidebar가 열릴 때 차트 크기를 재조정
    await nextTick(); // DOM 업데이트 대기
    chartInstance.resize(); // 차트 크기 재조정
  }
};

const saveTravel = async () => {
  if (tripPlan.value.tripName === "") {
    alert("여행 제목을 입력주세요.");
    return;
  }
  const currentDate = new Date(route.query.startdate);
  const eDate = new Date(route.query.enddate);
  let idx = 0;
  tripPlan.value.days = [];
  tripPlan.value.sidoCode = searchModel.value.selectedLocation;
  while (currentDate <= eDate) {
    // YYYY-MM-DD 형식으로 문자열 변환
    const formattedDate = currentDate.toISOString().split("T")[0];
    let planAttractions = [];
    let visitO = 0;
    for (let pAttraction of items.value[idx++]) {
      planAttractions.push({
        attractionsNo: pAttraction.no,
        visitOrder: visitO++,
        memo: "",
      });
    }

    let planDay = {
      dayNumber: idx,
      date: formattedDate,
      attractions: planAttractions,
    };
    tripPlan.value.days.push(planDay);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  try {
    const response = await axios.post(
      `http://localhost/tripplan`,
      tripPlan.value
    );
    console.log("Trip data successfully sent:", response.data);
    alert("여행 계획을 추가했습니다.");
    router.push({ name: "planlist" });
  } catch (error) {
    console.error("Error sending trip data:", error);
  }
  console.log("SaveTravel");
};

// 안전하게 차트를 렌더링하는 함수
const renderChartWithDelay = () => {
  setTimeout(async () => {
    await renderChart();
  }, 100); // 100ms 지연 (렌더링 안정화)
};

const renderChart = async () => {
  await nextTick(); // DOM 렌더링 후 실행
  const canvas = document.getElementById("chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // 기존 차트 제거
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  // 새 차트 생성
  chartInstance = new Chart(ctx, {
    type: "pie",
    data: topSidoData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false, // 부모 요소의 비율을 유지하지 않음
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
    },
  });
};
const renderChart2 = async () => {
  await nextTick(); // DOM 렌더링 후 실행
  const canvas = document.getElementById("chart2");

  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // 기존 차트 제거
  if (chartInstance2) {
    chartInstance2.destroy();
    chartInstance2 = null;
  }

  // 새 차트 생성
  chartInstance2 = new Chart(ctx, {
    type: "pie",
    data: topSidoAttData.value,
    options: {
      responsive: true,
      maintainAspectRatio: true, // 비율 유지
      aspectRatio: 2, // 너비와 높이 비율 (2:1)
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
    },
  });
};
const closeModal = () => {
  isModalOpen.value = false;
  if (chartInstance2) {
    chartInstance2.destroy();
    chartInstance2 = null;
  }
};
const openModal = (event) => {
  const { clientX, clientY } = event;
  isModalOpen.value = true;

  // 모달 위치 설정
  modalPosition.value = {
    top: clientY + 10, // 클릭 위치 바로 아래
    left: clientX + 10, // 클릭 위치 바로 오른쪽
  };
  renderChart2();
};
const removeItem = (no) => {
  if (items.value[selectedDay.value]) {
    items.value[selectedDay.value] = items.value[selectedDay.value].filter(
      (item) => item.no !== no
    );
  }

  updatedTripList.value.forEach((item, index) => {
    if (item.no === no) {
      item.selected = false;
    }
  });
  createMarkersAndPolyline();
};
const moveItem = (index, direction) => {
  const currentItems = items.value[selectedDay.value]; // 현재 선택된 일차의 items 배열

  if (!currentItems || currentItems.length === 0) return; // 아이템이 없으면 아무 작업도 하지 않음

  const newIndex = index + direction;

  // 새로운 인덱스가 배열 범위를 벗어나지 않도록 확인
  if (newIndex < 0 || newIndex >= currentItems.length) return;

  // 순서 바꾸기: 아이템을 기존 위치에서 제거하고 새로운 위치에 삽입
  const [itemToMove] = currentItems.splice(index, 1);
  currentItems.splice(newIndex, 0, itemToMove);

  // 업데이트된 items 배열을 다시 할당 (Vue의 반응형 시스템에서 감지)
  items.value[selectedDay.value] = [...currentItems];
  createMarkersAndPolyline();
};
const fetchTopSidoCodes = async () => {
  try {
    const response = await axios.get("http://localhost/tripplan/top-sido");
    console.log(response.data);

    topSidoData.value = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderWidth: 1,
        },
      ],
    };
    let idx = 0;
    for (let topSido of response.data) {
      topSidoData.value.labels.push(sidoMapping[topSido.sido_code]);
      topSidoData.value.datasets[0].data.push(topSido.visit_count);
      topSidoData.value.datasets[0].backgroundColor.push(bacgroundColor[idx++]);
    }
  } catch (error) {
    console.error("Error fetching top sido codes:", error);
  }
};
const fetchTopSidoCodesAtt = async () => {
  try {
    const response = await axios.get(
      `http://localhost/tripplan/top-att/${searchModel.value.selectedLocation}`
    );

    topSidoAttData.value = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderWidth: 1,
        },
      ],
    };
    let idx = 0;
    for (let topSido of response.data) {
      topSidoAttData.value.labels.push(topSido.title);
      topSidoAttData.value.datasets[0].data.push(topSido.visit_count);
      topSidoAttData.value.datasets[0].backgroundColor.push(
        bacgroundColor[idx++]
      );
    }
  } catch (error) {}
};

// sidebarOpen과 currentStep을 분리하여 각각 감시
watch(sidebarOpen, async (isOpen) => {
  if (currentStep.value === 1) {
    if (isOpen) {
      await renderChart();
    } else {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
    }
  }
});

watch(currentStep, async (step) => {
  if (step === 1) {
    await nextTick();
    await renderChart();
  } else {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }
});

// Sidebar 상태를 감시하여 지도 크기 재조정
watch(sidebarOpen, (newValue) => {
  nextTick(() => {
    if (map.value) {
      map.value.relayout(); // 지도 컨테이너 크기 재계산
      const center = map.value.getCenter(); // 현재 중심 좌표 가져오기
      map.value.setCenter(center); // 중심 좌표 재설정
    }
  });
});
watch(currentStep, (newValue) => {
  nextTick(() => {
    if (map.value) {
      map.value.relayout(); // 지도 컨테이너 크기 재계산
      const center = map.value.getCenter(); // 현재 중심 좌표 가져오기
      map.value.setCenter(center); // 중심 좌표 재설정
    }
  });
});
// 일차 변경 시 itemss와 itemssSelectedState 동기화
watch(selectedDay, () => {
  syncSelectedState();

  createMarkersAndPolyline();
});

watch(
  () => searchModel.value.selectedLocation,
  async (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      items.value = Array.from({ length }, () => []);

      await handleSearch();
      await fetchTopSidoCodesAtt();
    }
  },
  { deep: true } // 객체 변경을 감지하기 위해 깊은 감시 설정
);

// Lifecycle hooks
onMounted(async () => {
  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    const script = document.createElement("script");
    /* global kakao */
    script.src =
      "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=80a51ca8893edecb0612a0ba5858c1ad";

    script.onload = () => kakao.maps.load(initMap);

    document.head.appendChild(script);
  }
  await handleSearch();
  syncSelectedState();

  await fetchTopSidoCodes();
  await fetchTopSidoCodesAtt();
  if (currentStep.value === 1 && sidebarOpen.value) {
    renderChartWithDelay();
  }
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});

const setMapCenter = (item) => {
  const newCenter = new kakao.maps.LatLng(item.latitude, item.longitude);
  map.value.setCenter(newCenter);
};

// 제목 수정 관련 상태 추가
const isEditing = ref(false);
const editedTitle = ref("");

const startEditing = () => {
  editedTitle.value = tripPlan.value.tripName;
  isEditing.value = true;
};

const saveTitle = () => {
  if (editedTitle.value.trim()) {
    tripPlan.value.tripName = editedTitle.value;
  }
  isEditing.value = false;
};
</script>

<style scoped>
.canvas-container {
  width: 100%; /* 부모 요소의 폭을 100%로 설정 */
  height: 250px; /* 차트의 초기 높이를 명시적으로 설정 */
  min-height: 200px; /* 최소 높이 설정 */
  display: flex; /* 캔버스를 중심으로 배치 */
  justify-content: center;
  align-items: center;
}
canvas {
  width: 100% !important; /* 부모 요소의 너비를 기준으로 캔버스 크기 지정 */
  height: auto !important; /* 고정된 높이 설정 */
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.list-move {
  transition: transform 0.3s ease;
}

.modal {
  position: absolute;
  border-radius: 8px;
  z-index: 1000; /* 모달이 다른 요소 위에 뜨도록 설정 */
  transform: translate(0, 0); /* 클릭 위치 기준 이동 */
}
.modal-content {
  position: relative;
  max-width: 400px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

input {
  border-top: none;
  border-left: none;
  border-right: none;
}

/* Remove default input styles in WebKit browsers */
input::-webkit-input-placeholder {
  opacity: 0.5;
}

/* Remove default input styles in Firefox */
input::-moz-placeholder {
  opacity: 0.5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

header {
  animation: fadeIn 0.5s ease-out;
}

.rounded-lg {
  transition: all 0.2s ease-in-out;
}

.rounded-lg:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
