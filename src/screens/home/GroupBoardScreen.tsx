import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import { RoutineCard, AddRoutineButton } from '../../components/domain/routine';
import { useGroupRoutines } from '../../hooks/routine/group/useGroupRoutines';

const MOCK_ROUTINES = [
  {
    id: '1',
    category: '지식/관심사',
    progress: 82,
    title: '티끌모아 태산',
    timeRange: '오후 8:00 - 오후 9:00',
    selectedDays: ['월', '화', '수', '목', '금'],
    completedDays: ['화', '수'],
  },
  {
    id: '2',
    category: '운동/헬스',
    progress: 67,
    title: '운동 러버',
    timeRange: '오후 8:00 - 오후 9:00',
    selectedDays: ['월', '수', '금'],
    completedDays: ['월', '금'],
  },
  {
    id: '3',
    category: '자기개발',
    progress: 45,
    title: '아이고 종강이야',
    timeRange: '오전 7:00 - 오전 9:00',
    selectedDays: ['토', '일'],
    completedDays: ['토'],
  },
  {
    id: '4',
    category: '자기개발',
    progress: 45,
    title: '넌 독서를 하게 될거시야',
    timeRange: '오전 7:00 - 오전 9:00',
    selectedDays: ['월', '화', '수', '목', '금', '토', '일'],
    completedDays: ['월', '화', '수', '목'],
  },
];

// 댓글 목업 제거

const GroupBoardScreen = ({ navigation }: any) => {
  // 그룹 루틴 API 훅 사용
  const {
    data: groupRoutinesData,
    isLoading: isGroupRoutinesLoading,
    error: groupRoutinesError,
  } = useGroupRoutines({
    page: 0,
    size: 50,
  });

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

  // API 데이터를 화면에 맞는 형태로 변환
  const groupRoutines =
    groupRoutinesData?.result?.items?.map((item) => {
      const formattedItem = {
        id: item.id.toString(),
        category: item.routineType === 'DAILY' ? '생활' : '소비',
        progress: 0, // API에서 제공하지 않는 경우 기본값
        title: item.title,
        description: item.description,
        startTime: item.startTime,
        endTime: item.endTime,
        timeRange: `${formatTimeForDisplay(item.startTime)} ~ ${formatTimeForDisplay(item.endTime)}`,
        selectedDays: item.dayOfWeek, // 그룹 루틴은 dayOfWeek 사용
        completedDays: [], // API에서 제공하지 않는 경우 빈 배열
        peopleNums: item.peopleNums,
        routineNums: item.routineNums,
        routineType: item.routineType,
        joined: item.joined,
      };

      return formattedItem;
    }) || [];

  const renderRoutine = ({ item }: any) => (
    <RoutineCard
      category={item.category}
      progress={item.progress}
      title={item.title}
      timeRange={item.timeRange}
      selectedDays={item.selectedDays}
      completedDays={item.completedDays}
      onPress={() =>
        navigation.navigate('GroupRoutineDetail', {
          routineId: item.id,
          routineData: {
            id: item.id,
            title: item.title,
            description: item.description || '',
            startTime: item.startTime,
            endTime: item.endTime,
            dayOfWeek: item.selectedDays,
            peopleNums: item.peopleNums || 0,
            routineNums: item.routineNums || 0,
            routineType: item.routineType,
            joined: item.joined || false,
          },
        })
      }
    />
  );

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header title="단체루틴 목록" onBackPress={() => navigation.goBack()} />

      <ListWrapper>
        <FlatList
          data={groupRoutines}
          renderItem={renderRoutine}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <Banner>
              <BannerIcon>
                <Ionicons
                  name="megaphone-outline"
                  size={18}
                  color={theme.colors.white}
                />
              </BannerIcon>
              <BannerText>
                부적절한 게시글을 작성할 경우, 앱 이용이 제한될 수 있습니다.
              </BannerText>
            </Banner>
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        />
      </ListWrapper>

      <AddRoutineButton
        onPress={() => navigation.navigate('CreateGroupRoutine')}
      />
    </Container>
  );
};

export default GroupBoardScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Banner = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 12px 0 8px 0;
  padding: 12px;
  border-radius: 12px;
  background-color: ${theme.colors.gray50};
`;

const BannerIcon = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${theme.colors.primary};
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const BannerText = styled.Text`
  flex: 1;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray700};
`;

const ListWrapper = styled.View`
  flex: 1;
`;

// Footer 제거 (댓글 목업 제거에 따라 불필요)
