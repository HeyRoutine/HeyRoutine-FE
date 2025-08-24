import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Image, Modal, TouchableWithoutFeedback, View } from 'react-native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';

interface GroupRoutineDetailScreenProps {
  navigation: any;
  route: { params?: { routineId?: string } };
}

const GroupRoutineDetailScreen = ({
  navigation,
  route,
}: GroupRoutineDetailScreenProps) => {
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
    [route?.params?.routineId],
  );

  const [isJoinModalVisible, setJoinModalVisible] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [userRole, setUserRole] = useState<'host' | 'member' | null>(null);

  const handleBack = () => navigation.goBack();
  const handleJoin = () => setJoinModalVisible(true);
  const handleCloseJoinModal = () => setJoinModalVisible(false);
  const handleConfirmJoin = () => {
    // 참여 확정 로직 (API 연동 등)
    setIsJoined(true);
    setUserRole('member'); // 기본적으로 팀원으로 설정 (실제로는 API에서 사용자 역할 확인)
    setJoinModalVisible(false);
  };

  const handleMenuPress = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleEditRoutine = () => {
    // 루틴 수정 로직
    setIsMenuVisible(false);
  };

  const handleDeleteRoutine = () => {
    // 루틴 삭제 로직
    setIsMenuVisible(false);
  };

  const handleLeaveRoutine = () => {
    // 루틴 나가기 로직
    setIsJoined(false);
    setUserRole(null);
    setIsMenuVisible(false);
  };

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header title="단체 루틴" onBackPress={handleBack} />
      <ScrollContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <SummaryCard>
          <SummaryHeader>
            <SummaryTitle>{routine.title}</SummaryTitle>
            {!isJoined && (
              <MemberCountRow>
                <MemberIcon>👥</MemberIcon>
                <MemberCountText>{routine.membersCount}</MemberCountText>
              </MemberCountRow>
            )}
            {isJoined && (
              <MenuButton onPress={handleMenuPress}>
                <MenuIcon>⋯</MenuIcon>
              </MenuButton>
            )}
          </SummaryHeader>
          <SummaryDescription numberOfLines={2}>
            {routine.description}
          </SummaryDescription>
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
                <TaskIcon>{t.icon}</TaskIcon>
                <TaskContent>
                  <TaskTitle>{t.title}</TaskTitle>
                  <TaskDuration>{t.duration}</TaskDuration>
                </TaskContent>
              </ItemRow>
            ))}
          </ItemList>
        </SectionCard>

        <ParticipantsCard>
          <SectionHeader>참여자</SectionHeader>

          {!isJoined ? (
            // 참여하기 전: 일반 참여자 목록
            <AvatarRow horizontal showsHorizontalScrollIndicator={false}>
              {routine.participants.slice(0, 8).map((uri, idx) => (
                <AvatarWrapper key={`participant-${idx}`}>
                  <Avatar source={{ uri }} />
                </AvatarWrapper>
              ))}
            </AvatarRow>
          ) : (
            // 참여한 후: 완료자와 미달성자로 분류
            <>
              {/* 완료된 참여자 */}
              <CompletedSection>
                <CompletedTitle>완료</CompletedTitle>
                <CompletedCountContainer>
                  <CompletedIcon>👥</CompletedIcon>
                  <CompletedCountText>12</CompletedCountText>
                </CompletedCountContainer>
                <CompletedAvatarRow
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {routine.participants.slice(0, 8).map((uri, idx) => (
                    <AvatarWrapper key={`completed-${idx}`}>
                      <Avatar source={{ uri }} />
                    </AvatarWrapper>
                  ))}
                </CompletedAvatarRow>
              </CompletedSection>

              {/* 미달성 참여자 */}
              <UnachievedSection>
                <UnachievedTitle>미달성</UnachievedTitle>
                <UnachievedCountContainer>
                  <UnachievedIcon>👥</UnachievedIcon>
                  <UnachievedCountText>252</UnachievedCountText>
                </UnachievedCountContainer>
                <UnachievedAvatarRow
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {routine.participants.slice(0, 8).map((uri, idx) => (
                    <AvatarWrapper key={`unachieved-${idx}`}>
                      <Avatar source={{ uri }} />
                    </AvatarWrapper>
                  ))}
                </UnachievedAvatarRow>
              </UnachievedSection>
            </>
          )}
        </ParticipantsCard>
      </ScrollContent>

      {/* 하단 고정 버튼 */}
      {!isJoined ? (
        <FixedJoinCta>
          <JoinButton onPress={handleJoin}>
            <JoinText>단체루틴 참여</JoinText>
          </JoinButton>
        </FixedJoinCta>
      ) : (
        <FixedJoinCta>
          <JoinButton disabled>
            <JoinText>참여 완료</JoinText>
          </JoinButton>
        </FixedJoinCta>
      )}

      {/* 참여 확인 모달 */}
      <BottomSheetDialog
        visible={isJoinModalVisible}
        onRequestClose={handleCloseJoinModal}
      >
        <ModalTitle>단체루틴에 참여하시겠습니까?</ModalTitle>
        <ModalSubtitle>
          바로 단체 루틴에 (방장이 루틴을 수정시 루틴이 변경됩니다)
        </ModalSubtitle>

        <ButtonRow>
          <ButtonWrapper>
            <CustomButton
              text="취소"
              onPress={handleCloseJoinModal}
              backgroundColor={theme.colors.gray200}
              textColor={theme.colors.gray700}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <CustomButton
              text="참여하기"
              onPress={handleConfirmJoin}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
            />
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 메뉴 모달 */}
      <BottomSheetDialog
        visible={isMenuVisible}
        onRequestClose={() => setIsMenuVisible(false)}
      >
        {userRole === 'host' ? (
          <>
            <MenuItem onPress={handleEditRoutine}>
              <MenuItemText>수정</MenuItemText>
            </MenuItem>
            <MenuItem onPress={handleDeleteRoutine}>
              <MenuItemText style={{ color: theme.colors.error }}>
                삭제
              </MenuItemText>
            </MenuItem>
          </>
        ) : (
          <MenuItem onPress={handleLeaveRoutine}>
            <MenuItemText style={{ color: theme.colors.error }}>
              나가기
            </MenuItemText>
          </MenuItem>
        )}
      </BottomSheetDialog>
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

