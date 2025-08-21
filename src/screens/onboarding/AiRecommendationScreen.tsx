import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';
import Header from '../../components/common/Header';
import RoutineCard from '../../components/domain/routine/RoutineCard';

interface AiRecommendationScreenProps {
  navigation: any;
}

const AiRecommendationScreen = ({
  navigation,
}: AiRecommendationScreenProps) => {
  const handleSkip = () => {
    navigation.navigate('OnboardingLoading', {
      nextScreen: 'Result',
      isRoutineRegistration: true,
    });
  };

  const handleRoutinePress = (routineId: string) => {
    // 루틴 상세 화면으로 이동
    console.log('Routine pressed:', routineId);
  };

  const handleMorePress = (routineId: string) => {
    // 루틴 옵션 메뉴 표시
    console.log('More pressed:', routineId);
  };

  // 샘플 루틴 데이터
  const sampleRoutines = [
    {
      id: '1',
      category: '아침',
      progress: 0,
      title: '빵빵이의 아침 루틴',
      timeRange: '오전 8:00 - 오전 9:00',
      selectedDays: ['월', '화', '수', '목', '금'],
      totalItems: 5,
    },
    {
      id: '2',
      category: '운동',
      progress: 0,
      title: '빵빵이의 운동 루틴',
      timeRange: '오전 8:00 - 오전 9:00',
      selectedDays: ['월', '화', '수', '목', '금'],
      totalItems: 5,
    },
    {
      id: '3',
      category: '테스트',
      progress: 0,
      title: '빵빵이의 테스트 루틴',
      timeRange: '오전 8:00 - 오전 9:00',
      selectedDays: ['월', '화', '수', '목', '금'],
      totalItems: 5,
    },
  ];

  return (
    <Container>
      <Header onBackPress={() => navigation.goBack()} />

      <Content>
        <Title>루틴 추천</Title>
        <Description>
          <HighlightedText>빵빵이님</HighlightedText>의 시간표를 참고하여{'\n'}
          AI가 루틴을 만들었어요.
        </Description>

        <RoutineList>
          {sampleRoutines.map((routine) => (
            <RoutineCard
              key={routine.id}
              category={routine.category}
              progress={routine.progress}
              title={routine.title}
              timeRange={routine.timeRange}
              selectedDays={routine.selectedDays}
              onPress={() => handleRoutinePress(routine.id)}
              onMorePress={() => handleMorePress(routine.id)}
            />
          ))}
        </RoutineList>
      </Content>

      <ButtonWrapper>
        <CustomButton
          text="건너뛰기"
          onPress={handleSkip}
          backgroundColor={theme.colors.gray300}
          textColor={theme.colors.gray800}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default AiRecommendationScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
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
  margin-bottom: 32px;
`;

const HighlightedText = styled.Text`
  color: ${theme.colors.primary};
`;

const RoutineList = styled.View`
  flex: 1;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
