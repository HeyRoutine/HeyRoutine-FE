import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import {
  Image,
  Modal,
  TouchableWithoutFeedback,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import RoutineCard from '../../components/domain/routine/RoutineCard';
import {
  useDeleteGroupRoutine,
  useJoinGroupRoutine,
  useLeaveGroupRoutine,
  useGroupRoutineDetail,
  useUpdateGroupRoutineStatus,
  useUpdateGroupRoutineRecord,
} from '../../hooks/routine/group/useGroupRoutines';
import GuestbookModal from '../../components/domain/routine/GuestbookModal';
import RoutineSuggestionModal from '../../components/domain/routine/RoutineSuggestionModal';

interface GroupRoutineDetailScreenProps {
  navigation: any;
  route: { params?: { routineId?: string; routineData?: any } };
}

const GroupRoutineDetailScreen = ({
  navigation,
  route,
}: GroupRoutineDetailScreenProps) => {
  const routineId = route?.params?.routineId ?? '1';

  const queryClient = useQueryClient();

  // 실제 API 데이터 조회
  const {
    data: routineDetailData,
    isLoading: isRoutineDetailLoading,
    error: routineDetailError,
  } = useGroupRoutineDetail(routineId);

  // API 데이터를 화면에 맞는 형태로 변환
  const routine = useMemo(() => {
    if (!routineDetailData?.result) {
      return {
        id: routineId,
        title: '로딩 중...',
        description: '',
        membersCount: 0,
        timeRange: '',
        progressText: '',
        selectedDays: [],
        completedDays: [],
        isJoined: false,
        routineType: 'DAILY',
        routineNums: 0,
        tasks: [],
        participants: [],
        completedParticipants: [],
        unachievedParticipants: [],
        completedCount: 0,
        unachievedCount: 0,
        isAdmin: false,
      };
    }

    const result = routineDetailData.result;
    const groupRoutineInfo = result.groupRoutineInfo;
    const routineInfos = result.routineInfos || [];
    const memberInfo = result.groupRoutineMemberInfo;

    // 완료/미달성 참여자 계산
    const completedParticipants =
      memberInfo?.successPeopleProfileImageUrl || [];
    const unachievedParticipants =
      memberInfo?.failedPeopleProfileImageUrl || [];
    const completedCount = completedParticipants.length;
    const unachievedCount = unachievedParticipants.length;

    // 모든 루틴이 완료되었는지 확인
    const allCompleted =
      routineInfos.length > 0 && routineInfos.every((r: any) => r.isCompleted);

    // 모든 루틴이 완료되었다면 선택된 요일을 완료된 요일로 설정
    const completedDays = allCompleted ? groupRoutineInfo?.dayOfWeek || [] : [];

    const routineObject = {
      id: routineId,
      title: groupRoutineInfo?.title || '제목 없음',
      description: groupRoutineInfo?.description || '',
      membersCount: groupRoutineInfo?.peopleNums || 0,
      timeRange: `${groupRoutineInfo?.startTime || '00:00'} - ${groupRoutineInfo?.endTime || '00:00'}`,
      progressText:
        routineInfos.length > 0
          ? `[${groupRoutineInfo?.routineType === 'DAILY' ? '생활' : '소비'}] ${Math.round((routineInfos.filter((r: any) => r.isCompleted).length / routineInfos.length) * 100)}%`
          : '0%',
      selectedDays: groupRoutineInfo?.dayOfWeek || [],
      completedDays,
      isJoined: groupRoutineInfo?.joined || false,
      routineType: groupRoutineInfo?.routineType || 'DAILY',
      routineNums: groupRoutineInfo?.routineNums || 0,
      tasks: routineInfos.map((r: any) => ({
        icon: '☕', // 이모지는 별도로 처리 필요
        title: r.name,
        duration: `${r.time}분`,
        isCompleted: r.isCompleted,
      })),
      participants: [...completedParticipants, ...unachievedParticipants],
      completedParticipants,
      unachievedParticipants,
      completedCount,
      unachievedCount,
      isAdmin: result.admin === true,
    };

    return routineObject;
  }, [routineDetailData, routineId]);

  const [isJoinModalVisible, setJoinModalVisible] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditRoutineModalVisible, setIsEditRoutineModalVisible] =
    useState(false);
  const [isEditRoutineDetailModalVisible, setIsEditRoutineDetailModalVisible] =
    useState(false);
  const [isGuestbookModalVisible, setIsGuestbookModalVisible] = useState(false);
  const [userRole, setUserRole] = useState<'host' | 'member' | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);

  // userRole과 isJoined 상태를 실제 API 데이터에 맞게 설정
  useEffect(() => {
    if (routineDetailData?.result) {
      const result = routineDetailData.result;
      const isUserJoined = result.groupRoutineInfo?.joined || false;

      if (result.admin) {
        setUserRole('host');
        setIsJoined(isUserJoined);
      } else if (isUserJoined) {
        setUserRole('member');
        setIsJoined(true);
      } else {
        setUserRole(null);
        setIsJoined(false);
      }
    }
  }, [routineDetailData]);

  // 그룹 루틴 관련 훅들
  const { mutate: deleteGroupRoutine, isPending: isDeleting } =
    useDeleteGroupRoutine();
  const { mutate: joinGroupRoutine, isPending: isJoining } =
    useJoinGroupRoutine();
  const { mutate: leaveGroupRoutine, isPending: isLeaving } =
    useLeaveGroupRoutine();

  // 루틴 상태 업데이트 훅
  const updateGroupRoutineStatus = useUpdateGroupRoutineStatus();

  // 단체루틴 기록 업데이트 훅
  const updateGroupRoutineRecord = useUpdateGroupRoutineRecord();

  const handleBack = () => navigation.goBack();
  const handleJoin = () => setJoinModalVisible(true);
  const handleCloseJoinModal = () => setJoinModalVisible(false);
  const handleConfirmJoin = () => {
    if (isJoined) {
      setJoinModalVisible(false);
      return;
    }

    if (routine.isAdmin) {
      setJoinModalVisible(false);
      return;
    }

    joinGroupRoutine(routine.id, {
      onSuccess: () => {
        setIsJoined(true);
        setUserRole('member');
        setJoinModalVisible(false);

        queryClient.invalidateQueries({
          queryKey: ['groupRoutineDetail', routineId],
        });
        queryClient.invalidateQueries({
          queryKey: ['infiniteGroupRoutines'],
        });

        Alert.alert('가입 완료', '그룹 루틴에 성공적으로 가입되었습니다.', [
          {
            text: '확인',
            onPress: () => {
              navigation.navigate('HomeMain');
            },
          },
        ]);
      },
      onError: (error) => {
        console.error('🔍 그룹 루틴 가입 실패:', error);
        setJoinModalVisible(false);
        Alert.alert('가입 실패', '그룹 루틴 가입에 실패했습니다.');
      },
    });
  };

  const handleMenuPress = () => {
    // joined가 true가 아닌 경우 아무 동작도 하지 않음
    if (!isJoined) {
      return;
    }
    setIsMenuVisible(!isMenuVisible);
  };

  const handleEditRoutine = () => {
    setIsMenuVisible(false);
    setIsEditRoutineModalVisible(true);
  };

  const handleConfirmEditRoutine = () => {
    setIsEditRoutineModalVisible(false);
    navigation.navigate('CreateGroupRoutine', {
      mode: 'edit',
      routineData: {
        id: routine.id,
        title: routine.title,
        description: routine.description,
        routineType: routine.routineType,
        startTime: routine.timeRange.split(' - ')[0],
        endTime: routine.timeRange.split(' - ')[1],
        dayTypes: routine.selectedDays,
      },
    });
  };

  const handleCancelEditRoutine = () => {
    setIsEditRoutineModalVisible(false);
  };

  const handleEditRoutineDetail = () => {
    setIsMenuVisible(false);
    setIsEditRoutineDetailModalVisible(true);
  };

  const handleConfirmEditRoutineDetail = () => {
    setIsEditRoutineDetailModalVisible(false);
    const routineInfos = routineDetailData?.result?.routineInfos || [];

    navigation.navigate('CreateGroupRoutineDetail', {
      mode: 'edit',
      routineData: {
        groupRoutineListId: routine.id,
        id: routine.id,
        title: routine.title,
        description: routine.description,
        routineType: routine.routineType,
        startTime: routine.timeRange.split(' - ')[0],
        endTime: routine.timeRange.split(' - ')[1],
        dayTypes: routine.selectedDays,
        routines: routineInfos,
      },
    });
  };

  const handleCancelEditRoutineDetail = () => {
    setIsEditRoutineDetailModalVisible(false);
  };

  const handleSaveRoutineDetail = () => {
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleDeleteRoutine = () => {
    setIsMenuVisible(false);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    deleteGroupRoutine(routine.id, {
      onSuccess: () => {
        setIsDeleteModalVisible(false);
        navigation.navigate('Result', {
          type: 'success',
          title: '그룹 루틴 삭제 완료',
          description: '그룹 루틴이 성공적으로 삭제되었습니다.',
          nextScreen: 'HomeMain',
        });
      },
      onError: (error) => {
        console.error('🔍 그룹 루틴 삭제 실패:', error);
        setIsDeleteModalVisible(false);
      },
    });
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);

  const handleLeaveRoutine = () => {
    if (routine.isAdmin) {
      setIsMenuVisible(false);
      return;
    }

    if (!isJoined) {
      setIsMenuVisible(false);
      return;
    }

    setIsMenuVisible(false);
    setIsLeaveModalVisible(true);
  };

  const handleConfirmLeave = () => {
    leaveGroupRoutine(routine.id, {
      onSuccess: () => {
        setIsJoined(false);
        setUserRole(null);
        setIsLeaveModalVisible(false);

        queryClient.invalidateQueries({
          queryKey: ['groupRoutineDetail', routineId],
        });
        queryClient.invalidateQueries({
          queryKey: ['infiniteGroupRoutines'],
        });

        Alert.alert('나가기 완료', '그룹 루틴에서 성공적으로 나갔습니다.', [
          {
            text: '확인',
            onPress: () => {
              navigation.navigate('HomeMain');
            },
          },
        ]);
      },
      onError: (error: any) => {
        console.error('🔍 그룹 루틴 나가기 실패:', error);
        setIsLeaveModalVisible(false);

        let errorMessage = '그룹 루틴 나가기에 실패했습니다.';
        if (error.response?.status === 403) {
          errorMessage = '권한이 없습니다. 방장은 나갈 수 없습니다.';
        } else if (error.response?.status === 404) {
          errorMessage = '그룹 루틴을 찾을 수 없습니다.';
        }

        Alert.alert('나가기 실패', errorMessage);
      },
    });
  };

  const handleCancelLeave = () => {
    setIsLeaveModalVisible(false);
  };

  // 루틴 아이템 토글 함수
  const handleTaskToggle = (index: number) => {
    const routineInfos = routineDetailData?.result?.routineInfos || [];
    const task = routineInfos[index];

    if (!task) {
      console.error('🔍 루틴 아이템을 찾을 수 없습니다:', index);
      return;
    }

    // 오늘 날짜인지 확인
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식

    // 그룹 루틴의 선택된 요일 확인
    const groupRoutineInfo = routineDetailData?.result?.groupRoutineInfo;
    const selectedDays = groupRoutineInfo?.dayOfWeek || [];

    // 오늘 요일이 선택된 요일에 포함되는지 확인
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const todayDay = dayNames[today.getDay()];

    const isTodayInSelectedDays = selectedDays.includes(todayDay);

    if (!isTodayInSelectedDays) {
      Alert.alert('알림', '오늘 날짜에 해당하는 루틴이 아닙니다.');
      return;
    }

    // 현재 상태의 반대값으로 업데이트
    const newStatus = !task.isCompleted;

    updateGroupRoutineStatus.mutate(
      {
        groupRoutineListId: routineId,
        routineId: task.id.toString(),
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          console.log('🔍 루틴 상태 업데이트 성공:', task.name, newStatus);

          // 모든 루틴이 완료되었는지 확인
          const updatedRoutineInfos = routineInfos.map((r, i) =>
            i === index ? { ...r, isCompleted: newStatus } : r,
          );

          const allCompleted = updatedRoutineInfos.every((r) => r.isCompleted);

          if (allCompleted && updatedRoutineInfos.length > 0) {
            // 단체루틴 기록 성공 API 호출
            updateGroupRoutineRecord.mutate(
              {
                groupRoutineListId: routineId,
                data: { status: true },
              },
              {
                onSuccess: () => {},
                onError: (error) => {
                  console.error('🔍 단체루틴 기록 업데이트 실패:', error);
                },
              },
            );
          }
        },
        onError: (error) => {
          console.error('🔍 루틴 상태 업데이트 실패:', error);
          Alert.alert('오류', '루틴 상태 업데이트에 실패했습니다.');
        },
      },
    );
  };

  // 로딩 상태 처리
  if (isRoutineDetailLoading) {
    return (
      <Container edges={['top', 'left', 'right']}>
        <Header title="단체 루틴" onBackPress={handleBack} />
        <LoadingContainer></LoadingContainer>
      </Container>
    );
  }

  // 에러 상태 처리
  if (routineDetailError) {
    return (
      <Container edges={['top', 'left', 'right']}>
        <Header title="단체 루틴" onBackPress={handleBack} />
        <ErrorContainer>
          <ErrorText>데이터를 불러오는데 실패했습니다.</ErrorText>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header
        title={isEditMode ? '상세 루틴 수정' : '단체 루틴'}
        onBackPress={isEditMode ? handleCancelEdit : handleBack}
        rightComponent={
          isEditMode ? (
            <SaveButton onPress={handleSaveRoutineDetail}>
              <SaveText>저장</SaveText>
            </SaveButton>
          ) : undefined
        }
      />
      <ScrollContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {/* 루틴 헤더 카드 - RoutineCard 활용 */}
        <RoutineCardContainer>
          <RoutineCard
            progress={
              routine.tasks.length > 0
                ? Math.round(
                    (routine.tasks.filter((t) => t.isCompleted).length /
                      routine.tasks.length) *
                      100,
                  )
                : 0
            }
            title={routine.title}
            description={routine.description}
            timeRange={routine.timeRange}
            selectedDays={routine.selectedDays}
            completedDays={routine.completedDays}
            onPress={() => {}}
            onMorePress={handleMenuPress}
            showProgress={false}
          />
        </RoutineCardContainer>

        {/* 해야할 루틴 섹션 */}
        <SectionCard>
          <RoutineListContainer>
            <SectionHeader>해야할 루틴</SectionHeader>
            {routine.tasks.map((task, index) => (
              <RoutineItemRow key={index}>
                <TaskIcon>{task.icon}</TaskIcon>
                <TaskContent>
                  <TaskTitle>{task.title}</TaskTitle>
                </TaskContent>
                <TaskDuration>{task.duration}</TaskDuration>
                <TaskStatus onPress={() => handleTaskToggle(index)}>
                  {task.isCompleted ? (
                    <CompletedCheckbox>
                      <CompletedCheckmark>✓</CompletedCheckmark>
                    </CompletedCheckbox>
                  ) : (
                    <UncompletedCheckbox />
                  )}
                </TaskStatus>
              </RoutineItemRow>
            ))}
            {isEditMode && (
              <AddTemplateButton
                onPress={() => setIsTemplateModalVisible(true)}
              >
                <AddTemplateText>+ 템플릿 추가</AddTemplateText>
              </AddTemplateButton>
            )}
          </RoutineListContainer>
        </SectionCard>

        {/* 완료/미달성 섹션 */}
        <SectionCard>
          <ParticipantsContainer>
            {/* 완료 섹션 */}
            <CompletedSection>
              <CompletedHeader>
                <CompletedTitle>완료</CompletedTitle>
                <CompletedCountContainer>
                  <CompletedIcon>👥</CompletedIcon>
                  <CompletedCountText>
                    {routine.completedCount}
                  </CompletedCountText>
                </CompletedCountContainer>
              </CompletedHeader>
              <CompletedAvatarContainer>
                <CompletedAvatarRow
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {routine.completedParticipants
                    .slice(0, 12)
                    .map((uri, idx) => (
                      <AvatarWrapper key={`completed-${idx}`}>
                        <Avatar
                          source={
                            uri
                              ? { uri }
                              : require('../../assets/images/default_profile.png')
                          }
                          defaultSource={require('../../assets/images/default_profile.png')}
                          onError={() => {}}
                        />
                      </AvatarWrapper>
                    ))}
                </CompletedAvatarRow>
              </CompletedAvatarContainer>
            </CompletedSection>

            {/* 미달성 섹션 */}
            <UnachievedSection>
              <UnachievedHeader>
                <UnachievedTitle>미달성</UnachievedTitle>
                <UnachievedCountContainer>
                  <UnachievedIcon>👥</UnachievedIcon>
                  <UnachievedCountText>
                    {routine.unachievedCount}
                  </UnachievedCountText>
                </UnachievedCountContainer>
              </UnachievedHeader>
              <UnachievedAvatarContainer>
                <UnachievedAvatarRow
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {routine.unachievedParticipants
                    .slice(0, 12)
                    .map((uri, idx) => (
                      <AvatarWrapper key={`unachieved-${idx}`}>
                        <Avatar
                          source={
                            uri
                              ? { uri }
                              : require('../../assets/images/default_profile.png')
                          }
                          defaultSource={require('../../assets/images/default_profile.png')}
                          onError={() => {}}
                        />
                      </AvatarWrapper>
                    ))}
                </UnachievedAvatarRow>
              </UnachievedAvatarContainer>
            </UnachievedSection>
          </ParticipantsContainer>
        </SectionCard>
      </ScrollContent>

      {/* 하단 고정 버튼 */}
      {!isJoined && !routine.isAdmin ? (
        <FixedJoinCta>
          <JoinButton onPress={handleJoin} disabled={isJoining}>
            <JoinText>{isJoining ? '가입 중...' : '단체루틴 참여'}</JoinText>
          </JoinButton>
        </FixedJoinCta>
      ) : isJoined ? (
        <FixedJoinCta>
          <JoinButton onPress={() => setIsGuestbookModalVisible(true)}>
            <JoinText>방명록</JoinText>
          </JoinButton>
        </FixedJoinCta>
      ) : null}

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
              text={isJoining ? '가입 중...' : '참여하기'}
              onPress={handleConfirmJoin}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
              disabled={isJoining}
            />
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 메뉴 모달 */}
      <BottomSheetDialog
        visible={isMenuVisible}
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <ModalContainer>
          {routine.isAdmin ? (
            <>
              <ModalButtonWrapper>
                <CustomButton
                  text="루틴 수정"
                  onPress={handleEditRoutine}
                  backgroundColor={theme.colors.white}
                  textColor={theme.colors.gray800}
                  borderColor={theme.colors.gray300}
                  borderWidth={1}
                />
              </ModalButtonWrapper>
              <ModalButtonWrapper>
                <CustomButton
                  text="상세 루틴 수정"
                  onPress={handleEditRoutineDetail}
                  backgroundColor={theme.colors.white}
                  textColor={theme.colors.gray800}
                  borderColor={theme.colors.gray300}
                  borderWidth={1}
                />
              </ModalButtonWrapper>
              <ModalButtonWrapper>
                <CustomButton
                  text="삭제"
                  onPress={handleDeleteRoutine}
                  backgroundColor={theme.colors.white}
                  textColor={theme.colors.error}
                  borderColor={theme.colors.error}
                  borderWidth={1}
                />
              </ModalButtonWrapper>
            </>
          ) : (
            <ModalButtonWrapper>
              <CustomButton
                text="단체 루틴 나가기"
                onPress={handleLeaveRoutine}
                backgroundColor={theme.colors.white}
                textColor={theme.colors.error}
                borderColor={theme.colors.error}
                borderWidth={1}
              />
            </ModalButtonWrapper>
          )}
        </ModalContainer>
      </BottomSheetDialog>

      {/* 삭제 확인 모달 */}
      <BottomSheetDialog
        visible={isDeleteModalVisible}
        onRequestClose={handleCancelDelete}
      >
        <ModalTitle>단체 루틴 삭제</ModalTitle>
        <ModalSubtitle>
          정말 해당 루틴을 삭제하시겠습니까?{'\n'}
          삭제 시{' '}
          <ModalSubtitleHighlight>모든 참여자들의</ModalSubtitleHighlight>{' '}
          루틴에서도 삭제됩니다.
        </ModalSubtitle>

        <ButtonRow>
          <ButtonWrapper>
            <CustomButton
              text="취소"
              onPress={handleCancelDelete}
              backgroundColor={theme.colors.gray200}
              textColor={theme.colors.gray700}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <CustomButton
              text="삭제"
              onPress={handleConfirmDelete}
              backgroundColor={theme.colors.error}
              textColor={theme.colors.white}
              disabled={isDeleting}
            />
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 단체 루틴 수정 확인 모달 */}
      <BottomSheetDialog
        visible={isEditRoutineModalVisible}
        onRequestClose={handleCancelEditRoutine}
      >
        <ModalTitle>단체 루틴 수정</ModalTitle>
        <ModalSubtitle>
          정말 해당 루틴을 수정하시겠습니까?{'\n'}
          수정 시{' '}
          <ModalSubtitleHighlight>모든 참여자들의</ModalSubtitleHighlight>{' '}
          루틴에서도 수정됩니다.
        </ModalSubtitle>

        <ButtonRow>
          <ButtonWrapper>
            <CustomButton
              text="취소"
              onPress={handleCancelEditRoutine}
              backgroundColor={theme.colors.gray200}
              textColor={theme.colors.gray700}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <CustomButton
              text="수정"
              onPress={handleConfirmEditRoutine}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
            />
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 단체 루틴 상세 수정 확인 모달 */}
      <BottomSheetDialog
        visible={isEditRoutineDetailModalVisible}
        onRequestClose={handleCancelEditRoutineDetail}
      >
        <ModalTitle>단체 루틴 상세 수정</ModalTitle>
        <ModalSubtitle>
          정말 해당 루틴을 수정하시겠습니까?{'\n'}
          수정 시{' '}
          <ModalSubtitleHighlight>모든 참여자들의</ModalSubtitleHighlight>{' '}
          루틴에서도 수정됩니다.
        </ModalSubtitle>

        <ButtonRow>
          <ButtonWrapper>
            <CustomButton
              text="취소"
              onPress={handleCancelEditRoutineDetail}
              backgroundColor={theme.colors.gray200}
              textColor={theme.colors.gray700}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <CustomButton
              text="수정"
              onPress={handleConfirmEditRoutineDetail}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
            />
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 단체 루틴 나가기 확인 모달 */}
      <BottomSheetDialog
        visible={isLeaveModalVisible}
        onRequestClose={handleCancelLeave}
      >
        <ModalTitle>단체 루틴 나가기</ModalTitle>
        <ModalSubtitle>
          정말 해당 루틴에서 나가시겠습니까?{'\n'}
          나가기 시{' '}
          <ModalSubtitleHighlight>
            다시 참여할 수 없습니다.
          </ModalSubtitleHighlight>
        </ModalSubtitle>

        <ButtonRow>
          <ButtonWrapper>
            <CustomButton
              text="취소"
              onPress={handleCancelLeave}
              backgroundColor={theme.colors.gray200}
              textColor={theme.colors.gray700}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <CustomButton
              text="나가기"
              onPress={handleConfirmLeave}
              backgroundColor={theme.colors.error}
              textColor={theme.colors.white}
              disabled={isLeaving}
            />
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 방명록 모달 */}
      <GuestbookModal
        isVisible={isGuestbookModalVisible}
        onClose={() => setIsGuestbookModalVisible(false)}
        groupRoutineListId={routine.id}
      />

      {/* 템플릿 선택 모달 */}
      <RoutineSuggestionModal
        visible={isTemplateModalVisible}
        onRequestClose={() => setIsTemplateModalVisible(false)}
        onRoutineSelect={(template) => {
          setIsTemplateModalVisible(false);
        }}
      />
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

