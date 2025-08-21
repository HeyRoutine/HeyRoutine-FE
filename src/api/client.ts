import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '../types/api';

// API 기본 URL (환경에 따라 변경 필요)
const API_BASE_URL = 'https://your-api-domain.com';

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (토큰 추가 등)
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 헤더에 추가
    const token = getAuthToken(); // 이 함수는 별도로 구현 필요
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 (에러 처리 등)
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response;
  },
  (error) => {
    // 에러 처리 로직
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);

// 인증 토큰 가져오기 함수 (임시 구현)
function getAuthToken(): string | null {
  // 실제로는 AsyncStorage나 다른 저장소에서 토큰을 가져와야 함
  return null;
}

export default apiClient;
