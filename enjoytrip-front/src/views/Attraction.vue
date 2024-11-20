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
    <div class="text-center my-8 flex items-center justify-center space-x-2">
      <p class="text-gray-700">이 지역의</p>
      <select
        v-model="searchModel.selectedRecommendationType"
        class="w-[180px] text-black h-[40px] rounded border border-gray-300 flex-shrink-0"
      >
        <option
          v-for="type in recommendationTypes"
          :key="type.content_type_id"
          :value="type"
          class="text-black"
        >
          {{ type.content_type_name }}
        </option>
      </select>
      <p class="text-gray-700">추천해드려요</p>
    </div>

    <input
      v-model="searchModel.searchTerm"
      type="text"
      placeholder="검색어를 입력하세요"
      class="max-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-black"
    />
    <button
      @click="handleSearch"
      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      검색
    </button>

    <!-- Map Section -->
    <div class="mb-8">
      <h2 class="text-xl font-medium mb-4 text-black">지도</h2>
      <div
        ref="mapContainer"
        class="w-full h-[600px] bg-gray-200 rounded-lg"
      ></div>
    </div>

    <!-- List Section -->
    <div>
      <div
        class="overflow-y-auto border border-gray-300 rounded-lg p-4"
        style="max-height: 300px"
      >
        <table class="table table-striped w-full" v-if="tripList.length > 0">
          <thead>
            <tr>
              <th>대표이미지</th>
              <th>관광지명</th>
              <th>주소</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(trip, index) in tripList"
              :key="`${trip.title}-${index}`"
              @click="moveToCenter(trip.latitude, trip.longitude)"
              class="cursor-pointer hover:bg-gray-100"
            >
              <td>
                <img
                  :src="trip.firstImage1 || 'src/assets/img/no-img.png'"
                  :alt="trip.title"
                  width="100"
                />
              </td>
              <td>{{ trip.title }}</td>
              <td>{{ trip.addr1 }} {{ trip.addr2 }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-center text-gray-600">검색 결과가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";

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
const initMap = () => {
  if (!mapContainer.value) {
    console.error("지도 오류!");
    return;
  }

  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // Default center
    level: 3, // Zoom level
  };

  map.value = new kakao.maps.Map(mapContainer.value, options);

  // 마커
  // 초기 마커 생성
  const initialMarker = new kakao.maps.Marker({
    position: options.center,
    map: map.value,
    title: "초기 마커",
  });

  markers.value.push(initialMarker);
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
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];

  // 새 마커 추가
  const marker = new kakao.maps.Marker({
    position: newCenter, // 마커 위치를 새 중심 좌표로 설정
    map: map.value, // 표시할 지도 객체
    title: `${location} 중심 마커`, // 마커의 제목
  });

  // 새 마커 배열에 추가
  markers.value.push(marker);
};
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
  selectedRecommendationType: null,
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
  } catch (error) {
    console.error("검색 요청 중 오류 발생:", error);
  }
};

const markerImageSrc =
  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; // 마커 이미지 URL

const addMarkers = () => {
  // 기존 마커 제거
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];

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

    // 마커 클릭 이벤트 추가
    kakao.maps.event.addListener(marker, "click", () => {
      map.value.setCenter(markerPosition);
      alert(`마커 클릭: ${trip.title}`);
    });

    // 새 마커를 배열에 추가
    markers.value.push(marker);
  });

  // 첫 번째 마커의 위치로 지도 중심 이동
  if (firstMarkerPosition) {
    map.value.setCenter(firstMarkerPosition);
  }
};

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
</style>
