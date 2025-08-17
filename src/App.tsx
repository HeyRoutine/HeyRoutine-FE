import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from 'styled-components/native';
import { theme } from './styles/theme';

import SplashScreen from './screens/auth/SplashScreen';
import MainNavigator from './navigation/MainNavigator';
import AuthNavigator from './navigation/AuthNavigator';

export default function App() {
  // 1. 앱 로딩 상태 (폰트 등 비동기 작업 처리)
  const [isLoading, setIsLoading] = useState(true);
  // 2. 로그인 상태 (true로 초기화하여 MainNavigator 렌더링)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      }, 2000);
    }
  }, [fontsLoaded]);

  // 4. 로그인 상태에 따라 다른 화면 렌더링
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        {isLoading ? (
          <SplashScreen />
        ) : (
          <NavigationContainer>
            {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
