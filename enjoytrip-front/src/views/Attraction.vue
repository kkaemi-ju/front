<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- City and Region Navigation -->
    <div class="relative overflow-x-auto pb-8" ref="scrollContainer">
      <div class="flex space-x-6 items-center" ref="locationsContainer">
        <div
          v-for="(location, index) in locations"
          :key="`${location.sido_name}-${index}`"
          :ref="
            (el) => {
              if (el) locationRefs[index] = el;
            }
          "
          class="flex flex-col items-center transition-all duration-300 ease-in-out cursor-pointer mt-[30px]"
          :class="{ 'scale-105': index === centerIndex }"
          @click="selectLocation(index, location)"
        >
          <div
            class="rounded-full flex items-center justify-center mb-2 text-white transition-all duration-300"
            :class="{
              'w-24 h-24 bg-[#FF9100]': index === centerIndex,
              'w-20 h-20 bg-[#00712D]': index !== centerIndex,
            }"
          >
            <span class="text-sm text-center">{{ location.sido_name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendation Text with Dropdown -->
    <div class="search-section">
      <div class="region-select">
        <span class="text-[#00712D] font-bold text-lg">이 지역의</span>
        <select
          v-model="searchModel.selectedRecommendationType"
          class="select-style"
        >
          <option
            v-for="type in recommendationTypes"
            :key="type.content_type_id"
            :value="type"
          >
            {{ type.content_type_name }}
          </option>
        </select>
        <span class="text-[#00712D] font-bold text-lg">추천해드려요</span>
      </div>

      <!-- Search Input -->
      <div class="search-box">
        <input
          v-model="searchModel.searchTerm"
          type="text"
          placeholder="검색어를 입력하세요"
          class="search-input"
        />
        <button @click="handleSearch" class="search-button">검색</button>
      </div>
    </div>

    <!-- Map Section -->
    <div class="mb-8">
      <h2 class="text-xl font-medium mb-4 text-black">지도</h2>
      <div
        ref="mapContainer"
        class="w-full h-[500px] bg-gray-200 rounded-lg"
      ></div>
    </div>

    <!-- List Section -->
    <div>
      <div class="w-full">
        <table
          class="min-w-full divide-y divide-gray-200"
          v-if="tripList.length > 0"
        >
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                대표이미지
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                관광지명
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                주소
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                찜하기
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(trip, index) in tripList"
              :key="`${trip.title}-${index}`"
              @click="moveToCenter(trip)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  :src="trip.firstImage1 || 'src/assets/img/no-img.png'"
                  :alt="trip.title"
                  width="100"
                  class="h-20 w-20 rounded-md object-cover"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ trip.title }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ trip.addr1 }} {{ trip.addr2 }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="toggleFavorite(trip.no)"
                  class="text-gray-400 hover:text-red-500 focus:outline-none"
                >
                  <Heart
                    :class="{
                      'fill-red-500 text-red-500': favorites.includes(trip.no),
                    }"
                  />
                  <span class="sr-only">찜하기</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-center text-gray-600">검색 결과가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import { Heart } from "lucide-vue-next";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
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

// 추천 컨텐츠 타입
const recommendationTypes = [
  { content_type_id: null, content_type_name: "선택" },
  { content_type_id: 12, content_type_name: "관광지" },
  { content_type_id: 14, content_type_name: "문화시설" },
  { content_type_id: 15, content_type_name: "축제공연행사" },
  { content_type_id: 25, content_type_name: "여행코스" },
  { content_type_id: 28, content_type_name: "레포츠" },
  { content_type_id: 32, content_type_name: "숙박" },
  { content_type_id: 38, content_type_name: "쇼핑" },
  { content_type_id: 39, content_type_name: "음식점" },
];

const locations = ref([
  ...originalLocations,
  ...originalLocations,
  ...originalLocations,
]);

const scrollContainer = ref(null);
const locationsContainer = ref(null);
const locationRefs = ref([]);
const centerIndex = ref(originalLocations.length);
const selectedLocation = computed(
  () => originalLocations[centerIndex.value % originalLocations.length]
);
// 검색 결과 저장
const tripList = ref([]);
const markers = ref([]); // 마커들을 저장할 배열
const selectedRecommendationType = ref(recommendationTypes[0]);
const mapContainer = ref(null);
const map = ref(null);
const markerImageSrc =
  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; // 마커 이미지 URL

const favorites = ref([]);

