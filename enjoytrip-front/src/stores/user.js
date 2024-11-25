import { ref } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { AlertTriangle } from "lucide-vue-next";
export const useUserStore = defineStore("userStore", () => {
  const router = useRouter();
  const isLoggedIn = ref(false);
  const showLoginModal = ref(false);
  const isValidToken = ref(false);
  const userInfo = ref(null);
  const setUserInfo = (newUserInfo) => {
    userInfo.value = newUserInfo;
  };
  const userLogin = async (loginUser) => {
    try {
      const response = await axios.post(
        "http://localhost/user/login",
        loginUser
      );
      const { data, status } = response;

      if (status === 201) {
        // 로그인 성공
        const accessToken = data["access-token"];
        const refreshToken = data["refresh-token"];
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);

        isLoggedIn.value = true;
        isValidToken.value = true;
        showLoginModal.value = false;

        alert("로그인 성공! 환영합니다.");
      } else if (status === 403) {
        // 탈퇴한 사용자
        alert(data.message || "탈퇴한 계정입니다. 로그인할 수 없습니다.");
        isLoggedIn.value = false;
        isValidToken.value = false;
      } else if (status === 401) {
        // 아이디 또는 비밀번호 오류
        alert(data.message || "아이디 또는 비밀번호를 확인해주세요.");
        isLoggedIn.value = false;
        isValidToken.value = false;
      } else {
        // 기타 상태 코드 처리
        alert(data.message || "알 수 없는 오류가 발생했습니다.");
      }
    } catch (error) {
      // 서버 오류 또는 네트워크 오류 처리
      if (error.response) {
        // 서버에서 반환된 에러 처리
        const { status, data } = error.response;
        if (status === 500) {
          alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          alert(data.message || "로그인 중 문제가 발생했습니다.");
        }
      } else if (error.request) {
        // 네트워크 오류 처리
        alert("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
      } else {
        // 기타 오류 처리
        alert("오류가 발생했습니다: " + error.message);
      }
      isLoggedIn.value = false;
      isValidToken.value = false;
    }
  };

  const userLogout = async () => {
    try {
      const logoutResponse = await axios.get(
        `http://localhost/user/logout/${userInfo.value.userid}`
      );
      if (logoutResponse.status === 200) {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        isLoggedIn.value = false;
        userInfo.value = null;
        isValidToken.value = false;
        router.push("/");
      } else {
        console.log("유저 정보 없음!");
      }
    } catch (error) {
      console.log("로그아웃 중 오류가 발생했습니다.", error);
    }
  };

  const getUserInfo = async (token) => {
    try {
      // JWT 토큰 디코드
      const decodedToken = jwtDecode(token);

      // 유저 정보 조회
      const response = await axios.get(
        `http://localhost/user/info/${decodedToken.userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        userInfo.value = response.data.userInfo;

        isLoggedIn.value = true;
        isValidToken.value = true;
      } else {
        throw new Error("유저 정보 없음");
      }
    } catch (error) {
      isValidToken.value = false;
      await tokenRegenerate();
    }
  };

  const tokenRegenerate = async () => {
    try {
      const response = await axios.post(
        "http://localhost/user/refresh",
        JSON.stringify(userInfo.value),
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            refreshToken: sessionStorage.getItem("refreshToken"),
          },
        }
      );

      if (response.status === 201) {
        const newAccessToken = response.data["access-token"];
        sessionStorage.setItem("accessToken", newAccessToken);
        isValidToken.value = true;
      } else {
        throw new Error("토큰 재발급 실패");
      }
    } catch (error) {
      // HttpStatus.UNAUTHORIZE(401) : RefreshToken 기간 만료 >> 다시 로그인!!!!
      // 다시 로그인 전 DB에 저장된 RefreshToken 제거.
      try {
        const logoutResponse = await axios.get(
          `http://localhost/user/logout/${userInfo.value.userid}`
        );
        if (logoutResponse.status === 200) {
          console.log("리프레시 토큰 제거 성공");
        } else {
          console.log("리프레시 토큰 제거 실패");
        }
        alert("RefreshToken 기간 만료!!! 다시 로그인해 주세요.");
        isLoggedIn.value = false;
        userInfo.value = null;
        isValidToken.value = false;
        //router.push({ name: "user-login" })
      } catch (error) {
        console.error(error);
        isLoggedIn.value = false;
        userInfo.value = null;
      }
    }
  };

  return {
    isLoggedIn,
    showLoginModal,
    isValidToken,
    userInfo,
    userLogin,
    userLogout,
    getUserInfo,
    setUserInfo,
  };
});
