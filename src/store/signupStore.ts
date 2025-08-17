import { create } from 'zustand';

// 회원가입 데이터 타입 정의
interface SignupData {
  email: string;
  password: string;
  nickname: string;
  profileImage?: string | null;
}

// 회원가입 스토어 상태 타입 정의
interface SignupState {
  // 상태
  signupData: SignupData;

  // 액션 (상태를 변경하는 함수들)
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setNickname: (nickname: string) => void;
  setProfileImage: (profileImage: string | null) => void;
  clearSignupData: () => void;
  completeSignup: () => void;
}

// Zustand 스토어 생성
export const useSignupStore = create<SignupState>((set, get) => ({
  // 초기 상태
  signupData: {
    email: '',
    password: '',
    nickname: '',
    profileImage: null,
  },

  // 액션들
  setEmail: (email) =>
    set((state) => ({
      signupData: { ...state.signupData, email },
    })),

  setPassword: (password) =>
    set((state) => ({
      signupData: { ...state.signupData, password },
    })),

  setNickname: (nickname) =>
    set((state) => ({
      signupData: { ...state.signupData, nickname },
    })),

  setProfileImage: (profileImage) =>
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
    // 회원가입 완료 시 userStore로 데이터 이동
    const { signupData } = get();

    // userStore import (순환 참조 방지를 위해 동적 import)
    const { useUserStore } = require('./userStore');
    const { setUserInfo } = useUserStore.getState();

    // 사용자 정보로 변환하여 저장
    const userInfo = {
      nickname: signupData.nickname,
      email: signupData.email,
      profileImage: signupData.profileImage || undefined,
    };

    setUserInfo(userInfo);
    console.log('회원가입 완료 - 사용자 정보 저장:', userInfo);

    // 회원가입 데이터 초기화
    get().clearSignupData();
  },
}));
