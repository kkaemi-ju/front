import axios from "axios";

export const sendAttractionSearch = async (
  searchTerm, // keyword
  selectedLocation, // areaCode
  selectedRecommendationType // contentTypeId
) => {
  try {
    let endpoint = "";
    let requestData = {};

    if (searchTerm && selectedLocation && selectedRecommendationType) {
      // /sidotypetitlesearch (areaCode, contentTypeId, keyword)
      endpoint = "/attraction/sidotypetitlesearch";
      requestData = {
        areaCode: selectedLocation,
        contentTypeId: selectedRecommendationType,
        keyword: searchTerm,
      };
    } else if (searchTerm && selectedLocation) {
      // /sidotitlesearch (areaCode, keyword)
      endpoint = "/attraction/sidotitlesearch";
      requestData = {
        areaCode: selectedLocation,
        keyword: searchTerm,
      };
    } else if (selectedLocation && selectedRecommendationType) {
      // /sidotypesearch (areaCode, contentTypeId)
      endpoint = "/attraction/sidotypesearch";
      requestData = {
        areaCode: selectedLocation,
        contentTypeId: selectedRecommendationType,
      };
    } else if (selectedLocation) {
      // /sidosearch (areaCode)
      endpoint = "/attraction/sidosearch";
      requestData = {
        areaCode: selectedLocation,
      };
    } else {
      throw new Error("올바른 검색 조건을 입력하세요.");
    }

    // API 요청
    const response = await axios.post(
      `http://localhost:8080${endpoint}`, // 기본 URL에 endpoint 추가
      requestData
    );

    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("오류 발생", error);
    throw error;
  }
};