const RoutineCardContainer = styled.View`
  /* margin-bottom: 16px; */
`;

const SectionCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  margin-bottom: 16px;
`;

const SectionHeader = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 16px;
`;

const RoutineListContainer = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 8px;
  padding: 12px;
  gap: 8px;
`;

const RoutineItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  /* min-height: 48px; */
`;

const ItemList = styled.View`
  gap: 8px;
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
  align-self: center;
`;

const TaskContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-start;
`;

const TaskTitle = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray800};
  line-height: 20px;
`;

const TaskDuration = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray600};
  margin-left: 8px;
  align-self: center;
`;

const TaskStatus = styled.TouchableOpacity`
  margin-left: 8px;
  align-self: center;
`;

const CompletedCheckbox = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

const CompletedCheckmark = styled.Text`
  font-size: 12px;
  color: ${theme.colors.white};
  font-weight: bold;
`;

const UncompletedCheckbox = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 2px solid ${theme.colors.gray300};
  background-color: ${theme.colors.white};
`;

const CompletedIcon = styled.Text`
  font-size: 16px;
  color: ${theme.colors.primary};
`;

const UncompletedIcon = styled.Text`
  font-size: 16px;
  color: ${theme.colors.gray400};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray500};
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ErrorText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.error};
`;

