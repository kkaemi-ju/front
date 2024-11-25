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
              class="mb-2 h-5 w-5 text-emerald-600 translate-y-[1px]"
            />
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">
                {{ travelTitle }}
              </h1>
            </div>
          </div>

          <div class="flex flex-col items-end">
            <div
              class="flex items-center space-x-2 bg-white px-3 py-1 rounded-lg shadow-sm border border-green-700"
            >
              <CalendarIcon class="h-4 w-4 text-green-700" />
              <div class="flex items-center text-sm">
                {{ formattedDateRange }}
              </div>
            </div>
            <span class="text-base mt-1">{{ locationName }}</span>
          </div>
        </div>
      </div>
    </header>

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
          <div class="h-screen flex flex-col items-center p-4 bg-white">
            <div class="flex-1 w-full max-w-md overflow-y-auto space-y-4 mb-4">
              <div
                v-for="(day, index) in days"
                :key="day"
                class="flex justify-center"
              >
                <button
                  @click="selectDay(index)"
                  :class="[
                    'w-full rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 font-medium text-center border',
                    currentDay === index
                      ? 'border-[#00712D] bg-[#00712D] text-white'
                      : 'border-[#00712D] text-[#00712D] bg-white',
                  ]"
                >
                  {{ day }}
                </button>
              </div>
            </div>
            <button
              @click="onHandleUpdate"
              class="w-full border-2 border-primary text-primary rounded-full py-3 px-6 flex items-center justify-center relative"
            >
              편집
            </button>
            <button
              @click="onHandleDelete"
              class="mt-2 w-full border-2 border-red-500 text-red-500 rounded-full py-3 px-6 flex items-center justify-center relative"
            >
              삭제
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 bg-white">
          <div class="h-screen flex flex-col p-4 bg-white">
            <div class="flex-1 overflow-y-auto">
              <TransitionGroup name="list" tag="div">
                <div
                  v-for="(item, index) in items[currentDay]"
                  :key="item.no"
                  class="border border-gray-200 flex items-center mb-4 p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50"
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
                    class="w-20 h-20 rounded-lg object-cover mr-4"
                  />
                  <div class="flex-1">
                    <h2 class="font-bold text-lg">{{ item.title }}</h2>
                    <p class="text-gray-600">
                      {{ item.addr1 }} {{ item.addr2 }}
                    </p>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>

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
  MapPinIcon,
  CalendarIcon,
} from "lucide-vue-next";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const router = useRouter();
const route = useRoute();
const tripPlanId = ref(null);

const startDate = ref("");
const endDate = ref("");
const selectedRegion = ref("");
const sidebarOpen = ref(true);
const locationName = ref("");
const travelTitle = ref("여행계획");
let chartInstance = null;

const days = ref([]); // 일차 정보 (예: "1일차", "2일차")
const items = ref([]); // 이중 배열: 각 일차별로 아이템 저장
const currentDay = ref(0); // 현재 선택된 일차
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

const markers = ref([]); // 마커들을 저장할 배열
const linePath = ref([]); // 경로 좌표 배열
const polylines = ref([]); // 폴리라인 객체
const distanceOverlays = ref([]); // 거리 정보 오버레이

const mapContainer = ref(null);
const map = ref(null);

// 특정 일차 선택
const selectDay = (dayIndex) => {
  currentDay.value = dayIndex;
  createMarkersAndPolyline();
};
const toggleSidebar = async () => {
  sidebarOpen.value = !sidebarOpen.value;

  if (chartInstance && sidebarOpen.value) {
    // Sidebar가 열릴 때 차트 크기를 재조정
    await nextTick(); // DOM 업데이트 대기
    chartInstance.resize(); // 차트 크기 재조정
  }
};
const fetchPlanDetails = async (tripPlanId) => {
  try {
    const response = await axios.get(
      `http://localhost/tripplan/details/${tripPlanId}`
    );

    const data = response.data;

    // 제목, 날짜 설정
    travelTitle.value = data.tripName;
    startDate.value = data.startDate;
    endDate.value = data.endDate;
    locationName.value = originalLocations.find(
      (location) => location.sido_code === data.sidoCode
    )?.sido_name;
    // 일차별 데이터 초기화
    const totalDays =
      Math.ceil(
        (new Date(endDate.value) - new Date(startDate.value)) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    for (let i = 0; i < totalDays; i++) {
      days.value.push(`${i + 1}일차`);
      items.value.push([]); // 각 일차별로 빈 배열 추가
    }

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
  } catch (error) {
    console.error("Error fetching trip details:", error);
  }
};

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
  items.value[currentDay.value].forEach((coord, index) => {
    const position = new kakao.maps.LatLng(coord.latitude, coord.longitude);
    createNumberMarker(position, index);
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
const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0; // 날짜가 없으면 0 반환

  const start = new Date(startDate);
  const end = new Date(endDate);

  // 날짜 차이 계산 (포함 범위로 계산하기 위해 +1 추가)
  const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // 유효성 검사: 종료 날짜가 시작 날짜보다 빠를 경우 0 반환
  return days > 0 ? days : 0;
};
const onHandleUpdate = () => {
  router.push({
    name: "planupdate",
    query: {
      tripPlanId: tripPlanId.value, // 쿼리 매개변수로 tripPlanId 전달
    },
  });
};

const onHandleDelete = async () => {
  // 삭제 확인 다이얼로그
  const isConfirmed = confirm("여행 계획을 삭제하시겠습니까?");

  if (!isConfirmed) {
    return; // 사용자가 취소를 선택한 경우
  }

  try {
    const response = await axios.delete(
      `http://localhost/tripplan/${tripPlanId.value}`
    );

    if (response.status == 200) {
      alert("여행 계획이 성공적으로 삭제되었습니다.");
      router.push({ name: "planlist" });
    } else {
      alert("삭제 실패: 알 수 없는 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("삭제 중 오류 발생:", error);
    alert("삭제 중 문제가 발생했습니다. 다시 시도해 주세요.");
  }
};
// Lifecycle hooks
onMounted(async () => {
  tripPlanId.value = route.query.tripPlanId;
  console.log(`Received tripPlanId: ${tripPlanId.value}`);
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
  const coordinates = locationCoordinates[locationName.value];
  const newCenter = new kakao.maps.LatLng(coordinates.lat, coordinates.lng);

  map.value.setCenter(newCenter);
  createMarkersAndPolyline();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});

// 날짜 포맷터 추가
const formatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "2-digit",
});

// 날짜 포맷을 위한 computed 속성 추가
const formattedDateRange = computed(() => {
  if (!startDate.value || !endDate.value) return "";

  try {
    const formattedStart = formatter.format(new Date(startDate.value));
    const formattedEnd = formatter.format(new Date(endDate.value));
    return `${formattedStart} ~ ${formattedEnd}`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
});

const setMapCenter = (item) => {
  const newCenter = new kakao.maps.LatLng(item.latitude, item.longitude);
  map.value.setCenter(newCenter);
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
:root {
  --color-primary: #00712d;
  --color-secondary: #d5ed9f;
  --color-cream: #fffbe6;
  --color-orange: #ff9100;
}

.bg-primary {
  background-color: var(--color-primary);
}

.bg-secondary {
  background-color: var(--color-secondary);
}

.bg-cream {
  background-color: var(--color-cream);
}

.bg-orange {
  background-color: var(--color-orange);
}

.text-primary {
  color: var(--color-primary);
}

.border-primary {
  border-color: var(--color-primary);
}
</style>
