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

  const { selectedDate, setSelectedDate } = useRoutineStore();

  const today = new Date();

  const getStartOfWeekMonday = (date: Date) => {
    const copied = new Date(date);
    const day = copied.getDay();
    const diffToMonday = (day + 6) % 7;
    copied.setHours(0, 0, 0, 0);
    copied.setDate(copied.getDate() - diffToMonday);
    return copied;
  };

  const isSameDate = (a: Date, b: Date) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const dayLabels = ['월', '화', '수', '목', '금', '토', '일'] as const;

  const startOfWeek = getStartOfWeekMonday(selectedDate);
  const weekData = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + idx);
    return {
      day: dayLabels[idx],
      date: d.getDate(),
      fullDate: d,
    };
  });

  type RoutineListItem = {
    id: string;
    category: string;
    progress: number;
    title: string;
    description?: string;
    timeRange: string;
    selectedDays: string[];
    completedDays: string[];
  };

  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const selectedDay = ['일', '월', '화', '수', '목', '금', '토'][
    selectedDate.getDay()
  ];

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

  const {
    data: groupRoutinesData,
    isLoading: isGroupRoutinesLoading,
    error: groupRoutinesError,
    fetchNextPage: fetchNextGroupPage,
    hasNextPage: hasNextGroupPage,
    isFetchingNextPage: isFetchingNextGroupPage,
    refetch: refetchGroupRoutines,
  } = useInfiniteMyGroupRoutines({});

  useFocusEffect(
    React.useCallback(() => {
      refetchPersonalRoutines();
      refetchGroupRoutines();
    }, [refetchPersonalRoutines, refetchGroupRoutines]),
  );

  const formatTimeForDisplay = (time: any): string => {
    if (!time) return '00:00';

    if (Array.isArray(time)) {
      const [hour, minute] = time;
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    if (typeof time === 'string') {
      if (time.includes(',')) {
        const [hour, minute] = time.split(',');
        return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      }

      if (time.includes(':')) {
        return time.split(':').slice(0, 2).join(':');
      }
    }

    return '00:00';
  };

  const personalRoutines: RoutineListItem[] =
    personalRoutinesData?.pages?.flatMap((page) =>
      page.result.items.map((item) => ({
        id: item.id.toString(),
        category: item.routineType === 'DAILY' ? '생활' : '소비',
        progress: item.percent || 0,
        title: item.title,
        timeRange: `${formatTimeForDisplay(item.startTime)} ~ ${formatTimeForDisplay(item.endTime)}`,
        selectedDays: item.dayTypes,
        completedDays: [],
      })),
    ) || [];

  const groupRoutines: RoutineListItem[] =
    groupRoutinesData?.pages?.flatMap(
      (page) =>
        page.result?.items?.map((item) => {
          return {
            id: item.id.toString(),
            category: item.routineType === 'DAILY' ? '생활' : '소비',
            progress: item.percent || 0,
            title: item.title,
            description: item.description,
            timeRange: `${formatTimeForDisplay(item.startTime)} ~ ${formatTimeForDisplay(item.endTime)}`,
            selectedDays: item.dayOfWeek,
            completedDays: [],
          };
        }) || [],
    ) || [];

  // 선택된 날짜의 요일
  const selectedDayLabel = ['일', '월', '화', '수', '목', '금', '토'][
    selectedDate.getDay()
  ];

  // 선택된 요일의 루틴만 필터링

  const selectedDayPersonalRoutines = personalRoutines.filter((routine) =>
    routine.selectedDays.includes(selectedDayLabel),
  );
  const selectedDayGroupRoutines = groupRoutines.filter((routine) =>
    routine.selectedDays.includes(selectedDayLabel),
  );

  const dayCompletionStatus = weekData.map((item) => {
    const dayLabel = item.day;

    const dayPersonalRoutines = personalRoutines.filter((routine) =>
      routine.selectedDays.includes(dayLabel),
    );

    const dayGroupRoutines = groupRoutines.filter((routine) =>
      routine.selectedDays.includes(dayLabel),
    );

    const personalCompleted = dayPersonalRoutines.length > 0 ? false : false;

    const groupCompleted =
      dayGroupRoutines.length > 0
        ? dayGroupRoutines.every((routine) => (routine.progress || 0) >= 100)
        : false;

    const isCompleted = personalCompleted || groupCompleted;

    return {
      day: dayLabel,
      isCompleted,
      hasRoutines:
        dayPersonalRoutines.length > 0 || dayGroupRoutines.length > 0,
    };
  });

  const handleGroupBannerPress = () => {
    navigation.navigate('GroupBoard');
  };

  const handleRoutinePress = (routineId: string) => {
    if (selectedTab === 0) {
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
      const routine = groupRoutines.find((r) => r.id === routineId);
      if (routine) {
        navigation.navigate('GroupRoutineDetail', {
          routineId: routine.id,
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
      if (hasNextPersonalPage && !isFetchingNextPersonalPage) {
        fetchNextPersonalPage();
      }
    } else {
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
          iconSource={require('../../assets/images/group.png')}
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
                description={item.description}
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
            contentContainerStyle={{
              flexGrow: 0,
              paddingBottom: 0,
            }}
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
  padding-left: 0px;
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
  margin-bottom: 0;
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
