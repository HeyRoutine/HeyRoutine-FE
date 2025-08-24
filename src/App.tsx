import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from 'styled-components/native';
import { theme } from './styles/theme';

import SplashScreen from './screens/auth/SplashScreen';
import MainNavigator from './navigation/MainNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import OnboardingNavigator from './navigation/OnboardingNavigator';
import { useAuthStore, useOnboardingStore } from './store';
import ResultScreen from './screens/common/ResultScreen';

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 실패 시 1번만 재시도
      staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 유지
      gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    },
  },
});

export default function App() {
  // 1. 앱 로딩 상태 (폰트 등 비동기 작업 처리)
  const [isLoading, setIsLoading] = useState(true);

  // 2. Zustand 스토어에서 상태 가져오기
  const { isLoggedIn } = useAuthStore();
  const { onboardingData, completeOnboarding } = useOnboardingStore();

  const [showCelebration, setShowCelebration] = useState(false);

  // 온보딩 완료 시 호출되는 함수
  const handleOnboardingComplete = () => {
    completeOnboarding();
  };

  const [fontsLoaded] = useFonts({
    'Pretendard-Light': require('./assets/fonts/Pretendard-Light.otf'),
    'Pretendard-Regular': require('./assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('./assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('./assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('./assets/fonts/Pretendard-Bold.otf'),
    // 'SchoolSafe-Regular': require('./assets/fonts/Hakgyoansim Dunggeunmiso OTF R.otf'),
    // 'SchoolSafe-Bold': require('./assets/fonts/Hakgyoansim Dunggeunmiso OTF B.otf'),
    'SchoolSafe-Regular': require('./assets/fonts/Hakgyoansim-Dunggeunmiso-TTF-R.ttf'),
    'SchoolSafe-Bold': require('./assets/fonts/Hakgyoansim-Dunggeunmiso-TTF-B.ttf'),
  });

  useEffect(() => {
    // 3. 폰트 로딩 완료 후 로딩 상태 변경
    if (fontsLoaded) {
      setTimeout(() => {
        setIsLoading(false);
        // 로그인 상태이고 축하 화면을 보여줘야 하는 경우
        if (isLoggedIn) {
          setShowCelebration(true);
        }
      }, 2000);
    }
  }, [fontsLoaded, isLoggedIn]);

  // 온보딩 표시 여부 결정
  const shouldShowOnboarding = !onboardingData.isCompleted && isLoggedIn;

  // 4. 로그인 상태에 따라 다른 화면 렌더링
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider theme={theme}>
            {isLoading ? (
              <SplashScreen />
            ) : shouldShowOnboarding ? (
              <NavigationContainer>
                <OnboardingNavigator
                  onComplete={handleOnboardingComplete}
                  initialParams={{
                    nextScreen: 'Result',
                  }}
                />
              </NavigationContainer>
            ) : showCelebration ? (
              <NavigationContainer>
                <ResultScreen
                  navigation={{
                    navigate: () => setShowCelebration(false),
                  }}
                  route={{
                    params: {
                      type: 'celebration',
                      title: '냥멍이님',
                      description:
                        '금융 미션 성공 축하드려요!\n다음 미션도 꼭 성공하실 수 있을꺼에요.',
                      points: 100,
                      lottieSource: require('./assets/images/animation/confetti.json'),
                      onComplete: () => setShowCelebration(false),
                    },
                  }}
                />
              </NavigationContainer>
            ) : (
              <NavigationContainer>
                {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
              </NavigationContainer>
            )}
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
