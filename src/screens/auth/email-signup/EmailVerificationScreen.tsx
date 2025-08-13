import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { theme } from '../../../styles/theme';
import AuthButton from '../../../components/domain/auth/AuthButton';
import { formatTime } from '../../../utils/timeFormat';

const EmailVerificationScreen = ({ navigation }: any) => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3분 타이머

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
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>&lt;</BackButtonText>
        </BackButton>
        <ProgressText>2/5</ProgressText>
      </Header>

      <Content>
        <Title>
          안전한 사용을 위해{'\n'}
          이메일 인증을 해주세요.
        </Title>

        <TimerContainer>
          <MaterialCommunityIcons
            name="clock-outline"
            size={20}
            color={theme.colors.gray600}
          />
          <TimerText>{formatTime(timeLeft)}</TimerText>
        </TimerContainer>

        {/* TODO: TextInput과 연동하여 OTP 입력 컴포넌트 넣기 */}
        <OtpInputContainer>
          <OtpBox />
          <OtpBox />
          <OtpBox />
          <OtpBox />
        </OtpInputContainer>

        <ResendButton>
          <ResendText>인증번호 재발송</ResendText>
        </ResendButton>

        {/* 여우 이미지가 들어갈 공간을 비워둡니다. */}
        <Spacer />
      </Content>

      {/* 하단 버튼 */}
      <ButtonWrapper>
        <AuthButton
          text="인증하기"
          onPress={handleVerify}
          disabled={!isButtonEnabled}
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

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
`;

const BackButton = styled.TouchableOpacity``;

const BackButtonText = styled.Text`
  font-size: 24px;
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
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const TimerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-bottom: 40px;
`;

const TimerText = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const OtpInputContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const OtpBox = styled.View`
  width: 50px;
  height: 2px;
  background-color: ${theme.colors.primary};
`;

const ResendButton = styled.TouchableOpacity`
  align-self: flex-start;
`;

const ResendText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray600};
  text-decoration-line: underline;
`;

const Spacer = styled.View`
  flex: 1;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
