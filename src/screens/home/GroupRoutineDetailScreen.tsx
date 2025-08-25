import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import {
  Image,
  Modal,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import {
  useDeleteGroupRoutine,
  useJoinGroupRoutine,
  useLeaveGroupRoutine,
  useGroupRoutineDetail,
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
      isJoined: groupRoutineInfo?.joined || false,
      routineType: groupRoutineInfo?.routineType || 'DAILY',
      routineNums: groupRoutineInfo?.routineNums || 0,
      tasks: routineInfos.map((r: any) => ({
        icon: '☕', // 이모지는 별도로 처리 필요
        title: r.name,
        duration: `${r.time}분`,
      })),
      participants: [...completedParticipants, ...unachievedParticipants],
      completedParticipants,
      unachievedParticipants,
      completedCount,
      unachievedCount,
      isAdmin: result.admin === true, // isAdmin → admin으로 수정
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
      if (result.admin) {
        // isAdmin → admin으로 수정
        setUserRole('host');
        setIsJoined(true); // 방장은 가입된 상태로 간주
      } else if (result.groupRoutineInfo?.joined) {
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

  const handleBack = () => navigation.goBack();
  const handleJoin = () => setJoinModalVisible(true);
  const handleCloseJoinModal = () => setJoinModalVisible(false);
  const handleConfirmJoin = () => {
    // 이미 가입된 상태인지 확인
    if (isJoined) {
      console.log('🔍 이미 가입된 그룹 루틴입니다');
      setJoinModalVisible(false);
      return;
    }

    // isAdmin이 false일 때만 가입 가능
    if (routine.isAdmin) {
      console.log('🔍 방장은 가입할 수 없습니다');
      setJoinModalVisible(false);
      return;
    }

    // 그룹 루틴 가입 API 호출
    joinGroupRoutine(routine.id, {
      onSuccess: () => {
        console.log('🔍 그룹 루틴 가입 성공');

        // 상태 즉시 업데이트
        setIsJoined(true);
        setUserRole('member');
        setJoinModalVisible(false);

        // 캐시 무효화로 데이터 새로고침
        queryClient.invalidateQueries({
          queryKey: ['groupRoutineDetail', routineId],
        });
        queryClient.invalidateQueries({
          queryKey: ['infiniteGroupRoutines'],
        });

        // 성공 메시지 표시
        Alert.alert('가입 완료', '그룹 루틴에 성공적으로 가입되었습니다.', [
          {
            text: '확인',
            onPress: () => {
              // 홈 화면으로 돌아가기
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
    setIsMenuVisible(!isMenuVisible);
  };

  const handleEditRoutine = () => {
    // 그룹 루틴 기본 정보 수정 (제목, 설명, 시간, 요일 등)
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
        dayTypes: routine.selectedDays, // dayOfWeek → dayTypes로 수정 (API 요청 형식에 맞춤)
      },
    });
  };

  const handleCancelEditRoutine = () => {
    setIsEditRoutineModalVisible(false);
  };

  const handleEditRoutineDetail = () => {
    // 그룹 루틴 상세 루틴 수정 (개별 루틴 아이템들)
    setIsMenuVisible(false);
    setIsEditRoutineDetailModalVisible(true);
  };

  const handleConfirmEditRoutineDetail = () => {
    setIsEditRoutineDetailModalVisible(false);

    // 실제 API 데이터에서 routineInfos 사용
    const routineInfos = routineDetailData?.result?.routineInfos || [];

    navigation.navigate('CreateGroupRoutineDetail', {
      mode: 'edit',
      routineData: {
        groupRoutineListId: routine.id, // 그룹 루틴 ID를 명확한 이름으로 전달
        id: routine.id, // 기존 호환성을 위해 유지
        title: routine.title,
        description: routine.description,
        routineType: routine.routineType,
        startTime: routine.timeRange.split(' - ')[0],
        endTime: routine.timeRange.split(' - ')[1],
        dayTypes: routine.selectedDays,
        routines: routineInfos, // 원본 데이터 그대로 전달
      },
    });
  };

  const handleCancelEditRoutineDetail = () => {
    setIsEditRoutineDetailModalVisible(false);
  };

  const handleSaveRoutineDetail = () => {
    // 상세 루틴 수정 저장
    // TODO: updateGroupRoutineDetail API 호출
    console.log('🔍 상세 루틴 수정 저장');
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    // 상세 루틴 수정 취소
    setIsEditMode(false);
  };

  const handleDeleteRoutine = () => {
    // 루틴 삭제 로직
    setIsMenuVisible(false);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    deleteGroupRoutine(routine.id, {
      onSuccess: () => {
        console.log('🔍 그룹 루틴 삭제 성공');
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
        // 에러 처리 (나중에 토스트나 알림 추가)
      },
    });
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);

  const handleLeaveRoutine = () => {
    // isAdmin이 true일 때는 나가기 불가
    if (routine.isAdmin) {
      setIsMenuVisible(false);
      return;
    }

    // 이미 나간 상태인지 확인
    if (!isJoined) {
      setIsMenuVisible(false);
      return;
    }

    // 나가기 확인 모달 표시
    setIsMenuVisible(false);
    setIsLeaveModalVisible(true);
  };

  const handleConfirmLeave = () => {
    // 그룹 루틴 나가기 API 호출
    leaveGroupRoutine(routine.id, {
      onSuccess: () => {
        console.log('🔍 그룹 루틴 나가기 성공');

        // 상태 즉시 업데이트
        setIsJoined(false);
        setUserRole(null);
        setIsLeaveModalVisible(false);

        // 캐시 무효화로 데이터 새로고침
        queryClient.invalidateQueries({
          queryKey: ['groupRoutineDetail', routineId],
        });
        queryClient.invalidateQueries({
          queryKey: ['infiniteGroupRoutines'],
        });

        // 성공 메시지 표시
        Alert.alert('나가기 완료', '그룹 루틴에서 성공적으로 나갔습니다.', [
          {
            text: '확인',
            onPress: () => {
              // 홈 화면으로 돌아가기
              navigation.navigate('HomeMain');
            },
          },
        ]);
      },
      onError: (error: any) => {
        console.error('🔍 그룹 루틴 나가기 실패:', error);

        // 에러 상세 정보 로깅
        if (error.response) {
          console.error('🔍 에러 응답:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          });
        }

        setIsLeaveModalVisible(false);

        // 에러 상태에 따른 메시지
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

  // 로딩 상태 처리
  if (isRoutineDetailLoading) {
    return (
      <Container edges={['top', 'left', 'right']}>
        <Header title="단체 루틴" onBackPress={handleBack} />
        <LoadingContainer>
          <LoadingText>로딩 중...</LoadingText>
        </LoadingContainer>
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
        <SummaryCard>
          <SummaryHeader>
            <SummaryTitle>{routine.title}</SummaryTitle>
            {!isJoined && (
              <MemberCountRow>
                <MemberIcon>👥</MemberIcon>
                <MemberCountText>{routine.membersCount}</MemberCountText>
              </MemberCountRow>
            )}
            {/* 메뉴 버튼: 방장이거나 참여한 팀원만 표시 */}
            {(routine.isAdmin || (isJoined && !routine.isAdmin)) && (
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
            {isEditMode && (
              <AddTemplateButton
                onPress={() => setIsTemplateModalVisible(true)}
              >
                <AddTemplateText>+ 템플릿 추가</AddTemplateText>
              </AddTemplateButton>
            )}
          </ItemList>
        </SectionCard>

        <ParticipantsCard>
          <SectionHeader>참여자</SectionHeader>

          {!isJoined ? (
            // 참여하기 전: 일반 참여자 목록
            <AvatarRow horizontal showsHorizontalScrollIndicator={false}>
              {routine.participants.slice(0, 8).map((uri, idx) => (
                <AvatarWrapper key={`participant-${idx}`}>
                  <Avatar
                    source={{ uri }}
                    defaultSource={require('../../assets/images/default_profile.png')}
                    onError={() => console.log('프로필 이미지 로드 실패:', uri)}
                  />
                </AvatarWrapper>
              ))}
            </AvatarRow>
          ) : (
            // 참여한 후: 완료자와 미달성자로 분류
            <ParticipantsContainer>
              {/* 완료된 참여자 */}
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
                <CompletedAvatarRow
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {routine.completedParticipants.slice(0, 6).map((uri, idx) => (
                    <AvatarWrapper key={`completed-${idx}`}>
                      <Avatar
                        source={{ uri }}
                        defaultSource={require('../../assets/images/default_profile.png')}
                        onError={() =>
                          console.log('프로필 이미지 로드 실패:', uri)
                        }
                      />
                    </AvatarWrapper>
                  ))}
                </CompletedAvatarRow>
              </CompletedSection>

              {/* 미달성 참여자 */}
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
                <UnachievedAvatarRow
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {routine.unachievedParticipants
                    .slice(0, 6)
                    .map((uri, idx) => (
                      <AvatarWrapper key={`unachieved-${idx}`}>
                        <Avatar
                          source={{ uri }}
                          defaultSource={require('../../assets/images/default_profile.png')}
                          onError={() =>
                            console.log('프로필 이미지 로드 실패:', uri)
                          }
                        />
                      </AvatarWrapper>
                    ))}
                </UnachievedAvatarRow>
              </UnachievedSection>
            </ParticipantsContainer>
          )}
        </ParticipantsCard>
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
        {routine.isAdmin ? (
          // 방장 메뉴: 루틴 수정, 상세 루틴 수정, 삭제
          <SheetActions>
            <CustomButton
              text="루틴 수정"
              onPress={handleEditRoutine}
              backgroundColor={theme.colors.white}
              textColor={theme.colors.gray800}
              borderColor={theme.colors.gray300}
              borderWidth={1}
            />
            <CustomButton
              text="상세 루틴 수정"
              onPress={handleEditRoutineDetail}
              backgroundColor={theme.colors.white}
              textColor={theme.colors.gray800}
              borderColor={theme.colors.gray300}
              borderWidth={1}
            />
            <CustomButton
              text="삭제"
              onPress={handleDeleteRoutine}
              backgroundColor={theme.colors.white}
              textColor={theme.colors.error}
              borderColor={theme.colors.error}
              borderWidth={1}
            />
          </SheetActions>
        ) : (
          // 팀원 메뉴: 단체 루틴 나가기
          <SheetActions>
            <CustomButton
              text="단체 루틴 나가기"
              onPress={handleLeaveRoutine}
              backgroundColor={theme.colors.white}
              textColor={theme.colors.error}
              borderColor={theme.colors.error}
              borderWidth={1}
            />
          </SheetActions>
        )}
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
          console.log('🔍 선택된 템플릿:', template);
          setIsTemplateModalVisible(false);
          // TODO: 선택된 템플릿을 루틴 목록에 추가
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

const SheetActions = styled.View`
  gap: 12px;
  padding: 16px;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
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

// Template Button Styles
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

// Participants Styles
const ParticipantsContainer = styled.View`
  gap: 16px;
`;

const CompletedHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const UnachievedHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;
