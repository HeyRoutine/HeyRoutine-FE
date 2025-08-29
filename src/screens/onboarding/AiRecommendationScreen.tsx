import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';

import RoutineCard from '../../components/domain/routine/RoutineCard';

interface AiRecommendationScreenProps {
  navigation: any;
}

const AiRecommendationScreen = ({
  navigation,
}: AiRecommendationScreenProps) => {
  const [selectedRoutines, setSelectedRoutines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3초 후 로딩 완료

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    navigation.navigate('OnboardingLoading', {
      nextScreen: 'Result',
      isRoutineRegistration: true,
    });
  };

  const handleRoutineSelect = (routineId: string) => {
    setSelectedRoutines((prev) =>
      prev.includes(routineId)
        ? prev.filter((id) => id !== routineId)
        : [...prev, routineId],
    );
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
      completedDays: [],
    },
    {
      id: '2',
      category: '운동',
      progress: 0,
      title: '빵빵이의 운동 루틴',
      timeRange: '오전 8:00 - 오전 9:00',
      selectedDays: ['월', '화', '수', '목', '금'],
      totalItems: 5,
      completedDays: [],
    },
    {
      id: '3',
      category: '테스트',
      progress: 0,
      title: '빵빵이의 테스트 루틴',
      timeRange: '오전 8:00 - 오전 9:00',
      selectedDays: ['월', '화', '수', '목', '금'],
      totalItems: 5,
      completedDays: [],
    },
  ];

  // 로딩 중일 때 표시할 화면
  if (isLoading) {
    return (
      <Container>
        <LoadingContent>
          <LoadingTitle>AI가 루틴을 분석하고 있어요</LoadingTitle>
          <LoadingSubtitle>잠시만 기다려주세요...</LoadingSubtitle>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContent>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <Title>
          <HighlightedText>빵빵이님</HighlightedText>의 시간표를 참고하여{'\n'}
          AI가 루틴을 만들었어요.
        </Title>

        <RoutineList>
          {sampleRoutines.map((routine) => (
            <RoutineCard
              key={routine.id}
              category={routine.category}
              progress={routine.progress}
              title={routine.title}
              timeRange={routine.timeRange}
              selectedDays={routine.selectedDays}
              completedDays={routine.completedDays}
              isSelected={selectedRoutines.includes(routine.id)}
              showProgress={false}
              onPress={() => handleRoutineSelect(routine.id)}
              onMorePress={() => handleMorePress(routine.id)}
            />
          ))}
        </RoutineList>
      </Content>

      <ButtonWrapper>
        <CustomButton
          text={selectedRoutines.length > 0 ? '선택 완료' : '건너뛰기'}
          onPress={selectedRoutines.length > 0 ? handleSkip : handleSkip}
          backgroundColor={
            selectedRoutines.length > 0
              ? theme.colors.primary
              : theme.colors.gray300
          }
          textColor={
            selectedRoutines.length > 0
              ? theme.colors.white
              : theme.colors.gray800
          }
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
  padding-top: 56px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray800};
  line-height: 34px;
  margin-top: 16px;
  margin-bottom: 12px;
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

const LoadingContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const LoadingTitle = styled.Text`
  font-size: 20px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray800};
  text-align: center;
  margin-bottom: 8px;
`;

const LoadingSubtitle = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  text-align: center;
  margin-bottom: 32px;
`;
