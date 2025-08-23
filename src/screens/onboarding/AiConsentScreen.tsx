import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';
import YesNoButton from '../../components/onboarding/YesNoButton';
import Header from '../../components/common/Header';

interface AiConsentScreenProps {
  navigation: any;
}

const AiConsentScreen = ({ navigation }: AiConsentScreenProps) => {
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(
    null,
  );

  const handleOptionSelect = (option: 'yes' | 'no') => {
    console.log('Button selected:', option);
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === 'yes') {
      navigation.navigate('AiRecommendation');
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
      <Header onBackPress={() => navigation.goBack()} />

      <Body>
        <TopArea>
          <Content>
            <WelcomeText>환영합니다.</WelcomeText>
            <AppNameText>
              <HighlightedText>헤이루틴</HighlightedText> 입니다
            </AppNameText>
            <QuestionText>시간표를 토대로 루틴을 짜드릴까요?</QuestionText>
          </Content>
        </TopArea>

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

        <BottomArea>
          <FooterSection>
            <InfoText>사용자님의 시간표를 참조하여 AI가 추천해줘요!</InfoText>
            <NextButton
              onPress={selectedOption !== null ? handleNext : undefined}
              disabled={selectedOption === null}
              activeOpacity={selectedOption !== null ? 0.8 : 1}
            >
              <NextButtonText disabled={selectedOption === null}>
                다음
              </NextButtonText>
            </NextButton>
          </FooterSection>
        </BottomArea>
      </Body>
    </Container>
  );
};

export default AiConsentScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  padding: 24px;
  padding-top: 16px;
`;

const Body = styled.View`
  flex: 1;
`;

const TopArea = styled.View`
  flex: 1;
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
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

const BottomArea = styled.View`
  flex: 1;
  justify-content: flex-end;
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

const NextButton = styled.TouchableOpacity<{ disabled: boolean }>`
  background-color: ${({ disabled }) =>
    disabled ? theme.colors.gray300 : theme.colors.primary};
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const NextButtonText = styled.Text<{ disabled: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${({ disabled }) =>
    disabled ? theme.colors.gray500 : theme.colors.white};
`;
