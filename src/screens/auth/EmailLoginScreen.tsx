import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../../components/common/Header';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { theme } from '../../styles/theme';
import { FormGroup, Label } from '../../components/domain/auth/authFormStyles';

const EmailLoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid = email.length > 0 && password.length > 0;

  const handleLogin = () => {
    if (!isFormValid) return;
    // TODO: 로그인 API 연동
    Alert.alert('로그인 시도', `이메일: ${email}`);
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

          <CustomButton
            text="로그인"
            onPress={handleLogin}
            disabled={!isFormValid}
          />
        </FormContainer>

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
      </ContentWrapper>
    </Container>
  );
};

export default EmailLoginScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ContentWrapper = styled.View`
  flex: 1;
  padding: 24px;
`;

const TitleWrapper = styled.View`
  align-items: center;
  margin-bottom: 48px;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-bottom: 8px;
`;

const MainTitle = styled.Text`
  font-size: 32px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
`;

const FormContainer = styled.View`
  flex: 1;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const FooterLink = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.primary};
`;

const Separator = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray400};
  margin: 0 8px;
`;
