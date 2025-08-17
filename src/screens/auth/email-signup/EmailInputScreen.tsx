import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../../components/common/Header';
import CustomInput from '../../../components/common/CustomInput';
import CustomButton from '../../../components/common/CustomButton';
import { theme } from '../../../styles/theme';

const EmailInputScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 이메일 형식 유효성 검사
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  useEffect(() => {
    if (email.length > 0 && !isEmailValid) {
      setErrorMessage('올바른 이메일 형식을 입력해주세요.');
    } else {
      setErrorMessage('');
    }
  }, [email, isEmailValid]);

  const handleNext = () => {
    if (isEmailValid) {
      // navigation.navigate('EmailVerification', { email });
      navigation.navigate('Password');
    }
  };

  return (
    <Container>
      <Header
        onBackPress={() => navigation.goBack()}
        rightComponent={<ProgressText>1/5</ProgressText>}
      />

      <Content>
        <Title>
          만나서 반가워요.{'\n'}
          이메일을 입력해주세요!
        </Title>
      </Content>

      {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

      <CenterContent>
        <CustomInput
          value={email}
          onChangeText={setEmail}
          placeholder="example@example.com"
          maxLength={30}
        />
      </CenterContent>

      <ButtonWrapper>
        <CustomButton
          text="다음"
          onPress={handleNext}
          disabled={!isEmailValid}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default EmailInputScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ProgressText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const Content = styled.View`
  padding: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-top: 16px;
  margin-bottom: 12px;
`;

const ErrorContainer = styled.View`
  height: 20px;
  justify-content: center;
`;

const ErrorMessage = styled.Text`
  position: absolute;
  top: 200px;
  left: 24px;
  right: 24px;
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
`;

const CenterContent = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding: 100px 24px 0 24px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
