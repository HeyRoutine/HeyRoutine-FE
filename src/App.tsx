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


import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Alert } from 'react-native';

// ===== EAS BUILD + FIREBASE 직접 연결용 코드 (주석처리) =====
// import messaging from '@react-native-firebase/messaging';
// import scheduleNotification from './utils/scheduleNotification';




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

  // FCM 토큰 받기
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

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


async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log('푸시는 실제 기기에서만 동작해요');
    return;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('푸시 권한이 거부되었습니다');
      return;
    }

         // 웹과 모바일 구분하여 처리
     let token;
     if (Platform.OS === 'web') {
       console.log('🌐 웹 환경에서는 FCM 토큰을 받을 수 없습니다');
       return null;
     } else {
       console.log('📱 모바일 환경에서 토큰 요청');
       token = (await Notifications.getExpoPushTokenAsync({
         projectId: 'heyroutine-c64c1'
       })).data;
     }
    
    console.log('🔥 FCM 토큰 받기 성공:', token);
    Alert.alert('토큰 확인', token);
    console.log('📱 기기 정보:', Platform.OS);
    
    // 토큰을 서버에 전송하거나 로컬에 저장
    // await sendTokenToServer(token);

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (error) {
    console.error('❌ FCM 토큰 받기 실패:', error);
    return null;
  }
}

export function useNotificationListener() {
  useEffect(() => {
// 앱이 foreground 상태에서 알림 수신
    const receivedListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
      // 계좌 인증 성공 알림 -> 화면 이동 로직 추가
    });

    // 앱이 background/terminated → 클릭해서 들어온 경우
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('📲 알림 클릭됨:', response);
      // TODO: 특정 화면으로 이동
    });

    return () => {
      receivedListener.remove();
      responseListener.remove();
    };
  }, []);
}


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(registration => {
      console.log('Service Worker 등록 완료:', registration);
    }).catch(err => {
      console.error('Service Worker 등록 실패:', err);
    });
}