import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import { RoutineCard } from '../../components/domain/routine';
import { AddRoutineButton } from '../../components/domain/routine';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [selectedTab, setSelectedTab] = useState<'personal' | 'group'>(
    'personal',
  );
  const [selectedDate, setSelectedDate] = useState(29);
  const [showAddRoutineModal, setShowAddRoutineModal] = useState(false);

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
  ];

  const groupRoutines = [
    {
      id: '3',
      category: '생활',
      progress: 67,
      title: '저축 그룹 루틴',
      timeRange: '오후 8:00 ~ 오후 9:00',
      selectedDays: ['화'],
    },
    {
      id: '4',
      category: '소비',
      progress: 67,
      title: '저축 그룹 루틴',
      timeRange: '오후 8:00 ~ 오후 9:00',
      selectedDays: ['화'],
    },
  ];

  const handleGroupBannerPress = () => {
    navigation.navigate('GroupBoard');
  };

  const handleRoutinePress = (routineId: string) => {
    if (selectedTab === 'personal') {
      navigation.navigate('PersonalRoutineDetail');
    } else {
      navigation.navigate('GroupRoutineDetail');
    }
  };

  const handleMorePress = () => {
    // 더보기 액션 시트 표시
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

  const currentRoutines =
    selectedTab === 'personal' ? personalRoutines : groupRoutines;

  return (
    <Container>
      <Content>
        {/* 날짜 선택기 */}
        <DateSelector>
          <MonthSelector>
            <MonthText>2025년 7월</MonthText>
            <DropdownIcon>▼</DropdownIcon>
          </MonthSelector>
          <WeekContainer>
            {weekData.map((item) => (
              <DayItem key={item.date}>
                <DayText>{item.day}</DayText>
                <DateButton
                  isSelected={selectedDate === item.date}
                  onPress={() => setSelectedDate(item.date)}
                >
                  <DateText isSelected={selectedDate === item.date}>
                    {item.date}
                  </DateText>
                </DateButton>
              </DayItem>
            ))}
          </WeekContainer>
        </DateSelector>

        {/* 그룹 루틴 배너 */}
        <GroupBanner onPress={handleGroupBannerPress}>
          <BannerText>함께 도전할 루틴 그룹</BannerText>
          <GroupIcon>👥</GroupIcon>
        </GroupBanner>

        {/* 탭 선택 */}
        <TabContainer>
          <TabButton
            isSelected={selectedTab === 'personal'}
            onPress={() => setSelectedTab('personal')}
          >
            <TabText isSelected={selectedTab === 'personal'}>개인 루틴</TabText>
          </TabButton>
          <TabButton
            isSelected={selectedTab === 'group'}
            onPress={() => setSelectedTab('group')}
          >
            <TabText isSelected={selectedTab === 'group'}>그룹 루틴</TabText>
          </TabButton>
        </TabContainer>

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
              onMorePress={handleMorePress}
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
          <SelectionButton onPress={handleAICreateRoutine}>
            <SelectionButtonText>AI 추천 루틴 생성</SelectionButtonText>
          </SelectionButton>
          <SelectionButton onPress={handleManualCreateRoutine}>
            <SelectionButtonText>직접 루틴 생성</SelectionButtonText>
          </SelectionButton>
        </SelectionButtonsContainer>
      </BottomSheetDialog>
    </Container>
  );
};

export default HomeScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const DateSelector = styled.View`
  margin-bottom: 16px;
`;

const MonthSelector = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const MonthText = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 18px;
  color: ${theme.colors.gray800};
  margin-right: 8px;
`;

const DropdownIcon = styled.Text`
  font-size: 12px;
  color: ${theme.colors.gray600};
`;

const WeekContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const DayItem = styled.View`
  align-items: center;
`;

const DayText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray600};
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

const GroupBanner = styled.TouchableOpacity`
  background-color: ${theme.colors.primary}20;
  border-radius: 12px;
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const BannerText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.primary};
`;

const GroupIcon = styled.Text`
  font-size: 24px;
`;

const TabContainer = styled.View`
  flex-direction: row;
  background-color: ${theme.colors.gray100};
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 16px;
`;

const TabButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border-radius: 6px;
  background-color: ${({ isSelected }) =>
    isSelected ? theme.colors.white : 'transparent'};
  align-items: center;
`;

const TabText = styled.Text<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.gray600};
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

const SelectionButton = styled.TouchableOpacity`
  padding: 20px 16px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.gray300};
  background-color: ${theme.colors.white};
  align-items: center;
  justify-content: center;
`;

const SelectionButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray800};
`;
