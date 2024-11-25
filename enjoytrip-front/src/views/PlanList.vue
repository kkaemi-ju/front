<template>
  <div class="min-h-screen bg-[#FFFBE6]/30">
    <div class="container mx-auto py-6 px-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-[#00712D]">여행 계획</h1>

        <button
          class="bg-[#FF9100] hover:bg-[#FF9100]/90 text-white px-4 py-2 rounded-md flex items-center"
          @click="addNewPlan"
        >
          <PlusIcon class="mr-2 h-4 w-4" />
          새 여행 계획
        </button>
      </div>

      <!-- Board Layout -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="plan in plans"
          :key="plan.tripPlanId"
          @click="viewPlanDetails(plan.tripPlanId)"
          class="cursor-pointer"
        >
          <TripPlanBoard
            :date="plan.dateRange"
            :title="plan.title"
            :location="plan.location"
            :imageSrc="plan.imageSrc"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-6">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 mx-1 text-white bg-[#00712D] rounded-md hover:bg-[#00712D]/90 disabled:opacity-50"
        >
          이전
        </button>

        <button
          v-for="pageNum in displayedPages"
          :key="pageNum"
          @click="goToPage(pageNum)"
          :class="[
            'px-4 py-2 mx-1 rounded-md',
            pageNum === currentPage
              ? 'bg-[#D5ED9F]/30 text-[#00712D]'
              : 'text-gray-600 bg-white hover:bg-[#D5ED9F]/30',
          ]"
        >
          {{ pageNum }}
        </button>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 mx-1 text-white bg-[#00712D] rounded-md hover:bg-[#00712D]/90 disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
    <DateRangeModal
      :isVisible="isModalVisible"
      @cancel="cancelModal"
      @close="closeModal"
      @select="handleDateSelection"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { PlusIcon } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import DateRangeModal from "../components/modal/SelectDate.vue";
import TripPlanBoard from "../components/TripPlanBoard.vue";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const router = useRouter();
const isModalVisible = ref(false);
const selectedDateRange = ref(null);
const currentPage = ref(1);
const itemsPerPage = 8; // 한 페이지당 보여줄 카드 수 조정
const allPlans = ref([]);
const originalLocations = [
  { sido_code: 1, sido_name: "서울", image: "/src/assets/img/Seoul.png" },
  { sido_code: 2, sido_name: "인천", image: "/src/assets/img/Incheon.png" },
  { sido_code: 3, sido_name: "대전", image: "/src/assets/img/Daejeon.png" },
  { sido_code: 4, sido_name: "대구", image: "/src/assets/img/Daegu.png" },
  { sido_code: 5, sido_name: "광주", image: "/src/assets/img/Gwangju.png" },
  { sido_code: 6, sido_name: "부산", image: "/src/assets/img/Busan.png" },
  { sido_code: 7, sido_name: "울산", image: "/src/assets/img/Ulsan.png" },
  {
    sido_code: 8,
    sido_name: "세종",
    image: "/src/assets/img/Sejong.png",
  },
  { sido_code: 31, sido_name: "경기도", image: "/src/assets/img/Gyeonggi.png" },
  {
    sido_code: 32,
    sido_name: "강원도",
    image: "/src/assets/img/Gangwon.png",
  },
  {
    sido_code: 33,
    sido_name: "충청북도",
    image: "/src/assets/img/Chungbuk.png",
  },
  {
    sido_code: 34,
    sido_name: "충청남도",
    image: "src/assets/img/Chungnam.png",
  },
  {
    sido_code: 35,
    sido_name: "경상북도",
    image: "src/assets/img/Gyeongbuk.png",
  },
  {
    sido_code: 36,
    sido_name: "경상남도",
    image: "src/assets/img/Gyeongnam.png",
  },
  {
    sido_code: 37,
    sido_name: "전라북도",
    image: "/src/assets/img/Jeonbuk.png",
  },
  {
    sido_code: 38,
    sido_name: "전라남도",
    image: "/src/assets/img/Jeonnam.png",
  },
  { sido_code: 39, sido_name: "제주도", image: "/src/assets/img/Jeju.png" },
];

const plans = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allPlans.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(allPlans.value.length / itemsPerPage);
});

const displayedPages = computed(() => {
  const pages = [];
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + 4);

  if (end - start < 4) {
    start = Math.max(1, end - 4);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (pageNum) => {
  currentPage.value = pageNum;
};

const getImageBySidoCode = (sidoCode) => {
  const location = originalLocations.find((loc) => loc.sido_code === sidoCode);
  return location ? location.image : "src/assets/img/no-img.png";
};

const getSidoNameByCode = (sidoCode) => {
  const location = originalLocations.find((loc) => loc.sido_code === sidoCode);
  return location ? location.sido_name : "";
};

const fetchPlans = async () => {
  try {
    const response = await axios.get(
      `http://localhost/tripplan/${userInfo.value.userId}`
    );

    const sortedData = response.data.sort(
      (a, b) => b.tripPlanId - a.tripPlanId
    );

    allPlans.value = sortedData.map((plan) => ({
      tripPlanId: plan.tripPlanId,
      title: plan.tripName,
      dateRange: `${plan.startDate}~${plan.endDate}`,
      imageSrc: getImageBySidoCode(plan.sidoCode),
      location: getSidoNameByCode(plan.sidoCode),
    }));

    console.log("Mapped Plans:", allPlans.value); // 디버깅용
  } catch (error) {
    console.error("Error fetching trip plans:", error);
  }
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
const closeModal = () => {
  isModalVisible.value = false;
  router.push({
    name: "planmake",
    query: {
      startdate: selectedDateRange.value.startDate,
      enddate: selectedDateRange.value.endDate,
      day: calculateDays(
        selectedDateRange.value.startDate,
        selectedDateRange.value.endDate
      ),
    },
  });
};

const cancelModal = () => {
  isModalVisible.value = false;
};
const handleDateSelection = (dateRange) => {
  selectedDateRange.value = dateRange;
  closeModal();
};

const addNewPlan = () => {
  // 새 여행 계획 추가 로직
  isModalVisible.value = true;
};

const viewPlanDetails = (tripPlanId) => {
  // 여행 계획 상세 보기 로직

  console.log(`여행 계획 ${tripPlanId} 상세 보기`);
  router.push({
    name: "plandetail",
    query: {
      tripPlanId, // 쿼리 매개변수로 tripPlanId 전
    },
  });
};
onMounted(() => {
  fetchPlans(); // 컴포넌트 로드 시 데이터 가져오기
});
</script>

<style scoped>
/* 추가적인 스타일이 필요한 경우 여기에 작성 */

/* 페이지네이션 버튼 호버 효과 */
button:not(:disabled):hover {
  opacity: 0.9;
}

/* 페이지네이션 버튼 트랜지션 */
button {
  transition: all 0.2s ease-in-out;
}
</style>
