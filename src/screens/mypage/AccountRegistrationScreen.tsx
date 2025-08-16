import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/common/Header';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { theme } from '../../styles/theme';

interface IAccountRegistrationScreenProps {
  navigation: any;
}

const AccountRegistrationScreen = ({
  navigation,
}: IAccountRegistrationScreenProps) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 계좌번호 유효성 검사 (임시)
  const isAccountValid = accountNumber.length >= 10;

  useEffect(() => {
    if (accountNumber.length > 0 && !isAccountValid) {
      setErrorMessage('존재하지 않는 계좌번호입니다.');
    } else {
      setErrorMessage('');
    }
  }, [accountNumber, isAccountValid]);

  const handleRequestAuth = () => {
    if (isAccountValid) {
      // 1원 인증 요청 로직
      console.log('1원 인증 요청');
    }
  };

  return (
    <Container>
      <Header title="계좌 등록" onBackPress={() => navigation.goBack()} />

      <Content>
        <Title>계좌번호를 입력해주세요</Title>
      </Content>

      {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

      <CenterContent>
        <CustomInput
          value={accountNumber}
          onChangeText={setAccountNumber}
          placeholder="계좌번호를 입력하세요"
          maxLength={20}
        />
      </CenterContent>

      <ButtonWrapper>
        <CustomButton
          text="1원 인증 요청"
          onPress={handleRequestAuth}
          disabled={!isAccountValid}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default AccountRegistrationScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
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
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
