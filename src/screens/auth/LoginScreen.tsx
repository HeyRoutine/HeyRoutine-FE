import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      {/* 배경 그라데이션 */}
      <LinearGradient
        colors={['#A992FE', '#E585E3']} // 색상 직접 지정
        style={styles.gradient}
      />

      <SafeAreaView style={styles.wrapper}>
        {/* 1. 상단 제목 영역 */}
        <View style={styles.topContent}>
          <Text style={styles.subTitle}>나만의 루틴 어플</Text>
          <Text style={styles.title}>헤이루틴</Text>
        </View>

        {/* 2. 중간 캐릭터 이미지 영역 */}
        <View style={styles.middleContent}>
          <Image
            source={require('../../assets/images/character_mori.png')}
            resizeMode="contain"
          />
        </View>

        {/* 3. 하단 버튼 영역 */}
        <View style={styles.bottomContent}>
          {/* 카카오 로그인 버튼 */}
          <TouchableOpacity style={[styles.socialButton, styles.kakaoButton]}>
            <Image
              source={require('../../assets/images/Kakao.png')}
              style={styles.buttonIcon}
            />
            <Text style={[styles.buttonText, styles.kakaoButtonText]}>
              카카오 로그인
            </Text>
          </TouchableOpacity>

          {/* 네이버 로그인 버튼 */}
          <TouchableOpacity style={[styles.socialButton, styles.naverButton]}>
            <Image
              source={require('../../assets/images/Naver.png')}
              style={styles.buttonIcon}
            />
            <Text style={[styles.buttonText, styles.naverButtonText]}>
              네이버 로그인
            </Text>
          </TouchableOpacity>

          {/* 이메일로 로그인 버튼 */}
          <TouchableOpacity style={styles.emailLoginButton}>
            <Text style={styles.emailLoginText}>이메일로 로그인</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

// --- StyleSheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  topContent: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  middleContent: {
    flex: 4,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContent: {
    flex: 3,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  subTitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4,
    // fontFamily 등은 프로젝트에 폰트 설정 후 추가 필요
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  socialButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  naverButton: {
    backgroundColor: '#03C75A',
  },
  buttonIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    left: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  kakaoButtonText: {
    color: '#1F2021', // 검정 계열 텍스트
  },
  naverButtonText: {
    color: '#FFFFFF', // 흰색 텍스트
  },
  emailLoginButton: {
    marginTop: 12,
  },
  emailLoginText: {
    fontSize: 14,
    color: '#ffffff',
  },
});

export default LoginScreen;
