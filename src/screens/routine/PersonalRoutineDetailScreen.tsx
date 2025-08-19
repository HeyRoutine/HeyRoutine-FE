import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';

interface PersonalRoutineDetailScreenProps {
  navigation: any;
}

const PersonalRoutineDetailScreen = ({
  navigation,
}: PersonalRoutineDetailScreenProps) => {
  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    // 수정 화면으로 이동
  };

  const handleDelete = () => {
    // 삭제 확인 다이얼로그
  };

  const handleStart = () => {
    // 루틴 실행 화면으로 이동
  };

  return (
    <Container>
      <Header title="개인 루틴 상세" onBackPress={handleBack} />
      <Content>
        <RoutineInfo>
          <RoutineTitle>빵빵이의 아침 루틴</RoutineTitle>
          <RoutineCategory>[생활] 67%</RoutineCategory>
          <RoutineTime>오전 8:00 ~ 오전 9:00</RoutineTime>
          <RoutineDays>월 화 수 목 금</RoutineDays>
        </RoutineInfo>

        <StatsSection>
          <StatsTitle>통계</StatsTitle>
          <StatsGrid>
            <StatItem>
              <StatValue>15</StatValue>
              <StatLabel>총 실행 횟수</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>67%</StatValue>
              <StatLabel>완료율</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>5일</StatValue>
              <StatLabel>연속 달성</StatLabel>
            </StatItem>
          </StatsGrid>
        </StatsSection>

        <ActionSection>
          <ActionButton onPress={handleStart}>
            <ActionText>루틴 시작</ActionText>
          </ActionButton>
        </ActionSection>
      </Content>
    </Container>
  );
};

export default PersonalRoutineDetailScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const RoutineInfo = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

const RoutineTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 20px;
  color: ${theme.colors.gray800};
  margin-bottom: 8px;
`;

const RoutineCategory = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray600};
  margin-bottom: 4px;
`;

const RoutineTime = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  margin-bottom: 4px;
`;

const RoutineDays = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
`;

const StatsSection = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

const StatsTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 16px;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StatItem = styled.View`
  flex: 1;
  align-items: center;
`;

const StatValue = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 24px;
  color: ${theme.colors.primary};
  margin-bottom: 4px;
`;

const StatLabel = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray600};
`;

const ActionSection = styled.View`
  margin-top: 16px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  align-items: center;
`;

const ActionText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;
