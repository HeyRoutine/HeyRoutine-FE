import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { ScrollView, Text } from 'react-native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';

interface AIRecommendationResultScreenProps {
  navigation: any;
}

const AIRecommendationResultScreen = ({
  navigation,
}: AIRecommendationResultScreenProps) => {
  // 임시 결과 데이터 (나중에 API 응답으로 교체)
  const resultData = {
    title: 'AI 추천 루틴',
    description: '설문 결과를 바탕으로 생성된 맞춤 루틴입니다.',
    routines: [
      {
        id: 1,
        title: '아침 루틴',
        description: '효율적인 출근 준비를 위한 루틴',
        time: '07:00 - 08:00',
        category: '생활',
      },
      {
        id: 2,
        title: '운동 루틴',
        description: '규칙적인 운동 습관을 위한 루틴',
        time: '18:00 - 19:00',
        category: '운동',
      },
      {
        id: 3,
        title: '저녁 루틴',
        description: '규칙적인 수면을 위한 루틴',
        time: '22:00 - 23:00',
        category: '생활',
      },
    ],
  };

  const handleGoHome = () => {
    navigation.navigate('HomeMain');
  };

  const handleCreateRoutine = () => {
    // 추천받은 루틴을 개인 루틴으로 추가하는 로직
    console.log('루틴 생성 요청');
    navigation.navigate('HomeMain');
  };

  return (
    <Container>
      <Header title="AI 추천 결과" onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TitleContainer>
          <Title>{resultData.title}</Title>
          <Description>{resultData.description}</Description>
        </TitleContainer>

        <RoutineList>
          {resultData.routines.map((routine) => (
            <RoutineCard key={routine.id}>
              <RoutineHeader>
                <RoutineTitle>{routine.title}</RoutineTitle>
                <RoutineCategory>{routine.category}</RoutineCategory>
              </RoutineHeader>
              <RoutineDescription>{routine.description}</RoutineDescription>
              <RoutineTime>{routine.time}</RoutineTime>
            </RoutineCard>
          ))}
        </RoutineList>

        <ButtonContainer>
          <CustomButton
            text="홈으로 돌아가기"
            onPress={handleGoHome}
            backgroundColor={theme.colors.gray300}
            textColor={theme.colors.gray700}
          />
          <CustomButton
            text="루틴 생성하기"
            onPress={handleCreateRoutine}
            backgroundColor={theme.colors.primary}
            textColor={theme.colors.white}
          />
        </ButtonContainer>
      </ScrollView>
    </Container>
  );
};

export default AIRecommendationResultScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const TitleContainer = styled.View`
  margin-bottom: 30px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 24px;
  color: ${theme.colors.gray900};
  margin-bottom: 8px;
`;

const Description = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
`;

const RoutineList = styled.View`
  margin-bottom: 30px;
`;

const RoutineCard = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

const RoutineHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const RoutineTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray900};
`;

const RoutineCategory = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.primary};
  background-color: ${theme.colors.primary}20;
  padding: 4px 8px;
  border-radius: 6px;
`;

const RoutineDescription = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  margin-bottom: 8px;
`;

const RoutineTime = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray700};
`;

const ButtonContainer = styled.View`
  gap: 12px;
`;
