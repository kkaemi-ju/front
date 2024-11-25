```
<template>
  <div class="min-h-screen bg-white">
    <!-- Top Date Selection Bar -->
    <div class="border-b">
      <div
        class="container mx-auto px-4 py-3 flex items-center justify-between"
      >
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input
              v-model="tripPlan.tripName"
              type="text"
              placeholder="여행 제목"
              class="px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#00712D]"
            />
          </div>
          <div class="relative">
            {{ formatDateRange }}
          </div>
        </div>
        <div class="text-sm text-gray-500">
          {{ sidoMapping[searchModel.selectedLocation] || "지역" }}
        </div>
      </div>
    </div>

    <div class="flex relative">
      <!-- Left Sidebar -->
      <div
        :class="[
          'transition-all duration-300',
          sidebarOpen ? 'w-[500px]' : 'w-[500px]',
        ]"
        class="flex bg-white border-r overflow-hidden"
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
              class="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
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
          </div>

          <!-- Place Selection -->
          <div v-if="currentStep === 2" class="p-4">
            <h3 class="text-lg font-medium mb-4">장소 선택</h3>
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
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600',
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
                class="h-screen flex flex-col p-4 bg-gray-100"
                v-if="updatedTripList.length > 0"
              >
                <div class="flex-1 overflow-y-auto">
                  <div
                    v-for="(item, index) in updatedTripList"
                    :key="`${item.title}-${index}`"
                    class="flex items-center mb-4 p-4 bg-white rounded-lg shadow"
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
                            ? 'bg-green-500 text-white'
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
        <div class="h-screen flex flex-col p-4 bg-gray-100">
          <h6 class="text-2xl font-bold mb-4">리스트</h6>
          <div class="flex-1 overflow-y-auto">
            <TransitionGroup name="list" tag="div">
              <div
                v-for="(item, index) in items[selectedDay]"
                :key="item.no"
                class="flex items-center mb-4 p-4 bg-white rounded-lg shadow"
              >
                <img
                  :src="item.firstImage1 || 'src/assets/img/no-img.png'"
                  alt="Item image"
                  class="w-20 h-20 rounded-lg object-cover mr-4"
                />
                <div class="flex-1">
                  <h2 class="font-bold text-lg">{{ item.title }}</h2>
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
          left: sidebarOpen ? (currentStep === 2 ? '850px' : '500px') : '0px',
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
const tripPlanId = ref(null);
const sidebarOpen = ref(true);
const currentStep = ref(1);

let chartInstance = null;
//api 요청을 위한 data

const days = ref([]);
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
const initCheck = ref(false);
const calDay = ref("");
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
  tripName: "",
  startDate: "",
  endDate: "",
  userId: userInfo.value.userId,
  days: [],
  sidoCode: searchModel.value.selectedLocation,
});
// 검색 결과 저장
const tripList = ref([]);
const updatedTripList = ref([]);
const markers = ref([]); // 마커들을 저장할 배열
const linePath = ref([]); // 경로 좌표 배열
const polylines = ref([]); // 폴리라인 객체
const distanceOverlays = ref([]); // 거리 정보 오버레이

const mapContainer = ref(null);
const map = ref(null);
const markerImageSrc =
  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; // 마커 이미지 URL
const itemssSelectedState = ref(
  Array.from({ length: Number(route.query.day) }, () =>
    updatedTripList.value.map(() => false)
  ) // 1일차, 2일차, 3일차
);
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
  console.log("createMarkersAnd");
  console.log(items.value[selectedDay.value]);
  items.value[selectedDay.value].forEach((coord, index) => {
    const position = new kakao.maps.LatLng(coord.latitude, coord.longitude);
    createNumberMarker(position, index);
    console.log("fdfdfd");
  });
};

const addDistanceOverlay = (start, end, distance) => {
  // 두 지점의 중간 위치 계산

  const midPosition = new kakao.maps.LatLng(
    (start.getLat() + end.getLat()) / 2,
    (start.getLng() + end.getLng()) / 2
  );

  // 거리 정보 표시
  const content = `<div style="padding:5px; background: white; border: 1px solid #ccc; border-radius: 3px;">${distance}m</div>`;
  const overlay = new kakao.maps.CustomOverlay({
    content,
    map: map.value,
    position: midPosition,
    yAnchor: 0.5,
    xAnchor: 0.5,
  });

  distanceOverlays.value.push(overlay);
};

const clearMarkersAndPolyline = () => {
  // 기존 마커 제거
  markers.value.forEach((marker) => {
    if (marker && typeof marker.setMap === "function") {
      marker.setMap(null); // 지도에서 마커 제거
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

// itemss와 itemssSelectedState를 동기화
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
};

const formatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "2-digit",
});
const formatDateRange = ref("");

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
    alert("여행 제목을 입력해주세요.");
    return;
  }
  const currentDate = new Date(tripPlan.value.startDate);
  const eDate = new Date(tripPlan.value.endDate);

  tripPlan.value.sidoCode = searchModel.value.selectedLocation;
  let idx = 0;
  tripPlan.value.days = [];
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
  console.log(tripPlan.value);
  try {
    await axios.put(
      `http://localhost/tripplan/${tripPlanId.value}`,
      tripPlan.value
    );
    router.push({
      name: "plandetail",
      query: {
        tripPlanId: tripPlanId.value, // 쿼리 매개변수로 tripPlanId 전달
      },
    }); // Redirect to trip plan list
  } catch (error) {
    console.error("Error updating trip plan:", error);
  }
  console.log("SaveTravel");
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
const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0; // 날짜가 없으면 0 반환

  const start = new Date(startDate);
  const end = new Date(endDate);

  // 날짜 차이 계산 (포함 범위로 계산하기 위해 +1 추가)
  const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // 유효성 검사: 종료 날짜가 시작 날짜보다 빠를 경우 0 반환
  return days > 0 ? days : 0;
};
const fetchPlanDetails = async (tripPlanId) => {
  try {
    const response = await axios.get(
      `http://localhost/tripplan/details/${tripPlanId}`
    );

    const data = response.data;

    // 제목, 날짜 설정
    tripPlan.value.tripName = data.tripName;
    tripPlan.value.startDate = data.startDate;
    tripPlan.value.endDate = data.endDate;
    tripPlan.value.sidoCode = data.sidoCode;
    searchModel.value.selectedLocation = data.sidoCode;

    formatDateRange.value = `${formatter.format(new Date(data.startDate))} ~
${formatter.format(new Date(data.endDate))}`;

    calDay.value = calculateDays(
      new Date(data.startDate),
      new Date(data.endDate)
    );
    const ccalDay = calDay.value;
    days.value = Array.from({ length: ccalDay }, (_, i) => `${i + 1}일차`);
    items.value = Array.from({ length: ccalDay }, () => []);
    // 데이터 분배
    data.attractions.forEach((attraction) => {
      const dayIndex = attraction.dayNumber - 1; // dayNumber 기준으로 일차 구분 (0-based)
      if (items.value[dayIndex]) {
        items.value[dayIndex].push(attraction); // 해당 일차 배열에 데이터 추가
      }
    });
    // 일차별로 visitOrder 기준 정렬
    items.value.forEach((dayItems) => {
      dayItems.sort((a, b) => a.visitOrder - b.visitOrder);
    });
    console.log(ccalDay);
    console.log(items.value);
  } catch (error) {
    console.error("Error fetching trip details:", error);
  }
};

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
watch(currentStep, async (newValue) => {
  await nextTick(() => {
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
    // 콜백 함수를 async로 설정
    if (newValue && newValue !== oldValue) {
      if (initCheck.value) {
        const ccalDay = calDay.value;
        items.value = Array.from({ length: ccalDay }, () => []); // 올바른 초기화
        // 비동기 함수 호출
        await handleSearch();
        createMarkersAndPolyline();
      }
      initCheck.value = true;
    }
  },
  { deep: true } // 객체 변경을 감지하기 위해 깊은 감시 설정
);
// Lifecycle hooks
onMounted(async () => {
  //여기서 데이터 가져오기 !!!
  tripPlanId.value = route.query.tripPlanId;
  await fetchPlanDetails(tripPlanId.value);

  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    const script = document.createElement("script");
    /* global kakao */
    script.onload = () => kakao.maps.load(initMap);
    script.src =
      "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=80a51ca8893edecb0612a0ba5858c1ad";

    document.head.appendChild(script);
  }
  console.log("item 체크");
  console.log(items.value);
  await handleSearch();
  console.log("item 체크2");
  console.log(items.value);
  syncSelectedState();
  console.log("item 체크3");
  console.log(items.value);
  createMarkersAndPolyline();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
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
  width: 100% !important;
  height: auto !important;
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
</style>
