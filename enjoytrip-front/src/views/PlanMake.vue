<template>
    <div class="min-h-screen bg-white">
      <!-- Top Date Selection Bar -->
      <div class="border-b">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
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
              <input
                type="text"
                :value="formatDateRange"
                @click="showDatePicker = !showDatePicker"
                class="px-4 py-2 border rounded-md cursor-pointer bg-white"
                readonly
              />
              <!-- Date Picker Popup -->
              <div
                v-if="showDatePicker"
                class="absolute top-12 left-0 z-50 bg-white border rounded-lg shadow-lg p-4"
              >
                <div class="flex gap-4 mb-4">
                  <div>
                    <label class="block text-sm mb-1">시작 날짜</label>
                    <input
                      type="date"
                      v-model="startDate"
                      class="px-2 py-1 border rounded"
                    />
                  </div>
                  <div>
                    <label class="block text-sm mb-1">종료 날짜</label>
                    <input
                      type="date"
                      v-model="endDate"
                      class="px-2 py-1 border rounded"
                    />
                  </div>
                </div>
                <div class="flex justify-end">
                  <button
                    @click="showDatePicker = false"
                    class="px-4 py-2 bg-[#00712D] text-white rounded hover:bg-[#00712D]/90"
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="text-sm text-gray-500">
            {{ selectedRegion || "지역" }}
          </div>
        </div>
      </div>

      <div class="flex relative">
        <!-- Left Sidebar -->
        <div
          :class="['transition-all duration-300', sidebarOpen ? 'w-[500px]' : 'w-0']"
          class="flex bg-white border-r overflow-hidden"
        >
          <!-- Steps Navigation -->
          <div class="w-[160px] bg-white border-r flex flex-col justify-between">
            <div class="p-4 space-y-4">
              <!-- Step 1 -->
              <div
                :class="[
                  'p-3 rounded cursor-pointer',
                  currentStep === 1 ? 'bg-[#00712D]/10 text-[#00712D]' : 'hover:bg-gray-100'
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
                  currentStep === 2 ? 'bg-[#00712D]/10 text-[#00712D]' : 'hover:bg-gray-100'
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
                v-model="selectedRegion"
                class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00712D]"
              >
                <option value="">지역을 선택하세요</option>
                <option value="서울">서울</option>
                <option value="대구">대구</option>
                <option value="부산">부산</option>
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
              <div  class="text-sm text-gray-500">
                지역을 먼저 선택해주세요
              </div>
            <div>
                <div class="flex justify-center mb-4">
                    <select
                    v-model="selectedDay"
                    class="border border-gray rounded-md px-4 py-2 text-center"
                    style="width:100%"
                    >
                    <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
                    </select>
                </div>

                <div class="flex items-center mb-4">
                    <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="장소명을 입력하세요"
                    class="flex-1 border rounded-md px-4 py-2"
                    />
                    <button class="ml-2">
                    <SearchIcon class="h-5 w-5 text-gray-500" />
                    </button>
                </div>
                <div class="flex items-center space-x-2">
                    <button @click="scrollLeft" class="p-2">
                    <ChevronLeftIcon class="h-5 w-5 text-gray-600" />
                    </button>
                    <div ref="scrollContainer" class="flex overflow-x-auto space-x-2">
                        <button
                        v-for="(tag, index) in tags"
                        :key="index"
                        @click="toggleTag(tag)"
                        :class="[
                            'flex-shrink-0 px-3 py-1 border rounded-full',
                            selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
                        ]"
                        >
                        {{ tag }}
                        </button>

                    </div>
                    <button @click="scrollRight" class="p-2">
                    <ChevronRightIcon class="h-5 w-5 text-gray-600" />
                    </button>
                </div>
                <ul class="space-y-4">
                    <li
                    v-for="place in filteredPlaces"
                    :key="place.id"
                    class="flex items-center justify-between p-2 border rounded-md"
                    >
                    <div class="flex items-center">
                        <img :src="place.image" alt="" class="w-16 h-16 rounded-md mr-4" />
                        <div>
                        <h3 class="font-bold">{{ place.name }}</h3>
                        <p class="text-sm text-gray-500">{{ place.address }}</p>
                        </div>
                    </div>
                    <button
                        @click="toggleSelection(place.id)"
                        :class="[
                        'w-8 h-8 flex items-center justify-center rounded-full',
                        place.selected ? 'bg-blue-200' : 'bg-gray-200'
                        ]"
                    >
                        <CheckIcon v-if="place.selected" class="h-5 w-5 text-blue-600" />
                        <PlusIcon v-else class="h-5 w-5 text-gray-600" />
                    </button>
                    </li>
                </ul>
            </div>

        </div>


    </div>
