import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { theme } from '../../../styles/theme';
import AuthButton from '../../../components/domain/auth/AuthButton';
import { formatTime } from '../../../utils/timeFormat';

const EmailVerificationScreen = ({ navigation }: any) => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(10); // 3분 타이머

  const isButtonEnabled = code.length === 4;
  const isTimeUp = timeLeft === 0;

  // 타이머 로직 (UI 표시용)
  useEffect(() => {
    if (isTimeUp) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleVerify = () => {
    // TODO: 인증하기 로직 구현
    if (!isButtonEnabled) return;
    navigation.navigate('Password');
  };

  const handleCodeChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, ''); // 숫자만 허용
    setCode(numericText);
  };

  const handleResendCode = () => {
    // TODO: 인증번호 재발송 로직 구현
    setTimeLeft(180);
    setCode('');
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
            color={isTimeUp ? theme.colors.error : theme.colors.gray600}
          />
          <TimerText isTimeUp={isTimeUp}>{formatTime(timeLeft)}</TimerText>
        </TimerContainer>

        <OtpInputContainer>
          {[0, 1, 2, 3].map((index) => (
            <OtpBox key={index} isFocused={index === code.length}>
              <OtpText>{code[index] || ''}</OtpText>
            </OtpBox>
          ))}
          <HiddenTextInput
            value={code}
            onChangeText={handleCodeChange}
            maxLength={4}
            keyboardType="number-pad"
            autoFocus={true}
            caretHidden={true}
          />
        </OtpInputContainer>

        <ResendButton onPress={handleResendCode}>
          <ResendText>인증번호 재발송</ResendText>
        </ResendButton>

        {isTimeUp && <ErrorMessage>인증 시간이 만료되었습니다.</ErrorMessage>}

        <CharacterImage
          source={require('../../../assets/images/character_shoo.png')}
          resizeMode="contain"
        />
      </Content>

      {/* 하단 버튼 */}
      <ButtonWrapper>
        <AuthButton
          text="인증하기"
          onPress={handleVerify}
          disabled={!isButtonEnabled || isTimeUp}
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
  font-size: ${theme.fonts.caption}px;
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

const TimerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-bottom: 40px;
`;

const TimerText = styled.Text<{ isTimeUp: boolean }>`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${({ isTimeUp }) =>
    isTimeUp ? theme.colors.error : theme.colors.gray600};
`;

const OtpInputContainer = styled.View`
  position: relative;
  flex-direction: row;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const HiddenTextInput = styled.TextInput`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
`;

const OtpBox = styled.View`
  width: 60px;
  height: 50px;
  border-bottom-width: 2px;
  border-color: ${theme.colors.gray300};
  justify-content: center;
  align-items: center;
`;

const OtpText = styled.Text`
  font-size: ${theme.fonts.title}px;
  font-family: ${theme.fonts.Medium};
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

const ErrorMessage = styled.Text`
  margin-top: 8px;
  font-size: ${theme.fonts.caption}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
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
