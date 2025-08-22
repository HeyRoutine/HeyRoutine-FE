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
        </FormContainer>

        <BottomActions>
          <CustomButton
            text="로그인"
            onPress={handleLogin}
            disabled={!isFormValid}
            backgroundColor={
              isFormValid ? theme.colors.primary : theme.colors.gray200
            }
            textColor={isFormValid ? theme.colors.white : theme.colors.gray500}
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
        </BottomActions>
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
    flexGrow: 1,
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

const BottomActions = styled.View`
  margin-top: auto;
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
