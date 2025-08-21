import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { theme } from '../../../styles/theme';
import CustomButton from '../../../components/common/CustomButton';
import Header from '../../../components/common/Header';
import OtpInput from '../../../components/common/OtpInput';
import Timer from '../../../components/common/Timer';
import { useAuthStore } from '../../../store';

const EmailVerificationScreen = ({ navigation, route }: any) => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3분 타이머

  // Zustand 스토어에서 회원가입 데이터 가져오기
  const { signupData } = useAuthStore();
  const { email } = signupData;

  const { isEmailChange, onSuccess } = route.params || {};

  const isButtonEnabled = code.length === 4;

  // 타이머 로직 (UI 표시용)
  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleVerify = () => {
    // TODO: 인증하기 로직 구현

    if (isEmailChange) {
      // 이메일 변경 모드일 때
      navigation.replace('Result', {
        type: 'success',
        title: '변경 완료',
        description: '이메일을 성공적으로 변경했어요',
        nextScreen: 'ProfileEdit',
        onSuccess: onSuccess,
      });
    } else {
      // 회원가입 모드일 때
      navigation.navigate('Password');
    }
  };

  const handleCodeChange = (text: string) => {
    setCode(text);
  };

  return (
    <Container>
      <Header
        onBackPress={() => navigation.goBack()}
        rightComponent={
          !isEmailChange ? <ProgressText>2/5</ProgressText> : null
        }
      />

      <Content>
        <Title>
          안전한 사용을 위해{'\n'}
          이메일 인증을 해주세요.
        </Title>

        <Timer timeLeft={timeLeft} />

        <OtpInput
          code={code}
          onChangeText={handleCodeChange}
          maxLength={4}
          autoFocus={true}
        />

        <ResendButton>
          <ResendText>인증번호 재발송</ResendText>
        </ResendButton>

        <CharacterImage
          source={require('../../../assets/images/character_shoo.png')}
          resizeMode="contain"
        />
      </Content>

      {/* 하단 버튼 */}
      <ButtonWrapper>
        <CustomButton
          text="인증하기"
          onPress={handleVerify}
          // TODO: 4자리 숫자 입력 후 인증하기 버튼 활성화 + 타이머 종료 후 인증하기 버튼 비활성화
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

const ResendText = styled.Text`
  font-size: ${theme.fonts.caption}px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray600};
  text-decoration-line: underline;
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
