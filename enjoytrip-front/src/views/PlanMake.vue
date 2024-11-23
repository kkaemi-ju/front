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
              v-model="travelTitle"
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
          sidebarOpen ? 'w-[500px]' : 'w-0',
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

            <div>
              <!-- Chart Section -->
              <div class="flex flex-col items-center mt-10 canvas-container">
                <h2 class="text-xl font-bold mb-2">TravelGo의 추천</h2>
                <p class="text-gray-500 mb-4">가장 핫한 지역 Top 3</p>
                <canvas id="chart"></canvas>
              </div>
            </div>
          </div>

          <!-- Place Selection -->
          <div v-if="currentStep === 2" class="p-4">
            <h3 class="text-lg font-medium mb-4">장소 선택</h3>
            <!-- <div v-if="selectedRegion === '' || startDate === '' || endDate === ''" class="text-sm text-gray-500">
                지역을 먼저 선택해주세요
              </div> -->
            <div class="text-sm text-gray-500">지역을 먼저 선택해주세요</div>
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
                            ? 'bg-pink-500 text-white'
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
        @click="toggleSidebar"
        :class="[
          'absolute w-6 h-16 bg-white border border-l-0 rounded-r flex items-center justify-center hover:bg-gray-50 z-10 transition-all duration-300',
          { 'left-0': !sidebarOpen },
        ]"
        :style="{
          left: sidebarOpen ? (currentStep === 2 ? '850px' : '500px') : '0px',
          // 항상 부모 요소의 가운데에 위치
        }"
      >
        <ChevronLeftIcon v-if="sidebarOpen" class="h-5 w-5" />
        <ChevronRightIcon v-else class="h-5 w-5" />
      </button>

      <!-- Right Content Area (Map Placeholder) -->
      <div
        ref="mapContainer"
        class="flex-1 bg-gray-50 min-h-[calc(100vh-64px)] rounded-lg"
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

const router = useRouter();
const route = useRoute();
const showDatePicker = ref(false);
const startDate = route.query.startdate;
const endDate = route.query.enddate;
const selectedRegion = ref("");
const sidebarOpen = ref(true);
const currentStep = ref(1);
const travelTitle = ref("");
let chartInstance = null;

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

// 검색 결과 저장
const tripList = ref([]);
const updatedTripList = ref([]);
const markers = ref([]); // 마커들을 저장할 배열
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
    console.log("selected");
    console.log(items.value.length);
    for (let trip of items.value) {
      console.log(trip);
    }
    const coordinates =
      locationCoordinates[sidoMapping[searchModel.value.selectedLocation]];
    const newCenter = new kakao.maps.LatLng(coordinates.lat, coordinates.lng);

    map.value.setCenter(newCenter);
    // addMarkers();
  } catch (error) {
    console.error("검색 요청 중 오류 발생:", error);
  }
};