const toggleFavorite = async (id) => {
  if (userInfo.value === null) {
    alert("로그인 후 이용하실 수 있습니다.");
    return;
  }
  if (favorites.value.includes(id)) {
    favorites.value = favorites.value.filter((favId) => favId !== id);
    await deleteFavorite(id);
  } else {
    favorites.value.push(id);
    await createFavorite(id);
  }
};
const initMap = () => {
  if (!mapContainer.value) {
    console.error("mapContainer가 초기화되지 않았습니다.");
    return;
  }

  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // Default center
    level: 2, // Zoom level
  };

  map.value = new kakao.maps.Map(mapContainer.value, options);
};

// 지도 중심좌표 변경
const updateMapCenter = (location) => {
  const coordinates = locationCoordinates[location];
  if (!coordinates || !map.value) {
    console.error("유효하지 않은 좌표 또는 지도 객체가 없습니다.");
    return;
  }

  // 지도 중심 이동
  const newCenter = new kakao.maps.LatLng(coordinates.lat, coordinates.lng);
  map.value.setCenter(newCenter); // 지도 중심 변경

  // 기존 마커 제거
  if (markers.value && Array.isArray(markers.value)) {
    markers.value.forEach((item) => {
      if (item && item.marker) {
        item.marker.setMap(null); // 마커가 존재하면 지도에서 제거
      }
    });
  }
  markers.value = [];

  // 새 마커 추가
  const newMarker = new kakao.maps.Marker({
    position: newCenter, // 마커 위치를 새 중심 좌표로 설정
    map: map.value, // 표시할 지도 객체
    title: `${location} 중심 마커`, // 마커의 제목
  });

  // 새 마커 배열에 추가
  markers.value.push({ marker: newMarker });
};

// 지역 선택 시 중심 업데이트
const updateCenterLocation = () => {
  if (!scrollContainer.value || locationRefs.value.length === 0) return;

  const containerRect = scrollContainer.value.getBoundingClientRect();
  const containerCenter = containerRect.left + containerRect.width / 2;

  let closestIndex = 0;
  let minDistance = Infinity;

  for (let i = 0; i < locationRefs.value.length; i++) {
    const el = locationRefs.value[i];
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const distance = Math.abs(rect.left + rect.width / 2 - containerCenter);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }

  centerIndex.value = closestIndex;

  // 무한 스크롤 효과를 위한 스크롤 위치 조정
  if (closestIndex < originalLocations.length) {
    scrollContainer.value.scrollLeft +=
      locationRefs.value[originalLocations.length].offsetLeft;
    centerIndex.value += originalLocations.length;
  } else if (closestIndex >= originalLocations.length * 2) {
    scrollContainer.value.scrollLeft -=
      locationRefs.value[originalLocations.length].offsetLeft;
    centerIndex.value -= originalLocations.length;
  }
};

const debouncedUpdateCenterLocation = (() => {
  let timeoutId = null;
  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(updateCenterLocation, 150);
  };
})();

const throttledScrollHandler = (() => {
  let lastExecution = 0;
  return () => {
    const now = Date.now();
    if (now - lastExecution > 100) {
      debouncedUpdateCenterLocation();
      lastExecution = now;
    }
  };
})();

const selectLocation = (index, location) => {
  centerIndex.value = index;
  searchModel.value.selectedLocation = location.sido_code;

  updateMapCenter(location.sido_name); // 지도 업데이트
  scrollToCenter(index);

  // 지도 검색
  handleSearch();
};

const scrollToCenter = (index) => {
  if (!scrollContainer.value || !locationRefs.value[index]) return;

  const containerRect = scrollContainer.value.getBoundingClientRect();
  const targetRect = locationRefs.value[index].getBoundingClientRect();

  const scrollLeft =
    targetRect.left -
    containerRect.left -
    containerRect.width / 2 +
    targetRect.width / 2;

  scrollContainer.value.scrollTo({
    left: scrollContainer.value.scrollLeft + scrollLeft,
    behavior: "smooth",
  });
};

const searchModel = ref({
  searchTerm: "",
  selectedLocation: 4,
  selectedRecommendationType: recommendationTypes[0],
});

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
    addMarkers();

    await getFavorite();
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

  tripList.value.forEach((trip, index) => {
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
    map.value.setCenter(firstMarkerPosition);
  }
};

