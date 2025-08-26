import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface RoutineCardProps {
  progress: number;
  title: string;
  description?: string;
  category?: string;
  timeRange: string;
  selectedDays: string[];
  completedDays: string[];
  isSelected?: boolean;
  showProgress?: boolean;
  onPress: () => void;
  onMorePress?: () => void;
}

const RoutineCard = ({
  progress,
  title,
  description,
  category,
  timeRange,
  selectedDays,
  completedDays,
  isSelected = false,
  showProgress = true,
  onPress,
  onMorePress,
}: RoutineCardProps) => {
  // 시간을 "오후 h:mm - 오후 h:mm" 형식으로 변환하는 함수
  const formatTimeRange = (timeRange: string) => {
    let times = timeRange.split(' - ');
    if (times.length !== 2) {
      const timesWithTilde = timeRange.split(' ~ ');
      if (timesWithTilde.length !== 2) return timeRange;
      times = timesWithTilde;
    }

    const formatTime = (time: string) => {
      const [hour, minute] = time.split(':').map(Number);
      const period = hour < 12 ? '오전' : '오후';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${period} ${displayHour}:${minute.toString().padStart(2, '0')}`;
    };

    return `${formatTime(times[0])} - ${formatTime(times[1])}`;
  };
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

  // 오늘 날짜에 해당하는 요일 계산
  const getTodayDay = () => {
    const today = new Date();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    return dayNames[today.getDay()];
  };

  const isDayCompleted = (day: string) => {
    const today = getTodayDay();
    // 오늘에 해당하는 요일이고 completedDays에 포함된 경우에만 완료로 표시
    return day === today && completedDays.includes(day);
  };

  return (
    <Container onPress={onPress} isSelected={isSelected}>
      <Header>
        <Title>{title}</Title>
        <HeaderRight>
          <ProgressText progress={progress}>
            {Math.round(progress)}%
          </ProgressText>
          {onMorePress && (
            <MoreButton onPress={onMorePress}>
              <MoreIcon>⋯</MoreIcon>
            </MoreButton>
          )}
        </HeaderRight>
      </Header>
      {description && <Description>{description}</Description>}
      <TimeText>{formatTimeRange(timeRange)}</TimeText>
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
  margin-bottom: 4px;
`;

const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 0;
`;

const ProgressText = styled.Text<{ progress: number }>`
  font-family: ${theme.fonts.SemiBold};
  font-size: 20px;
  font-weight: 600;
  color: ${({ progress }) => {
    if (progress >= 100) return theme.colors.primary;
    if (progress >= 80) return theme.colors.gray800;
    if (progress >= 60) return theme.colors.gray700;
    if (progress >= 40) return theme.colors.gray600;
    if (progress >= 20) return theme.colors.gray500;
    return '#B5B6BD'; // Gray-Scale-400
  }};
`;

const CategoryText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  color: ${theme.colors.primary};
  margin-bottom: 4px;
`;

const MoreButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: 8px;
`;

const MoreIcon = styled.Text`
  font-size: 20px;
  color: ${theme.colors.gray500};
  line-height: 20px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  font-weight: 500;
  color: #3f3f42;
  flex: 1;
`;

const Description = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  font-weight: 400;
  color: #98989e;
  margin-bottom: 4px;
`;

const TimeText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  font-weight: 400;
  color: #b5b6bd;
  margin-bottom: 24px;
`;

const DayContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  width: 100%;
  gap: 4px;
`;

const DayBadge = styled.View<{ isSelected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.gray200};
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const DayText = styled.Text<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 10px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.gray600};
`;