const addMarkers = () => {
  // 기존 마커 제거
  if (markers.value && Array.isArray(markers.value)) {
    markers.value.forEach((item) => {
      if (item && item.marker) {
        item.marker.setMap(null); // 기존 마커를 지도에서 제거
      }
    });
  }
  markers.value = []; // 기존 마커 목록 초기화

  // 첫 번째 마커의 위치를 저장할 변수
  let firstMarkerPosition = null;

  updatedTripList.value.forEach((trip, index) => {
    if (!trip.latitude || !trip.longitude) return; // 유효한 좌표만 처리

    // 마커 위치
    const markerPosition = new kakao.maps.LatLng(trip.latitude, trip.longitude);

    // 첫 번째 마커의 위치를 저장
    if (index === 0) {
      firstMarkerPosition = markerPosition;
    }

    // 마커 이미지 설정
    const imageSize = new kakao.maps.Size(24, 35);
    const markerImage = new kakao.maps.MarkerImage(markerImageSrc, imageSize);

    // 마커 생성
    const marker = new kakao.maps.Marker({
      map: map.value,
      position: markerPosition,
      title: trip.title,
      image: markerImage,
    });

    // 인포윈도우 내용
    const infowindowContent = `
  <div style="padding: 10px; max-width: 200px; word-wrap: break-word; text-align: center; overflow: hidden; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); border-radius: 8px; font-family: Arial, sans-serif;">
    <div style="margin-bottom: 10px;">
      <img
        src="${trip.firstImage1 || "src/assets/img/no-img.png"}"
        alt="${trip.title}"
        style="width: 100%; max-width: 150px; height: auto; border-radius: 4px;"
      />
    </div>
    <strong style="font-size: 14px; color: #333;">${trip.title}</strong><br>
    <span style="font-size: 11px; color: #777; display: block; margin-top: 5px;">
      ${trip.addr1 || ""} ${trip.addr2 || ""}
    </span>
  </div>
`;
    const infowindow = new kakao.maps.InfoWindow({
      content: infowindowContent,
      removable: true,
    });

    // 마커 클릭 이벤트 추가
    kakao.maps.event.addListener(marker, "click", () => {
      // 모든 기존 인포윈도우 닫기
      markers.value.forEach((item) => item.infowindow.close());

      // 현재 클릭된 마커의 인포윈도우 열기
      infowindow.open(map.value, marker);
    });

    // 새 마커와 인포윈도우를 배열에 추가
    markers.value.push({
      marker,
      infowindow,
    });
  });

  // 첫 번째 마커의 위치로 지도 중심 이동
  if (firstMarkerPosition) {
    console.log(firstMarkerPosition);
    map.value.setCenter(firstMarkerPosition);
  }
};
// itemss와 itemssSelectedState를 동기화
const syncSelectedState = () => {
  if (!itemssSelectedState.value[selectedDay.value]) {
    itemssSelectedState.value[selectedDay.value] = updatedTripList.value.map(
      () => false
    );
  }

  if (!items.value[selectedDay.value]) {
    items.value[selectedDay.value] = [];
  }

  // itemss의 selected 상태를 items를 기준으로 갱신
  updatedTripList.value.forEach((item, index) => {
    const isSelected = items.value[selectedDay.value].some(
      (selectedItem) => selectedItem.no === item.no
    );
    item.selected = isSelected;
    itemssSelectedState.value[selectedDay.value][index] = isSelected;
  });
};

const toggleSelected = (item, index) => {
  if (!itemssSelectedState.value[selectedDay.value]) {
    itemssSelectedState.value[selectedDay.value] = updatedTripList.value.map(
      () => false
    );
  }

  if (!items.value[selectedDay.value]) {
    items.value[selectedDay.value] = [];
  }

  const isSelected = !itemssSelectedState.value[selectedDay.value][index];
  itemssSelectedState.value[selectedDay.value][index] = isSelected;
  item.selected = isSelected;
  if (isSelected) {
    // 선택된 아이템을 items 배열에 추가
    items.value[selectedDay.value].push(item);
  } else {
    // 선택 해제된 아이템을 items 배열에서 제거
    items.value[selectedDay.value] = items.value[selectedDay.value].filter(
      (i) => i.no !== item.no
    );
  }
};

const selectedTag = ref(); // 현재 선택된 태그 저장

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
const toggleTag = (tag) => {
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
  console.log("tag click");
  handleSearch();
};
const filteredPlaces = computed(() => {
  return places.value.filter((place) => place.name.includes(searchQuery.value));
});
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

const saveTravel = () => {
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
    data: {
      labels: ["Fruits and Veggies", "Good Carbs", "Protein"],
      datasets: [
        {
          data: [40, 25, 25],
          backgroundColor: ["#FAD6A5", "#FF7A7A", "#82E3C9"],
          borderWidth: 1,
        },
      ],
    },
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
const removeItem = (no) => {
  if (items.value[selectedDay.value]) {
    items.value[selectedDay.value] = items.value[selectedDay.value].filter(
      (item) => item.no !== no
    );
  }

  updatedTripList.value.forEach((item, index) => {
    if (item.no === no) {
      itemssSelectedState.value[selectedDay.value][index] = false;
      item.selected = false;
    }
  });
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
};

// Watchers
watch([currentStep, sidebarOpen], async ([step, open]) => {
  if (step === 1 && open) {
    await renderChart();
  } else {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }
});

// 일차 변경 시 itemss와 itemssSelectedState 동기화
watch(selectedDay, () => {
  syncSelectedState();
});

watch(
  () => searchModel.value.selectedLocation,
  (newValue, oldValue) => {
    console.log(newValue, oldValue);
    if (newValue && newValue !== oldValue) {
      console.log("위치 선택");
      handleSearch();
    }
  },
  { deep: true } // 객체 변경을 감지하기 위해 깊은 감시 설정
);

// Lifecycle hooks
onMounted(() => {
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

  syncSelectedState();
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
