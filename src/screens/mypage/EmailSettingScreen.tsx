import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/common/Header';
import { theme } from '../../styles/theme';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { useUserStore } from '../../store';

interface IEmailSettingScreenProps {
  navigation: any;
}

const EmailSettingScreen = ({ navigation }: IEmailSettingScreenProps) => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  // Zustand 스토어에서 사용자 정보 가져오기
  const { userInfo, updateUserInfo } = useUserStore();

  // 현재 사용자 이메일을 스토어에서 가져와서 초기값 설정
  useEffect(() => {
    if (userInfo?.email) {
      setEmail(userInfo.email);
    }
  }, [userInfo?.email]);

  const validateEmail = (text: string) => {
    // 빈 문자열 체크
    if (text.length === 0) {
      setValidationMessage('');
      setIsValidEmail(false);
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setValidationMessage('올바른 이메일 형식을 입력해주세요.');
      setIsValidEmail(false);
      return;
    }

    // 모든 검증 통과
    setValidationMessage('');
    setIsValidEmail(true);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    validateEmail(text);
  };

  const handleVerification = () => {
    if (isValidEmail) {
      // 이메일 인증 화면으로 이동
      navigation.navigate('EmailVerification', {
        email: email,
        isEmailChange: true,
        onSuccess: () => {
          // Zustand 스토어에 이메일 업데이트
          updateUserInfo({ email: email });
          console.log('이메일 변경 완료:', email);
          navigation.goBack();
        },
      });
    }
  };

  return (
    <Container>
      <Header title="이메일 설정" onBackPress={() => navigation.goBack()} />

      <Content>
        <EmailSection>
          <EmailLabel>이메일</EmailLabel>
          <InputContainer>
            <CustomInput
              value={email}
              placeholder="example@exam.com"
              maxLength={30}
              onChangeText={handleEmailChange}
            />
          </InputContainer>
          <InstructionText>
            <InstructionTextPart>* </InstructionTextPart>
            <HighlightedText>사용가능한</HighlightedText>
            <InstructionTextPart>
              {' '}
              이메일을 입력해주셔야합니다.
            </InstructionTextPart>
          </InstructionText>
          <ErrorContainer>
            {validationMessage ? (
              <ErrorText>{validationMessage}</ErrorText>
            ) : null}
          </ErrorContainer>
        </EmailSection>
      </Content>

      <ButtonWrapper>
        <CustomButton
          text="인증 하기"
          onPress={handleVerification}
          disabled={!isValidEmail || email.length === 0}
          backgroundColor={
            isValidEmail && email.length > 0
              ? theme.colors.primary
              : theme.colors.gray200
          }
          textColor={
            isValidEmail && email.length > 0
              ? theme.colors.white
              : theme.colors.gray500
          }
        />
      </ButtonWrapper>
    </Container>
  );
};

export default EmailSettingScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const EmailSection = styled.View`
  margin-top: 32px;
`;

const EmailLabel = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray900};
  margin-bottom: 12px;
`;

const InputContainer = styled.View`
  margin-bottom: 8px;
`;

const InstructionText = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const InstructionTextPart = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const HighlightedText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.primary};
`;

const ErrorContainer = styled.View`
  height: 20px;
  justify-content: center;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
