<template>
  <div class="bg-white flex flex-col min-h-screen">
    <!-- Main Content -->
    <main class="flex-grow">
      <!-- Hero Section -->
      <section class="relative h-[500px] overflow-hidden">
        <div
          class="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out flex"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="(slide, index) in heroSlides"
            :key="index"
            class="w-full h-full flex-shrink-0 bg-cover bg-center relative"
            :style="{ backgroundImage: `url(${slide.image})` }"
          >
            <!-- 검은색 배경 -->
            <div class="absolute inset-0 bg-black bg-opacity-50"></div>

            <!-- 슬라이드 내용 -->
            <div
              class="container mx-auto relative h-full flex items-center justify-center text-white px-4"
            >
              <div class="text-center space-y-4">
                <h1 class="text-4xl font-bold">{{ slide.title }}</h1>
                <p class="text-lg text-[#D5ED9F]">{{ slide.subtitle }}</p>
                <!-- 버튼 -->
                <div class="flex justify-center gap-4 mt-8">
                  <button
                    class="px-4 py-2 bg-[#FF9100] hover:bg-[#FF9100]/90 hover:scale-110 text-white rounded"
                    @click="navigateToAttractions"
                  >
                    여행지 찾기
                  </button>
                  <button
                    class="px-4 py-2 border border-white hover:scale-110 text-white hover:bg-white/20 rounded"
                    @click="navigateToTripPlan"
                  >
                    여행 계획 만들기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button
          @click="prevSlide"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 p-2 rounded-full transition-colors"
        >
          <ChevronLeft class="h-6 w-6 text-gray-800" />
        </button>
        <button
          @click="nextSlide"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 p-2 rounded-full transition-colors"
        >
          <ChevronRight class="h-6 w-6 text-gray-800" />
        </button>

        <!-- Slide Controls -->
        <div
          class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/30 px-6 py-3 rounded-full"
        >
          <!-- Slide Counter -->
          <div class="text-white font-medium">
            {{ currentSlide + 1 }} / {{ heroSlides.length }}
          </div>

          <!-- Progress Bar -->
          <div class="w-32 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              class="h-full bg-white transition-all duration-100"
              :style="{ width: `${(timeLeft / slideDuration) * 100}%` }"
            ></div>
          </div>

          <!-- Play/Pause Button -->
          <button
            @click="toggleSlideShow"
            class="text-white hover:text-gray-200 transition-colors"
          >
            <Pause v-if="isPlaying" class="h-5 w-5" />
            <Play v-else class="h-5 w-5" />
          </button>
        </div>
      </section>

      <!-- Categories -->
      <section class="py-12 bg-white">
        <div class="container mx-auto max-w-screen-lg px-4">
          <div
            class="grid grid-cols-1 sm:grid-cols-4 gap-8 justify-items-center"
          >
            <router-link
              v-for="category in categories"
              :key="category.name"
              :to="category.link"
              class="group flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1"
            >
              <!-- 아이콘 -->
              <component
                :is="category.icon"
                class="w-10 h-10 mb-2 transition-all duration-300"
                :class="[category.iconColor]"
              />
              <!-- 텍스트 -->
              <span
                class="text-base font-semibold text-center transition-all duration-300"
                :class="[category.textColor]"
              >
                {{ category.name }}
              </span>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Hot Spots -->
      <section class="py-12 bg-white">
        <div class="container mx-auto px-4 bg-white">
          <h2 class="text-2xl font-bold mb-8">요즘 핫한 관광지?!</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="spot in hotSpots"
              :key="spot.title"
              class="overflow-hidden hover:shadow-lg transition-shadow bg-white rounded-lg border-2"
            >
              <img
                :src="spot.image"
                :alt="spot.title"
                class="w-full h-48 object-cover"
              />
              <div class="p-4">
                <h3 class="font-semibold">{{ spot.title }}</h3>
                <p class="text-sm text-gray-600 mt-2">
                  {{ spot.addr }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { Menu, ChevronLeft, ChevronRight, Pause, Play } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { MapPin, Calendar, MessageSquare, User } from "lucide-vue-next";
import axios from "axios";

const router = useRouter(); // 라우터 인스턴스 생성
const categories = ref([
  {
    name: "관광지",
    link: "/attractions",
    icon: MapPin,
    iconColor: "text-[#00712D] group-hover:text-[#FF9100]",
    textColor: "text-[#00712D] group-hover:text-[#FF9100]",
  },
  {
    name: "여행계획",
    link: "/planlist",
    icon: Calendar,
    iconColor: "text-[#FF9100] group-hover:text-[#00712D]",
    textColor: "text-[#FF9100] group-hover:text-[#00712D]",
  },
  {
    name: "게시판",
    link: "/board",
    icon: MessageSquare,
    iconColor: "text-[#00712D] group-hover:text-[#FF9100]",
    textColor: "text-[#00712D] group-hover:text-[#FF9100]",
  },
  {
    name: "마이페이지",
    link: "/mypage",
    icon: User,
    iconColor: "text-[#FF9100] group-hover:text-[#00712D]",
    textColor: "text-[#FF9100] group-hover:text-[#00712D]",
  },
]);

const hotSpots = ref([]);

const heroSlides = ref([
  {
    image: "/src/assets/img/image-copy6.png",
    title: "당신의 완벽한 여행을 찾아보세요",
    subtitle: "특별한 순간, 특별한 장소에서",
  },
  {
    image: "/src/assets/img/image-copy.png",
    title: "새로운 모험을 경험하세요",
    subtitle: "잊지 못할 추억을 만들어보세요",
  },
  {
    image: "/src/assets/img/image-copy3.png",
    title: "당신만의 여행 스토리",
    subtitle: "떠나GO와 함께 시작하세요",
  },
]);

const currentSlide = ref(0);
const isPlaying = ref(true);
const slideInterval = ref(null);
const timeLeft = ref(3000);
const slideDuration = 3000; // 5 seconds

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length;
  timeLeft.value = slideDuration;
};

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + heroSlides.value.length) %
    heroSlides.value.length;
  timeLeft.value = slideDuration;
};

