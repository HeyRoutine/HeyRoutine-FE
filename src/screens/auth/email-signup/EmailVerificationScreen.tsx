import React, { useState, useEffect } from 'react';
import { Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { theme } from '../../../styles/theme';
import CustomButton from '../../../components/common/CustomButton';
import Header from '../../../components/common/Header';
import OtpInput from '../../../components/common/OtpInput';
import Timer from '../../../components/common/Timer';
import { useAuthStore } from '../../../store';
import { mailSend, authCheck } from '../../../api/user/user';
import { useMailSendForPassword } from '../../../hooks/user/useUser';
import {
  MailSendRequest,
  ApiResponse,
  AuthCheckRequest,
} from '../../../types/api';
import { Ionicons } from '@expo/vector-icons';

const EmailVerificationScreen = ({ navigation, route }: any) => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3분 타이머
  const [resendState, setResendState] = useState<'idle' | 'loading' | 'done'>(
    'idle',
  );
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // route.params에서 이메일과 모드 가져오기
  const { email, isEmailChange, onSuccess, mode } = route.params || {};
  const isPasswordResetMode = mode === 'passwordReset';

  // 비밀번호 재설정 메일 발송 hook
  const { mutate: sendPasswordResetMail, isPending: isSendingPasswordMail } = useMailSendForPassword();

  const isButtonEnabled = code.length === 6;

  // 타이머 로직 (UI 표시용)
  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // 재발송 쿨다운은 사용하지 않습니다 (항상 활성화 요구사항)

  const handleVerify = async () => {
    // 인증번호 확인 로직 (서버 스펙에 따라 UUID 기반이면 authCheck 호출)
    try {
      // 예시: 4자리 코드와 이메일을 함께 전송한다고 가정 (스펙에 맞게 조정)
      const payload: AuthCheckRequest = { email, authNum: code } as any;
      const res = await authCheck(payload);
      if (!res.isSuccess) {
        // 서버 메시지 검사
        if (res.message === '인증번호가 틀렸습니다') {
          setVerifyError('인증번호가 틀렸습나다');
        } else {
          setVerifyError(res.message || null);
        }
        console.warn('인증 실패:', res.message);
        return;
      }
      // 성공 시 오류 초기화
      setVerifyError(null);
    } catch (e: any) {
      // Axios 에러 처리 (HTTP 400 포함)
      const message = e?.response?.data?.message;
      if (e?.response?.status === 400 && message === '인증번호가 틀렸습니다') {
        setVerifyError('인증번호가 틀렸습나다');
        } else {
        setVerifyError(message || '인증 요청 중 오류가 발생했습니다');
      }
      console.warn('인증 요청 오류:', e);
      return;
    }

    if (isPasswordResetMode) {
      // 비밀번호 찾기 모드일 때 - ResultScreen을 거쳐 PasswordSetting으로 이동
      navigation.replace('Result', {
        type: 'success',
        title: '인증 완료',
        description: '이메일 인증이 완료되었습니다. 비밀번호 재설정 페이지로 이동합니다.',
        nextScreen: 'PasswordSetting',
        nextScreenParams: { email: email, mode: 'passwordReset' },
        buttonText: '비밀번호 재설정하기',
      });
    } else if (isEmailChange) {
      // 이메일 변경 모드일 때
      navigation.replace('Result', {
        type: 'success',
        title: '변경 완료',
        description: '이메일을 성공적으로 변경했어요',
        nextScreen: 'ProfileEdit',
        onSuccess: onSuccess,
      });
    } else {
      // 회원가입 모드일 때 - email을 route.params로 전달
      navigation.navigate('Password', { email });
    }
  };
  const sendVerificationMail = async () => {
    if (!email) return;
    
    try {
      setResendState('loading');
      // 누른 순간 타이머 3분(180초)으로 리셋
      setTimeLeft(180);
      
      if (isPasswordResetMode) {
        // 비밀번호 찾기 모드일 때는 useMailSendForPassword hook 사용
        sendPasswordResetMail(
          { email },
          {
            onSuccess: (data) => {
              console.log('🔍 비밀번호 재설정 메일 발송 성공:', data);
              if (data.isSuccess) {
                setResendState('done');
                setTimeout(() => setResendState('idle'), 1500); // 1.5초 완료 표시 후 기본 상태
              } else {
                console.warn('메일 전송 실패:', data.message);
                setResendState('idle');
              }
            },
            onError: (error) => {
              console.warn('메일 전송 오류:', error);
              setResendState('idle');
            },
          },
        );
      } else {
        // 일반 회원가입 모드일 때는 기존 API 호출
        const payload: MailSendRequest = { email } as any;
        const res = await mailSend(payload);
        
        if (!res.isSuccess) {
          console.warn('메일 전송 실패:', res.message);
          setResendState('idle');
        }
        if (res.isSuccess) {
          setResendState('done');
          setTimeout(() => setResendState('idle'), 1500); // 1.5초 완료 표시 후 기본 상태
        }
      }
    } catch (e) {
      console.warn('메일 전송 오류:', e);
      setResendState('idle');
    }
  };

  useEffect(() => {
    // 비밀번호 찾기 모드가 아닐 때만 화면 진입 시 인증메일 발송
    if (!isPasswordResetMode) {
      sendVerificationMail();
    }
  }, [isPasswordResetMode]);

  const handleCodeChange = (text: string) => {
    setCode(text);
    if (verifyError) setVerifyError(null);
  };

  return (
    <Container>
      <Header
        onBackPress={() => navigation.goBack()}
        rightComponent={
          !isEmailChange && !isPasswordResetMode ? <ProgressText>2/5</ProgressText> : null
        }
      />

      <Content>
        <Title>
          {isPasswordResetMode 
            ? '비밀번호 재설정을 위해\n이메일 인증을 해주세요.'
            : '안전한 사용을 위해\n이메일 인증을 해주세요.'
          }
        </Title>

        <Timer timeLeft={timeLeft} />

        <OtpInput
          code={code}
          onChangeText={handleCodeChange}
          maxLength={6}
          autoFocus={true}
        />

        <ResendButton 
          onPress={sendVerificationMail} 
          activeOpacity={0.7}
          disabled={isPasswordResetMode && isSendingPasswordMail}
        >
          {resendState === 'loading' || (isPasswordResetMode && isSendingPasswordMail) ? (
            <ResendRow>
              <ActivityIndicator size="small" color={theme.colors.gray600} />
              <ResendText disabled>재발송 중...</ResendText>
            </ResendRow>
          ) : resendState === 'done' ? (
            <ResendRow>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={theme.colors.primary}
              />
              <ResendText>재발송 완료</ResendText>
            </ResendRow>
          ) : (
            <ResendText>인증번호 재발송</ResendText>
          )}
        </ResendButton>

        {verifyError ? <ErrorText>{verifyError}</ErrorText> : null}

        <CharacterImage
          source={require('../../../assets/images/character_shoo.png')}
          resizeMode="contain"
          pointerEvents="none"
        />
      </Content>

      {/* 하단 버튼 */}
      <ButtonWrapper>
        <CustomButton
          text={isPasswordResetMode ? "인증 완료" : "인증하기"}
          onPress={handleVerify}
          // TODO: 6자리 숫자 입력 후 인증하기 버튼 활성화 + 타이머 종료 후 인증하기 버튼 비활성화
          // disabled={!isButtonEnabled}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.white}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default EmailVerificationScreen;

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
  flex: 1;
  padding: 24px;
  align-items: stretch;
`;

const Title = styled.Text`
  font-size: ${theme.fonts.title}px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ResendButton = styled.TouchableOpacity`
  align-self: flex-start;
`;

const ResendText = styled.Text<{ disabled?: boolean }>`
  font-size: ${theme.fonts.caption}px;
  font-family: ${theme.fonts.Medium};
  color: ${(props) =>
    props.disabled ? theme.colors.gray400 : theme.colors.gray600};
  text-decoration-line: underline;
`;

const ResendRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const ErrorText = styled.Text`
  margin-top: 8px;
  color: ${theme.colors.error};
  font-family: ${theme.fonts.Regular};
  font-size: 13px;
`;

// 오른쪽 아래, 아래보다는 조금 위
const CharacterImage = styled.Image`
  position: absolute;
  bottom: -24px;
  right: -240px;
  height: 280px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
