<template>
  <div>
    <button @click="openModal" class="bg-blue-700 text-white px-4 py-2 rounded">
      Show company news
    </button>

    <Transition name="modal">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div
          class="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col"
        >
          <!-- Header -->
          <div class="bg-blue-700 p-4 text-white rounded-t-lg">
            <h2 class="text-xl font-bold">Company News</h2>
          </div>

          <!-- Chat messages -->
          <div class="flex-1 overflow-auto p-4 space-y-4">
            <TransitionGroup name="message" tag="div">
              <div
                v-for="message in messages"
                :key="message.id"
                :class="[
                  'flex items-start gap-2',
                  message.sender === 'user' ? 'justify-end' : 'justify-start',
                ]"
              >
                <div
                  v-if="message.sender === 'bot'"
                  class="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white"
                >
                  C
                </div>
                <div class="flex flex-col gap-1">
                  <div
                    :class="[
                      'p-3 rounded-lg',
                      message.sender === 'user'
                        ? 'bg-blue-700 text-white'
                        : 'bg-gray-100',
                    ]"
                  >
                    {{ message.text }}
                  </div>
                  <span class="text-xs text-gray-500">{{
                    message.timestamp
                  }}</span>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Company cards -->
          <Transition name="cards">
            <div v-if="showCompanyCards" class="p-4 space-y-2">
              <div
                v-for="company in companies"
                :key="company.name"
                class="p-4 bg-white shadow rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div class="text-green-500 text-sm">
                  Today Gain {{ company.gain }} ↑
                </div>
                <div class="text-blue-700">{{ company.name }}</div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isModalOpen = ref(false);
const messages = ref([]);
const showCompanyCards = ref(false);

const companies = [
  { name: "Alphabet Inc.", gain: "268.50" },
  { name: "Google", gain: "120.34" },
];

const userMessages = ["Show company news", "Alphabet", "Show me the details"];

const botMessages = [
  "Which company do you want to take a look at?",
  "Please help me select the company below?",
  "Here are the latest stock updates for your selected company.",
];

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")} ${
    now.getHours() >= 12 ? "PM" : "AM"
  }`;
};

const addMessage = (text, sender) => {
  messages.value.push({
    id: messages.value.length,
    text,
    sender,
    timestamp: getCurrentTime(),
  });
};

const openModal = () => {
  isModalOpen.value = true;
  setTimeout(sendMessages, 2000);
};

const sendMessages = () => {
  let delay = 0;
  userMessages.forEach((msg, index) => {
    setTimeout(() => {
      addMessage(msg, "user");
      setTimeout(() => addMessage(botMessages[index], "bot"), 1000);
      if (index === userMessages.length - 1) {
        setTimeout(() => (showCompanyCards.value = true), 1000);
      }
    }, delay);
    delay += 4000; // 2초 후 사용자 메시지, 2초 후 봇 메시지
  });
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}
.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.cards-enter-active,
.cards-leave-active {
  transition: all 0.3s ease;
}
.cards-enter-from,
.cards-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
