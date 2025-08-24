import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import TabNavigation from '../../components/common/TabNavigation';
import RoutineCard from '../../components/domain/routine/RoutineCard';
import AddRoutineButton from '../../components/domain/routine/AddRoutineButton';
import GroupRoutineCard from '../../components/domain/routine/GroupRoutineCard';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import CustomButton from '../../components/common/CustomButton';
import { useRoutineStore } from '../../store';
import { usePersonalRoutines } from '../../hooks/routine/personal/usePersonalRoutines';
import { useGroupRoutines } from '../../hooks/routine/group/useGroupRoutines';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showAddRoutineModal, setShowAddRoutineModal] = useState(false);

  // Zustand 스토어에서 루틴 상태 가져오기
  const { selectedDate, setSelectedDate } = useRoutineStore();

  // 오늘 날짜 기준
  const today = new Date();

  // 주 시작(월요일) 계산
  const getStartOfWeekMonday = (date: Date) => {
    const copied = new Date(date);
    const day = copied.getDay(); // 0=일,1=월,...6=토
    const diffToMonday = (day + 6) % 7; // 월요일까지 되돌아가기
    copied.setHours(0, 0, 0, 0);
    copied.setDate(copied.getDate() - diffToMonday);
    return copied;
  };

  // 같은 날짜 비교 (연/월/일)
  const isSameDate = (a: Date, b: Date) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  // 요일 문자열
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'] as const;

  // 선택된 날짜가 속한 주(월~일) 데이터 생성
  const startOfWeek = getStartOfWeekMonday(selectedDate);
  const weekData = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + idx);
    return {
      day: dayLabels[d.getDay()],
      date: d.getDate(),
      fullDate: d,
    };
  });

  // 샘플 루틴 데이터 타입
  type RoutineListItem = {
    id: string;
    category: string;
    progress: number;
    title: string;
    timeRange: string;
    selectedDays: string[];
    completedDays: string[];
  };

  // API 훅 사용
  const selectedDateString = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  const selectedDay = ['일', '월', '화', '수', '목', '금', '토'][
    selectedDate.getDay()
  ];

  const {
    data: personalRoutinesData,
    isLoading: isPersonalRoutinesLoading,
    error: personalRoutinesError,
  } = usePersonalRoutines({
    date: selectedDateString,
    day: selectedDay,
  });

  // API 데이터를 화면에 맞는 형태로 변환
  const personalRoutines: RoutineListItem[] =
    personalRoutinesData?.result?.items?.map((item) => ({
      id: item.id.toString(),
      category: item.routineType === 'DAILY' ? '생활' : '소비',
      progress: 0, // API에서 제공하지 않는 경우 기본값
      title: item.title,
      timeRange: `${item.startTime} ~ ${item.endTime}`,
      selectedDays: item.dayTypes, // 타입 정의에 따르면 dayTypes
      completedDays: [], // API에서 제공하지 않는 경우 빈 배열
    })) || [];

  // 그룹 루틴 API 훅 사용
  const {
    data: groupRoutinesData,
    isLoading: isGroupRoutinesLoading,
    error: groupRoutinesError,
  } = useGroupRoutines({
    page: 0,
    size: 10,
  });

  // 그룹 루틴 데이터를 화면에 맞는 형태로 변환
  const groupRoutines: RoutineListItem[] =
    groupRoutinesData?.result?.items?.map((item) => ({
      id: item.id.toString(),
      category: item.routineType === 'DAILY' ? '생활' : '소비',
      progress: 0, // API에서 제공하지 않는 경우 기본값
      title: item.title,
      timeRange: `${item.startTime} ~ ${item.endTime}`,
      selectedDays: item.dayOfWeek, // 그룹 루틴은 dayOfWeek 사용
      completedDays: [], // API에서 제공하지 않는 경우 빈 배열
    })) || [];

  const handleGroupBannerPress = () => {
    navigation.navigate('GroupBoard');
  };

  const handleRoutinePress = (routineId: string) => {
    if (selectedTab === 0) {
      // 개인 루틴에서 실제 데이터 찾기
      const routine = personalRoutines.find((r) => r.id === routineId);
      if (routine) {
        navigation.navigate('PersonalRoutineDetail', {
          routineData: {
            id: routine.id,
            name: routine.title,
            startTime: routine.timeRange.split(' ~ ')[0],
            endTime: routine.timeRange.split(' ~ ')[1],
            days: routine.selectedDays,
            category: routine.category,
          },
        });
      }
    } else {
      // 그룹 루틴에서 실제 데이터 찾기
      const routine = groupRoutines.find((r) => r.id === routineId);
      if (routine) {
        navigation.navigate('GroupRoutineDetail', {
          routineData: {
            id: routine.id,
            name: routine.title,
            startTime: routine.timeRange.split(' ~ ')[0],
            endTime: routine.timeRange.split(' ~ ')[1],
            days: routine.selectedDays,
            category: routine.category,
          },
        });
      }
    }
  };

  const handleAddRoutine = () => {
    setShowAddRoutineModal(true);
  };

  const handleAICreateRoutine = () => {
    setShowAddRoutineModal(false);
    // TODO: AI 추천 루틴 생성 화면으로 이동
    navigation.navigate('CreateRoutine');
  };

  const handleManualCreateRoutine = () => {
    setShowAddRoutineModal(false);
    navigation.navigate('CreateRoutine');
  };

  const handleDateSelect = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    setSelectedDate(newDate);
  };

  const currentRoutines = selectedTab === 0 ? personalRoutines : groupRoutines;

  return (
    <Container edges={['top', 'left', 'right']}>
      <Content>
        {/* 날짜 선택기 */}
        <DateSelector>
          <MonthText>
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
          </MonthText>
          <WeekContainer>
            {weekData.map((item) => (
              <DayItem key={item.fullDate.toISOString()}>
                <DayText day={item.day}>{item.day}</DayText>
                <DateButton
                  isSelected={isSameDate(item.fullDate, today)}
                  onPress={() => handleDateSelect(item.fullDate)}
                >
                  <DateText isSelected={isSameDate(item.fullDate, today)}>
                    {item.date}
                  </DateText>
                </DateButton>
              </DayItem>
            ))}
          </WeekContainer>
        </DateSelector>

        {/* 그룹 루틴 카드 */}
        <GroupRoutineCard
          onPress={handleGroupBannerPress}
          iconSource={require('../../assets/images/people.png')}
        />

        {/* 탭 선택 */}
        <TabNavigation
          selectedIndex={selectedTab}
          onTabChange={setSelectedTab}
          tabs={['개인 루틴', '그룹 루틴']}
        />

        {/* 루틴 목록 */}
        <RoutineList>
          {currentRoutines.map((routine) => (
            <RoutineCard
              key={routine.id}
              category={routine.category}
              progress={routine.progress}
              title={routine.title}
              timeRange={routine.timeRange}
              selectedDays={routine.selectedDays}
              completedDays={routine.completedDays}
              onPress={() => handleRoutinePress(routine.id)}
            />
          ))}
        </RoutineList>
      </Content>

      {/* 플로팅 액션 버튼 */}
      <AddRoutineButton onPress={handleAddRoutine} />

      {/* 루틴 추가 선택 모달 */}
      <BottomSheetDialog
        visible={showAddRoutineModal}
        onRequestClose={() => setShowAddRoutineModal(false)}
      >
        <SelectionButtonsContainer>
          <CustomButton
            text="AI 추천 루틴 생성"
            onPress={handleAICreateRoutine}
            backgroundColor={theme.colors.white}
            textColor={theme.colors.primary}
            borderColor="#8B5CF6"
            borderWidth={1}
          />
          <CustomButton
            text="직접 루틴 생성"
            onPress={handleManualCreateRoutine}
            backgroundColor={theme.colors.white}
            textColor={theme.colors.gray800}
            borderColor={theme.colors.gray300}
            borderWidth={1}
          />
        </SelectionButtonsContainer>
      </BottomSheetDialog>
    </Container>
  );
};

export default HomeScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
  padding-bottom: 0;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

const DateSelector = styled.View`
  margin-bottom: 16px;
`;

const MonthText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 20px;
  color: ${theme.colors.gray800};
  margin-bottom: 12px;
`;

const WeekContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const DayItem = styled.View`
  align-items: center;
`;

const DayText = styled.Text<{ day: string }>`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${({ day }) => {
    if (day === '토') return '#2283EC';
    if (day === '일') return '#ED2929';
    return theme.colors.gray600;
  }};
  margin-bottom: 4px;
`;

const DateButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : 'transparent'};
  align-items: center;
  justify-content: center;
`;

const DateText = styled.Text<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.gray800};
`;

const RoutineList = styled.View`
  flex: 1;
  margin-bottom: 36px;
`;

const GroupRoutineGuide = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const GuideText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray800};
  text-align: center;
  margin-bottom: 12px;
`;

const GuideSubText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  line-height: 20px;
`;

// 모달 관련 스타일
const SelectionButtonsContainer = styled.View`
  gap: 12px;
`;
