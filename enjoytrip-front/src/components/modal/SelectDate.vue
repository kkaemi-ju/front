<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg w-full max-w-3xl p-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-medium mb-2">여행 기간이 어떻게 되시나요?</h2>
        <p class="text-gray-500">
          * 여행 일자는 최대 {{ maxDays }}일까지 설정 가능합니다.
        </p>
        <p class="text-gray-500">
          현재 여행 기간(여행지 도착 날짜, 여행지 출발 날짜)으로 입력해 주세요.
        </p>
      </div>

      <div class="flex gap-12 justify-center mb-8">
        <button class="self-center text-gray-400" @click="previousMonth">
          <ChevronLeftIcon class="h-6 w-6" />
        </button>

        <div v-for="offset in 2" :key="offset" class="flex-1">
          <div class="text-center mb-6 text-xl font-semibold text-[#00712D]">
            {{ formatYearMonth(addMonths(currentDate, offset - 1)) }}
          </div>

          <div class="grid grid-cols-7 mb-2">
            <div
              v-for="day in ['일', '월', '화', '수', '목', '금', '토']"
              :key="day"
              class="text-center py-2"
            >
              <span
                :class="
                  day === '일'
                    ? 'text-red-500'
                    : day === '토'
                    ? 'text-blue-500'
                    : ''
                "
              >
                {{ day }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="date in getDaysInMonth(offset)"
              :key="date.toISOString()"
              class="aspect-square"
            >
              <button
                v-if="isValidDate(date)"
                @click="selectDate(date)"
                :class="[
                  'w-full h-full rounded-lg flex items-center justify-center',
                  isSelected(date)
                    ? 'bg-[#00712D] text-white'
                    : isInRange(date)
                    ? 'bg-[#D5ED9F] text-black'
                    : 'hover:bg-gray-100 text-black',
                  isDisabled(date)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : '',
                  date.getDay() === 0 ? 'text-red-500' : '',
                  date.getDay() === 6 ? 'text-blue-500' : '',
                ]"
                :disabled="isDisabled(date)"
              >
                {{ date.getDate() }}
              </button>
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-300"
              >
                {{ date.getDate() }}
              </div>
            </div>
          </div>
        </div>

        <button class="self-center text-gray-400" @click="nextMonth">
          <ChevronRightIcon class="h-6 w-6" />
        </button>
      </div>

      <div class="flex justify-end space-x-4">
        <button
          @click="confirmSelection"
          class="bg-[#FF9100] text-white px-8 py-3 rounded-lg hover:bg-[#FF9100]/90"
        >
          선택
        </button>
        <button
          @click="cancelSelection"
          class="bg-gray-300 text-black px-8 py-3 rounded-lg hover:bg-gray-400"
        >
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-vue-next";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  maxDays: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["close", "select", "cancel"]);

const currentDate = ref(new Date());
const selectedDates = ref([]);

// Methods
const addMonths = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

const formatYearMonth = (date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};

const getDaysInMonth = (offset) => {
  const date = addMonths(currentDate.value, offset - 1);
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];

  // Add previous month's days
  for (let i = 0; i < firstDay.getDay(); i++) {
    const prevDate = new Date(year, month, -i);
    days.unshift(prevDate);
  }

  // Add current month's days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Add next month's days to complete the grid
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};

const isValidDate = (date) => {
  const currentMonth = currentDate.value.getMonth();
  const dateMonth = date.getMonth();
  const offset = dateMonth - currentMonth;
  return offset >= 0 && offset <= 1;
};

const isSelected = (date) => {
  return selectedDates.value.some(
    (selectedDate) => selectedDate.toDateString() === date.toDateString()
  );
};

const isDisabled = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

const selectDate = (date) => {
  if (selectedDates.value.length === 2) {
    selectedDates.value = [date];
  } else if (selectedDates.value.length === 1) {
    const firstDate = selectedDates.value[0];
    if (date < firstDate) {
      selectedDates.value = [date];
    } else {
      const daysDiff = Math.floor((date - firstDate) / (1000 * 60 * 60 * 24));
      if (daysDiff > props.maxDays - 1) {
        const maxDate = new Date(firstDate);
        maxDate.setDate(maxDate.getDate() + props.maxDays - 1);
        selectedDates.value = [firstDate, maxDate];
      } else {
        selectedDates.value = [firstDate, date];
      }
    }
  } else {
    selectedDates.value = [date];
  }
};

const previousMonth = () => {
  currentDate.value = addMonths(currentDate.value, -1);
};

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1);
};

const confirmSelection = () => {
  if (selectedDates.value.length === 2) {
    emit("select", {
      startDate: selectedDates.value[0],
      endDate: selectedDates.value[1],
    });
    emit("close");
  }
};

// New function added
const isInRange = (date) => {
  if (selectedDates.value.length !== 2) return false;
  const [start, end] = selectedDates.value.sort((a, b) => a - b);
  return date > start && date < end;
};

const cancelSelection = () => {
  selectedDates.value = [];
  currentDate.value = new Date();
  emit("cancel");
};
</script>
