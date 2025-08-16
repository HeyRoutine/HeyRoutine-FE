import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Header from '../../../components/common/Header';
import CustomButton from '../../../components/common/CustomButton';
import { theme } from '../../../styles/theme';
import { formatTime } from '../../../utils/timeFormat';

const EmailVerificationScreen = ({ navigation }: any) => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3분 타이머

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
      <Header
        onBackPress={() => navigation.goBack()}
        rightComponent={<ProgressText>1/5</ProgressText>}
      />

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
        <CustomButton
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

const ProgressText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  text-align: center;
  line-height: 34px;
  margin-bottom: 32px;
`;

const TimerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 32px;
`;

const TimerText = styled.Text<{ isTimeUp: boolean }>`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${(props) =>
    props.isTimeUp ? theme.colors.error : theme.colors.gray600};
  margin-left: 8px;
`;

const OtpInputContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
`;

const OtpBox = styled.View<{ isFocused: boolean }>`
  width: 60px;
  height: 60px;
  border-width: 2px;
  border-color: ${(props) =>
    props.isFocused ? theme.colors.primary : theme.colors.gray300};
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  margin: 0 8px;
  background-color: ${theme.colors.white};
`;

const OtpText = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
`;

const HiddenTextInput = styled.TextInput`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
`;

const ResendButton = styled.TouchableOpacity`
  margin-bottom: 24px;
`;

const ResendText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.primary};
`;

const ErrorMessage = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
  margin-bottom: 24px;
`;

const CharacterImage = styled.Image`
  width: 120px;
  height: 120px;
  margin-bottom: 48px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
