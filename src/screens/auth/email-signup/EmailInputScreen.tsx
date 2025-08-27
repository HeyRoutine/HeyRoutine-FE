import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../../components/common/Header';
import CustomInput from '../../../components/common/CustomInput';
import CustomButton from '../../../components/common/CustomButton';
import { theme } from '../../../styles/theme';
import { useAuthStore } from '../../../store';
import { validateEmail } from '../../../utils/validation';
import { useCheckEmailDuplicate, useMailSendForPassword } from '../../../hooks/user/useUser';

const EmailInputScreen = ({ navigation, route }: any) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(
    null,
  );


  // route.params에서 모드 가져오기
  const { mode } = route.params || {};
  const isPasswordResetMode = mode === 'passwordReset';

  // 비밀번호 재설정 메일 발송 hook
  const { mutate: sendPasswordResetMail, isPending: isSendingPasswordMail } = useMailSendForPassword();

  // Zustand 스토어에서 이메일 설정 함수 가져오기
  const { setSignupEmail } = useAuthStore();

  // 이메일 중복 확인 API hook - 실시간으로 호출 (비밀번호 찾기 모드일 때는 건너뛰기)
  const {
    data: duplicateCheckData,
    isLoading: isCheckingDuplicate,
    error: duplicateCheckError,
  } = useCheckEmailDuplicate(
    email, 
    email.length > 0 && validateEmail(email) && !isPasswordResetMode
  ); // 이메일이 유효하고 비밀번호 찾기 모드가 아닐 때만 자동으로 호출

  // 이메일 형식 유효성 검사
  const isEmailValid = validateEmail(email);

  useEffect(() => {
    if (email.length > 0 && !isEmailValid) {
      setErrorMessage('올바른 이메일 형식을 입력해주세요.');
    } else {
      setErrorMessage('');
    }
  }, [email, isEmailValid]);

  // 이메일 입력 시 상태 초기화
  useEffect(() => {
    if (email.length === 0) {
      // 이메일이 비어있을 때 상태 초기화
      setIsEmailAvailable(null);
      setErrorMessage('');
    }
  }, [email]);

  // 이메일 중복 확인 결과 처리 - 실시간
  useEffect(() => {
    if (email.length > 0 && validateEmail(email) && !isCheckingDuplicate) {
      if (duplicateCheckError) {
        // API 에러 처리
        console.log('🔍 이메일 중복 확인 에러:', duplicateCheckError);
        setErrorMessage('이메일 중복 확인 중 오류가 발생했습니다.');
        setIsEmailAvailable(false);
      } else if (duplicateCheckData) {
        // API 응답 확인
        console.log('🔍 이메일 중복 확인 응답:', duplicateCheckData);
        if (
          duplicateCheckData.isSuccess &&
          duplicateCheckData.code === 'COMMON200'
        ) {
          // 중복 확인 성공 - 사용 가능한 이메일
          console.log('🔍 이메일 중복 확인 성공:', duplicateCheckData.result);
          setErrorMessage('');
          setIsEmailAvailable(true);
        } else {
          // API는 성공했지만 비즈니스 로직 실패 (중복된 이메일)
          console.log('🔍 이메일 중복 확인 실패:', duplicateCheckData.message);
          setErrorMessage(
            duplicateCheckData.message || '이미 사용 중인 이메일입니다.',
          );
          setIsEmailAvailable(false);
        }
      }
    } else if (email.length === 0) {
      // 이메일이 비어있을 때
      setErrorMessage('');
      setIsEmailAvailable(null);
    }
  }, [email, isCheckingDuplicate, duplicateCheckData, duplicateCheckError]);

  const handleNext = () => {
    if (isPasswordResetMode) {
      // 비밀번호 찾기 모드일 때는 이메일 형식만 확인
      if (isEmailValid) {
        handleEmailVerified();
      }
    } else {
      // 회원가입 모드일 때는 이메일 중복 확인도 필요
      if (isEmailValid && isEmailAvailable === true) {
        handleEmailVerified();
      }
    }
  };

  // 이메일이 확인되었을 때 다음 화면으로 이동
  const handleEmailVerified = () => {
    if (isPasswordResetMode) {
      // 비밀번호 찾기 모드일 때는 이메일 형식만 확인하면 바로 메일 발송
      if (isEmailValid) {
        handlePasswordResetMailSend();
      }
    } else {
      // 회원가입 모드일 때는 이메일 중복 확인도 필요
      if (isEmailValid && isEmailAvailable === true && !isCheckingDuplicate) {
        // Zustand 스토어에 이메일 저장
        setSignupEmail(email);
        console.log('🔍 이메일 저장됨:', email);

        // 저장 후 스토어 상태 확인
        const currentState = useAuthStore.getState();
        console.log('🔍 이메일 저장 후 스토어 상태:', currentState.signupData);

        // route.params로 이메일 전달
        navigation.navigate('EmailVerification', { email });
      }
    }
  };

  // 비밀번호 재설정 메일 발송 함수
  const handlePasswordResetMailSend = () => {
    if (!email) return;
    
    setErrorMessage('');
    console.log('🔍 비밀번호 재설정 메일 발송 시작:', email);
    
    sendPasswordResetMail(
      { email },
      {
        onSuccess: (data) => {
          console.log('🔍 비밀번호 재설정 메일 발송 성공:', data);
          
          if (data.isSuccess && data.code === 'COMMON200') {
            // 메일 발송 성공 시 EmailVerificationScreen으로 이동
            navigation.navigate('EmailVerification', { 
              email: email, 
              mode: 'passwordReset' 
            });
          } else {
            // 메일 발송 실패 시 에러 메시지 표시
            setErrorMessage(data.message || '메일 발송에 실패했습니다. 다시 시도해주세요.');
          }
        },
        onError: (error: any) => {
          console.error('🔍 비밀번호 재설정 메일 발송 오류:', error);
          
          // axios 에러 응답에서 메시지 추출
          if (error.response?.data?.message) {
            setErrorMessage(error.response.data.message);
          } else if (error.message) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage('메일 발송 중 오류가 발생했습니다. 다시 시도해주세요.');
          }
        },
      },
    );
  };

  return (
    <Container>
      <Header
        onBackPress={() => navigation.goBack()}
        rightComponent={!isPasswordResetMode ? <ProgressText>1/5</ProgressText> : null}
      />

      <Content>
        <Title>
          {isPasswordResetMode 
            ? '비밀번호 재설정을 위해\n이메일을 입력해주세요!'
            : '만나서 반가워요.\n이메일을 입력해주세요!'
          }
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
          text={
            isPasswordResetMode
              ? isSendingPasswordMail ? '메일 발송 중...' : '메일 발송'
              : isCheckingDuplicate ? '확인 중...' : '다음'
          }
          onPress={handleNext}
          disabled={
            isPasswordResetMode
              ? !isEmailValid || isSendingPasswordMail
              : !isEmailValid || isCheckingDuplicate || isEmailAvailable !== true
          }
          backgroundColor={
            isPasswordResetMode
              ? isEmailValid && !isSendingPasswordMail
                ? theme.colors.primary
                : theme.colors.gray200
              : isEmailValid && !isCheckingDuplicate && isEmailAvailable === true
                ? theme.colors.primary
                : theme.colors.gray200
          }
          textColor={
            isPasswordResetMode
              ? isEmailValid && !isSendingPasswordMail
                ? theme.colors.white
                : theme.colors.gray500
              : isEmailValid && !isCheckingDuplicate && isEmailAvailable === true
                ? theme.colors.white
                : theme.colors.gray500
          }
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
