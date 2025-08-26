import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity, View, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import TabNavigation from '../../components/common/TabNavigation';
import RoutineCard from '../../components/domain/routine/RoutineCard';
import AddRoutineButton from '../../components/domain/routine/AddRoutineButton';
import GroupRoutineCard from '../../components/domain/routine/GroupRoutineCard';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import CustomButton from '../../components/common/CustomButton';
import { useRoutineStore } from '../../store';
import {
  useInfinitePersonalRoutines,
  usePersonalRoutines,
} from '../../hooks/routine/personal/usePersonalRoutines';
import {
  useInfiniteGroupRoutines,
  useGroupRoutines,
  useInfiniteMyGroupRoutines,
} from '../../hooks/routine/group/useGroupRoutines';

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

  // 요일 문자열 (월화수목금토일 순서)
  const dayLabels = ['월', '화', '수', '목', '금', '토', '일'] as const;

  // 선택된 날짜가 속한 주(월~일) 데이터 생성
  const startOfWeek = getStartOfWeekMonday(selectedDate);
  const weekData = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + idx);
    return {
      day: dayLabels[idx], // 인덱스를 직접 사용하여 월화수목금토일 순서 보장
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

  // 개인 루틴 API 훅
  const {
    data: personalRoutinesData,
    isLoading: isPersonalRoutinesLoading,
    error: personalRoutinesError,
    fetchNextPage: fetchNextPersonalPage,
    hasNextPage: hasNextPersonalPage,
    isFetchingNextPage: isFetchingNextPersonalPage,
    refetch: refetchPersonalRoutines,
  } = useInfinitePersonalRoutines({
    date: selectedDateString,
    day: selectedDay,
  });

  // 내 단체루틴 조회[홈] API 훅
  const {
    data: groupRoutinesData,
    isLoading: isGroupRoutinesLoading,
    error: groupRoutinesError,
    fetchNextPage: fetchNextGroupPage,
    hasNextPage: hasNextGroupPage,
    isFetchingNextPage: isFetchingNextGroupPage,
    refetch: refetchGroupRoutines,
  } = useInfiniteMyGroupRoutines({});

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔍 HomeScreen - 화면 포커스됨, 데이터 새로고침 시작');
      refetchPersonalRoutines();
      refetchGroupRoutines();
    }, [refetchPersonalRoutines, refetchGroupRoutines]),
  );

  // 시간을 HH:mm 형식으로 변환하는 함수
  const formatTimeForDisplay = (time: any): string => {
    if (!time) return '00:00';

    // [11, 0] 배열 형태로 받아오는 경우
    if (Array.isArray(time)) {
      const [hour, minute] = time;
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    // 문자열인 경우
    if (typeof time === 'string') {
      // 9,0 형식을 09:00 형식으로 변환
      if (time.includes(',')) {
        const [hour, minute] = time.split(',');
        return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      }

      // HH:mm:ss 형식을 HH:mm 형식으로 변환
      if (time.includes(':')) {
        return time.split(':').slice(0, 2).join(':');
      }
    }

    return '00:00';
  };

  // API 데이터를 화면에 맞는 형태로 변환 (모든 페이지 데이터 합치기)
  const personalRoutines: RoutineListItem[] =
    personalRoutinesData?.pages?.flatMap((page) =>
      page.result.items.map((item) => ({
        id: item.id.toString(),
        category: item.routineType === 'DAILY' ? '생활' : '소비',
        progress: 0, // API에서 제공하지 않는 경우 기본값
        title: item.title,
        timeRange: `${formatTimeForDisplay(item.startTime)} ~ ${formatTimeForDisplay(item.endTime)}`,
        selectedDays: item.dayTypes, // 타입 정의에 따르면 dayTypes
        completedDays: [], // API에서 제공하지 않는 경우 빈 배열
      })),
    ) || [];

  // 내 단체루틴 데이터를 화면에 맞는 형태로 변환
  const groupRoutines: RoutineListItem[] =
    groupRoutinesData?.pages?.flatMap(
      (page) =>
        page.result?.items?.map((item) => {
          return {
            id: item.id.toString(),
            category: item.routineType === 'DAILY' ? '생활' : '소비',
            progress: item.percent || 0, // API에서 제공하는 percent 사용
            title: item.title,
            timeRange: `${formatTimeForDisplay(item.startTime)} ~ ${formatTimeForDisplay(item.endTime)}`,
            selectedDays: item.dayOfWeek, // 그룹 루틴은 dayOfWeek 사용
            completedDays: [], // API에서 제공하지 않는 경우 빈 배열
          };
        }) || [],
    ) || [];

  // 선택된 날짜의 요일
  const selectedDayLabel = ['일', '월', '화', '수', '목', '금', '토'][
    selectedDate.getDay()
  ];

  // 선택된 요일의 루틴만 필터링
  console.log('🔍 개인 루틴 디버깅:', {
    selectedDayLabel,
    totalPersonalRoutines: personalRoutines.length,
    personalRoutines: personalRoutines.map((r) => ({
      id: r.id,
      title: r.title,
      selectedDays: r.selectedDays,
      isIncluded: r.selectedDays.includes(selectedDayLabel),
    })),
  });

  const selectedDayPersonalRoutines = personalRoutines.filter((routine) =>
    routine.selectedDays.includes(selectedDayLabel),
  );

  console.log('🔍 필터링된 개인 루틴:', selectedDayPersonalRoutines.length);
  const selectedDayGroupRoutines = groupRoutines.filter((routine) =>
    routine.selectedDays.includes(selectedDayLabel),
  );

  // 각 요일별 완료 상태 계산
  const dayCompletionStatus = weekData.map((item) => {
    const dayLabel = item.day;

    // 해당 요일의 개인 루틴들
    const dayPersonalRoutines = personalRoutines.filter((routine) =>
      routine.selectedDays.includes(dayLabel),
    );

    // 해당 요일의 그룹 루틴들
    const dayGroupRoutines = groupRoutines.filter((routine) =>
      routine.selectedDays.includes(dayLabel),
    );

    // 개인 루틴 완료 상태 (현재는 API에서 제공하지 않으므로 기본값)
    const personalCompleted = dayPersonalRoutines.length > 0 ? false : false;

    // 그룹 루틴 완료 상태 (percent가 100%인 경우 완료로 간주)
    const groupCompleted =
      dayGroupRoutines.length > 0
        ? dayGroupRoutines.every((routine) => (routine.progress || 0) >= 100)
        : false;

    // 완료 상태 결정 (개인 또는 그룹 루틴 중 하나라도 완료되면 완료)
    const isCompleted = personalCompleted || groupCompleted;

    return {
      day: dayLabel,
      isCompleted,
      hasRoutines:
        dayPersonalRoutines.length > 0 || dayGroupRoutines.length > 0,
    };
  });

  console.log('🔍 요일별 완료 상태:', dayCompletionStatus);

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
          routineId: routine.id, // routineId로 전달
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

  // 무한 스크롤 핸들러
  const handleLoadMore = () => {
    if (selectedTab === 0) {
      // 개인 루틴 탭
      if (hasNextPersonalPage && !isFetchingNextPersonalPage) {
        fetchNextPersonalPage();
      }
    } else {
      // 그룹 루틴 탭
      if (hasNextGroupPage && !isFetchingNextGroupPage) {
        fetchNextGroupPage();
      }
    }
  };

  const isFetchingNextPage =
    selectedTab === 0 ? isFetchingNextPersonalPage : isFetchingNextGroupPage;

  return (
    <Container edges={['top', 'left', 'right']}>
      <Content>
        {/* 날짜 선택기 */}
        <DateSelector>
          <MonthText>
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
          </MonthText>
          <WeekContainer>
            {weekData.map((item, index) => {
              const completionStatus = dayCompletionStatus[index];
              return (
                <DayItem key={item.fullDate.toISOString()}>
                  <DayText day={item.day}>{item.day}</DayText>
                  <DateButton
                    isSelected={isSameDate(item.fullDate, selectedDate)}
                    isCompleted={completionStatus?.isCompleted}
                    onPress={() => handleDateSelect(item.fullDate)}
                  >
                    <DateText
                      isSelected={isSameDate(item.fullDate, selectedDate)}
                      isCompleted={completionStatus?.isCompleted}
                    >
                      {item.date}
                    </DateText>
                  </DateButton>
                </DayItem>
              );
            })}
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
          <FlatList
            data={
              selectedTab === 0
                ? selectedDayPersonalRoutines
                : selectedDayGroupRoutines
            }
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RoutineCard
                category={item.category}
                progress={item.progress}
                title={item.title}
                timeRange={item.timeRange}
                selectedDays={item.selectedDays}
                completedDays={item.completedDays}
                onPress={() => handleRoutinePress(item.id)}
              />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={null}
            showsVerticalScrollIndicator={false}
          />
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

const Content = styled.View`
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

const DateButton = styled.TouchableOpacity<{
  isSelected: boolean;
  isCompleted?: boolean;
}>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ isSelected, isCompleted }) => {
    if (isCompleted) return theme.colors.primary;
    if (isSelected) return theme.colors.primary;
    return 'transparent';
  }};
  align-items: center;
  justify-content: center;
`;

const DateText = styled.Text<{ isSelected: boolean; isCompleted?: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${({ isSelected, isCompleted }) => {
    if (isCompleted || isSelected) return theme.colors.white;
    return theme.colors.gray800;
  }};
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

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  padding: 16px;
`;
