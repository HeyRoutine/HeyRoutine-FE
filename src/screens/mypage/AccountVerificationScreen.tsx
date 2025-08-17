import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';
import Header from '../../components/common/Header';
import OtpInput from '../../components/common/OtpInput';
import Timer from '../../components/common/Timer';

const AccountVerificationScreen = ({ navigation }: any) => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3분 타이머
  const [errorMessage, setErrorMessage] = useState('');

  const isButtonEnabled = code.length === 4;
  const isTimeUp = timeLeft === 0;

  // 타이머 로직 (UI 표시용)
  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleVerify = () => {
    // TODO: 계좌 인증 로직 구현

    // 임시로 성공 처리 (실제로는 API 응답에 따라 처리)
    navigation.navigate('Complete', {
      title: '등록 성공',
      description: '계좌 등록을 성공적으로 완료했어요',
      onComplete: () => {
        navigation.navigate('ProfileEdit');
      },
    });
  };

  const handleCodeChange = (text: string) => {
    setCode(text);
    setErrorMessage(''); // 입력 시 에러 상태 초기화
  };

  const handleResendCode = () => {
    // TODO: 1원 입금 재발송 로직 구현
    setTimeLeft(180);
    setCode('');
    setErrorMessage('');
  };

  return (
    <Container>
      <Header onBackPress={() => navigation.goBack()} />

      <Content>
        <Title>계좌 인증을 해주세요</Title>

        <Description>
          계좌 거래내역에서 입금한 1원의 입금자명을 확인 후{'\n'}
          4자리 숫자를 입력해 주세요
        </Description>

        <Timer timeLeft={timeLeft} isTimeUp={isTimeUp} />

        <OtpInput
          code={code}
          onChangeText={handleCodeChange}
          maxLength={4}
          autoFocus={true}
        />

        <ResendButton onPress={handleResendCode}>
          <ResendText>1원 입금 재발송</ResendText>
        </ResendButton>

        <ErrorContainer>
          {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
          {isTimeUp && <ErrorMessage>인증 시간이 만료되었습니다.</ErrorMessage>}
        </ErrorContainer>

        <CharacterImage
          source={require('../../assets/images/character_shoo.png')}
          resizeMode="contain"
        />
      </Content>

      {/* 하단 버튼 */}
      <ButtonWrapper>
        <CustomButton
          text="인증하기"
          onPress={handleVerify}
          // TODO: 4자리 숫자 입력 후 인증하기 버튼 활성화, 타이머 종료 후 인증하기 버튼 비활성화
          // disabled={!isButtonEnabled || isTimeUp}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default AccountVerificationScreen;

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

const Description = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  line-height: 24px;
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

const ErrorContainer = styled.View`
  height: 20px;
  justify-content: center;
`;

const ErrorMessage = styled.Text`
  font-size: 14px;
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
