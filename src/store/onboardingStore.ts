import { create } from 'zustand';

// 웹 환경 체크
const isWeb = typeof window !== 'undefined';

// 온보딩 단계 타입 정의
export type OnboardingStep =
  | 'welcome'
  | 'timetable-upload'
  | 'ai-consent'
  | 'ai-recommendation'
  | 'loading'
  | 'complete';

// 온보딩 데이터 타입 정의
interface OnboardingData {
  timetableFile?: string;
  aiConsent: boolean;
  recommendedRoutines?: any[];
  isCompleted: boolean;
}

// 온보딩 스토어 상태 타입 정의
interface OnboardingState {
  // 상태
  currentStep: OnboardingStep;
  onboardingData: OnboardingData;
  isLoading: boolean;

  // 액션 (상태를 변경하는 함수들)
  setCurrentStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setTimetableFile: (file: string) => void;
  setAiConsent: (consent: boolean) => void;
  setRecommendedRoutines: (routines: any[]) => void;
  setLoading: (loading: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

// 온보딩 단계 순서 정의
const ONBOARDING_STEPS: OnboardingStep[] = [
  'welcome',
  'timetable-upload',
  'ai-consent',
  'ai-recommendation',
  'loading',
  'complete',
];

// Zustand 스토어 생성
export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  // 초기 상태
  currentStep: 'welcome',
  onboardingData: {
    aiConsent: false,
    isCompleted: false,
  },
  isLoading: false,

  // 액션들
  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    const nextIndex = Math.min(currentIndex + 1, ONBOARDING_STEPS.length - 1);
    set({ currentStep: ONBOARDING_STEPS[nextIndex] });
  },

  prevStep: () => {
    const { currentStep } = get();
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    const prevIndex = Math.max(currentIndex - 1, 0);
    set({ currentStep: ONBOARDING_STEPS[prevIndex] });
  },

  setTimetableFile: (file) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, timetableFile: file },
    })),

  setAiConsent: (consent) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, aiConsent: consent },
    })),

  setRecommendedRoutines: (routines) =>
    set((state) => ({
      onboardingData: {
        ...state.onboardingData,
        recommendedRoutines: routines,
      },
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  completeOnboarding: () =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, isCompleted: true },
      currentStep: 'complete',
    })),

  resetOnboarding: () =>
    set({
      currentStep: 'welcome',
      onboardingData: {
        aiConsent: false,
        isCompleted: false,
      },
      isLoading: false,
    }),
}));

// 모바일 환경에서만 persist 적용
if (!isWeb) {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  const { persist, createJSONStorage } = require('zustand/middleware');

  const persistedStore = persist(useOnboardingStore, {
    name: 'onboarding-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state: OnboardingState) => ({
      currentStep: state.currentStep,
      onboardingData: state.onboardingData,
    }),
  });

  // 기존 스토어를 persisted 스토어로 교체
  Object.assign(useOnboardingStore, persistedStore);
}
