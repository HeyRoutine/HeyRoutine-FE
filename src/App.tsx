import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRef } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from './screens/auth/SplashScreen';
import MainNavigator from './navigation/MainNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import OnboardingNavigator from './navigation/OnboardingNavigator';
import { useAuthStore, useOnboardingStore } from './store';
import ResultScreen from './screens/common/ResultScreen';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // 포그라운드에서도 상단바 알림 표시
    shouldPlaySound: true, // 소리 재생
    shouldSetBadge: false, // 앱 아이콘 배지 설정
  }),
});
// 푸시 알림 핸들러 설정
function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('푸시 알림 권한이 거부되었습니다.');
      return null;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      console.log('Project ID를 찾을 수 없습니다.');
      return null;
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log('🔍 FCM 토큰 발급 성공:', pushTokenString);

      // 토큰을 AsyncStorage에 저장
      await AsyncStorage.setItem('fcmToken', pushTokenString);
      await AsyncStorage.setItem('fcmTokenIssued', 'true');

      return pushTokenString;
    } catch (e: unknown) {
      console.error('🔍 FCM 토큰 발급 실패:', e);
      return null;
    }
  } else {
    console.log('실제 기기에서만 푸시 알림을 사용할 수 있습니다.');
    return null;
  }
}
//

// React Query 클라이언트 생성
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 실패 시 1번만 재시도
      staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 유지
      gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    },
  },
});

export default function App() {
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  // 1. 앱 로딩 상태 (폰트 등 비동기 작업 처리)
  const [isLoading, setIsLoading] = useState(true);

  // 2. Zustand 스토어에서 상태 가져오기
  const { isLoggedIn } = useAuthStore();
  const { onboardingData, completeOnboarding } = useOnboardingStore();

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
    'SchoolSafe-Regular': require('./assets/fonts/Hakgyoansim-Dunggeunmiso-TTF-R.ttf'),
    'SchoolSafe-Bold': require('./assets/fonts/Hakgyoansim-Dunggeunmiso-TTF-B.ttf'),
  });

  useEffect(() => {
    // 1. FCM 토큰 발급 (앱 시작 시 한 번만)
    const initializeFCMToken = async () => {
      try {
        const hasTokenBeenIssued = await AsyncStorage.getItem('fcmTokenIssued');
        if (hasTokenBeenIssued !== 'true') {
          console.log('🔍 FCM 토큰 발급 시작...');
          await registerForPushNotificationsAsync();
        } else {
          console.log('🔍 FCM 토큰이 이미 발급되었습니다.');
        }
      } catch (error) {
        console.error('🔍 FCM 토큰 초기화 실패:', error);
      }
    };

    // 2. 알림 수신 리스너 등록 (앱 실행 중 알림 도착 시)
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('알림 수신 (foreground):', notification);
        setNotification(notification);
      });

    // 3. 알림 반응 리스너 등록 (사용자가 알림 탭 시)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('알림 반응:', response);
        // 여기서 response.notification.request.content.data 등을 통해
        // 알림에 포함된 데이터에 접근하고 특정 화면으로 이동하는 등의 로직 처리 가능
      });

    // 4. 폰트 로딩 완료 후 로딩 상태 변경 및 FCM 토큰 발급
    if (fontsLoaded) {
      initializeFCMToken();
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [fontsLoaded]);

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
