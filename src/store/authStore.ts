import { create } from 'zustand';

// 웹 환경 체크
const isWeb = typeof window !== 'undefined';

// 회원가입 데이터 타입 정의
interface SignupData {
  email: string;
  password: string;
  nickname: string;
  profileImage: string | null;
}

// 인증 상태 타입 정의
interface AuthState {
  // 상태
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  signupData: SignupData;

  // 액션 (상태를 변경하는 함수들)
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  login: () => void;
  logout: () => void;

  // Signup related actions
  setSignupEmail: (email: string) => void;
  setSignupPassword: (password: string) => void;
  setSignupNickname: (nickname: string) => void;
  setSignupProfileImage: (profileImage: string | null) => void;
  clearSignupData: () => void;
  completeSignup: () => void;
}

// Zustand 스토어 생성
export const useAuthStore = create<AuthState>((set, get) => ({
  // 초기 상태
  accessToken: null,
  refreshToken: null,
  isLoggedIn: true,
  signupData: {
    email: '',
    password: '',
    nickname: '',
    profileImage: null,
  },

  // 액션들
  setAccessToken: (token) => set({ accessToken: token }),

  setRefreshToken: (token) => set({ refreshToken: token }),

  setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),

  login: () => {
    set({
      isLoggedIn: true,
    });
  },

  logout: () => {
    set({
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    });
  },

  // Signup actions
  setSignupEmail: (email) =>
    set((state) => ({
      signupData: { ...state.signupData, email },
    })),

  setSignupPassword: (password) =>
    set((state) => ({
      signupData: { ...state.signupData, password },
    })),

  setSignupNickname: (nickname) =>
    set((state) => ({
      signupData: { ...state.signupData, nickname },
    })),

  setSignupProfileImage: (profileImage) =>
    set((state) => ({
      signupData: { ...state.signupData, profileImage },
    })),

  clearSignupData: () =>
    set({
      signupData: { email: '', password: '', nickname: '', profileImage: null },
    }),

  completeSignup: () => {
    const { signupData } = get();
    const { useUserStore } = require('./userStore');
    const { setUserInfo } = useUserStore.getState();

    setUserInfo({
      nickname: signupData.nickname,
      email: signupData.email,
      profileImage: signupData.profileImage || undefined,
    });
    get().clearSignupData();
  },
}));

// 모바일 환경에서만 persist 적용
if (!isWeb) {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  const { persist, createJSONStorage } = require('zustand/middleware');

  const persistedStore = persist(useAuthStore, {
    name: 'auth-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state: AuthState) => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
      isLoggedIn: state.isLoggedIn,
      signupData: state.signupData,
    }),
  });

  // 기존 스토어를 persisted 스토어로 교체
  Object.assign(useAuthStore, persistedStore);
}
