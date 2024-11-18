<template>
  <div class="bg-[#FFFBE6] flex flex-col min-h-screen">
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
            class="w-full h-full flex-shrink-0 bg-cover bg-center"
            :style="{ backgroundImage: `url(${slide.image})` }"
          >
            <div class="absolute inset-0 bg-black bg-opacity-50"></div>
            <div
              class="container mx-auto relative h-full flex items-center justify-center text-white px-4"
            >
              <div class="text-center space-y-4">
                <h1 class="text-4xl font-bold">{{ slide.title }}</h1>
                <p class="text-lg text-[#D5ED9F]">{{ slide.subtitle }}</p>
                <div class="flex justify-center gap-4 mt-8">
                  <button
                    class="px-4 py-2 bg-[#FF9100] hover:bg-[#FF9100]/90 text-white rounded"
                  >
                    여행지 찾기
                  </button>
                  <button
                    class="px-4 py-2 border border-white text-white hover:bg-white/20 rounded"
                  >
                    더 알아보기
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <router-link
              v-for="category in categories"
              :key="category.name"
              :to="category.link"
              class="block mb-4"
            >
              <div
                class="bg-gray-100 h-24 md:h-32 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <span class="text-xl">{{ category.name }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Hot Spots -->
      <section class="py-12 bg-[#FFFBE6]">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl font-bold mb-8">요즘 핫한 관광지?!</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="spot in hotSpots"
              :key="spot.title"
              class="overflow-hidden hover:shadow-lg transition-shadow bg-white rounded-lg"
            >
              <img
                :src="spot.image"
                :alt="spot.title"
                class="w-full h-48 object-cover"
              />
              <div class="p-4">
                <h3 class="font-semibold">{{ spot.title }}</h3>
                <p class="text-sm text-gray-600 mt-2">
                  특별한 순간을 만나보세요
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


const categories = ref([
  { name: "관광지", link: "/spots" },
  { name: "계획", link: "/plan" },
  { name: "숙소", link: "/accommodation" },
]);

const hotSpots = ref([
  { title: "싸피 구미캠", image: "/placeholder.svg?height=400&width=300" },
  { title: "재경집", image: "/placeholder.svg?height=400&width=300" },
  { title: "선주집", image: "/placeholder.svg?height=400&width=300" },
  { title: "추천 명소", image: "/placeholder.svg?height=400&width=300" },
]);

const heroSlides = ref([
  {
    image: "/placeholder.svg?height=500&width=1000",
    title: "당신의 완벽한 여행을 찾아보세요",
    subtitle: "특별한 순간, 특별한 장소에서",
  },
  {
    image: "/placeholder.svg?height=500&width=1000",
    title: "새로운 모험을 경험하세요",
    subtitle: "잊지 못할 추억을 만들어보세요",
  },
  {
    image: "/placeholder.svg?height=500&width=1000",
    title: "당신만의 여행 스토리",
    subtitle: "TravelGo와 함께 시작하세요",
  },
]);

const currentSlide = ref(0);
const isPlaying = ref(true);
const slideInterval = ref(null);
const timeLeft = ref(5000);
const slideDuration = 5000; // 5 seconds

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

// Watch for manual navigation to reset timer
watch(currentSlide, () => {
  timeLeft.value = slideDuration;
});

onMounted(() => {
  timeLeft.value = slideDuration;
  if (isPlaying.value) {
    startSlideShow();
  }
});

onUnmounted(() => {
  stopSlideShow();
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
