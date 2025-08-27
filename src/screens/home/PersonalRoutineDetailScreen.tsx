import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import CustomButton from '../../components/common/CustomButton';
import {
  DayButton,
  RoutineItemAdder,
  DayOfWeekSelector,
  EmojiPickerModal,
  RoutineSuggestionModal,
} from '../../components/domain/routine';
import {
  useRoutineTemplates,
  useRoutineEmojis,
} from '../../hooks/routine/common/useCommonRoutines';
import CompletedRoutineItem from '../../components/domain/routine/CompletedRoutineItem';
import { useRoutineStore } from '../../store';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import {
  usePersonalRoutineDetails,
  useDeletePersonalRoutineList,
  useUpdatePersonalRoutineDetail,
  useDeletePersonalRoutineDetail,
} from '../../hooks/routine/personal/usePersonalRoutines';

interface PersonalRoutineDetailScreenProps {
  navigation: any;
  route: {
    params?: {
      routineData?: any;
    };
  };
}

const PersonalRoutineDetailScreen = ({
  navigation,
  route,
}: PersonalRoutineDetailScreenProps) => {
  const routineData = route?.params?.routineData;
  const { setActiveRoutineId, isEditMode, setEditMode } = useRoutineStore();
  const [selectedDays, setSelectedDays] = useState<string[]>(
    routineData?.days || [],
  );
  const [routineItems, setRoutineItems] = useState<
    Array<{
      emoji: string;
      text: string;
      time: string;
      isCompleted: boolean;
    }>
  >([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [currentText, setCurrentText] = useState<string>('');
  const [moreSheetVisible, setMoreSheetVisible] = useState(false);
  const [exitConfirmVisible, setExitConfirmVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteSuccessVisible, setDeleteSuccessVisible] = useState(false);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [routineSuggestionVisible, setRoutineSuggestionVisible] =
    useState(false);

  const {
    data: existingRoutinesData,
    isLoading: isLoadingExistingRoutines,
    refetch: refetchRoutineDetails,
  } = usePersonalRoutineDetails(routineData?.id?.toString() || '', {
    date: (() => {
      const today = new Date();
      const koreaTime = new Date(today.getTime() + 9 * 60 * 60 * 1000);
      return `${koreaTime.getFullYear()}-${String(koreaTime.getMonth() + 1).padStart(2, '0')}-${String(koreaTime.getDate()).padStart(2, '0')}`;
    })(),
  });

  useFocusEffect(
    useCallback(() => {
      refetchRoutineDetails();
    }, [refetchRoutineDetails]),
  );

  const { mutate: deleteRoutine } = useDeletePersonalRoutineList();

  const { mutate: updateRoutineDetail, isPending: isUpdating } =
    useUpdatePersonalRoutineDetail();

  const { mutate: deleteRoutineDetail } = useDeletePersonalRoutineDetail();

  const { data: templatesData, isLoading: isLoadingTemplates } =
    useRoutineTemplates();

  const { data: emojisData, isLoading: isLoadingEmojis } = useRoutineEmojis();

  const handleDeleteRoutine = () => {
    closeMoreSheet();
    setDeleteConfirmVisible(true);
  };

  const handleConfirmDelete = () => {
    if (!routineData?.id) {
      return;
    }

    deleteRoutine(routineData.id.toString(), {
      onSuccess: () => {
        setDeleteConfirmVisible(false);
        setDeleteSuccessVisible(true);
      },
      onError: (error) => {
        // Alert 제거 - 토스트나 다른 UI 컴포넌트로 대체 예정
        console.log('삭제 실패: 루틴 삭제에 실패했습니다.');
      },
    });
  };

  const closeDeleteConfirm = () => setDeleteConfirmVisible(false);

  const closeDeleteSuccess = () => {
    setDeleteSuccessVisible(false);
    navigation.goBack();
  };

  useEffect(() => {
    setEditMode(false);
  }, [setEditMode]);

  useEffect(() => {
    if (
      existingRoutinesData?.result &&
      existingRoutinesData.result.length > 0
    ) {
      const sortedRoutines = [...existingRoutinesData.result].sort((a, b) => {
        return a.routineId - b.routineId;
      });

      const existingItems = sortedRoutines.map((routine: any) => {
        const isCompleted = routine.isCompleted || routine.completed || false;

        return {
          emoji: routine.emojiUrl,
          text: routine.routineName,
          time: `${routine.time}분`,
          isCompleted: isCompleted,
        };
      });

      setRoutineItems(existingItems);
    } else if (
      existingRoutinesData?.result &&
      existingRoutinesData.result.length === 0
    ) {
      setRoutineItems([]);
    }
  }, [existingRoutinesData]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isEditMode) {
          setExitConfirmVisible(true);
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [isEditMode]),
  );

  const handleBack = () => {
    if (isEditMode) {
      setExitConfirmVisible(true);
    } else {
      navigation.goBack();
    }
  };

  const handleDayPress = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handlePlusPress = () => {
    setRoutineSuggestionVisible(true);
  };

  const handleClockPress = () => {
    setRoutineSuggestionVisible(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
  };

  const handleTextChange = (text: string) => {
    setCurrentText(text);
  };

  const handleTextPress = () => {
    setRoutineSuggestionVisible(true);
  };

  const handleEditItem = (index: number) => {
    const item = routineItems[index];
    setEditingIndex(index);
    setSelectedEmoji(item.emoji);
    setCurrentText(item.text);
    setSelectedTime(item.time);
  };

  const handleCompleteEdit = () => {
    if (selectedEmoji && currentText && selectedTime) {
      if (editingIndex !== null) {
        const updatedItems = [...routineItems];
        updatedItems[editingIndex] = {
          emoji: selectedEmoji,
          text: currentText,
          time: selectedTime,
          isCompleted: false,
        };
        setRoutineItems(updatedItems);
        setEditingIndex(null);
      } else {
        const newItem = {
          emoji: selectedEmoji,
          text: currentText,
          time: selectedTime,
          isCompleted: false,
        };
        setRoutineItems([...routineItems, newItem]);
      }

      setSelectedEmoji('');
      setCurrentText('');
      setSelectedTime('');
    }
  };

  useEffect(() => {
    if (selectedEmoji && currentText && selectedTime) {
      handleCompleteEdit();
    }
  }, [selectedEmoji, currentText, selectedTime]);

  const handleDeleteItem = (index: number) => {
    const itemToDelete = routineItems[index];
    const existingRoutines = existingRoutinesData?.result || [];

    const existingRoutine = existingRoutines.find(
      (existing: any) =>
        existing.routineName === itemToDelete.text &&
        existing.time === parseInt(itemToDelete.time.replace('분', '')) &&
        existing.emojiUrl === itemToDelete.emoji,
    );

    if (existingRoutine) {
      deleteRoutineDetail(existingRoutine.routineId.toString(), {
        onSuccess: () => {
          const updatedItems = routineItems.filter((_, i) => i !== index);
          setRoutineItems(updatedItems);
        },
        onError: (error) => {
          // Alert 제거 - 토스트나 다른 UI 컴포넌트로 대체 예정
          console.log('삭제 실패: 루틴 삭제에 실패했습니다.');
        },
      });
    } else {
      const updatedItems = routineItems.filter((_, i) => i !== index);
      setRoutineItems(updatedItems);
    }
  };

  const handleRoutineSuggestionSelect = (routine: any) => {
    const newItem = {
      emoji: routine.icon,
      text: routine.title,
      time: selectedTime || '30분',
      isCompleted: false,
    };
    setRoutineItems([...routineItems, newItem]);

    setSelectedEmoji('');
    setCurrentText('');
    setSelectedTime('');
  };

  const handleRoutineSuggestionClose = () => {
    setRoutineSuggestionVisible(false);
  };

  const handleSave = () => {
    if (!routineData?.id) {
      return;
    }

    const existingRoutines = existingRoutinesData?.result || [];

    const getEmojiId = (emojiUrl: string) => {
      let emojiId = 1;
      if (emojisData?.result?.items) {
        const emoji = emojisData.result.items.find(
          (e: any) => e.emojiUrl === emojiUrl,
        );
        if (emoji) {
          emojiId = emoji.emojiId;
        }
      }
      return emojiId;
    };

    const updateRoutine: any[] = [];
    const makeRoutine: any[] = [];

    routineItems.forEach((item, index) => {
      if (index < existingRoutines.length) {
        const existingRoutine = existingRoutines[index];
        updateRoutine.push({
          id: existingRoutine.routineId,
          routineName: item.text,
          emojiId: getEmojiId(item.emoji),
          time: parseInt(item.time.replace('분', '')),
        });
      } else {
        makeRoutine.push({
          routineName: item.text,
          emojiId: getEmojiId(item.emoji),
          time: parseInt(item.time.replace('분', '')),
        });
      }
    });

    const deletedRoutines = existingRoutines.slice(routineItems.length);

    const deletePromises = deletedRoutines.map(
      (routine: any) =>
        new Promise((resolve, reject) => {
          deleteRoutineDetail(routine.routineId.toString(), {
            onSuccess: () => resolve(routine.routineId),
            onError: (error) => reject(error),
          });
        }),
    );

    // 삭제 완료 후 업데이트 및 생성
    Promise.all(deletePromises)
      .then(() => {
        if (updateRoutine.length > 0 || makeRoutine.length > 0) {
          updateRoutineDetail(
            {
              myRoutineListId: routineData.id.toString(),
              data: {
                updateRoutine: updateRoutine,
                makeRoutine: makeRoutine,
              },
            },
            {
              onSuccess: () => {
                setEditMode(false);
                refetchRoutineDetails();
              },
              onError: (error) => {
                // Alert 제거 - 토스트나 다른 UI 컴포넌트로 대체 예정
                console.log('수정 실패: 루틴 수정에 실패했습니다.');
              },
            },
          );
        } else {
          setEditMode(false);
          refetchRoutineDetails();
        }
      })
      .catch((error) => {
        // Alert 제거 - 토스트나 다른 UI 컴포넌트로 대체 예정
        console.log('수정 실패: 루틴 수정에 실패했습니다.');
      });
  };

  const handleStartRoutine = () => {
    if (!routineData?.id) {
      return;
    }

    setActiveRoutineId(routineData.id.toString());

    // ActiveRoutineScreen으로 이동
    const tasksWithRoutineId = routineItems.map((item, index) => {
      // 정렬된 순서로 routineId 매칭
      const sortedRoutines = existingRoutinesData?.result
        ? [...existingRoutinesData.result].sort(
            (a, b) => a.routineId - b.routineId,
          )
        : [];
      const matchingRoutine = sortedRoutines[index];

      return {
        icon: item.emoji,
        title: item.text,
        duration: item.time,
        routineId: matchingRoutine?.routineId,
      };
    });

    navigation.navigate('ActiveRoutine', {
      tasks: tasksWithRoutineId,
      routineName: routineData?.name || '루틴',
      routineId: routineData?.id?.toString(),
    });
  };

  const handleMorePress = () => {
    setMoreSheetVisible(true);
  };

  const closeMoreSheet = () => setMoreSheetVisible(false);

  const closeExitConfirm = () => setExitConfirmVisible(false);

  const handleConfirmExit = () => {
    closeExitConfirm();
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleTaskToggle = (index: number) => {
    // 개인 루틴 토글 로직 구현
    const updatedItems = [...routineItems];
    updatedItems[index] = {
      ...updatedItems[index],
      isCompleted: !updatedItems[index].isCompleted,
    };
    setRoutineItems(updatedItems);
  };

  const handleEditRoutine = () => {
    closeMoreSheet();

    // HomeScreen에서 전달받은 데이터 구조를 CreateRoutineScreen에서 기대하는 구조로 변환
    const data = {
      id: routineData?.id,
      title: routineData?.name || routineData?.title || '루틴 제목',
      routineType: routineData?.category === '생활' ? 'DAILY' : 'FINANCE',
      dayTypes: routineData?.days || selectedDays,
      startTime: routineData?.startTime || '00:00',
      endTime: routineData?.endTime || '00:00',
      startDate:
        routineData?.startDate || new Date().toISOString().split('T')[0],
    };

    navigation.navigate('CreateRoutine', { mode: 'edit', routineData: data });
  };

  const handleEditRoutineDetail = () => {
    closeMoreSheet();
    setEditMode(true);
  };

  // 오늘이 선택된 요일에 포함되는지 확인하는 함수
  const formatTimeWithPeriod = (time: string) => {
    if (!time) return '00:00';

    // HH:mm 형식에서 시간 추출
    const [hour, minute] = time.split(':').map(Number);
    const period = hour < 12 ? '오전' : '오후';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${period} ${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const isTodayInSelectedDays = () => {
    const today = new Date();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const todayName = dayNames[today.getDay()];
    return selectedDays.includes(todayName);
  };

  return (
    <Container>
      <Header title="루틴 상세" onBackPress={handleBack} />
      <Content>
        {/* 루틴 헤더 섹션 */}
        <RoutineCard>
          <HeaderContent>
            <HeaderLeft>
              <RoutineTitle>{routineData?.name || '루틴 제목'}</RoutineTitle>
              <RoutineTime>
                {formatTimeWithPeriod(routineData?.startTime || '00:00')} -{' '}
                {formatTimeWithPeriod(routineData?.endTime || '00:00')}
              </RoutineTime>
            </HeaderLeft>
            {!isEditMode && (
              <MoreIconButton onPress={handleMorePress}>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color={theme.colors.gray600}
                />
              </MoreIconButton>
            )}
          </HeaderContent>
          <DayOfWeekSelector
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
            readOnly={true}
            buttonSize={40}
            borderRadius={20}
          />

          {/* 새로운 루틴 추가 (수정 모드일 때만) */}
          {isEditMode && editingIndex === null && (
            <AdderContainer>
              <RoutineItemAdder
                onPlusPress={handlePlusPress}
                onClockPress={handleClockPress}
                onTextChange={handleTextChange}
                onTextPress={handleTextPress}
                selectedTime={selectedTime}
                selectedEmoji={selectedEmoji}
                currentText={currentText}
                placeholder="루틴을 추가해주세요"
                editable={isEditMode}
              />
            </AdderContainer>
          )}

          {/* 완성된 루틴 아이템들 */}
          {routineItems.map((item, index) => (
            <AdderContainer key={index}>
              <CompletedRoutineItem
                item={item}
                index={index}
                onEdit={(index, emoji, text, time) => {
                  const updatedItems = [...routineItems];
                  updatedItems[index] = {
                    emoji,
                    text,
                    time,
                    isCompleted: updatedItems[index].isCompleted, // 기존 완료 상태 유지
                  };
                  setRoutineItems(updatedItems);
                }}
                onDelete={handleDeleteItem}
                isEditMode={isEditMode}
              />
            </AdderContainer>
          ))}
        </RoutineCard>
        {/* 루틴 실행/수정 완료 버튼 */}

        <CreateButton
          onPress={isEditMode ? handleSave : handleStartRoutine}
          disabled={!isEditMode && !isTodayInSelectedDays()}
          style={{
            opacity: !isEditMode && !isTodayInSelectedDays() ? 0.5 : 1,
            backgroundColor:
              !isEditMode && !isTodayInSelectedDays()
                ? theme.colors.gray200
                : theme.colors.primary,
          }}
        >
          <CreateButtonText
            style={{
              color:
                !isEditMode && !isTodayInSelectedDays()
                  ? theme.colors.gray400
                  : theme.colors.white,
            }}
          >
            {isEditMode ? '수정 완료' : '루틴 실행하기'}
          </CreateButtonText>
        </CreateButton>
      </Content>

      <EmojiPickerModal
        visible={emojiPickerVisible}
        onRequestClose={() => setEmojiPickerVisible(false)}
        onEmojiSelect={(emoji) => {
          setSelectedEmoji(emoji);

          // 편집 중인 아이템이 있으면 해당 아이템의 이모지를 업데이트
          if (editingIndex !== null) {
            const updatedItems = [...routineItems];
            updatedItems[editingIndex] = {
              ...updatedItems[editingIndex],
              emoji: emoji,
            };
            setRoutineItems(updatedItems);
          }

          setEmojiPickerVisible(false);
        }}
      />

      <RoutineSuggestionModal
        visible={routineSuggestionVisible}
        onRequestClose={handleRoutineSuggestionClose}
        onRoutineSelect={handleRoutineSuggestionSelect}
        templates={templatesData?.result?.items || []}
      />

      {/* 더보기 시트 */}
      <BottomSheetDialog
        visible={moreSheetVisible}
        onRequestClose={closeMoreSheet}
      >
        <MoreSheetContainer>
          <MoreButton onPress={handleEditRoutine}>
            <MoreButtonText>루틴 수정</MoreButtonText>
          </MoreButton>
          <MoreButton onPress={handleEditRoutineDetail}>
            <MoreButtonText>상세 루틴 수정</MoreButtonText>
          </MoreButton>
          <DeleteButton onPress={handleDeleteRoutine}>
            <DeleteButtonText>삭제</DeleteButtonText>
          </DeleteButton>
        </MoreSheetContainer>
      </BottomSheetDialog>

      {/* 편집 모드 종료 확인 모달 */}
      <BottomSheetDialog
        visible={exitConfirmVisible}
        onRequestClose={closeExitConfirm}
      >
        <SheetTitle>편집을 종료하시겠습니까?</SheetTitle>
        <SheetSubtitle>저장하지 않은 변경사항은 사라집니다.</SheetSubtitle>
        <SheetActions>
          <ButtonWrapper>
            <CancelButton onPress={closeExitConfirm}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <ConfirmButton onPress={handleConfirmExit}>
              <ConfirmText>종료</ConfirmText>
            </ConfirmButton>
          </ButtonWrapper>
        </SheetActions>
      </BottomSheetDialog>

      {/* 루틴 삭제 확인 모달 */}
      <BottomSheetDialog
        visible={deleteConfirmVisible}
        onRequestClose={closeDeleteConfirm}
      >
        <SheetTitle>루틴을 삭제하시겠습니까?</SheetTitle>
        <SheetActions>
          <ButtonWrapper>
            <CancelButton onPress={closeDeleteConfirm}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <ConfirmButton onPress={handleConfirmDelete}>
              <ConfirmText>삭제</ConfirmText>
            </ConfirmButton>
          </ButtonWrapper>
        </SheetActions>
      </BottomSheetDialog>

      {/* 루틴 삭제 성공 모달 */}
      <BottomSheetDialog
        visible={deleteSuccessVisible}
        onRequestClose={closeDeleteSuccess}
      >
        <SheetTitle>루틴이 삭제되었습니다.</SheetTitle>
        <SheetActions>
          <CustomButton text="확인" onPress={closeDeleteSuccess} />
        </SheetActions>
      </BottomSheetDialog>
    </Container>
  );
};

export default PersonalRoutineDetailScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 16px;
`;

const RoutineCard = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 16px;
  padding: 24px 16px;
  margin-bottom: 16px;
`;

const RoutineTitle = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  font-weight: 500;
  color: #3f3f42;
  margin-bottom: 4px;
`;

const RoutineTime = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray500};
  margin-bottom: 16px;
`;

const AdderContainer = styled.View`
  margin-bottom: 10px;
`;

const CreateButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 16px;
  margin: 0;
  align-items: center;
  justify-content: center;
`;

const CreateButtonText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const MoreIconButton = styled.TouchableOpacity`
  padding: 4px;
`;

const SheetTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 20px;
  color: ${theme.colors.gray900};
  text-align: center;
  margin-bottom: 8px;
`;

const SheetSubtitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  margin-bottom: 24px;
`;

const SheetActions = styled.View`
  gap: 12px;
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
  padding: 18px;
  align-items: center;
`;

const CancelText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray700};
`;

const ConfirmButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const ConfirmText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const MoreSheetContainer = styled.View`
  gap: 12px;
  padding: 0;
`;

const MoreButton = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray300};
  border-radius: 12px;
  padding: 16px;
  align-items: center;
`;

const MoreButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  font-weight: 500;
  color: #5c5d61;
  text-align: center;
  line-height: 22px;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.error};
  border-radius: 12px;
  padding: 16px;
  align-items: center;
`;

const DeleteButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  font-weight: 500;
  color: ${theme.colors.error};
  text-align: center;
  line-height: 22px;
`;

const RoutineHeaderCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const HeaderLeft = styled.View`
  flex: 1;
`;

const DaySelectorCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
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
