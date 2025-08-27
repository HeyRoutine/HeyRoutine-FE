import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/common/Header';
import { theme } from '../../styles/theme';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { validatePassword } from '../../utils/validation';
import { useMyPageResetPassword } from '../../hooks/user';
import { useMailSendForPassword } from '../../hooks/user/useUser';

interface IPasswordSettingScreenProps {
  navigation: any;
  route: any;
}

const PasswordSettingScreen = ({ navigation, route }: IPasswordSettingScreenProps) => {
  // route.params에서 모드 가져오기
  const { mode, email } = route.params || {};
  const isPasswordResetMode = mode === 'passwordReset';
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidForm, setIsValidForm] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const { mutateAsync: resetPasswordMutate } = useMyPageResetPassword();
  const { mutate: sendPasswordResetMail } = useMailSendForPassword();

  // 실시간 검증을 위한 useEffect (PasswordScreen과 동일한 방식)
  useEffect(() => {
    // 새 비밀번호 유효성 검사
    const isValidPassword = validatePassword(newPassword);

    // 새 비밀번호와 확인 비밀번호 일치 검사
    const isMatch = newPassword === confirmPassword;

    // 현재 비밀번호와 새 비밀번호가 같은지 체크
    const isDifferentFromCurrent = currentPassword !== newPassword;

    // 에러 메시지 설정 (PasswordScreen과 동일한 로직)
    if (newPassword && !isValidPassword) {
      setValidationMessage(
        '비밀번호는 영문 소문자, 숫자를 포함하여 8~20자여야 합니다.',
      );
    } else if (confirmPassword && !isMatch) {
      setValidationMessage('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
    } else if (currentPassword && newPassword && !isDifferentFromCurrent) {
      setValidationMessage('현재 비밀번호와 다른 비밀번호를 입력해주세요.');
    } else {
      setValidationMessage('');
    }

    // 폼 유효성 설정 (비밀번호 찾기 모드일 때는 현재 비밀번호 불필요)
    if (isPasswordResetMode) {
      setIsValidForm(
        Boolean(
          newPassword &&
            confirmPassword &&
            isValidPassword &&
            isMatch,
        ),
      );
    } else {
      setIsValidForm(
        Boolean(
          currentPassword &&
            newPassword &&
            confirmPassword &&
            isValidPassword &&
            isMatch &&
            isDifferentFromCurrent,
        ),
      );
    }
  }, [currentPassword, newPassword, confirmPassword, isPasswordResetMode]);

  const handleCurrentPasswordChange = (text: string) => {
    setCurrentPassword(text);
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
  };

  const handlePasswordChange = async () => {
    if (!isValidForm) return;

    if (isPasswordResetMode) {
      // 비밀번호 찾기 모드일 때는 비밀번호 재설정 API 호출
      try {
        // 여기에 비밀번호 재설정 API 호출 로직 추가
        // 예: sendPasswordResetMail({ email, newPassword })
        console.log('🔍 비밀번호 재설정 모드:', { email, newPassword });
        
        // 임시로 성공 처리 (실제 API 구현 필요)
        navigation.replace('Result', {
          type: 'success',
          title: '비밀번호 재설정 완료',
          description: '새로운 비밀번호로 로그인할 수 있습니다',
          nextScreen: 'EmailLogin',
          buttonText: '로그인 하러 가기',
        });
      } catch (error: any) {
        navigation.replace('Result', {
          type: 'failure',
          title: '재설정 실패',
          description: '비밀번호 재설정에 실패했습니다. 다시 시도해주세요.',
          nextScreen: 'PasswordSetting',
        });
      }
    } else {
      // 일반 비밀번호 변경 모드
      try {
        const response = await resetPasswordMutate({ password: newPassword });
        if (response.isSuccess) {
          navigation.replace('Result', {
            type: 'success',
            title: '변경 완료',
            description: '비밀번호를 성공적으로 변경했어요',
            nextScreen: 'ProfileEdit',
            onSuccess: () => {},
          });
        } else {
          navigation.replace('Result', {
            type: 'failure',
            title: '변경 실패',
            description: response.message || '비밀번호 변경에 실패했어요',
            nextScreen: 'ProfileEdit',
          });
        }
      } catch (error: any) {
        navigation.replace('Result', {
          type: 'failure',
          title: '변경 실패',
          description: error?.response?.data?.message || '비밀번호 변경에 실패했어요',
          nextScreen: 'ProfileEdit',
        });
      }
    }
  };

  return (
    <Container>
      <Header 
        title={isPasswordResetMode ? "비밀번호 재설정" : "비밀번호 설정"} 
        onBackPress={() => navigation.goBack()} 
      />

      <Content>
        <PasswordSection>
          {!isPasswordResetMode && (
            <>
              <PasswordLabel>현재 비밀번호</PasswordLabel>
              <InputContainer>
                <CustomInput
                  value={currentPassword}
                  placeholder="현재 비밀번호를 입력하세요"
                  maxLength={20}
                  onChangeText={handleCurrentPasswordChange}
                  isPassword={true}
                />
              </InputContainer>
            </>
          )}

          <PasswordLabel>새 비밀번호</PasswordLabel>
          <InputContainer>
            <CustomInput
              value={newPassword}
              placeholder="새 비밀번호를 입력하세요"
              maxLength={20}
              onChangeText={handleNewPasswordChange}
              isPassword={true}
            />
          </InputContainer>

          <PasswordLabel>새 비밀번호 확인</PasswordLabel>
          <InputContainer>
            <CustomInput
              value={confirmPassword}
              placeholder="새 비밀번호를 다시 입력하세요"
              maxLength={20}
              onChangeText={handleConfirmPasswordChange}
              isPassword={true}
            />
          </InputContainer>

          <InstructionText>
            <InstructionTextPart>* </InstructionTextPart>
            <HighlightedText>비밀번호는 8자 이상 20자 이하</HighlightedText>
            <InstructionTextPart>로 입력해주세요.</InstructionTextPart>
          </InstructionText>
          <InstructionText>
            <InstructionTextPart>* </InstructionTextPart>
            <HighlightedText>소문자 및 숫자를 모두 포함</HighlightedText>
            <InstructionTextPart>해야 합니다.</InstructionTextPart>
          </InstructionText>

          <ErrorContainer>
            {validationMessage ? (
              <ErrorText>{validationMessage}</ErrorText>
            ) : null}
          </ErrorContainer>
        </PasswordSection>
      </Content>

      <ButtonContainer>
        <CustomButton
          text={isPasswordResetMode ? "비밀번호 재설정" : "비밀번호 변경"}
          onPress={handlePasswordChange}
          disabled={!isValidForm}
          backgroundColor={
            isValidForm ? theme.colors.primary : theme.colors.gray200
          }
          textColor={isValidForm ? theme.colors.white : theme.colors.gray500}
        />
      </ButtonContainer>
    </Container>
  );
};

export default PasswordSettingScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const PasswordSection = styled.View`
  margin-top: 32px;
`;

const PasswordLabel = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray900};
  margin-bottom: 12px;
  margin-top: 24px;
`;

const InputContainer = styled.View`
  margin-bottom: 8px;
`;

const InstructionText = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
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
  margin-top: 8px;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
`;

const ButtonContainer = styled.View`
  padding: 24px;
`;
