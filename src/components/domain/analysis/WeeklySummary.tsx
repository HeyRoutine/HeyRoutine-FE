import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../styles/theme';
import RoutineStatusRow from './RoutineStatusRow';

/**
 * 루틴 완료 상태 타입
 */
type RoutineStatus = 'isCompleted' | 'incomplete' | 'future' | 'optional';

/**
 * WeeklySummary의 props 인터페이스
 */
interface IWeeklySummaryProps {
  /** 주간 요약 제목 */
  title: string;
  /** 날짜 범위 */
  dateRange: string;
  /** 요일 헤더 */
  weekDays: string[];
  /** 루틴 데이터 */
  routines: Array<{
    name: string;
    status: RoutineStatus[];
  }>;
  /** 현재 선택된 요일 인덱스 */
  selectedDayIndex: number;
  /** 이전 주 이동 핸들러 */
  onPreviousWeek?: () => void;
  /** 다음 주 이동 핸들러 */
  onNextWeek?: () => void;
}

/**
 * 주간 요약 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 주간 요약 컴포넌트
 */
const WeeklySummary = ({
  title,
  dateRange,
  weekDays,
  routines,
  selectedDayIndex,
  onPreviousWeek,
  onNextWeek,
}: IWeeklySummaryProps) => {
  return (
    <Container>
      <HeaderSection>
        <Title>{title}</Title>
        <DateSection>
          <NavigationButton onPress={onPreviousWeek} disabled={!onPreviousWeek}>
            <Ionicons
              name="chevron-back"
              size={16}
              color={
                onPreviousWeek ? theme.colors.gray500 : theme.colors.gray300
              }
            />
          </NavigationButton>
          <DateRange>{dateRange}</DateRange>
          <NavigationButton onPress={onNextWeek} disabled={!onNextWeek}>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={onNextWeek ? theme.colors.gray500 : theme.colors.gray300}
            />
          </NavigationButton>
        </DateSection>
      </HeaderSection>

      <TableContainer>
        {/* 요일 헤더 */}
        <WeekHeaderRow>
          <HeaderCell />
          {weekDays.map((day, index) => (
            <HeaderCell key={index} isSelected={index === selectedDayIndex}>
              <DayText isSelected={index === selectedDayIndex}>{day}</DayText>
            </HeaderCell>
          ))}
        </WeekHeaderRow>

        {/* 루틴 행들 */}
        {routines.map((routine, routineIndex) => (
          <RoutineStatusRow
            key={routineIndex}
            routineName={routine.name}
            status={routine.status}
            selectedDayIndex={selectedDayIndex}
          />
        ))}
      </TableContainer>
    </Container>
  );
};

export default WeeklySummary;

const Container = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid ${theme.colors.gray200};
`;

const HeaderSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
`;

const DateSection = styled.View`
  flex-direction: row;
  align-items: center;
`;

const NavigationButton = styled(TouchableOpacity)`
  padding: 4px;
`;

const DateRange = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin: 0 8px;
`;

const TableContainer = styled.View``;

const WeekHeaderRow = styled.View`
  flex-direction: row;
  margin-bottom: 12px;
`;

const HeaderCell = styled.View<{ isSelected?: boolean }>`
  flex: 1;
  align-items: center;
  padding: 8px 4px;
`;

const DayText = styled.Text<{ isSelected: boolean }>`
  font-size: 12px;
  font-family: ${theme.fonts.Regular};
  color: ${(props) =>
    props.isSelected ? theme.colors.primary : theme.colors.gray600};
`;
