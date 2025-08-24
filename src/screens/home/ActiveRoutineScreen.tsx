import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import { theme } from '../../styles/theme';
import ProgressCircle from '../../components/common/ProgressCircle';
import RoutineActionButton from '../../components/domain/routine/RoutineActionButton';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import { Ionicons } from '@expo/vector-icons';

import { useRoutineStore } from '../../store';

const ActiveRoutineScreen = ({ navigation, route }: any) => {
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10분을 초로
  const [isActive, setIsActive] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPauseModalVisible, setPauseModalVisible] = useState(false);
  const [isCompleteModalVisible, setCompleteModalVisible] = useState(false);
  const [isResumeModalVisible, setResumeModalVisible] = useState(false);
  const [isSkipModalVisible, setSkipModalVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { markActiveRoutineTaskCompleted, resetActiveRoutineProgress } =
    useRoutineStore();

  const incomingTasks = route?.params?.tasks as
    | Array<{ icon: string; title: string; duration: string }>
    | undefined;
  const routineName = route?.params?.routineName as string | undefined;
  const onTaskComplete = route?.params?.onTaskComplete as
    | ((index: number) => void)
    | undefined;
  const onComplete = route?.params?.onComplete as (() => void) | undefined;

  const tasks = useMemo(() => {
    if (incomingTasks && incomingTasks.length > 0) return incomingTasks;
    return [
      { icon: '🍞', title: '식빵 굽기', duration: '10분' },
      { icon: '☕', title: '커피 내리기', duration: '5분' },
      { icon: '🧼', title: '샤워하기', duration: '15분' },
    ];
  }, [incomingTasks]);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress(((10 * 60 - newTime) / (10 * 60)) * 100);
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // 모든 루틴 완료 상태일 때만 ResultScreen으로 이동
  useEffect(() => {
    if (isCompleted && activeTaskIndex >= tasks.length - 1) {
      const timer = setTimeout(() => {
        if (onComplete) {
          try {
            onComplete();
          } catch {}
        }
        // 루틴 완료 후 루틴 상세 화면으로 돌아가기
        navigation.goBack();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [
    isCompleted,
    activeTaskIndex,
    tasks.length,
    onComplete,
    navigation,
    tasks,
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePausePress = () => {
    if (isActive) {
      setPauseModalVisible(true);
    } else {
      // 재시작 모달 오픈
      setResumeModalVisible(true);
    }
  };

  const handleConfirmPause = () => {
    setIsActive(false);
    setPauseModalVisible(false);
  };

  const handleClosePauseModal = () => setPauseModalVisible(false);

  const handleConfirmResume = () => {
    setIsActive(true);
    setResumeModalVisible(false);
  };

  const handleCloseResumeModal = () => setResumeModalVisible(false);

  const handleCompletePress = () => {
    // 항상 완료 확인 모달을 노출
    setCompleteModalVisible(true);
  };

  const handleConfirmComplete = () => {
    // 현재 태스크 완료를 전역에도 기록
    try {
      markActiveRoutineTaskCompleted(activeTaskIndex);
    } catch {}
    // 상세 화면 콜백도 유지
    try {
      onTaskComplete?.(activeTaskIndex);
    } catch {}
    // 마지막 항목이면 축하 화면으로 전환, 아니면 다음 항목으로 이동
    if (activeTaskIndex < tasks.length - 1) {
      setCompleteModalVisible(false);
      // 개별 루틴 완료 시 잠깐 성공 화면 표시
      setIsActive(false);
      setIsCompleted(true);

      // 2초 후 다음 루틴으로 이동
      setTimeout(() => {
        setIsCompleted(false);
        goToNextTask();
      }, 2000);
    } else {
      setCompleteModalVisible(false);
      setIsActive(false);
      setIsCompleted(true);
    }
  };

  const handleCloseCompleteModal = () => setCompleteModalVisible(false);

  const handleSkipPress = () => {
    setSkipModalVisible(true);
  };

  const goToNextTask = () => {
    if (activeTaskIndex < tasks.length - 1) {
      setActiveTaskIndex((prev) => prev + 1);
      setTimeLeft(10 * 60);
      setProgress(0);
      setIsActive(true);
    } else {
      navigation.goBack();
    }
  };

  const handleConfirmSkip = () => {
    setSkipModalVisible(false);
    goToNextTask();
  };

  const handleCloseSkipModal = () => setSkipModalVisible(false);

  return (
    <Container edges={['top', 'left', 'right']}>
      <ScrollContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32, flexGrow: 1 }}
      >
        <ContentContainer>
          <Title>{tasks[activeTaskIndex]?.title || '루틴'}</Title>
          <Subtitle>{routineName || '루틴'}</Subtitle>

          <TimerContainer>
            {isCompleted ? (
              <SuccessContainer>
                <SuccessCircle>
                  <CheckIcon>
                    <Ionicons
                      name="checkmark"
                      size={80}
                      color={theme.colors.white}
                    />
                  </CheckIcon>
                </SuccessCircle>
                <SuccessTitle>루틴 성공🎉</SuccessTitle>
                <SuccessSubtitle>훌륭해요👍</SuccessSubtitle>
              </SuccessContainer>
            ) : (
              <>
                <ProgressCircle
                  progress={progress}
                  size={280}
                  strokeWidth={12}
                  progressColor={theme.colors.primary}
                  backgroundColor={theme.colors.gray200}
                  showText={false}
                  reverse
                />
                <TimerContent>
                  <BreadIcon>{tasks[activeTaskIndex]?.icon || '⏰'}</BreadIcon>
                  <TimeLeft>{formatTime(timeLeft)}</TimeLeft>
                  <TotalTime>
                    {tasks[activeTaskIndex]?.duration || '10분'}
                  </TotalTime>
                </TimerContent>
              </>
            )}
          </TimerContainer>

          {!isCompleted && (
            <ActionButtonsContainer>
              <RoutineActionButton
                type={isActive ? 'pause' : 'play'}
                onPress={handlePausePress}
              />
              <RoutineActionButton
                type="complete"
                onPress={handleCompletePress}
              />
              <RoutineActionButton type="skip" onPress={handleSkipPress} />
            </ActionButtonsContainer>
          )}
        </ContentContainer>
      </ScrollContent>

      {/* 일시정지 확인 모달 */}
      <BottomSheetDialog
        visible={isPauseModalVisible}
        onRequestClose={handleClosePauseModal}
      >
        <ModalTitle>루틴 일시정지</ModalTitle>
        <ModalSubtitle>해당 루틴을 일시정지 하시겠습니까?</ModalSubtitle>
        <ButtonRow>
          <ButtonWrapper>
            <CancelButton onPress={handleClosePauseModal}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <PauseButton onPress={handleConfirmPause}>
              <PauseText>일시정지</PauseText>
            </PauseButton>
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 스킵 확인 모달 */}
      <BottomSheetDialog
        visible={isSkipModalVisible}
        onRequestClose={handleCloseSkipModal}
      >
        <ModalTitle>루틴 넘어가기</ModalTitle>
        <ModalSubtitle>다음 루틴으로 넘어가시겠습니까?</ModalSubtitle>
        <ButtonRow>
          <ButtonWrapper>
            <CancelButton onPress={handleCloseSkipModal}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <SkipButton onPress={handleConfirmSkip}>
              <SkipText>스킵</SkipText>
            </SkipButton>
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 완료 확인 모달 */}
      <BottomSheetDialog
        visible={isCompleteModalVisible}
        onRequestClose={handleCloseCompleteModal}
      >
        <ModalTitle>루틴 완료</ModalTitle>
        <ModalSubtitle>해당 루틴을 완료하시겠습니까?</ModalSubtitle>
        <ButtonRow>
          <ButtonWrapper>
            <CancelButton onPress={handleCloseCompleteModal}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <CompleteButton onPress={handleConfirmComplete}>
              <CompleteText>완료</CompleteText>
            </CompleteButton>
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 재시작 확인 모달 */}
      <BottomSheetDialog
        visible={isResumeModalVisible}
        onRequestClose={handleCloseResumeModal}
      >
        <ModalTitle>루틴 다시 시작</ModalTitle>
        <ModalSubtitle>해당 루틴을 다시 시작하시겠습니까?</ModalSubtitle>
        <ButtonRow>
          <ButtonWrapper>
            <CancelButton onPress={handleCloseResumeModal}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <ResumeButton onPress={handleConfirmResume}>
              <ResumeText>다시 시작</ResumeText>
            </ResumeButton>
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>
    </Container>
  );
};

export default ActiveRoutineScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ScrollContent = styled.ScrollView`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 28px;
  color: ${theme.colors.gray900};
  text-align: center;
  margin-bottom: 12px;
`;

const Subtitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
  text-align: center;
  margin-bottom: 16px;
`;

const TimerContainer = styled.View`
  margin: 0 0 40px 0;
  position: relative;
  width: 280px;
  height: 280px;
  justify-content: center;
  align-items: center;
`;

const TimerContent = styled.View`
  position: absolute;
  align-items: center;
  z-index: 1;
`;

const BreadIcon = styled.Text`
  font-size: 48px;
  margin-bottom: 16px;
`;

const TimeLeft = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 36px;
  color: ${theme.colors.gray900};
  margin-bottom: 8px;
`;

const TotalTime = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
`;

const ActionButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 0;
`;

// Success styles
const SuccessContainer = styled.View`
  align-items: center;
  width: 280px;
  height: 280px;
  justify-content: center;
`;

const SuccessCircle = styled.View`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background-color: ${theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

const CheckIcon = styled.View`
  align-items: center;
  justify-content: center;
`;

const SuccessTitle = styled.Text`
  margin-top: 20px;
  font-family: ${theme.fonts.Bold};
  font-size: 22px;
  color: ${theme.colors.gray900};
`;

const SuccessSubtitle = styled.Text`
  margin-top: 6px;
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
`;

const ModalTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 18px;
  color: ${theme.colors.gray900};
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ModalSubtitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  margin-bottom: 36px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: ${theme.colors.gray200};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const CancelText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray700};
`;

const PauseButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const PauseText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const CompleteButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const CompleteText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const ResumeButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const ResumeText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const SkipButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const SkipText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;
