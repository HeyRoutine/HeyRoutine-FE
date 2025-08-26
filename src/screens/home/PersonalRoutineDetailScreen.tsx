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

  // 수정 중인 아이템 인덱스 (null이면 새로 추가하는 중)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 루틴 추천 모달 상태
  const [routineSuggestionVisible, setRoutineSuggestionVisible] =
    useState(false);

  // 개인루틴 상세 조회 훅 - 기존 루틴들을 불러오기
  const {
    data: existingRoutinesData,
    isLoading: isLoadingExistingRoutines,
    refetch: refetchRoutineDetails,
  } = usePersonalRoutineDetails(routineData?.id?.toString() || '', {
    // 한국 시간으로 날짜 생성
    date: (() => {
      const today = new Date();
      const koreaTime = new Date(today.getTime() + 9 * 60 * 60 * 1000); // UTC+9
      return `${koreaTime.getFullYear()}-${String(koreaTime.getMonth() + 1).padStart(2, '0')}-${String(koreaTime.getDate()).padStart(2, '0')}`;
    })(),
  });

  // 화면이 포커스될 때마다 루틴 상세 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      console.log(
        '🔍 PersonalRoutineDetailScreen - 화면 포커스됨, 루틴 상세 데이터 새로고침',
      );
      console.log(
        '🔍 현재 날짜:',
        (() => {
          const today = new Date();
          const koreaTime = new Date(today.getTime() + 9 * 60 * 60 * 1000);
          return `${koreaTime.getFullYear()}-${String(koreaTime.getMonth() + 1).padStart(2, '0')}-${String(koreaTime.getDate()).padStart(2, '0')}`;
        })(),
      );
      refetchRoutineDetails();
    }, [refetchRoutineDetails]),
  );

  // 개인루틴 삭제 훅
  const { mutate: deleteRoutine } = useDeletePersonalRoutineList();

  // 개인루틴 상세 수정 훅
  const { mutate: updateRoutineDetail, isPending: isUpdating } =
    useUpdatePersonalRoutineDetail();

  // 개인루틴 상세 삭제 훅
  const { mutate: deleteRoutineDetail } = useDeletePersonalRoutineDetail();

  // 루틴 템플릿 조회 훅
  const { data: templatesData, isLoading: isLoadingTemplates } =
    useRoutineTemplates();

  // 루틴 이모지 조회 훅
  const { data: emojisData, isLoading: isLoadingEmojis } = useRoutineEmojis();

  // 루틴 삭제 확인 모달 열기
  const handleDeleteRoutine = () => {
    closeMoreSheet();
    setDeleteConfirmVisible(true);
  };

  // 루틴 삭제 실행
  const handleConfirmDelete = () => {
    if (!routineData?.id) {
      console.error('🔍 루틴 ID가 없습니다:', routineData);
      return;
    }

    console.log('🔍 전체 루틴 삭제 시작:', routineData.id);
    deleteRoutine(routineData.id.toString(), {
      onSuccess: () => {
        console.log('🔍 전체 루틴 삭제 성공');
        setDeleteConfirmVisible(false);
        setDeleteSuccessVisible(true);
      },
      onError: (error) => {
        console.error('🔍 전체 루틴 삭제 실패:', error);
        Alert.alert('삭제 실패', '루틴 삭제에 실패했습니다.');
      },
    });
  };

  // 삭제 확인 모달 닫기
  const closeDeleteConfirm = () => setDeleteConfirmVisible(false);

  // 삭제 성공 모달 닫기
  const closeDeleteSuccess = () => {
    setDeleteSuccessVisible(false);
    navigation.goBack();
  };

  // 화면 진입 시 편집 모드 해제
  useEffect(() => {
    setEditMode(false);
  }, [setEditMode]);

  // 기존 루틴 데이터를 화면에 로드
  useEffect(() => {
    console.log('🔍 existingRoutinesData 변경됨:', {
      hasData: !!existingRoutinesData,
      resultLength: existingRoutinesData?.result?.length || 0,
      result: existingRoutinesData?.result,
      fullResponse: existingRoutinesData,
    });

    if (
      existingRoutinesData?.result &&
      existingRoutinesData.result.length > 0
    ) {
      console.log('🔍 기존 루틴 데이터 로드:', existingRoutinesData.result);

      // 루틴 순서를 고정하기 위해 routineId로 정렬
      const sortedRoutines = [...existingRoutinesData.result].sort((a, b) => {
        // routineId가 작은 순서대로 정렬 (생성 순서)
        return a.routineId - b.routineId;
      });

      console.log('🔍 정렬된 루틴 데이터:', sortedRoutines);
      console.log('🔍 전체 API 응답 구조:', existingRoutinesData);

      // 모든 루틴의 완료 상태를 상세히 로그
      sortedRoutines.forEach((routine: any, index: number) => {
        console.log(`🔍 루틴 ${index + 1} 상세 정보:`, {
          routineId: routine.routineId,
          routineName: routine.routineName,
          isCompleted: routine.isCompleted,
          completed: routine.completed,
          isCompletedType: typeof routine.isCompleted,
          allFields: Object.keys(routine),
          rawRoutine: routine,
        });
      });

      const existingItems = sortedRoutines.map((routine: any) => {
        // API 응답에서 완료 상태 필드 확인 (isCompleted 또는 completed)
        const isCompleted = routine.isCompleted || routine.completed || false;

        console.log(`🔍 루틴 "${routine.routineName}" 완료 상태 매핑:`, {
          routineId: routine.routineId,
          originalIsCompleted: routine.isCompleted,
          originalCompleted: routine.completed,
          finalIsCompleted: isCompleted,
        });

        return {
          emoji: routine.emojiUrl,
          text: routine.routineName,
          time: `${routine.time}분`,
          isCompleted: isCompleted,
        };
      });

      console.log('🔍 최종 매핑된 루틴 아이템들:', existingItems);
      setRoutineItems(existingItems);
    } else if (
      existingRoutinesData?.result &&
      existingRoutinesData.result.length === 0
    ) {
      console.log('🔍 빈 루틴 데이터 - 기존 아이템들 초기화');
      // 빈 배열인 경우 기존 아이템들 초기화
      setRoutineItems([]);
    }
  }, [existingRoutinesData]);

  // 완료 상태 관련 로직은 API 연동 시 구현 예정

  // 폰의 뒤로가기 버튼 처리
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isEditMode) {
          setExitConfirmVisible(true);
          return true; // 이벤트 소비
        }
        return false; // 기본 뒤로가기 동작 허용
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
    // 시간 선택 시 현재 선택된 시간을 RoutineSuggestionModal에 전달
    setRoutineSuggestionVisible(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    console.log('선택된 이모지:', emoji);
    setSelectedEmoji(emoji);
  };

  const handleTextChange = (text: string) => {
    console.log('입력된 텍스트:', text);
    setCurrentText(text);
  };

  const handleTextPress = () => {
    setRoutineSuggestionVisible(true);
  };

  // 기존 아이템 수정 시작
  const handleEditItem = (index: number) => {
    const item = routineItems[index];
    setEditingIndex(index);
    setSelectedEmoji(item.emoji);
    setCurrentText(item.text);
    setSelectedTime(item.time);
  };

  // 수정 완료 또는 새 아이템 추가
  const handleCompleteEdit = () => {
    if (selectedEmoji && currentText && selectedTime) {
      if (editingIndex !== null) {
        // 기존 아이템 수정
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
        // 새 아이템 추가
        const newItem = {
          emoji: selectedEmoji,
          text: currentText,
          time: selectedTime,
          isCompleted: false,
        };
        setRoutineItems([...routineItems, newItem]);
      }

      // 필드 초기화
      setSelectedEmoji('');
      setCurrentText('');
      setSelectedTime('');
    }
  };

  // 세 개 필드가 모두 채워졌을 때 자동으로 추가/수정
  useEffect(() => {
    if (selectedEmoji && currentText && selectedTime) {
      handleCompleteEdit();
    }
  }, [selectedEmoji, currentText, selectedTime]);

  const handleDeleteItem = (index: number) => {
    // 삭제할 아이템이 기존 루틴인지 확인
    const itemToDelete = routineItems[index];
    const existingRoutines = existingRoutinesData?.result || [];

    const existingRoutine = existingRoutines.find(
      (existing: any) =>
        existing.routineName === itemToDelete.text &&
        existing.time === parseInt(itemToDelete.time.replace('분', '')) &&
        existing.emojiUrl === itemToDelete.emoji,
    );

    if (existingRoutine) {
      // 기존 루틴인 경우 API 호출로 삭제
      console.log('🔍 기존 루틴 삭제 시작:', existingRoutine.routineId);
      deleteRoutineDetail(existingRoutine.routineId.toString(), {
        onSuccess: () => {
          console.log('🔍 기존 루틴 삭제 성공');
          // 로컬 상태에서도 제거
          const updatedItems = routineItems.filter((_, i) => i !== index);
          setRoutineItems(updatedItems);
        },
        onError: (error) => {
          console.error('🔍 기존 루틴 삭제 실패:', error);
          Alert.alert('삭제 실패', '루틴 삭제에 실패했습니다.');
        },
      });
    } else {
      // 새로 추가된 루틴인 경우 로컬에서만 제거
      console.log('🔍 새로 추가된 루틴 로컬 삭제:', itemToDelete.text);
      const updatedItems = routineItems.filter((_, i) => i !== index);
      setRoutineItems(updatedItems);
    }
  };

  // 루틴 추천 선택 핸들러 (완료 버튼 클릭 시 호출)
  const handleRoutineSuggestionSelect = (routine: any) => {
    // 완성된 루틴 아이템을 화면에 추가
    const newItem = {
      emoji: routine.icon,
      text: routine.title,
      time: selectedTime || '30분', // 선택된 시간 사용, 없으면 기본값
      isCompleted: false,
    };
    setRoutineItems([...routineItems, newItem]);

    // 필드 초기화
    setSelectedEmoji('');
    setCurrentText('');
    setSelectedTime('');
  };

  // 루틴 추천 모달이 닫힐 때 호출되는 핸들러
  const handleRoutineSuggestionClose = () => {
    setRoutineSuggestionVisible(false);
  };

  const handleSave = () => {
    if (!routineData?.id) {
      console.error('🔍 루틴 ID가 없습니다:', routineData);
      return;
    }

    // 기존 루틴 데이터와 새로운 루틴 데이터를 비교하여 업데이트할 데이터 준비
    const existingRoutines = existingRoutinesData?.result || [];

    // 이모지 URL을 emojiId로 매핑하는 함수
    const getEmojiId = (emojiUrl: string) => {
      let emojiId = 1; // 기본값
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

    // 업데이트할 루틴과 새로 만들 루틴을 분리
    const updateRoutine: any[] = [];
    const makeRoutine: any[] = [];

    // 기존 루틴과 새로운 루틴을 구분하기 위해 인덱스 기반으로 매핑
    routineItems.forEach((item, index) => {
      // 기존 루틴 데이터가 있고, 해당 인덱스에 기존 루틴이 있는 경우
      if (index < existingRoutines.length) {
        const existingRoutine = existingRoutines[index];
        // 기존 루틴이 수정된 경우
        updateRoutine.push({
          id: existingRoutine.routineId,
          routineName: item.text,
          emojiId: getEmojiId(item.emoji),
          time: parseInt(item.time.replace('분', '')),
        });
      } else {
        // 새로 추가된 루틴
        makeRoutine.push({
          routineName: item.text,
          emojiId: getEmojiId(item.emoji),
          time: parseInt(item.time.replace('분', '')),
        });
      }
    });

    // 삭제된 루틴 찾기 (기존 루틴 개수보다 현재 아이템이 적으면 삭제된 것)
    const deletedRoutines = existingRoutines.slice(routineItems.length);

    console.log('🔍 루틴 수정 데이터:', {
      updateRoutine,
      makeRoutine,
      deletedRoutines,
    });

    // 삭제된 루틴들 먼저 삭제
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
        // 업데이트할 루틴과 새로 만들 루틴이 있으면 한 번에 처리
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
                console.log('🔍 루틴 수정 성공');
                // 모든 작업 완료 후 편집 모드 종료
                setEditMode(false);
                refetchRoutineDetails(); // 데이터 새로고침
              },
              onError: (error) => {
                console.error('🔍 루틴 수정 실패:', error);
                Alert.alert('수정 실패', '루틴 수정에 실패했습니다.');
              },
            },
          );
        } else {
          // 수정할 내용이 없으면 바로 편집 모드 종료
          setEditMode(false);
          refetchRoutineDetails(); // 데이터 새로고침
        }
      })
      .catch((error) => {
        console.error('🔍 루틴 삭제 실패:', error);
        Alert.alert('수정 실패', '루틴 수정에 실패했습니다.');
      });
  };

  const handleStartRoutine = () => {
    if (!routineData?.id) {
      console.error('🔍 루틴 ID가 없습니다:', routineData);
      return;
    }

    console.log('🔍 루틴 실행 시작:', routineData.id);
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

      console.log(`🔍 태스크 ${index + 1} 매칭:`, {
        itemText: item.text,
        itemTime: item.time,
        itemEmoji: item.emoji,
        matchingRoutine: matchingRoutine,
        routineId: matchingRoutine?.routineId,
        sortedRoutineIds: sortedRoutines.map((r) => r.routineId),
      });

      return {
        icon: item.emoji,
        title: item.text,
        duration: item.time,
        routineId: matchingRoutine?.routineId,
      };
    });

    console.log('🔍 ActiveRoutineScreen으로 전달할 tasks:', tasksWithRoutineId);

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

    console.log('🔍 루틴 수정 데이터 전달:', {
      originalData: routineData,
      convertedData: data,
    });

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