</div>

        <!-- List Sidebar for Step 2 -->
        <div
          v-if="currentStep === 2"
          :class="['transition-all duration-300', sidebarOpen ? 'w-[300px]' : 'w-0']"
          class="bg-white border-r overflow-hidden"
        >
          <div class="p-4">
            <h3 class="text-lg font-medium mb-4">리스트</h3>
            <div class="text-sm text-gray-500">
              리스트 내용이 들어갈 공간
            </div>
          </div>
        </div>

        <!-- Collapse Button -->
        <button
        @click="toggleSidebar"
        :class="[
            'absolute w-6 h-16 bg-white border border-l-0 rounded-r flex items-center justify-center hover:bg-gray-50 z-10 transition-all duration-300',
            { 'left-0': !sidebarOpen }
        ]"
        :style="{
            left: sidebarOpen ? (currentStep === 2 ? '800px' : '500px') : '0px',
             // 항상 부모 요소의 가운데에 위치

        }"
        >
        <ChevronLeftIcon v-if="sidebarOpen" class="h-5 w-5" />
        <ChevronRightIcon v-else class="h-5 w-5" />
        </button>

        <!-- Right Content Area (Map Placeholder) -->
        <div class="flex-1 bg-gray-50 min-h-[calc(100vh-64px)]">
          <div class="h-full flex items-center justify-center text-gray-400">
            암튼차트
          </div>
        </div>
      </div>
    </div>
  </template>
 <script setup>
 import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
 import { ChevronLeftIcon, ChevronRightIcon,SearchIcon, CheckIcon, PlusIcon } from "lucide-vue-next";
 import Chart from "chart.js/auto";

 const showDatePicker = ref(false);
 const startDate = ref("");
 const endDate = ref("");
 const selectedRegion = ref("");
 const sidebarOpen = ref(true);
 const currentStep = ref(1);
 const travelTitle = ref("");
 let chartInstance = null;

 const days = ['1일차', '2일차', '3일차']
  const selectedDay = ref(days[0])
  const searchQuery = ref('')
  const tags = ['관광지', '문화시설', '축제공연행사', '쇼핑','음식점']

  const places = ref([
    { id: 1, name: '할로나 블로우 홀 전망대', address: '8459-8481 Kalaniana\'ole Hwy, Honolulu, HI 96825, USA', image: '/placeholder.svg?height=64&width=64', selected: true },
    { id: 2, name: '다이아몬드헤드 산', address: 'Diamond Head, Honolulu, HI 96815, USA', image: '/placeholder.svg?height=64&width=64', selected: true },
    { id: 3, name: '이올라니 궁전', address: '364 S King St, Honolulu, HI 96813, USA', image: '/placeholder.svg?height=64&width=64', selected: false },
    { id: 4, name: '테디스 비거 버거스 - 하와이 카이', address: '7192 Kalaniana\'ole Hwy E124, Honolulu, HI 96825, USA', image: '/placeholder.svg?height=64&width=64', selected: false },
    { id: 5, name: 'T 갤러리아', address: '330 Royal Hawaiian Ave, Honolulu, HI 96815, USA', image: '/placeholder.svg?height=64&width=64', selected: false },
    { id: 6, name: 'Hanauma Bay', address: 'Hanauma Bay, Hawaii 96825, USA', image: '/placeholder.svg?height=64&width=64', selected: false },
    { id: 7, name: '와이키키 비치', address: 'Waikiki Beach, Honolulu, HI 96815, USA', image: '/placeholder.svg?height=64&width=64', selected: false },
  ])

  const selectedTag = ref("0"); // 현재 선택된 태그 저장

  const scrollContainer = ref(null)

    const scrollLeft = () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollBy({ left: -100, behavior: 'smooth' })
    }
    }

    const scrollRight = () => {
        if (scrollContainer.value) {
            scrollContainer.value.scrollBy({ left: 100, behavior: 'smooth' })
        }
    }
    // 태그 클릭 함수
    const toggleTag = (tag) => {
        selectedTag.value = tag; // 태그 선택
        console.log("선택된 태그:", selectedTag.value);
    };
  const filteredPlaces = computed(() => {
    return places.value.filter(place =>
      place.name.includes(searchQuery.value)
    )
  })

  const toggleSelection = (id) => {
    const place = places.value.find(place => place.id === id)
    if (place) {
      place.selected = !place.selected
    }
  }


 const formatDateRange = computed(() => {
   if (!startDate.value || !endDate.value) return "날짜를 선택하세요";
   if (new Date(endDate.value) >= new Date(startDate.value)) {
     return `${startDate.value} ~ ${endDate.value}`;
   } else {
     alert("종료 날짜는 시작 날짜 이후로 선택해주세요.");
     return "날짜를 선택하세요";
   }
 });

 const toggleSidebar = async () => {
  sidebarOpen.value = !sidebarOpen.value;

  if (chartInstance && sidebarOpen.value) {
    // Sidebar가 열릴 때 차트 크기를 재조정
    await nextTick(); // DOM 업데이트 대기
    chartInstance.resize(); // 차트 크기 재조정
  }
};

 const saveTravel = () => {
   console.log("Travel saved:", {
     travelTitle: travelTitle.value,
     startDate: startDate.value,
     endDate: endDate.value,
     selectedRegion: selectedRegion.value,
   });
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

 // Lifecycle hooks
 onMounted(() => {
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
</style>
