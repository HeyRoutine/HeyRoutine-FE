import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';

interface AiConsentScreenProps {
  navigation: any;
}

const AiConsentScreen = ({ navigation }: AiConsentScreenProps) => {
  const handleConsent = () => {
    navigation.navigate('OnboardingLoading', {
      nextScreen: 'AiRecommendation',
      isRoutineRecommendation: true,
    });
  };

  return (
    <Container>
      <Content>
        <Title>AI 동의</Title>
        <Description>
          AI가 당신의 시간표를 분석하여{'\n'}
          개인화된 루틴을 추천해드려요.
        </Description>
      </Content>

      <ButtonWrapper>
        <CustomButton
          text="동의하기"
          onPress={handleConsent}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.white}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default AiConsentScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 24px;
  color: ${theme.colors.gray800};
  margin-bottom: 16px;
  text-align: center;
`;

const Description = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
  text-align: center;
  line-height: 24px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