const SaveButton = styled.TouchableOpacity`
  padding: 8px 16px;
  background-color: ${theme.colors.primary};
  border-radius: 8px;
`;

const SaveText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.white};
`;

const ParticipantsContainer = styled.View`
  flex-direction: column;
  gap: 16px;
`;

const CompletedSection = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 8px;
  padding: 12px;
  min-height: 120px;
`;

const UnachievedSection = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 8px;
  padding: 12px;
  min-height: 120px;
`;

const CompletedHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CompletedTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 16px;
  color: ${theme.colors.gray800};
`;

const CompletedCountContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CompletedCountText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray600};
  margin-left: 4px;
`;

const CompletedAvatarRow = styled.ScrollView``;

const CompletedAvatarContainer = styled.View`
  border-radius: 8px;
  padding: 12px;
`;

const UnachievedHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const UnachievedTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 16px;
  color: ${theme.colors.gray800};
`;

const UnachievedCountContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UnachievedIcon = styled.Text`
  font-size: 16px;
  color: ${theme.colors.gray600};
`;

const UnachievedCountText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray600};
  margin-left: 4px;
`;

const UnachievedAvatarRow = styled.ScrollView``;

const UnachievedAvatarContainer = styled.View`
  border-radius: 8px;
  padding: 12px;
`;

const AvatarWrapper = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  margin-right: 8px;
`;

const Avatar = styled(Image)`
  width: 100%;
  height: 100%;
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

const AddTemplateButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: ${theme.colors.gray50};
  border: 2px dashed ${theme.colors.gray300};
  border-radius: 8px;
  margin-top: 8px;
`;

const AddTemplateText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
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

const ModalSubtitleHighlight = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 13px;
  color: ${theme.colors.error};
  text-align: center;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 20px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;

const ModalContainer = styled.View`
  padding: 20px;
`;

const ModalButtonWrapper = styled.View`
  margin-bottom: 16px;
  height: 48px;

  &:last-child {
    margin-bottom: 0;
  }
`;
