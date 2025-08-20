import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from 'styled-components/native';
import { theme } from './styles/theme';

import SplashScreen from './screens/auth/SplashScreen';
import MainNavigator from './navigation/MainNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import OnboardingNavigator from './navigation/OnboardingNavigator';
import { useAuthStore } from './store';
import ResultScreen from './screens/common/ResultScreen';

export default function App() {
  // 1. 앱 로딩 상태 (폰트 등 비동기 작업 처리)
  const [isLoading, setIsLoading] = useState(true);

  // 2. Zustand 스토어에서 로그인 상태 가져오기
  const { isLoggedIn } = useAuthStore();
  const [showCelebration, setShowCelebration] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true); // 온보딩 표시 여부

  // 온보딩 완료 시 호출되는 함수
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
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

  // 4. 로그인 상태에 따라 다른 화면 렌더링
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        {isLoading ? (
          <SplashScreen />
        ) : showOnboarding ? (
          <NavigationContainer>
            <OnboardingNavigator
              onComplete={handleOnboardingComplete}
              initialParams={{
                nextScreen: 'Result',
              }}
            />
          </NavigationContainer>
        ) : showCelebration ? (
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
        ) : (
          <NavigationContainer>
            {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
