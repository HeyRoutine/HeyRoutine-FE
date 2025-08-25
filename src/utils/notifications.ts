import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

/**
 * FCM/Expo Push 토큰을 획득하는 헬퍼
 * - 권한 요청 → Expo Push Token 발급
 * - 필요 시 디바이스 토큰 로깅(EAS 빌드 환경)
 */
export const getFcmToken = async (): Promise<string | null> => {
  try {
    // 권한 확인 및 요청
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('알림 권한이 거부되어 푸시 토큰을 가져올 수 없습니다.');
      return null;
    }

    // EAS Project ID (app.json의 expo.extra.eas.projectId 권장)
    const projectId =
      (Constants as any)?.expoConfig?.extra?.eas?.projectId ||
      (Constants as any)?.easConfig?.projectId;
    if (!projectId) {
      console.warn('EAS projectId가 설정되지 않았습니다. app.json을 확인하세요.');
    }

    const expoToken = await Notifications.getExpoPushTokenAsync({ projectId });
    const expoPushToken = expoToken?.data ?? null;
    if (expoPushToken) {
      console.log('Expo Push Token:', expoPushToken);
    }

    // 선택: 네이티브 디바이스 토큰 (EAS 빌드에서만 유효)
    try {
      const device = await Notifications.getDevicePushTokenAsync();
      if (device?.data) {
        console.log('Device Push Token:', device.data);
      }
    } catch {}

    return expoPushToken;
  } catch (error) {
    console.warn('FCM/푸시 토큰 획득 실패:', error);
    return null;
  }
};


