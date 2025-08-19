import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface TimeRangeSelectorProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

const TimeRangeSelector = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}: TimeRangeSelectorProps) => {
  return (
    <Container>
      <TimeSection>
        <TimeLabel>시작 시간</TimeLabel>
        <TimeValue>{startTime}</TimeValue>
      </TimeSection>
      <TimeSection>
        <TimeLabel>완료 시간</TimeLabel>
        <TimeValue>{endTime}</TimeValue>
      </TimeSection>
    </Container>
  );
};

export default TimeRangeSelector;

const Container = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
`;

const TimeSection = styled.View`
  flex: 1;
  align-items: center;
`;

const TimeLabel = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray700};
  margin-bottom: 8px;
`;

const TimeValue = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
`;
