import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import {
  RoutineCard,
  AddRoutineButton,
} from '../../components/domain/routine';

const MOCK_ROUTINES = [
  {
    id: '1',
    category: '지식/관심사',
    progress: 82,
    title: '티끌모아 태산',
    timeRange: '오후 8:00 - 오후 9:00',
    selectedDays: ['월', '화', '수', '목', '금'],
  },
  {
    id: '2',
    category: '운동/헬스',
    progress: 67,
    title: '운동 러버',
    timeRange: '오후 8:00 - 오후 9:00',
    selectedDays: ['월', '수', '금'],
  },
  {
    id: '3',
    category: '자기개발',
    progress: 45,
    title: '아이고 종강이야',
    timeRange: '오전 7:00 - 오전 9:00',
    selectedDays: ['토', '일'],
  },
  {
    id: '4',
    category: '자기개발',
    progress: 45,
    title: '넌 도서를 하게 될거시야',
    timeRange: '오전 7:00 - 오전 9:00',
    selectedDays: ['월', '화', '수', '목', '금', '토', '일'],
  },
];

// 댓글 목업 제거

const GroupBoardScreen = ({ navigation }: any) => {
  const renderRoutine = ({ item }: any) => (
    <RoutineCard
      category={item.category}
      progress={item.progress}
      title={item.title}
      timeRange={item.timeRange}
      selectedDays={item.selectedDays}
      onPress={() => navigation.navigate('GroupRoutineDetail', { routineId: item.id })}
      onMorePress={() => {}}
    />
  );

  return (
    <Container>
      <Header title="단체루틴 목록" onBackPress={() => navigation.goBack()} />

      <ListWrapper>
        <FlatList
          data={MOCK_ROUTINES}
          renderItem={renderRoutine}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <Banner>
              <BannerIcon>
                <Ionicons name="megaphone-outline" size={18} color={theme.colors.white} />
              </BannerIcon>
              <BannerText>부적절한 게시글을 작성할 경우, 앱 이용이 제한될 수 있습니다.</BannerText>
            </Banner>
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </ListWrapper>

      <AddRoutineButton onPress={() => {}} />
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