const createMarkerWithInfoWindow = (trip) => {
  if (!trip.latitude || !trip.longitude || !map.value) {
    console.error("유효하지 않은 좌표 또는 지도 객체가 없습니다.");
    return null;
  }

  // 마커 위치 설정
  const markerPosition = new kakao.maps.LatLng(trip.latitude, trip.longitude);

  // 마커 이미지 설정
  const imageSize = new kakao.maps.Size(24, 35);
  const markerImage = new kakao.maps.MarkerImage(markerImageSrc, imageSize);

  // 마커 생성
  const newMarker = new kakao.maps.Marker({
    position: markerPosition,
    map: map.value,
    title: trip.title,
    image: markerImage,
  });

  // 인포윈도우 내용 설정
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

  // 인포윈도우 열기
  infowindow.open(map.value, newMarker);

  // 마커 클릭 이벤트 추가
  kakao.maps.event.addListener(newMarker, "click", () => {
    // 모든 기존 인포윈도우 닫기
    markers.value.forEach((item) => item.infowindow.close());

    // 현재 클릭된 마커의 인포윈도우 열기
    infowindow.open(map.value, newMarker);
  });

  return { marker: newMarker, infowindow };
};

const moveToCenter = (trip) => {
  if (!trip.latitude || !trip.longitude || !map.value) {
    console.error("유효하지 않은 좌표 또는 지도 객체가 없습니다.");
    return;
  }

  // 지도 중심 이동
  const newCenter = new kakao.maps.LatLng(trip.latitude, trip.longitude);
  map.value.setCenter(newCenter);

  // 기존 마커 제거
  if (markers.value && Array.isArray(markers.value)) {
    markers.value.forEach((item) => {
      if (item && item.marker) {
        item.marker.setMap(null);
      }
    });
  }
  markers.value = []; // 기존 마커 초기화

  // 새로운 마커와 인포윈도우 추가
  const newMarkerWithInfo = createMarkerWithInfoWindow(trip);
  if (newMarkerWithInfo) {
    markers.value.push(newMarkerWithInfo);
  }
};
const createFavorite = async (no) => {
  const response = await axios.post(`http://localhost/attraction/favorite`, {
    attractionsNo: no,
    userId: userInfo.value.userId,
  });
  console.log(response);
};
const deleteFavorite = async (no) => {
  const response = await axios.delete(`http://localhost/attraction/favorite`, {
    params: {
      attractionsNo: no,
      userId: userInfo.value.userId,
    },
  });

  console.log(response);
};

const getFavorite = async () => {
  if (userInfo.value === null) return;
  favorites.value = [];

  const response = await axios.get(
    `http://localhost/attraction/favorite/${userInfo.value.userId}`
  );
  const data = response.data;
  for (let t of tripList.value) {
    for (let d of data) {
      if (t.no === d.attractionsNo) {
        favorites.value.push(t.no);
      }
    }
  }
};
const userCheck = () => {
  if (userInfo.value === null) {
    alert("로그인 후 이용하실 수 있습니다.");
    return false;
  }
  return true;
};
watch(
  () => searchModel.value.selectedRecommendationType,
  (newValue, oldValue) => {
    if (newValue && newValue.content_type_id !== oldValue?.content_type_id) {
      handleSearch();
    }
  },
  { deep: true } // 객체 변경을 감지하기 위해 깊은 감시 설정
);

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
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });
    window.addEventListener("resize", debouncedUpdateCenterLocation, {
      passive: true,
    });
  }
  updateCenterLocation();
});

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener("scroll", throttledScrollHandler);
    window.removeEventListener("resize", debouncedUpdateCenterLocation);
  }
});
</script>

<style scoped>
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;
}

@media (max-width: 640px) {
  .flex {
    flex-wrap: nowrap;
  }
}

.w-24 {
  width: 6rem;
}

.h-24 {
  height: 6rem;
}

.w-20 {
  width: 5rem;
}

.h-20 {
  height: 5rem;
}

.transition-colors {
  transition-property: background-color, width, height;
  transition-timing-function: ease-in-out;
  transition-duration: 300ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.scale-105 {
  transform: scale(1.05);
}
#mapContainer {
  height: 1500px;
}

.search-section {
  @apply mt-8 space-y-4;
}

.region-select {
  @apply flex items-center justify-center gap-3;
}

.select-style {
  @apply px-4 py-2 rounded-full border-2 border-[#00712D] bg-white text-[#00712D]
           font-bold focus:outline-none focus:ring-2 focus:ring-[#FF9100];
}

.search-box {
  @apply flex justify-center gap-2;
}

.search-input {
  @apply w-full max-w-md px-4 py-2 rounded-full border-2 border-[#00712D]
           focus:outline-none focus:ring-2 focus:ring-[#FF9100];
}

.search-button {
  @apply px-6 py-2 rounded-full bg-[#00712D] text-white font-bold
           hover:bg-[#FF9100] transition-colors duration-300;
}
</style>
