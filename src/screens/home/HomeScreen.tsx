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

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showAddRoutineModal, setShowAddRoutineModal] = useState(false);

  // Zustand 스토어에서 루틴 상태 가져오기
  const { selectedDate, setSelectedDate } = useRoutineStore();

  // 현재 선택된 날짜의 일자 추출
  const currentDay = selectedDate.getDate();

  // 요일과 날짜 데이터
  const weekData = [
    { day: '화', date: 29 },
    { day: '수', date: 30 },
    { day: '목', date: 31 },
    { day: '금', date: 1 },
    { day: '토', date: 2 },
    { day: '일', date: 3 },
    { day: '월', date: 4 },
  ];

  // 샘플 루틴 데이터
  const personalRoutines = [
    {
      id: '1',
      category: '생활',
      progress: 33,
      title: '빵빵이의 아침 루틴',
      timeRange: '오전 8:00 ~ 오전 9:00',
      selectedDays: ['월', '화'],
    },
    {
      id: '2',
      category: '생활',
      progress: 33,
      title: '빵빵이의 아침 루틴',
      timeRange: '오전 8:00 ~ 오전 9:00',
      selectedDays: ['월', '화'],
    },
    {
      id: '3',
      category: '운동',
      progress: 67,
      title: '저녁 운동 루틴',
      timeRange: '오후 7:00 ~ 오후 8:00',
      selectedDays: ['화', '목', '금'],
    },
    {
      id: '4',
      category: '학습',
      progress: 45,
      title: '독서 시간',
      timeRange: '오후 9:00 ~ 오후 10:00',
      selectedDays: ['월', '수', '토'],
    },
  ];

  const groupRoutines = [
    {
      id: '5',
      category: '생활',
      progress: 67,
      title: '저축 그룹 루틴',
      timeRange: '오후 8:00 ~ 오후 9:00',
      selectedDays: ['화'],
    },
    {
      id: '6',
      category: '소비',
      progress: 67,
      title: '저축 그룹 루틴',
      timeRange: '오후 8:00 ~ 오후 9:00',
      selectedDays: ['화'],
    },
    {
      id: '7',
      category: '운동',
      progress: 89,
      title: '그룹 헬스 루틴',
      timeRange: '오후 6:00 ~ 오후 7:00',
      selectedDays: ['월', '수', '금'],
    },
    {
      id: '8',
      category: '학습',
      progress: 23,
      title: '스터디 그룹',
      timeRange: '오후 10:00 ~ 오후 11:00',
      selectedDays: ['화', '목'],
    },
  ];

  const handleGroupBannerPress = () => {
    navigation.navigate('GroupBoard');
  };

  const handleRoutinePress = (routineId: string) => {
    if (selectedTab === 0) {
      navigation.navigate('PersonalRoutineDetail', {
        routineData: {
          name: '빵빵이의 점심루틴',
          startTime: '오후 7:00',
          endTime: '오후 10:00',
          days: ['월', '화'],
        },
      });
    } else {
      navigation.navigate('GroupRoutineDetail');
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

  const handleDateSelect = (date: number) => {
    // 현재 월의 해당 날짜로 Date 객체 생성
    const newDate = new Date();
    newDate.setDate(date);
    setSelectedDate(newDate);
  };

  const currentRoutines = selectedTab === 0 ? personalRoutines : groupRoutines;

  return (
    <Container edges={['top', 'left', 'right']}>
      <Content>
        {/* 날짜 선택기 */}
        <DateSelector>
          <MonthText>2025년 7월</MonthText>
          <WeekContainer>
            {weekData.map((item) => (
              <DayItem key={item.date}>
                <DayText day={item.day}>{item.day}</DayText>
                <DateButton
                  isSelected={currentDay === item.date}
                  onPress={() => handleDateSelect(item.date)}
                >
                  <DateText isSelected={currentDay === item.date}>
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
        <ModalTitle>루틴 추가</ModalTitle>
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
`;

// 모달 관련 스타일
const ModalTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 24px;
  color: ${theme.colors.gray900};
  text-align: center;
  margin-bottom: 36px;
`;

const SelectionButtonsContainer = styled.View`
  gap: 12px;
`;
