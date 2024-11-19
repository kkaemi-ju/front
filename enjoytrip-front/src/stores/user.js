import { ref } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const useUserStore = defineStore("userStore", () => {
  const isLoggedIn = ref(false);
  const showLoginModal = ref(false);
  const isValidToken = ref(false);
  const userInfo = ref(null);
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
    } catch (error) {
      console.error("로그인 중 오류가 발생했습니다.", error);
    }
  };

  const userLogout = async () => {
    try {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");

      isLoggedIn.value = false;
      userInfo.value = null;
      isValidToken.value = false;
    } catch (error) {
      console.log("로그아웃 중 오류가 발생했습니다.", error);
    }
  };

  const getUserInfo = async (token) => {
    // let decodeToken = jwtDecode(token)
    // console.log(decodeToken)
    // await findById(
    //   decodeToken.userId,
    //   (response) => {
    //     if (response.status === httpStatusCode.OK) {
    //       userInfo.value = response.data.userInfo
    //     } else {
    //       console.log("유저 정보 없음!!!!")
    //     }
    //   },
    //   async (error) => {
    //     console.error(
    //       "g[토큰 만료되어 사용 불가능.] : ",
    //       error.response.status,
    //       error.response.statusText
    //     )
    //     isValidToken.value = false

    //     await tokenRegenerate()
    //   }
    // )
  }
  return {
    isLoggedIn,
    showLoginModal,
    isValidToken,
    userInfo,
    userLogin,
    userLogout,
    getUserInfo
  };
});
