import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import DayButton from './DayButton';

interface DayOfWeekSelectorProps {
  selectedDays: string[];
  onDaysChange: (days: string[]) => void;
  onStartDatePress?: () => void;
  selectedStartDate?: string;
  readOnly?: boolean;
}

const DayOfWeekSelector = ({
  selectedDays,
  onDaysChange,
  onStartDatePress,
  selectedStartDate,
  readOnly = false,
}: DayOfWeekSelectorProps) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  const handleDayPress = (day: string) => {
    if (readOnly) return; // 읽기 전용일 때는 클릭 무시

    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter((d) => d !== day));
    } else {
      onDaysChange([...selectedDays, day]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  return (
    <Container>
      {!readOnly && (
        <HeaderRow>
          <Label>요일</Label>
          {onStartDatePress && (
            <StartDateButton onPress={onStartDatePress}>
              <StartDateText>
                {selectedStartDate
                  ? formatDate(selectedStartDate)
                  : '시작 날짜 선택'}
              </StartDateText>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.colors.gray600}
              />
            </StartDateButton>
          )}
        </HeaderRow>
      )}
      <DaysContainer>
        {days.map((day) => (
          <DayButton
            key={day}
            day={day}
            isSelected={selectedDays.includes(day)}
            onPress={() => handleDayPress(day)}
            disabled={readOnly}
          />
        ))}
      </DaysContainer>
    </Container>
  );
};

export default DayOfWeekSelector;

const Container = styled.View`
  margin-bottom: 24px;
  padding: 24px;
  background-color: #fafafa;
  border-radius: 10px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Label = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.gray800};
`;

const StartDateButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const StartDateText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 11px;
  color: ${theme.colors.gray400};
`;

const DaysContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 4px;
`;