const startSlideShow = () => {
  if (!slideInterval.value) {
    slideInterval.value = setInterval(() => {
      timeLeft.value -= 100;
      if (timeLeft.value <= 0) {
        nextSlide();
      }
    }, 100);
  }
};

const stopSlideShow = () => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value);
    slideInterval.value = null;
  }
};

const toggleSlideShow = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    startSlideShow();
  } else {
    stopSlideShow();
  }
};

// 여행지 찾기 버튼 클릭 시 이동
const navigateToAttractions = () => {
  router.push("/attractions"); // "/attractions" 경로로 이동
};

const navigateToTripPlan = () => {
  router.push("/planlist");
};

const getTopAttractions = async () => {
  try {
    const response = await axios.get(`http://localhost/attraction/top`);
    if (response.status === 200) {
      const topAttractions = response.data.slice(0, 4); // 상위 5개

      const AttractionList = topAttractions.map(
        (attraction) => attraction.attractions_no
      );
      getImageAndName(AttractionList);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getImageAndName = async (AttractionList) => {
  // 백에서 이름이랑 이미지 받아오기
  try {
    const response = await axios.post(
      `http://localhost/attraction/info`,
      AttractionList
    );
    if (response.status === 200) {
      console.log("infos : " + response.data);
      hotSpots.value = response.data.map((info) => ({
        title: info.title,
        image: info.firstImage1 || "/src/assets/img/no-img2.jpg",
        addr: info.addr1,
      }));
    }
  } catch (error) {
    console.error(error.message);
  }
};
// Watch for manual navigation to reset timer
watch(currentSlide, () => {
  timeLeft.value = slideDuration;
});

onMounted(() => {
  timeLeft.value = slideDuration;
  if (isPlaying.value) {
    startSlideShow();
  }
  getTopAttractions();
});

onUnmounted(() => {
  stopSlideShow();
});
</script>

<style scoped>
body {
  background: none !important;
}
</style>
