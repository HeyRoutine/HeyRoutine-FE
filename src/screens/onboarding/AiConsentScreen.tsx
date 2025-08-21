import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';
import YesNoButton from '../../components/onboarding/YesNoButton';

interface AiConsentScreenProps {
  navigation: any;
}

const AiConsentScreen = ({ navigation }: AiConsentScreenProps) => {
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(
    null,
  );

  const handleOptionSelect = (option: 'yes' | 'no') => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === 'yes') {
      navigation.navigate('OnboardingLoading', {
        nextScreen: 'AiRecommendation',
        isRoutineRecommendation: true,
      });
    } else {
      // 'no' 선택 시 다음 화면으로 이동 (AI 추천 없이)
      navigation.navigate('OnboardingLoading', {
        nextScreen: 'AiRecommendation',
        isRoutineRecommendation: false,
      });
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon>{'<'}</BackIcon>
        </BackButton>
      </Header>

      <Content>
        <WelcomeText>환영합니다.</WelcomeText>
        <AppNameText>
          <HighlightedText>헤이루틴</HighlightedText> 입니다
        </AppNameText>
        <QuestionText>시간표를 토대로 루틴을 짜드릴까요?</QuestionText>
      </Content>

      <Spacer />

      <ButtonSection>
        <YesNoButton
          type="yes"
          onPress={() => handleOptionSelect('yes')}
          isSelected={selectedOption === 'yes'}
        />
        <YesNoButton
          type="no"
          onPress={() => handleOptionSelect('no')}
          isSelected={selectedOption === 'no'}
        />
      </ButtonSection>

      <Spacer />

      <FooterSection>
        <InfoText>사용자님의 시간표를 참조하여 AI가 추천해줘요!</InfoText>
        <NextButton
          onPress={handleNext}
          disabled={selectedOption === null}
          disabledStyle={selectedOption === null}
        >
          <NextButtonText>다음</NextButtonText>
        </NextButton>
      </FooterSection>
    </Container>
  );
};

export default AiConsentScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px 24px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
`;

const BackIcon = styled.Text`
  font-size: 24px;
  color: ${theme.colors.gray800};
`;

const Content = styled.View`
  padding: 24px;
`;

const WelcomeText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 20px;
  color: ${theme.colors.gray800};
  margin-bottom: 8px;
  text-align: left;
`;

const AppNameText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 20px;
  color: ${theme.colors.gray800};
  margin-bottom: 16px;
  text-align: left;
`;

const HighlightedText = styled.Text`
  color: ${theme.colors.primary};
`;

const QuestionText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 20px;
  color: ${theme.colors.gray800};
  text-align: left;
`;

const ButtonSection = styled.View`
  flex-direction: row;
  padding: 0 24px;
  justify-content: center;
  align-items: center;
`;

const Spacer = styled.View`
  flex: 1;
`;

const FooterSection = styled.View`
  padding: 0 24px 24px;
`;

const InfoText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray500};
  text-align: center;
  margin-bottom: 24px;
`;

const NextButton = styled.TouchableOpacity<{ disabledStyle: boolean }>`
  background-color: ${({ disabledStyle }) =>
    disabledStyle ? theme.colors.gray300 : theme.colors.primary};
  padding: 16px;
  border-radius: 12px;
  align-items: center;
`;

const NextButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;
