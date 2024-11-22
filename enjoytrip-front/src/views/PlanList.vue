<template>
  <div class="min-h-screen bg-[#FFFBE6]/30">
    <div class="container mx-auto py-6 px-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-[#00712D]">여행 계획</h1>

        <button
          class="bg-[#00712D] hover:bg-[#00712D]/90 text-white px-4 py-2 rounded-md flex items-center"
          @click="addNewPlan"
        >
          <PlusIcon class="mr-2 h-4 w-4" />
          새 여행 계획
        </button>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-[#D5ED9F]/30">
            <tr>
              <th
                class="w-[100px] px-6 py-3 text-left text-sm font-medium text-[#00712D]"
              >
                번호
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-[#00712D]"
              >
                여행 계획
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-[#00712D]"
              >
                기간
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="plan in plans"
              :key="plan.id"
              class="hover:bg-[#FFFBE6]/50 transition-colors cursor-pointer"
              @click="viewPlanDetails(plan.id)"
            >
              <td class="px-6 py-4 text-sm text-gray-600">{{ plan.id }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  {{ plan.title }}
                  <span
                    v-if="plan.id === 1"
                    class="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-[#FF9100] text-white"
                  >
                    New
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ plan.dateRange }}
              </td>
            </tr>
          </tbody>
        </table>
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
import { ref } from "vue";
import { PlusIcon } from "lucide-vue-next";
import { useRouter } from "vue-router";
import DateRangeModal from "../components/modal/SelectDate.vue";

const isModalVisible = ref(false);
const selectedDateRange = ref(null);
const router = useRouter();

const plans = ref([
  {
    id: 1,
    title: "제주도 힐링 여행",
    dateRange: "2024.01.01~2024.01.02",
  },
  {
    id: 2,
    title: "부산 맛집 투어",
    dateRange: "2024.01.15~2024.01.17",
  },
  {
    id: 3,
    title: "강원도 스키 여행",
    dateRange: "2024.02.01~2024.02.03",
  },
]);
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

const formatDate = (date) => {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const addNewPlan = () => {
  // 새 여행 계획 추가 로직
  isModalVisible.value = true;
};

const viewPlanDetails = (id) => {
  // 여행 계획 상세 보기 로직

  console.log(`여행 계획 ${id} 상세 보기`);
  router.push("/plandetail");
};
</script>

<style scoped>
/* 추가적인 스타일이 필요한 경우 여기에 작성 */
</style>
