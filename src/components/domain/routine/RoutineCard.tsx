import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface RoutineCardProps {
  category: string;
  progress: number;
  title: string;
  timeRange: string;
  selectedDays: string[];
  completedDays: string[];
  isSelected?: boolean;
  showProgress?: boolean;
  onPress: () => void;
  onMorePress?: () => void;
}

const RoutineCard = ({
  category,
  progress,
  title,
  timeRange,
  selectedDays,
  completedDays,
  isSelected = false,
  showProgress = true,
  onPress,
  onMorePress,
}: RoutineCardProps) => {
  // 요일 순서 정의 (월화수목금토일)
  const dayOrder = ['월', '화', '수', '목', '금', '토', '일'];

  // 요일을 순서대로 정렬하는 함수
  const sortDaysByOrder = (days: string[]) => {
    return days.sort((a, b) => {
      const indexA = dayOrder.indexOf(a);
      const indexB = dayOrder.indexOf(b);
      return indexA - indexB;
    });
  };

  const isDayCompleted = (day: string) => completedDays.includes(day);

  return (
    <Container onPress={onPress} isSelected={isSelected}>
      <Header>
        <CategoryText>[{category}]</CategoryText>
        <RightHeader>
          {showProgress && <ProgressText>{progress}%</ProgressText>}
          {onMorePress && (
            <MoreButton onPress={onMorePress}>
              <MoreIcon>⋯</MoreIcon>
            </MoreButton>
          )}
        </RightHeader>
      </Header>
      <Title>{title}</Title>
      <TimeText>{timeRange}</TimeText>
      <DayContainer>
        {sortDaysByOrder(selectedDays).map((day) => {
          const done = isDayCompleted(day);
          return (
            <DayBadge key={day} isSelected={done}>
              <DayText isSelected={done}>{day}</DayText>
            </DayBadge>
          );
        })}
      </DayContainer>
    </Container>
  );
};

export default RoutineCard;

const Container = styled.TouchableOpacity<{ isSelected: boolean }>`
  background-color: #f7f8fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 2px solid
    ${({ isSelected }) => (isSelected ? theme.colors.primary : 'transparent')};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 4px; */
`;

const CategoryText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  color: ${theme.colors.primary};
`;

const MoreButton = styled.TouchableOpacity`
  padding: 4px;
`;

const MoreIcon = styled.Text`
  font-size: 16px;
  color: ${theme.colors.gray500};
`;

const RightHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProgressText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  color: ${theme.colors.primary};
  margin-right: 8px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 4px;
`;

const TimeText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray500};
  margin-bottom: 24px;
`;

const DayContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-end;
`;

const DayBadge = styled.View<{ isSelected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.gray200};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  margin-bottom: 4px;
`;

const DayText = styled.Text<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 10px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.gray600};
`;
