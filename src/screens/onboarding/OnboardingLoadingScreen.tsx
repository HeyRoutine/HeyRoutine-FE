import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import { useAuthStore } from '../../store';
import CustomButton from '../../components/common/CustomButton';
import ProgressCircle from '../../components/common/ProgressCircle';

interface OnboardingLoadingScreenProps {
  navigation: any;
  route: any;
}

const OnboardingLoadingScreen = ({
  navigation,
  route,
}: OnboardingLoadingScreenProps) => {
  const { setLoggedIn } = useAuthStore();
  const [progress, setProgress] = useState(0);
  const {
    nextScreen = 'Result',
    isUpload = false,
    isAiAnalysis = false,
    isRoutineRecommendation = false,
    isRoutineRegistration = false,
  } = route.params || {};

  useEffect(() => {
    // 프로그레스 업데이트 (100ms마다 2%씩 증가)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // 5초 후 다음 화면으로 이동
    const timer = setTimeout(() => {
      if (nextScreen === 'Result' && isUpload) {
        // 업로드 후 성공 결과 표시
        navigation.navigate('Result', {
          type: 'success',
          title: '시간표 업로드 성공!',
          description: '시간표가 성공적으로 업로드되었어요.',
          points: 50,
          nextScreen: 'AiConsent',
        });
      } else if (nextScreen === 'Result' && isRoutineRegistration) {
        // 루틴 등록 후 성공 결과 표시
        navigation.navigate('Result', {
          type: 'success',
          title: '루틴 등록 완료!',
          description: 'AI 추천 루틴이 성공적으로 등록되었어요.',
          points: 50,
          nextScreen: null, // 메인 화면으로 이동
        });
      } else if (nextScreen === 'Result' && isAiAnalysis) {
        // AI 분석 후 성공 결과 표시
        navigation.navigate('Result', {
          type: 'success',
          title: '루틴 등록 완료!',
          description: 'AI 추천 루틴이 성공적으로 등록되었어요.',
          points: 50,
          nextScreen: null, // 메인 화면으로 이동
        });
      } else if (nextScreen === 'Result') {
        // 실패 결과를 표시하고 TimetableUpload로 이동
        navigation.navigate('Result', {
          type: 'failure',
          title: '시간표 불러오기 실패',
          description: '헤이영 캠퍼스에서 시간표를 불러오는데 실패했어요.',
          points: undefined,
          nextScreen: 'TimetableUpload',
        });
      } else if (nextScreen === 'OnboardingLoading') {
        // OnboardingLoading으로 이동 (업로드 로딩)
        navigation.navigate('OnboardingLoading', {
          nextScreen: 'Result',
          isUpload: true,
        });
      } else if (nextScreen) {
        navigation.navigate(nextScreen);
      } else {
        // nextScreen이 없으면 로그인 상태로 변경하여 메인 화면으로 이동
        setLoggedIn(true);
      }
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [navigation, nextScreen, setLoggedIn, isUpload, isAiAnalysis]);

  const handleSkip = () => {
    if (nextScreen) {
      navigation.navigate(nextScreen);
    } else {
      setLoggedIn(true);
    }
  };

  const getTitle = () => {
    if (isRoutineRegistration) return '루틴 등록중...';
    if (isRoutineRecommendation) return '루틴 추천중...';
    if (isAiAnalysis) return 'AI 루틴 분석중...';
    return '시간표 불러오는중...';
  };

  const getDescription = () => {
    if (isRoutineRegistration) return 'AI 추천 루틴을 등록하고 있어요';
    if (isRoutineRecommendation)
      return 'AI가 당신에게 맞는 루틴을 추천하고 있어요';
    if (isAiAnalysis)
      return 'AI가 당신의 시간표를 분석하여 맞춤 루틴을 추천하고 있어요';
    return '헤이영 캠퍼스에서 시간표를 불러오고 있어요';
  };

  return (
    <Container>
      <Content>
        <ProgressSection>
          <ProgressCircle progress={progress} />
        </ProgressSection>

        <TextSection>
          <Title>{getTitle()}</Title>
          <Description>{getDescription()}</Description>
        </TextSection>
      </Content>

      <ButtonWrapper>
        <CustomButton
          text="건너뛰기"
          onPress={handleSkip}
          backgroundColor={theme.colors.gray200}
          textColor={theme.colors.gray600}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default OnboardingLoadingScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const ProgressSection = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: 60px;
`;

const TextSection = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  text-align: center;
  margin-bottom: 8px;
`;

const Description = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  text-align: center;
  line-height: 24px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
