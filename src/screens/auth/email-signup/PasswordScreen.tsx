import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../../components/common/Header';
import CustomInput from '../../../components/common/CustomInput';
import CustomButton from '../../../components/common/CustomButton';
import { theme } from '../../../styles/theme';
import {
  FormGroup,
  Label,
} from '../../../components/domain/auth/authFormStyles';

const PasswordScreen = ({ navigation, route }: any) => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);

  // 비밀번호 유효성 검사를 위한 useEffect
  useEffect(() => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[0-9]).{8,20}$/;
    const isValid = passwordRegex.test(password);
    setIsPasswordValid(isValid);

    const isMatch = password === passwordConfirm;
    setDoPasswordsMatch(isMatch);

    // 에러 메시지 설정
    if (password && !isValid) {
      setErrorMessage(
        '비밀번호는 영문 소문자, 숫자를 포함하여 8~20자여야 합니다.',
      );
    } else if (passwordConfirm && !isMatch) {
      setErrorMessage('비밀번호가 서로 일치하지 않습니다');
    } else {
      setErrorMessage('');
    }
  }, [password, passwordConfirm]);

  const handleNext = () => {
    navigation.navigate('Nickname');
  };

  return (
    <Container>
      <Header
        onBackPress={() => navigation.goBack()}
        rightComponent={<ProgressText>2/5</ProgressText>}
      />

      <Content>
        <Title>
          안전한 사용을 위해{'\n'}
          비밀번호를 입력해주세요.
        </Title>
        <ErrorContainer>
          {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
        </ErrorContainer>
      </Content>

      <CenterContent>
        <FormGroup>
          <Label>비밀번호</Label>
          <CustomInput
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력해주세요."
            isPassword
            maxLength={20}
          />
        </FormGroup>

        <FormGroup>
          <Label>비밀번호 확인</Label>
          <CustomInput
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            placeholder="비밀번호를 입력해주세요."
            isPassword
            maxLength={20}
          />
        </FormGroup>
      </CenterContent>

      <ButtonWrapper>
        <CustomButton
          text="다음"
          onPress={handleNext}
          disabled={!isPasswordValid || !doPasswordsMatch}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default PasswordScreen;

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
