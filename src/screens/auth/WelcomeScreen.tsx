import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import CustomButton from '../../components/common/CustomButton';
import { theme } from '../../styles/theme';
import { useAuthStore, useOnboardingStore } from '../../store';

// 유저 닉네임을 props로 받는다고 가정
const WelcomeScreen = ({ navigation, route }: any) => {
  const nickname = route.params?.nickname || '냥냥이';
  const { login } = useAuthStore();
  const { resetOnboarding } = useOnboardingStore();

  const handleStart = () => {
    // 온보딩 상태 초기화 (최초 한번만 온보딩 보여주기 위해)
    resetOnboarding();
    // Zustand를 통해 로그인 상태 변경
    login();
  };

  return (
    <Container>
      <Content>
        <PartyPopperImage
          source={require('../../assets/images/party_popper.png')}
          resizeMode="contain"
        />
        <Title>
          <HighlightText>{nickname}님</HighlightText>
          {'\n'}
          환영합니다!
        </Title>
        <SubTitle>
          헤이루틴을 통해{'\n'}
          AI가 추천하는 갓생 플랜을{'\n'}
          시작해요!
        </SubTitle>
      </Content>

      <ButtonWrapper>
        <CustomButton
          text="시작하기"
          onPress={handleStart}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.white}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default WelcomeScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
  justify-content: center;
  align-items: center;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const PartyPopperImage = styled.Image`
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: ${theme.fonts.title}px;
  color: ${theme.colors.gray900};
  text-align: center;
  line-height: 34px;
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
`;

const SubTitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: ${theme.fonts.body}px;
  color: ${theme.colors.gray600};
  text-align: center;
  line-height: 24px;
  margin-top: 16px;
`;

const ButtonWrapper = styled.View`
  width: 100%;
  padding: 24px;
`;
