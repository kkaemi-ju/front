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
    console.log(newUserInfo)
    userInfo.value = newUserInfo;
  };
  const userLogin = async (loginUser) => {
    try {
      console.log(loginUser);
      const response = await axios.post(
        "http://localhost/user/login",
        loginUser
      );
      // posts.value = response.data.posts // 서버에서 가져온 데이터를 posts에 저장
      let { data } = response;
      let accessToken = data["access-token"];
      let refreshToken = data["refresh-token"];
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      isLoggedIn.value = true;
      showLoginModal.value = false;
      isValidToken.value = true;
    } catch (error) {
      console.error("로그인 중 오류가 발생했습니다.", error);
      alert("아이디 또는 비밀번호를 확인해주세요.")
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
        console.log("유저 정보 없음!")
      }

    } catch (error) {
      console.log("로그아웃 중 오류가 발생했습니다.", error);
    }
  };

  const getUserInfo = async (token) => {
    try {


      // JWT 토큰 디코드
      const decodedToken = jwtDecode(token);
      console.log("디코딩된 토큰:", decodedToken);

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
        console.log("유저 정보:", userInfo.value);

        isLoggedIn.value = true;
        isValidToken.value = true;
      } else {
        throw new Error("유저 정보 없음");
      }
    } catch (error) {
      console.error("토큰 만료 또는 유효하지 않음:", error);
      isValidToken.value = false;
      await tokenRegenerate();
    }
  };

  const tokenRegenerate = async () => {

    try{
    const response = await axios.post(
      'http://localhost/user/refresh', JSON.stringify(userInfo.value),
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
      console.log("토큰 재발급 성공:", newAccessToken);

    } else {
      throw new Error("토큰 재발급 실패");
    }
  } catch (error) {
    // HttpStatus.UNAUTHORIZE(401) : RefreshToken 기간 만료 >> 다시 로그인!!!!
    console.error("리프레시 토큰 만료:", error);
    // 다시 로그인 전 DB에 저장된 RefreshToken 제거.
    try {
      const logoutResponse = await axios.get(
        `http://localhost/user/logout/${userInfo.value.userid}`
      );
      if (logoutResponse.status === 200) {
        console.log("리프레시 토큰 제거 성공")
      } else {
        console.log("리프레시 토큰 제거 실패")
      }
      alert("RefreshToken 기간 만료!!! 다시 로그인해 주세요.")
      isLoggedIn.value = false
      userInfo.value = null
      isValidToken.value = false
      //router.push({ name: "user-login" })
    } catch (error){
      console.error(error)
      isLogin.value = false
      userInfo.value = null
    }

  }
  }

  return {
    isLoggedIn,
    showLoginModal,
    isValidToken,
    userInfo,
    userLogin,
    userLogout,
    getUserInfo,
    setUserInfo
  };
});
