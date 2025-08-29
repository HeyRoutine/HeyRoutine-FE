import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

import CustomButton from '../../components/common/CustomButton';

interface AIRecommendationResultScreenProps {
  navigation: any;
  route: any;
}

const AIRecommendationResultScreen = ({
  navigation,
  route,
}: AIRecommendationResultScreenProps) => {
  // 라우트 파라미터에서 결과 데이터 받기
  const resultData = route.params?.resultData || {
    routines: [
      {
        id: '1',
        title: '아침 운동 루틴',
        category: '운동',
        timeRange: '07:00 - 08:00',
        days: ['월', '화', '수', '목', '금'],
        description: '하루를 시작하는 아침 운동 루틴입니다.',
      },
      {
        id: '2',
        title: '저녁 정리 루틴',
        category: '생활',
        timeRange: '21:00 - 22:00',
        days: ['월', '화', '수', '목', '금'],
        description: '하루를 마무리하는 정리 루틴입니다.',
      },
    ],
  };

  console.log('AI 추천 결과 데이터:', resultData);

  const handleComplete = () => {
    // 홈 화면으로 이동
    navigation.navigate('HomeMain');
  };

  return (
    <Container>
      <Content>
        <Title>AI가 추천한 루틴</Title>
        <Subtitle>설문 결과를 바탕으로 맞춤 루틴을 생성했어요</Subtitle>

        <ResultList>
          {resultData.routines.map((routine: any, index: number) => (
            <ResultCard key={routine.id}>
              <CardHeader>
                <RoutineTitle>{routine.title}</RoutineTitle>
                <CategoryTag>
                  <CategoryTagText>{routine.category}</CategoryTagText>
                </CategoryTag>
              </CardHeader>

              <RoutineInfo>
                <InfoRow>
                  <InfoLabel>시간:</InfoLabel>
                  <InfoValue>{routine.timeRange}</InfoValue>
                </InfoRow>

                <InfoRow>
                  <InfoLabel>요일:</InfoLabel>
                  <InfoValue>{routine.days.join(', ')}</InfoValue>
                </InfoRow>

                <InfoRow>
                  <InfoLabel>설명:</InfoLabel>
                  <InfoValue>{routine.description}</InfoValue>
                </InfoRow>
              </RoutineInfo>
            </ResultCard>
          ))}
        </ResultList>
      </Content>

      <ButtonWrapper>
        <CustomButton
          text="완료"
          onPress={handleComplete}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.white}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default AIRecommendationResultScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-bottom: 32px;
`;

const ResultList = styled.View`
  flex: 1;
`;

const ResultCard = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid ${theme.colors.gray200};
`;

const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const RoutineTitle = styled.Text`
  font-size: 18px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
  flex: 1;
`;

const CategoryTag = styled.View`
  background-color: ${theme.colors.primary};
  padding: 4px 8px;
  border-radius: 6px;
`;

const CategoryTagText = styled.Text`
  font-size: 12px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.white};
`;

const RoutineInfo = styled.View`
  gap: 8px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray700};
  width: 40px;
  margin-right: 8px;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray800};
  flex: 1;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
