<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-96 p-6">
      <h2 class="text-xl font-bold mb-4 text-[#00712D]">회원가입</h2>
      <form @submit.prevent="handleSubmit">
        <!-- Name Field -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-[#00712D]">이름</label>
          <input
            v-model="joinForm.name"
            type="text"
            placeholder="이름 입력"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <!-- ID Field with Validation -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-[#00712D]">아이디</label>
          <div class="flex space-x-2">
            <input
              v-model="joinForm.id"
              type="text"
              placeholder="아이디 입력"
              class="flex-grow border rounded px-3 py-2"
            />
            <button
              type="button"
              @click="checkIdDuplicate"
              class="px-4 py-2 bg-[#00712D] text-white rounded hover:bg-[#FF9100] transition"
            >
              중복 확인
            </button>
          </div>
          <p
            v-if="idCheckMessage"
            :class="isIdAvailable ? 'text-green-600' : 'text-red-600'"
            class="mt-1 text-sm"
          >
            {{ idCheckMessage }}
          </p>
        </div>

        <!-- Password Fields -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-[#00712D]">비밀번호</label>
          <input
            v-model="joinForm.password"
            type="password"
            placeholder="비밀번호 입력"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <!-- Password Confirmation -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-[#00712D]">비밀번호 확인</label>
          <input
            v-model="passwordConfirm"
            type="password"
            placeholder="비밀번호 재입력"
            class="w-full border rounded px-3 py-2"
          />
          <p
            v-if="passwordConfirm && passwordConfirm !== joinForm.password"
            class="mt-1 text-sm text-red-600"
          >
            비밀번호가 일치하지 않습니다
          </p>
        </div>

        <!-- Email Field -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-[#00712D]">이메일</label>
          <input
            v-model="joinForm.email"
            type="email"
            placeholder="이메일 입력"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-200 text-black hover:bg-gray-300 rounded"
          >
            취소
          </button>
          <button
            type="submit"
            :disabled="!isFormValid"
            class="px-4 py-2 bg-[#00712D] text-white hover:bg-[#FF9100] rounded disabled:opacity-50 disabled:hover:bg-[#00712D]"
          >
            가입하기
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from "vue";
const emit = defineEmits(["close"]);
import axios from "axios";

const joinForm = ref({
  id: "",
  password: "",
  name: "",
  email: "",
});

const passwordConfirm = ref("");
const idCheckMessage = ref("");
const isIdAvailable = ref(false);

const checkIdDuplicate = async () => {
  if (!joinForm.value.id) {
    idCheckMessage.value = "아이디를 입력해주세요.";
    isIdAvailable.value = false;
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost/user/${joinForm.value.id}`
    );
    const data = response.data;

    isIdAvailable.value = data["available"];
    idCheckMessage.value = data["available"]
      ? "사용할 수 있는 아이디입니다."
      : "중복된 아이디입니다.";
  } catch (error) {
    console.error("ID 중복 체크 오류:", error);
    idCheckMessage.value = "중복 확인 중 오류가 발생했습니다.";
    isIdAvailable.value = false;
  }
};

const isFormValid = computed(() => {
  return (
    joinForm.value.name &&
    joinForm.value.id &&
    joinForm.value.password &&
    passwordConfirm.value === joinForm.value.password &&
    joinForm.value.email &&
    isIdAvailable.value
  );
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    const response = await axios.post("http://localhost/user/join", {
      userId: joinForm.value.id,
      userPwd: joinForm.value.password,
      userName: joinForm.value.name,
      userEmail: joinForm.value.email,
    });

    console.log("회원가입 성공:", response.data);
    alert("회원가입이 완료되었습니다!");
    emit("close");
  } catch (error) {
    console.error("회원가입 요청 실패:", error);
    alert("회원가입 중 문제가 발생했습니다.");
  }
};
</script>
<style>
/* Scoped 스타일에 추가하지 말고, 글로벌 스타일로 설정 */
input {
  color: black; /* 모든 input의 텍스트 색상을 검정으로 설정 */
}
</style>