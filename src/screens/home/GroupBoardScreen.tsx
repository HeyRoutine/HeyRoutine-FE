import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import { AddRoutineButton } from '../../components/domain/routine';
import RoutineCard from '../../components/domain/routine/RoutineCard';
import { useGroupRoutines } from '../../hooks/routine/group/useGroupRoutines';

const MOCK_ROUTINES = [
  {
    id: '1',
    title: '티끌모아 태산',
    description: '주 1회 가계부 작성, 뉴스 스크랩 관련 루틴',
    timeRange: '오후 8:00 - 오후 9:00',
    itemCount: 5,
    participantCount: 52,
    selectedDays: ['수', '일'],
  },
  {
    id: '2',
    title: '운동 러버',
    description: '매일 운동하기, 건강한 생활 습관 만들기',
    timeRange: '오후 6:00 - 오후 7:00',
    itemCount: 3,
    participantCount: 28,
    selectedDays: ['월', '수', '금'],
  },
  {
    id: '3',
    title: '아이고 종강이야',
    description: '학습 계획 세우기, 시험 준비하기',
    timeRange: '오전 7:00 - 오전 9:00',
    itemCount: 4,
    participantCount: 15,
    selectedDays: ['토', '일'],
  },
];

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
        title: item.title,
        description: item.description || '루틴 설명이 없습니다.',
        startTime: item.startTime,
        endTime: item.endTime,
        timeRange: `${formatTimeForDisplay(item.startTime)} - ${formatTimeForDisplay(item.endTime)}`,
        itemCount: item.routineNums || 0,
        participantCount: item.peopleNums || 0,
        selectedDays: item.dayOfWeek || [],
        routineType: item.routineType,
        joined: item.joined,
      };

      return formattedItem;
    }) || MOCK_ROUTINES; // API 데이터가 없으면 목업 데이터 사용

  const renderRoutine = ({ item }: any) => (
    <RoutineCardWrapper>
      <RoutineCard
        progress={0}
        title={item.title}
        description={item.description}
        category={item.routineType === 'DAILY' ? '생활' : '소비'}
        timeRange={item.timeRange}
        selectedDays={item.selectedDays}
        completedDays={[]}
        onPress={() =>
          navigation.navigate('GroupRoutineDetail', {
            routineId: item.id,
            routineData: {
              id: item.id,
              title: item.title,
              description: item.description,
              startTime: item.startTime,
              endTime: item.endTime,
              dayOfWeek: item.selectedDays,
              peopleNums: item.participantCount,
              routineNums: item.itemCount,
              routineType: item.routineType,
              joined: item.joined,
            },
          })
        }
      />
      <ParticipantInfo>
        <ParticipantIcon>👥</ParticipantIcon>
        <ParticipantCount>{item.participantCount}</ParticipantCount>
      </ParticipantInfo>
    </RoutineCardWrapper>
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

const RoutineCardWrapper = styled.View`
  position: relative;
  margin-bottom: 12px;
`;

const ParticipantInfo = styled.View`
  position: absolute;
  top: 16px;
  right: 16px;
  align-items: center;
  background-color: #f7f8fa;
  padding: 6px 8px;
  border-radius: 12px;
`;

const ParticipantIcon = styled.Text`
  font-size: 16px;
  margin-bottom: 2px;
`;

const ParticipantCount = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 14px;
  color: ${theme.colors.primary};
`;
