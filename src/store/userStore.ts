import { create } from 'zustand';

// 사용자 정보 타입 정의
interface UserInfo {
  id?: string;
  nickname: string;
  email: string;
  profileImage?: string;
  phoneNumber?: string;
}

// 스토어 상태 타입 정의
interface UserState {
  // 상태
  userInfo: UserInfo | null;

  // 액션 (상태를 변경하는 함수들)
  setUserInfo: (userInfo: UserInfo) => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  clearUserInfo: () => void;
}

// Zustand 스토어 생성
export const useUserStore = create<UserState>((set) => ({
  // 초기 상태
  userInfo: null,

  // 액션들
  setUserInfo: (userInfo) => set({ userInfo }),

  updateUserInfo: (updates) =>
    set((state) => ({
      userInfo: state.userInfo ? { ...state.userInfo, ...updates } : null,
    })),

  clearUserInfo: () => set({ userInfo: null }),
}));
