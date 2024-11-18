<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- City and Region Navigation -->
    <div class="relative overflow-x-auto pb-8" ref="scrollContainer">
      <div class="flex space-x-6 items-center" ref="locationsContainer">
        <div
          v-for="(location, index) in locations"
          :key="`${location}-${index}`"
          :ref="
            (el) => {
              if (el) locationRefs[index] = el;
            }
          "
          class="flex flex-col items-center transition-all duration-300 ease-in-out cursor-pointer mt-[30px]"
          :class="{ 'scale-105': index === centerIndex }"
          @click="selectLocation(index)"
        >
          <div
            class="rounded-full flex items-center justify-center mb-2 text-white transition-all duration-300"
            :class="{
              'w-24 h-24 bg-[#FF9100]': index === centerIndex,
              'w-20 h-20 bg-[#00712D]': index !== centerIndex,
            }"
          >
            <span class="text-sm text-center">{{ location }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Location -->
    <div v-if="selectedLocation" class="text-center my-8">
      <p class="text-lg font-semibold text-gray-800">
        선택된 지역: {{ selectedLocation }}
      </p>
    </div>

    <!-- Recommendation Text -->
    <div class="text-center my-8">
      <p class="text-gray-700">
        이 지역의 맛집, 숙소, 쇼핑, 숙박 등등을 추천해드려요
      </p>
    </div>

    <!-- Map Section -->
    <div class="mb-8">
      <h2 class="text-xl font-medium mb-4">지도</h2>
      <div class="w-full h-64 bg-gray-200 rounded-lg"></div>
    </div>

    <!-- List Section -->
    <div>
      <h2 class="text-xl font-medium mb-4">리스트</h2>
      <div class="w-full h-64 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

const originalLocations = [
  "서울",
  "인천",
  "대전",
  "대구",
  "광주",
  "부산",
  "울산",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "경상북도",
  "경상남도",
  "전북특별자치도",
  "전라남도",
  "제주도",
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

const selectLocation = (index) => {
  centerIndex.value = index;
  scrollToCenter(index);
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

onMounted(() => {
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
</style>
