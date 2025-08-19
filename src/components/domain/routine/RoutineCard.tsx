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
        <CategoryBadge>
          <CategoryText>
            [{category}] {progress}%
          </CategoryText>
        </CategoryBadge>
        <MoreButton onPress={onMorePress}>
          <MoreIcon>⋯</MoreIcon>
        </MoreButton>
      </Header>
      <Title>{title}</Title>
      <TimeText>{timeRange}</TimeText>
      <DayContainer>
        {selectedDays.map((day) => (
          <DayBadge key={day}>
            <DayText>{day}</DayText>
          </DayBadge>
        ))}
      </DayContainer>
    </Container>
  );
};

export default RoutineCard;

const Container = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CategoryBadge = styled.View`
  background-color: ${theme.colors.gray100};
  padding: 4px 8px;
  border-radius: 4px;
`;

const CategoryText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  color: ${theme.colors.gray700};
`;

const MoreButton = styled.TouchableOpacity`
  padding: 4px;
`;

const MoreIcon = styled.Text`
  font-size: 16px;
  color: ${theme.colors.gray500};
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 4px;
`;

const TimeText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  margin-bottom: 8px;
`;

const DayContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const DayBadge = styled.View`
  background-color: ${theme.colors.primary};
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 4px;
  margin-bottom: 4px;
`;

const DayText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  color: ${theme.colors.white};
`;
