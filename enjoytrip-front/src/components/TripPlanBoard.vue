<template>
  <div class="max-w-md">
    <div class="relative rounded-3xl overflow-hidden group">
      <!-- Background Image -->
      <img
        :src="imageSrc"
        alt="Travel destination landscape"
        class="w-full h-[280px] object-cover"
      />

      <!-- Gradient Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70"
      ></div>

      <!-- Content -->
      <div class="absolute inset-0 p-6 flex flex-col">
        <!-- Bottom Content -->
        <div class="flex-grow flex flex-col justify-end space-y-3">
          <div class="text-white/90 text-base font-medium">
            {{ date }}
          </div>
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h2 class="text-white text-xl font-bold">{{ title }}</h2>
            </div>
            <div class="inline-flex items-center gap-1.5">
              <MapPinIcon class="h-4 w-4 text-white/80" />
              <span class="text-white/80 text-sm">{{ location }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XIcon, MapPinIcon } from "lucide-vue-next";

defineProps({
  date: String,
  editDate: String,
  title: String,
  locationCount: Number,
  imageSrc: String,
  location: String,
});
</script>

<style scoped>
.group:hover img {
  transform: scale(1.05);
  transition: transform 0.3s ease-in-out;
}

img {
  transition: transform 0.3s ease-in-out;
}
</style>
