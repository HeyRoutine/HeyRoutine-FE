import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface DayOfWeekSelectorProps {
  selectedDays: string[];
  onDayToggle: (day: string) => void;
  onStartDatePress?: () => void;
}

const DayOfWeekSelector = ({
  selectedDays,
  onDayToggle,
  onStartDatePress,
}: DayOfWeekSelectorProps) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <Container>
      <Header>
        <Title>요일</Title>
        {onStartDatePress && (
          <StartDateButton onPress={onStartDatePress}>
            <StartDateText>시작 날짜 선택</StartDateText>
            <ArrowIcon>›</ArrowIcon>
          </StartDateButton>
        )}
      </Header>
      <DayContainer>
        {days.map((day) => (
          <DayButton
            key={day}
            isSelected={selectedDays.includes(day)}
            onPress={() => onDayToggle(day)}
          >
            <DayText isSelected={selectedDays.includes(day)}>{day}</DayText>
          </DayButton>
        ))}
      </DayContainer>
    </Container>
  );
};

export default DayOfWeekSelector;

const Container = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 16px;
  color: ${theme.colors.gray800};
`;

const StartDateButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const StartDateText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
`;

const ArrowIcon = styled.Text`
  font-size: 16px;
  color: ${theme.colors.gray600};
  margin-left: 4px;
`;

const DayContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const DayButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.gray100};
  align-items: center;
  justify-content: center;
`;

const DayText = styled.Text<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.gray700};
`;
