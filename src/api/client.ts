import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '../types/api';
import { useAuthStore } from '../store';

// API 기본 URL (환경에 따라 변경 필요)
const API_BASE_URL = 'http://13.124.86.72:8080'; // 실제 백엔드 서버 URL

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
    const token = getAuthToken();
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
    // 401 에러 시 토큰 만료 처리
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
    }

    // 에러 처리 로직
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);

// 인증 토큰 가져오기 함수 (Zustand store에서 가져오기)
function getAuthToken(): string | null {
  const { accessToken } = useAuthStore.getState();
  return accessToken;
}

export default apiClient;
