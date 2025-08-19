import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface RoutineCardProps {
  category: string;
  progress: number;
  title: string;
  timeRange: string;
  selectedDays: string[];
  onPress: () => void;
  onMorePress: () => void;
}

const RoutineCard = ({
  category,
  progress,
  title,
  timeRange,
  selectedDays,
  onPress,
  onMorePress,
}: RoutineCardProps) => {
  return (
    <Container onPress={onPress}>
      <Header>
        <CategoryText>
          [{category}] {progress}%
        </CategoryText>
        <MoreButton onPress={onMorePress}>
          <MoreIcon>⋯</MoreIcon>
        </MoreButton>
      </Header>
      <Title>{title}</Title>
      <TimeText>{timeRange}</TimeText>
      <DayContainer>
        {selectedDays.map((day) => (
          <DayBadge key={day} isSelected={true}>
            <DayText isSelected={true}>{day}</DayText>
          </DayBadge>
        ))}
      </DayContainer>
    </Container>
  );
};

export default RoutineCard;

const Container = styled.TouchableOpacity`
  background-color: #f7f8fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
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
