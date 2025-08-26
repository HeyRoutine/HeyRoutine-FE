import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// ===== EAS BUILD + FIREBASE 직접 연결용 코드 =====
// Firebase가 설치되어 있을 때만 import (Expo Go에서도 작동)
let messaging: any = null;
let getToken: any = null;

try {
  // Firebase가 설치되어 있으면 import
  const firebaseMessaging = require('@react-native-firebase/messaging');
  messaging = firebaseMessaging.default;
  getToken = firebaseMessaging.default().getToken;
} catch (error) {
  console.log('⚠️ Firebase Messaging이 설치되지 않음, Expo Push Token으로 대체');
}

export default function FCMTestScreen() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>('');

  useEffect(() => {
    // 권한 상태 확인
    checkPermissionStatus();
    
    // 알림 리스너 설정
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('알림 클릭됨:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const checkPermissionStatus = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
  };

    const registerForPushNotificationsAsync = async () => {
    console.log('🚀 FCM 토큰 받기 시작');
    
    if (!Device.isDevice) {
      console.log('❌ 시뮬레이터에서는 작동하지 않음');
      Alert.alert('알림', '푸시는 실제 기기에서만 동작해요');
      return;
    }

    try {
      console.log('📱 실제 기기에서 실행 중');
      
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('🔐 현재 권한 상태:', existingStatus);
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        console.log('🔐 권한 요청 중...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('🔐 권한 요청 결과:', status);
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ 권한이 거부됨');
        Alert.alert('권한 거부', '푸시 권한이 거부되었습니다');
        return;
      }

             console.log('✅ 권한 허용됨, 토큰 요청 중...');
       
       // 웹과 모바일 구분하여 처리
       let token;
       if (Platform.OS === 'web') {
         console.log('🌐 웹 환경에서 토큰 요청');
         // 웹에서는 VAPID 키가 필요하므로 임시로 에러 처리
         throw new Error('웹에서는 VAPID 키 설정이 필요합니다. 모바일 앱에서 테스트해주세요.');
               } else {
          console.log('📱 모바일 환경에서 토큰 요청');
          
          // ===== EAS BUILD + FIREBASE 직접 연결용 코드 =====
          // Firebase가 사용 가능하면 Firebase FCM 토큰 사용
          if (messaging && getToken) {
            try {
              console.log('🔥 Firebase FCM 토큰 요청 중...');
              token = await getToken();
              console.log('✅ Firebase FCM 토큰 받기 성공:', token);
            } catch (firebaseError) {
              console.log('⚠️ Firebase FCM 토큰 받기 실패, Expo Push Token으로 대체');
              console.log('에러:', firebaseError);
              // Firebase 실패 시 Expo Push Token으로 대체
              token = (await Notifications.getExpoPushTokenAsync({
                projectId: 'shinhan-HeyRoutine'
              })).data;
            }
          } else {
            // Firebase가 없으면 Expo Push Token 사용
            console.log('📱 Expo Push Token 요청 중...');
            token = (await Notifications.getExpoPushTokenAsync({
              projectId: 'shinhan-HeyRoutine'
            })).data;
          }
        }
      
      console.log('🔥 FCM 토큰 받기 성공:', token);
      console.log('📱 기기 정보:', Platform.OS);
      
      setExpoPushToken(token);
      Alert.alert('성공', `FCM 토큰을 받았습니다!\n${token.substring(0, 50)}...`);
      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      console.error('❌ FCM 토큰 받기 실패:', error);
      console.error('❌ 에러 상세:', JSON.stringify(error, null, 2));
      Alert.alert('오류', 'FCM 토큰을 받는데 실패했습니다');
    }
  };

  const sendTestNotification = async () => {
    if (!expoPushToken) {
      Alert.alert('알림', '먼저 FCM 토큰을 받아주세요');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "테스트 알림 🎉",
          body: "FCM이 정상적으로 작동하고 있습니다!",
          data: { data: '테스트 데이터' },
        },
        trigger: { seconds: 2 } as any,
      });
      
      Alert.alert('성공', '테스트 알림을 2초 후에 보냅니다');
    } catch (error) {
      console.error('알림 전송 실패:', error);
      Alert.alert('오류', '테스트 알림 전송에 실패했습니다');
    }
  };

  const copyToken = () => {
    if (expoPushToken) {
      // 클립보드에 복사 (실제로는 react-native-clipboard 사용 권장)
      Alert.alert('복사 완료', '토큰이 클립보드에 복사되었습니다');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>FCM 테스트 화면</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>권한 상태</Text>
        <Text style={styles.statusText}>현재: {permissionStatus}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FCM 토큰 받기</Text>
        <TouchableOpacity style={styles.button} onPress={registerForPushNotificationsAsync}>
          <Text style={styles.buttonText}>토큰 받기</Text>
        </TouchableOpacity>
      </View>

      {expoPushToken ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>받은 토큰</Text>
          <Text style={styles.tokenText} numberOfLines={3}>
            {expoPushToken}
          </Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyToken}>
            <Text style={styles.copyButtonText}>토큰 복사</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>테스트 알림</Text>
        <TouchableOpacity 
          style={[styles.button, !expoPushToken && styles.disabledButton]} 
          onPress={sendTestNotification}
          disabled={!expoPushToken}
        >
          <Text style={styles.buttonText}>테스트 알림 보내기</Text>
        </TouchableOpacity>
      </View>

      {notification ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>받은 알림</Text>
          <Text style={styles.notificationText}>
            제목: {notification.request.content.title}
          </Text>
          <Text style={styles.notificationText}>
            내용: {notification.request.content.body}
          </Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>사용법</Text>
        <Text style={styles.instructionText}>
          1. "토큰 받기" 버튼을 눌러 FCM 토큰을 받습니다{'\n'}
          2. 받은 토큰을 복사하여 서버에 전송합니다{'\n'}
          3. "테스트 알림 보내기"로 푸시 알림을 테스트합니다{'\n'}
          4. 콘솔에서 자세한 로그를 확인할 수 있습니다
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  tokenText: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: '#34C759',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  notificationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
