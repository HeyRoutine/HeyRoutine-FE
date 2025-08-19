import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../../../styles/theme';

interface TimeRangeSelectorProps {
  startTime: string;
  endTime: string;
  onStartTimePress: () => void;
  onEndTimePress: () => void;
}

const TimeRangeSelector = ({
  startTime,
  endTime,
  onStartTimePress,
  onEndTimePress,
}: TimeRangeSelectorProps) => {
  return (
    <Container>
      <Label>시간</Label>
      <TimeContainer>
        <TimeButton onPress={onStartTimePress}>
          <TimeLabel>시작 시간</TimeLabel>
          <TimeValue>{startTime}</TimeValue>
        </TimeButton>
        <TimeButton onPress={onEndTimePress}>
          <TimeLabel>완료 시간</TimeLabel>
          <TimeValue>{endTime}</TimeValue>
        </TimeButton>
      </TimeContainer>
    </Container>
  );
};

export default TimeRangeSelector;

const Container = styled.View`
  margin-bottom: 24px;
  padding: 24px;
  background-color: #fafafa;
  border-radius: 10px;
`;

const Label = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 12px;
`;

const TimeContainer = styled.View`
  flex-direction: row;
  gap: 16px;
`;

const TimeButton = styled(TouchableOpacity)`
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

const TimeLabel = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 4px;
`;

const TimeValue = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 20px;
  color: ${theme.colors.gray400};
`;
