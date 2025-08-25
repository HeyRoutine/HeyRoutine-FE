import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../../components/common/Header';
import CustomInput from '../../../components/common/CustomInput';
import CustomButton from '../../../components/common/CustomButton';
import { theme } from '../../../styles/theme';
import { useAuthStore } from '../../../store';
import { validateEmail } from '../../../utils/validation';
import { useCheckEmailDuplicate } from '../../../hooks/user/useUser';

const EmailInputScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(
    null,
  );

  // Zustand 스토어에서 이메일 설정 함수 가져오기
  const { setSignupEmail } = useAuthStore();

  // 이메일 중복 확인 API hook - 실시간으로 호출
  const {
    data: duplicateCheckData,
    isLoading: isCheckingDuplicate,
    error: duplicateCheckError,
  } = useCheckEmailDuplicate(email, email.length > 0 && validateEmail(email)); // 이메일이 유효할 때 자동으로 호출

  // 이메일 형식 유효성 검사
  const isEmailValid = validateEmail(email);

  useEffect(() => {
    if (email.length > 0 && !isEmailValid) {
      setErrorMessage('올바른 이메일 형식을 입력해주세요.');
    } else {
      setErrorMessage('');
    }
  }, [email, isEmailValid]);

  // 이메일 입력 시 실시간 중복 확인 실행
  useEffect(() => {
    if (email.length > 0 && validateEmail(email)) {
      // 이메일이 유효할 때 useCheckEmailDuplicate의 enabled가 자동으로 true가 되어 API 호출
      console.log('🔍 이메일 중복 확인 트리거:', email);
      console.log('🔍 이메일 유효성:', validateEmail(email));
      console.log('🔍 enabled 조건:', email.length > 0 && validateEmail(email));
    } else if (email.length === 0) {
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
    if (isEmailValid && isEmailAvailable === true) {
      // 이메일이 유효하고 사용 가능할 때만 다음 화면으로 이동
      handleEmailVerified();
    }
  };

  // 이메일이 확인되었을 때 다음 화면으로 이동
  const handleEmailVerified = () => {
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
          text={isCheckingDuplicate ? '확인 중...' : '다음'}
          onPress={handleNext}
          disabled={
            !isEmailValid || isCheckingDuplicate || isEmailAvailable !== true
          }
          backgroundColor={
            isEmailValid && !isCheckingDuplicate && isEmailAvailable === true
              ? theme.colors.primary
              : theme.colors.gray200
          }
          textColor={
            isEmailValid && !isCheckingDuplicate && isEmailAvailable === true
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
