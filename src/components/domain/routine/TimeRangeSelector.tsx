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
  const formatTimeDisplay = (time: string) => {
    if (!time || time === '오전 00:00') {
      return (
        <>
          <TimePeriod>오전</TimePeriod>
          <TimeNumber>00:00</TimeNumber>
        </>
      );
    }

    if (time.includes('오전')) {
      const timePart = time.replace('오전 ', '');
      return (
        <>
          <TimePeriod>오전</TimePeriod>
          <TimeNumber>{timePart}</TimeNumber>
        </>
      );
    } else if (time.includes('오후')) {
      const timePart = time.replace('오후 ', '');
      return (
        <>
          <TimePeriod>오후</TimePeriod>
          <TimeNumber>{timePart}</TimeNumber>
        </>
      );
    }

    return <TimeValue>{time}</TimeValue>;
  };

  return (
    <Container>
      <TimeContainer>
        <TimeButton onPress={onStartTimePress}>
          <TimeLabel>시작 시간</TimeLabel>
          <TimeValueContainer>
            {formatTimeDisplay(startTime)}
          </TimeValueContainer>
        </TimeButton>
        <TimeButton onPress={onEndTimePress}>
          <TimeLabel>완료 시간</TimeLabel>
          <TimeValueContainer>{formatTimeDisplay(endTime)}</TimeValueContainer>
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

const TimeValueContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const TimePeriod = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: #b5b6bd;
  font-weight: 500;
`;

const TimeNumber = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 20px;
  color: #b5b6bd;
  font-weight: 500;
`;

const TimeValue = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 20px;
  color: #b5b6bd;
  font-weight: 500;
`;
