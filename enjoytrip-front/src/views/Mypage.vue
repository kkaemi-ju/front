<template>
  <div class="max-w-2xl mx-auto p-6">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Name Field -->
      <div class="space-y-2">
        <label class="block text-gray-700 text-sm font-medium">이름</label>
        <input
          type="text"
          v-model="form.userName"
          placeholder="이름"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <!-- ID Field -->
      <div class="space-y-2">
        <label class="block text-gray-700 text-sm font-medium">아이디</label>
        <input
          type="text"
          v-model="form.userId"
          placeholder="아이디"
          readonly
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <!-- Password Field -->
      <div class="space-y-2">
        <label class="block text-gray-700 text-sm font-medium">패스워드</label>
        <p class="text-sm text-gray-500">
          변경을 원하시면 현재 비밀번호를 입력하시고, 변경 버튼을 눌러주세요.
        </p>
        <input
          type="password"
          v-model="form.userPwd"
          placeholder="현재 비밀번호"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <!-- Password Change Button -->
      <button
        type="button"
        @click="verifyPassword"
        class="text-white bg-[#FF9100] hover:bg-[#FF9100]/80 px-6 py-2 rounded-full text-sm transition-colors duration-200"
      >
        패스워드 변경
      </button>

      <!-- Email Field -->
      <div class="space-y-2">
        <label class="block text-gray-700 text-sm font-medium">이메일</label>
        <input
          type="email"
          v-model="form.userEmail"
          placeholder="이메일"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          @click="handleDelete"
          class="px-6 py-2 text-white bg-red-500 hover:bg-red-400 rounded-lg transition-colors duration-200"
        >
          삭제
        </button>
        <button
          type="submit"
          class="px-6 py-2 text-white bg-[#FF9100] hover:bg-[#FF9100]/80 rounded-lg transition-colors duration-200"
          @click="handleUpdate"
        >
          수정
        </button>
      </div>
    </form>

    <!-- Password Change Modal -->
    <div
      v-if="isPasswordModalVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-96">
        <h3 class="text-lg font-bold mb-4 text-black">새 비밀번호 변경</h3>
        <input
          type="password"
          v-model="newPassword"
          placeholder="새 비밀번호"
          class="w-full mb-4 px-4 py-2 border rounded-lg"
        />
        <input
          type="password"
          v-model="confirmNewPassword"
          placeholder="새 비밀번호 확인"
          class="w-full mb-2 px-4 py-2 border rounded-lg"
          @input="checkPasswordMatch"
        />
        <p v-if="passwordError" class="text-sm text-red-500 mb-4">
          비밀번호가 일치하지 않습니다.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="isPasswordModalVisible = false"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            취소
          </button>
          <button
            @click="changePassword"
            :disabled="passwordError"
            class="px-4 py-2 bg-[#FF9100] text-white rounded hover:bg-[#FF9100]/80 disabled:opacity-50"
          >
            변경
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const { userLogout, setUserInfo } = userStore;
const form = ref({
  userName: "",
  userId: "",
  userPwd: "",
  userEmail: "",
});
const isPasswordModalVisible = ref(false);
const newPassword = ref("");
const confirmNewPassword = ref("");
const passwordError = ref(false);

const handleSubmit = () => {
  console.log("Form submitted:", form.value);
};
const handleUpdate = async () => {
  try {
    const isConfirmed = confirm("계정을 수정하시겠습니까?");

    if (!isConfirmed) {
      return; // 사용자가 취소를 선택한 경우
    }

    const response = await axios.post(
      "http://localhost/mypage/update",
      form.value,
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );

    // HTTP 상태 코드 확인
    if (response.status === 200) {
      console.log(response.data);
      setUserInfo(response.data["userInfo"]);
    } else {
      alert("알 수 없는 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("업데이트 확인 오류:", error);
    alert("업데이트 중 문제가 발생했습니다.");
  }
};
const handleDelete = async () => {
  // 삭제 확인 다이얼로그
  const isConfirmed = confirm("계정을 삭제하시겠습니까?");

  if (!isConfirmed) {
    return; // 사용자가 취소를 선택한 경우
  }

  try {
    console.log(userInfo.value);
    const response = await axios.delete(
      `http://localhost/mypage/${userInfo.value.userId}`,
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );

    // HTTP 상태 코드 확인
    if (response.status === 200) {
      try {
        await userLogout();
        alert("계정이 성공적으로 삭제되었습니다.");
        console.log("로그아웃 성공적으로");
      } catch (error) {
        console.error("로그아웃 실패");
      }
    } else {
      alert("알 수 없는 오류가 발생했습니다.");
    }
  } catch (error) {
    // 에러 상태 코드 처리
    if (error.response && error.response.status === 500) {
      alert(error.response.data.error); // 서버에서 보낸 에러 메시지
    } else {
      alert("계정 삭제 중 문제가 발생했습니다.");
    }
  }
};

onMounted(() => {
  form.value.userId = userInfo.value.userId;
  form.value.userName = userInfo.value.userName;
  form.value.userEmail = userInfo.value.userEmail;
});

// Verify current password
const verifyPassword = async () => {
  try {
    const response = await axios.post("http://localhost/user/login", {
      userId: userInfo.value.userId,
      userPwd: form.value.userPwd,
    });
    if (response.status == 201) {
      isPasswordModalVisible.value = true;
      form.value.userPwd = "";
    } else {
      alert("현재 비밀번호가 일치하지 않습니다.");
    }
  } catch (error) {
    alert("현재 비밀번호가 일치하지 않습니다.");
  }

  return;
};

// Check if passwords match
const checkPasswordMatch = () => {
  passwordError.value = newPassword.value !== confirmNewPassword.value;
};

// Change to new password
const changePassword = async () => {
  if (passwordError.value) {
    alert("새 비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    const response = await axios.post("http://localhost/mypage/modifypwd", {
      userId: userInfo.value.userId,
      userPwd: newPassword.value,
    });

    if (response.status == 200) {
      alert("비밀번호가 성공적으로 변경되었습니다.");
      isPasswordModalVisible.value = false; // Close modal
      newPassword.value = "";
      confirmNewPassword.value = "";
    } else {
      alert("비밀번호 변경 실패.");
    }
  } catch (error) {
    console.error("비밀번호 변경 오류:", error);
    alert("비밀번호 변경 중 문제가 발생했습니다.");
  }
};
</script>

<style scoped>
button[type="submit"]:hover {
  background-color: #ff9100 !important;
}

input:focus {
  outline: none;
}
</style>
