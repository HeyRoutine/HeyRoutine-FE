import { create } from 'zustand';

// 인증 상태 타입 정의
interface AuthState {
  // 상태
  isLoggedIn: boolean;
  isLoading: boolean;

  // 액션 (상태를 변경하는 함수들)
  login: () => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Zustand 스토어 생성
export const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태 (로그인 화면부터 시작하려면 false로 설정)
  isLoggedIn: true,
  isLoading: false,

  // 액션들
  login: () => set({ isLoggedIn: true }),

  logout: () => set({ isLoggedIn: false }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
