import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Image } from 'react-native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import { RoutineItem, RoutineActionButton } from '../../components/domain/routine';

interface GroupRoutineDetailScreenProps {
  navigation: any;
  route: { params?: { routineId?: string } };
}

const GroupRoutineDetailScreen = ({ navigation, route }: GroupRoutineDetailScreenProps) => {
  const routine = useMemo(
    () => ({
      id: route?.params?.routineId ?? '1',
      title: '아이고 종강이야',
      description:
        '중깟까지 아침 갓생 루틴 필요하신 분 들어오셈 교수는 출입금지이긴한데 들어오면 환영하겠습니다아',
      membersCount: 52,
      timeRange: '오후 8:00 - 오후 9:00',
      progressText: '[자기개발] 67%',
      selectedDays: ['화', '토', '일'],
      tasks: [
        { icon: '☕', title: '커피 내리기', duration: '3분' },
        { icon: '🥐', title: '식빵 굽기', duration: '5분' },
        { icon: '🧼', title: '샤워하기', duration: '15분' },
        { icon: '✅', title: '싸피 목걸이 챙기기', duration: '15분' },
      ],
      participants: [
        'https://i.pravatar.cc/100?img=1',
        'https://i.pravatar.cc/100?img=2',
        'https://i.pravatar.cc/100?img=3',
        'https://i.pravatar.cc/100?img=4',
        'https://i.pravatar.cc/100?img=5',
        'https://i.pravatar.cc/100?img=6',
        'https://i.pravatar.cc/100?img=7',
        'https://i.pravatar.cc/100?img=8',
      ],
    }),
    [route?.params?.routineId]
  );

  const handleBack = () => navigation.goBack();
  const handleJoin = () => {};

  return (
    <Container>
      <Header title="단체 루틴" onBackPress={handleBack} />
      <ScrollContent showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <SummaryCard>
          <SummaryHeader>
            <SummaryTitle>{routine.title}</SummaryTitle>
            <MemberCountRow>
              <MemberIcon>👥</MemberIcon>
              <MemberCountText>{routine.membersCount}</MemberCountText>
            </MemberCountRow>
          </SummaryHeader>
          <SummaryDescription numberOfLines={2}>{routine.description}</SummaryDescription>
          <SummaryMetaRow>
            <MetaText>{routine.timeRange}</MetaText>
            <MetaDot>•</MetaDot>
            <MetaText>{routine.selectedDays.join(' ')}</MetaText>
          </SummaryMetaRow>
          <ProgressBadge>
            <ProgressText>{routine.progressText}</ProgressText>
          </ProgressBadge>
        </SummaryCard>

        <SectionCard>
          <SectionHeader>해야할 루틴</SectionHeader>
          <ItemList>
            {routine.tasks.map((t) => (
              <ItemRow key={t.title}>
                <RoutineItem icon={t.icon} title={t.title} duration={t.duration} />
              </ItemRow>
            ))}
          </ItemList>
        </SectionCard>

        <ParticipantsCard>
          <SectionHeader>참여자</SectionHeader>
          <AvatarRow horizontal showsHorizontalScrollIndicator={false}>
            {routine.participants.map((uri, idx) => (
              <AvatarWrapper key={`${uri}-${idx}`}>
                <Avatar source={{ uri }} />
              </AvatarWrapper>
            ))}
          </AvatarRow>
        </ParticipantsCard>

        <JoinCta>
          <JoinButton onPress={handleJoin}>
            <JoinText>단체루틴 참여</JoinText>
          </JoinButton>
        </JoinCta>
      </ScrollContent>
    </Container>
  );
};

export default GroupRoutineDetailScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ScrollContent = styled.ScrollView`
  flex: 1;
`;

const SummaryCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

const SummaryHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SummaryTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 18px;
  color: ${theme.colors.gray800};
`;

const MemberCountRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const MemberIcon = styled.Text`
  font-size: 14px;
  margin-right: 4px;
`;

const MemberCountText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.primary};
`;

const SummaryDescription = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 13px;
  color: ${theme.colors.gray600};
  margin-bottom: 8px;
`;

const SummaryMetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const MetaText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray600};
`;

const MetaDot = styled.Text`
  margin: 0 6px;
  color: ${theme.colors.gray400};
`;

const ProgressBadge = styled.View`
  align-self: flex-start;
  background-color: ${theme.colors.gray50};
  padding: 6px 10px;
  border-radius: 8px;
`;

const ProgressText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  color: ${theme.colors.gray700};
`;

const SectionCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

const SectionHeader = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 16px;
`;

const ItemList = styled.View`
  gap: 8px;
`;

const ParticipantsCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

const AvatarRow = styled.ScrollView`
`;

const AvatarWrapper = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  overflow: hidden;
  margin-right: 8px;
`;

const Avatar = styled(Image)`
  width: 100%;
  height: 100%;
`;

const JoinCta = styled.View`
  margin-top: 8px;
`;

const JoinButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 16px;
  align-items: center;
`;

const JoinText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const ItemRow = styled.View``;
