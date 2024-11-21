<template>
    <div class="min-h-screen bg-white">
      <!-- Top Date Selection Bar -->
      <div class="border-b">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h2 class="text-black">{{ travelTitle }}</h2>
            <h2 class="text-black">{{ startDate }}-{{ endDate }}</h2>
            <h2 class="text-sm text-gray-500">
            {{ selectedRegion || "지역" }}
          </h2>

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
            <div class="h-screen flex flex-col items-center p-4 bg-gray-100">
                <div class="flex-1 w-full max-w-md overflow-y-auto space-y-4 mb-4">
                <div v-for="day in days" :key="day" class="flex justify-center">
                    <button class="w-full max-w-xs py-4 bg-white rounded-lg shadow text-lg font-bold hover:bg-gray-50 transition-colors duration-200">
                    {{ day }}
                    </button>
                </div>
                </div>
                <button class="w-full max-w-xs py-4 bg-white border border-black rounded-lg shadow text-lg font-bold hover:bg-gray-50 transition-colors duration-200">
                편집
                </button>
            </div>

          </div>

          <!-- Content Area -->
          <div class="flex-1 bg-white">
            <div class="h-screen flex flex-col p-4 bg-gray-100">
            <h1 class="text-2xl font-bold mb-4">제주도 여행지</h1>
            <div class="flex-1 overflow-y-auto">
            <TransitionGroup name="list" tag="div">
                <div v-for="(item) in items" :key="item.id" class="flex items-center mb-4 p-4 bg-white rounded-lg shadow">
                <img :src="item.image" alt="Item image" class="w-20 h-20 rounded-lg object-cover mr-4" />
                <div class="flex-1">
                    <h2 class="font-bold text-lg">{{ item.title }}</h2>
                    <p class="text-gray-600">{{ item.description }}</p>
                </div>

                </div>
            </TransitionGroup>
            </div>
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
            left: sidebarOpen ? '500px' : '0px',
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
 import { ChevronLeftIcon, ChevronRightIcon,SearchIcon, CheckIcon, PlusIcon, TrashIcon,ChevronUpIcon, ChevronDownIcon  } from "lucide-vue-next";
 import Chart from "chart.js/auto";


 const startDate = ref("");
 const endDate = ref("");
 const selectedRegion = ref("");
 const sidebarOpen = ref(true);
 const currentStep = ref(1);
 const travelTitle = ref("여행계획");
 let chartInstance = null;

  const searchQuery = ref('')
  const days = ref([
  '1일차', '2일차', '3일차', '4일차', '5일차',
  '6일차', '7일차', '8일차', '9일차', '10일차',
  '11일차', '12일차', '13일차', '14일차', '15일차'
])
const items = ref([
  {
    id: 1,
    image: '/placeholder.svg?height=80&width=80',
    title: '순풍해장국',
    description: '대한민국 제주특별자치도 제주시',
  },
  {
    id: 2,
    image: '/placeholder.svg?height=80&width=80',
    title: '제주 해도미락 애월',
    description: '대한민국 제주특별자치도 제주시',
  },
  {
    id: 3,
    image: '/placeholder.svg?height=80&width=80',
    title: '성산 일출봉',
    description: '대한민국 서귀포시 성산 일출봉',
  },
  {
    id: 4,
    image: '/placeholder.svg?height=80&width=80',
    title: '제주동문시장',
    description: '대한민국 제주특별자치도 제주시',
  },
  {
    id: 5,
    image: '/placeholder.svg?height=80&width=80',
    title: '섭지코지',
    description: '대한민국 제주특별자치도 서귀포시',
  },
  {
    id: 6,
    image: '/placeholder.svg?height=80&width=80',
    title: '협재해변',
    description: '제주시 협재해변',
  },
  {
    id: 7,
    image: '/placeholder.svg?height=80&width=80',
    title: '우도',
    description: '제주시 우도',
  },
  {
    id: 8,
    image: '/placeholder.svg?height=80&width=80',
    title: '제주오설록 티뮤지엄',
    description: '대한민국 서귀포시',
  },
  {
    id: 9,
    image: '/placeholder.svg?height=80&width=80',
    title: '새별오름',
    description: '제주시 새별오름',
  },
])
  const selectedTag = ref("0"); // 현재 선택된 태그 저장

  const scrollContainer = ref(null)



 const toggleSidebar = async () => {
  sidebarOpen.value = !sidebarOpen.value;

  if (chartInstance && sidebarOpen.value) {
    // Sidebar가 열릴 때 차트 크기를 재조정
    await nextTick(); // DOM 업데이트 대기
    chartInstance.resize(); // 차트 크기 재조정
  }
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

const removeItem = (id) => {
  items.value = items.value.filter(item => item.id !== id)
}

const moveItem = (index, direction) => {
  if ((direction === -1 && index > 0) || (direction === 1 && index < items.value.length - 1)) {
    const newIndex = index + direction
    const itemToMove = items.value[index]
    items.value.splice(index, 1)
    items.value.splice(newIndex, 0, itemToMove)
  }
}


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

.list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