const AvatarRow = styled.ScrollView``;

// Completed Participants Styles
const CompletedSection = styled.View`
  margin-bottom: 20px;
`;

const CompletedTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 8px;
`;

const CompletedCountContainer = styled.View`
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CompletedIcon = styled.Text`
  font-size: 20px;
  margin-bottom: 4px;
  color: ${theme.colors.gray400};
`;

const CompletedCountText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray400};
`;

const CompletedAvatarRow = styled.ScrollView``;

// Unachieved Participants Styles
const UnachievedSection = styled.View`
  margin-bottom: 20px;
`;

const UnachievedTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 8px;
`;

const UnachievedCountContainer = styled.View`
  align-items: flex-start;
  margin-bottom: 12px;
`;

const UnachievedIcon = styled.Text`
  font-size: 20px;
  margin-bottom: 4px;
  color: ${theme.colors.gray400};
`;

const UnachievedCountText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray400};
`;

const UnachievedAvatarRow = styled.ScrollView``;

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

const FixedJoinCta = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: ${theme.colors.white};
`;

const JoinButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) =>
    props.disabled ? theme.colors.gray300 : theme.colors.primary};
  border-radius: 12px;
  padding: 16px;
  align-items: center;
`;

const JoinText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const ItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${theme.colors.gray50};
  border-radius: 8px;
`;

const TaskIcon = styled.Text`
  font-size: 20px;
  margin-right: 12px;
`;

const TaskContent = styled.View`
  flex: 1;
`;

const TaskTitle = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray800};
  margin-bottom: 2px;
`;

const TaskDuration = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray600};
`;

// Modal Styles
const ModalTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 18px;
  color: ${theme.colors.gray900};
  text-align: center;
`;

const ModalSubtitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 13px;
  color: ${theme.colors.gray600};
  text-align: center;
  margin-top: 8px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 20px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;

// Menu Styles
const MenuButton = styled.TouchableOpacity`
  margin-left: 12px;
  padding: 4px;
`;

const MenuIcon = styled.Text`
  font-size: 20px;
  color: ${theme.colors.gray600};
  font-weight: bold;
`;

const MenuItem = styled.TouchableOpacity`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.gray100};
`;

const MenuItemText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray800};
  text-align: center;
`;
