import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import CustomButton from '../../components/common/CustomButton';
import { theme } from '../../styles/theme';
import { useAuthStore, useOnboardingStore } from '../../store';
import { useSignUp, useSignIn } from '../../hooks/user/useUser';

// 모든 회원가입 데이터를 route.params로 받기
const WelcomeScreen = ({ navigation, route }: any) => {
  const { nickname, email, password, profileImage } = route.params || {};
  const { login } = useAuthStore();
  const { resetOnboarding } = useOnboardingStore();

  // 디버깅용 로그
  console.log('🔍 WelcomeScreen route.params:', route.params);

  // 회원가입 API hook
  const { mutate: signUp, isPending: isSigningUp } = useSignUp();
  // 로그인 API hook (자동 로그인용)
  const { mutate: signIn, isPending: isSigningIn } = useSignIn();

  const handleStart = () => {
    // 회원가입 API 호출
    signUp(
      {
        email: email,
        password: password,
        nickname: nickname,
        profileImage: profileImage || '', // 기본 프로필 이미지
        roles: ['USER'], // 기본 역할
      },
      {
        onSuccess: (data) => {
          console.log('회원가입 성공:', data);

          // 회원가입 성공 후 자동 로그인
          signIn(
            {
              email: email,
              password: password,
            },
            {
              onSuccess: (loginData) => {
                console.log('🔍 자동 로그인 성공:', loginData);

                // 토큰 저장
                if (
                  loginData.result &&
                  loginData.result.accessToken &&
                  loginData.result.refreshToken
                ) {
                  const { setAccessToken, setRefreshToken } =
                    useAuthStore.getState();
                  setAccessToken(loginData.result.accessToken);
                  setRefreshToken(loginData.result.refreshToken);

                  // 온보딩 상태 초기화 (최초 한번만 온보딩 보여주기 위해)
                  resetOnboarding();

                  // 로그인 상태 변경
                  login();

                  console.log('🔍 회원가입 후 자동 로그인 완료');
                }
              },
              onError: (loginError) => {
                console.error('🔍 자동 로그인 실패:', loginError);
                // 자동 로그인 실패 시 로그인 화면으로 이동
                navigation.navigate('EmailLogin');
              },
            },
          );
        },
        onError: (error) => {
          console.error('회원가입 실패:', error);
          // TODO: 에러 처리 (토스트 메시지 등)
        },
      },
    );
  };

  return (
    <Container>
      <Content>
        <PartyPopperImage
          source={require('../../assets/images/party_popper.png')}
          resizeMode="contain"
        />
        <Title>
          <HighlightText>{nickname}님</HighlightText>
          {'\n'}
          환영합니다!
        </Title>
        <SubTitle>
          헤이루틴을 통해{'\n'}
          AI가 추천하는 갓생 플랜을{'\n'}
          시작해요!
        </SubTitle>
      </Content>

      <ButtonWrapper>
        <CustomButton
          text={isSigningUp ? '가입 중...' : '시작하기'}
          onPress={handleStart}
          disabled={isSigningUp}
          backgroundColor={
            isSigningUp ? theme.colors.gray200 : theme.colors.primary
          }
          textColor={isSigningUp ? theme.colors.gray500 : theme.colors.white}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default WelcomeScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
  justify-content: center;
  align-items: center;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const PartyPopperImage = styled.Image`
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: ${theme.fonts.title}px;
  color: ${theme.colors.gray900};
  text-align: center;
  line-height: 34px;
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
`;

const SubTitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: ${theme.fonts.body}px;
  color: ${theme.colors.gray600};
  text-align: center;
  line-height: 24px;
  margin-top: 16px;
`;

const ButtonWrapper = styled.View`
  width: 100%;
  padding: 24px;
`;
