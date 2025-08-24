import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Alert, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { theme } from '../../styles/theme';

import Header from '../../components/common/Header';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { FormGroup, Label } from '../../components/domain/auth/authFormStyles';
import { useSignIn } from '../../hooks/user/useUser';
import { useAuthStore } from '../../store';

const EmailLoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login, setAccessToken, setRefreshToken } = useAuthStore();

  // 로그인 API hook
  const { mutate: signIn, isPending: isSigningIn } = useSignIn();

  const isFormValid = email.length > 0 && password.length > 0;

  const handleLogin = () => {
    if (!isFormValid) return;

    // 에러 메시지 초기화
    setErrorMessage('');

    // 로그인 API 호출
    signIn(
      {
        email: email,
        password: password,
      },
      {
        onSuccess: (data) => {
          console.log('로그인 성공:', data);

          // 토큰 저장
          if (data.result?.accessToken) {
            setAccessToken(data.result.accessToken);
          }
          if (data.result?.refreshToken) {
            setRefreshToken(data.result.refreshToken);
          }

          // 로그인 상태 변경
          login();
        },
        onError: (error: any) => {
          console.error('로그인 실패:', error);

          // 에러 메시지 설정
          if (error?.response?.data?.message) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage('로그인에 실패했습니다. 다시 시도해주세요.');
          }
        },
      },
    );
  };

  return (
    <Container>
      <Header title="이메일로 로그인" onBackPress={() => navigation.goBack()} />

      <ContentWrapper>
        <TitleWrapper>
          <SubTitle>나만의 루틴 어플</SubTitle>
          <MainTitle>
            <HighlightText>헤이루틴</HighlightText>
          </MainTitle>
          {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
        </TitleWrapper>

        <FormContainer>
          <FormGroup>
            <Label>이메일</Label>
            <CustomInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@example.com"
            />
          </FormGroup>

          <FormGroup>
            <Label>비밀번호</Label>
            <CustomInput
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력해주세요."
              isPassword={true}
            />
          </FormGroup>
        </FormContainer>

        <ButtonWrapper>
          <CustomButton
            text={isSigningIn ? '로그인 중...' : '로그인'}
            onPress={handleLogin}
            disabled={!isFormValid || isSigningIn}
            backgroundColor={
              isFormValid && !isSigningIn
                ? theme.colors.primary
                : theme.colors.gray200
            }
            textColor={
              isFormValid && !isSigningIn
                ? theme.colors.white
                : theme.colors.gray500
            }
          />

          <Footer>
            <FooterLink onPress={() => navigation.navigate('EmailInput')}>
              회원가입
            </FooterLink>
            <Separator>|</Separator>
            <FooterLink onPress={() => navigation.navigate('FindId')}>
              아이디 찾기
            </FooterLink>
            <Separator>|</Separator>
            <FooterLink onPress={() => navigation.navigate('FindPassword')}>
              비밀번호 찾기
            </FooterLink>
          </Footer>
        </ButtonWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default EmailLoginScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ContentWrapper = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 24,
  },
  keyboardShouldPersistTaps: 'handled',
})``;

const TitleWrapper = styled.View`
  align-items: flex-start;
  margin-top: 40px;
  margin-bottom: 60px;
`;

const SubTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 32px;
  color: ${theme.colors.gray900};
`;

const MainTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 32px;
  color: ${theme.colors.gray900};
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
`;

const FormContainer = styled.View`
  width: 100%;
`;

const ButtonWrapper = styled.View`
  /* padding: 0; */
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
`;

const FooterLink = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
`;

const Separator = styled.Text`
  margin: 0 12px;
  color: ${theme.colors.gray300};
`;

const ErrorMessage = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
  margin-top: 8px;
  text-align: center;
`;
