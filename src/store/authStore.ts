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
  isLoggedIn: false,
  signupData: {
    email: '',
    password: '',
    nickname: '',
    profileImage: null,
  },

  // 액션들
  setAccessToken: (token) => {
    console.log('🔍 AccessToken 저장:', token);
    set({ accessToken: token });
    console.log('🔍 저장 후 스토어 상태:', get());
  },

  setRefreshToken: (token) => {
    console.log('🔍 RefreshToken 저장:', token);
    set({ refreshToken: token });
    console.log('🔍 저장 후 스토어 상태:', get());
  },

  setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),

  login: () => {
    console.log('🔍 로그인 상태 변경: true');
    set({
      isLoggedIn: true,
    });
    console.log('🔍 로그인 후 전체 스토어 상태:', get());
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
      signupData: {
        email: '',
        password: '',
        nickname: '',
        profileImage: null,
      },
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
