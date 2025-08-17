import { create } from 'zustand';

// 사용자 정보 타입 정의
interface UserInfo {
  id?: string;
  nickname: string;
  email: string;
  profileImage?: string;
  phoneNumber?: string;
  points?: number; // 보유 포인트
}

// 스토어 상태 타입 정의
interface UserState {
  // 상태
  userInfo: UserInfo | null;

  // 액션 (상태를 변경하는 함수들)
  setUserInfo: (userInfo: UserInfo) => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  clearUserInfo: () => void;
  deductPoints: (amount: number) => void;
  addPoints: (amount: number) => void;
}

// Zustand 스토어 생성
export const useUserStore = create<UserState>((set) => ({
  // 초기 상태 (2000P로 초기화)
  userInfo: {
    id: '1',
    nickname: '사용자',
    email: 'user@example.com',
    points: 2000,
  },

  // 액션들
  setUserInfo: (userInfo) => set({ userInfo }),

  updateUserInfo: (updates) =>
    set((state) => ({
      userInfo: state.userInfo ? { ...state.userInfo, ...updates } : null,
    })),

  clearUserInfo: () => set({ userInfo: null }),

  // 포인트 관련 액션 추가
  deductPoints: (amount: number) =>
    set((state) => ({
      userInfo: state.userInfo
        ? {
            ...state.userInfo,
            points: Math.max(0, (state.userInfo.points || 0) - amount),
          }
        : null,
    })),

  addPoints: (amount: number) =>
    set((state) => ({
      userInfo: state.userInfo
        ? { ...state.userInfo, points: (state.userInfo.points || 0) + amount }
        : null,
    })),
}));
