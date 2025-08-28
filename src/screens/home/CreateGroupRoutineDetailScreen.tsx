import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import {
  DayButton,
  RoutineItemAdder,
  TimePickerModal,
  DayOfWeekSelector,
  EmojiPickerModal,
  RoutineSuggestionModal,
} from '../../components/domain/routine';
import CompletedRoutineItem from '../../components/domain/routine/CompletedRoutineItem';
import {
  useCreateGroupRoutineDetail,
  useCreateGroupRoutine,
  useUpdateGroupRoutineDetail,
} from '../../hooks/routine/group/useGroupRoutines';
import { getGroupRoutineDetail } from '../../api/routine/group/routineDetails';
import {
  useRoutineTemplates,
  useRoutineEmojis,
} from '../../hooks/routine/common/useCommonRoutines';
import { useQueryClient } from '@tanstack/react-query';

interface CreateGroupRoutineDetailScreenProps {
  navigation: any;
  route: { params?: { mode?: 'create' | 'edit'; routineData?: any } };
}

const CreateGroupRoutineDetailScreen = ({
  navigation,
  route,
}: CreateGroupRoutineDetailScreenProps) => {
  const mode = route?.params?.mode || 'create';
  const routineData = route?.params?.routineData;
  const queryClient = useQueryClient();

  const [selectedDays, setSelectedDays] = useState<string[]>(
    routineData?.dayTypes || routineData?.days || [],
  );
  const [routineItems, setRoutineItems] = useState<
    Array<{
      emoji: string;
      emojiId: number; // 이모지 ID 추가
      text: string;
      time: string;
      isCompleted: boolean;
    }>
  >([]);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [currentText, setCurrentText] = useState<string>('');

  // 수정 중인 아이템 인덱스 (null이면 새로 추가하는 중)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 루틴 추천 모달 상태
  const [routineSuggestionVisible, setRoutineSuggestionVisible] =
    useState(false);

  // 단체루틴 생성 + 상세 생성/수정 훅
  const { mutate: createGroupRoutine, isPending: isCreatingGroup } =
    useCreateGroupRoutine();
  const { mutate: createGroupRoutineDetail, isPending: isCreatingDetail } =
    useCreateGroupRoutineDetail();
  const { mutate: updateGroupRoutineDetail, isPending: isUpdatingDetail } =
    useUpdateGroupRoutineDetail();

  const isPending = isCreatingGroup || isCreatingDetail || isUpdatingDetail;

  // 루틴 템플릿 조회 훅 - 모든 템플릿을 가져오기 위해 카테고리 필터링 제거
  const { data: templateData, isLoading: isLoadingTemplates } =
    useRoutineTemplates({
      size: 50, // 더 많은 템플릿을 가져오기 위해 size 증가
    });

  // 이모지 조회 훅 - 모든 이모지를 가져오기 위해 카테고리 필터링 제거
  const { data: emojiData, isLoading: isLoadingEmojis } = useRoutineEmojis({});

  // 수정 모드에서 루틴 데이터 초기화
  useEffect(() => {
    if (
      mode === 'edit' &&
      routineData?.RoutineInfos &&
      emojiData?.result?.items
    ) {
      console.log('🔍 이모지 매칭 데이터:', {
        routineInfos: routineData.RoutineInfos,
        emojiItems: emojiData.result.items,
      });

      const emojiMap = new Map(
        emojiData.result.items.map((emoji: any) => [
          emoji.emojiId,
          emoji.emojiUrl,
        ]),
      );

      const initialRoutineItems = routineData.RoutineInfos.map(
        (routine: any) => {
          const emojiUrl = emojiMap.get(routine.emojiId) || '☕'; // 기본값
          console.log(
            `🔍 루틴 ${routine.name}: emojiId=${routine.emojiId}, emojiUrl=${emojiUrl}`,
          );
          return {
            emoji: emojiUrl,
            emojiId: routine.emojiId,
            text: routine.name,
            time: `${routine.time}분`,
            isCompleted: false,
          };
        },
      );

      setRoutineItems(initialRoutineItems);
    }
  }, [mode, routineData?.RoutineInfos, emojiData?.result?.items]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDayPress = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handlePlusPress = () => {
    if (isLoadingTemplates || isLoadingEmojis) {
      return;
    }

    if (templateData?.result?.items && templateData.result.items.length > 0) {
      setRoutineSuggestionVisible(true);
    } else {
      // 템플릿이 없어도 모달을 열어서 직접 입력할 수 있도록 함
      setRoutineSuggestionVisible(true);
    }
  };

  const handleClockPress = () => {
    // 시간 선택 모달을 직접 열기
    setTimePickerVisible(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
  };

  const handleTimeSelect = (time: string | number) => {
    if (typeof time === 'number') {
      const timeString = `${time}분`;
      setSelectedTime(timeString);
    } else {
      setSelectedTime(time);
    }
  };

  const handleTextChange = (text: string) => {
    // 시간 형식인지 확인 (예: "40분", "30분" 등)
    if (text.includes('분')) {
      setSelectedTime(text);
    } else {
      setCurrentText(text);
    }
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
      // 이모지 ID 찾기 (이모지 데이터에서 매칭)
      const emojiItem = emojiData?.result?.items?.find(
        (emoji: any) =>
          emoji.emojiUrl === selectedEmoji ||
          emoji.emojiId?.toString() === selectedEmoji,
      );

      // 이모지 ID를 찾지 못한 경우 로깅
      if (!emojiItem) {
        console.log('🔍 이모지 ID를 찾을 수 없음:', {
          selectedEmoji,
          availableEmojis: emojiData?.result?.items?.map((e: any) => ({
            emojiId: e.emojiId,
            emojiUrl: e.emojiUrl,
          })),
        });
      }

      const emojiId = emojiItem?.emojiId;

      // 이모지 ID가 없으면 에러 처리
      if (!emojiId) {
        console.error(
          '🔍 이모지 ID를 찾을 수 없어서 루틴을 추가할 수 없습니다:',
          selectedEmoji,
        );
        return;
      }

      if (editingIndex !== null) {
        // 기존 아이템 수정
        const updatedItems = [...routineItems];
        updatedItems[editingIndex] = {
          emoji: selectedEmoji,
          emojiId: emojiId,
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
          emojiId: emojiId,
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

  // 아이템 삭제
  const handleDeleteItem = (index: number) => {
    const updatedItems = routineItems.filter((_, i) => i !== index);
    setRoutineItems(updatedItems);
  };

  // 루틴 추천 선택 핸들러 (완료 버튼 클릭 시 호출)
  const handleRoutineSuggestionSelect = (routine: any) => {
    // 이모지 ID 찾기 (템플릿의 emojiId 사용)
    let emojiId = routine.emojiId;

    // 템플릿에 emojiId가 없으면 이모지 URL로 찾기
    if (!emojiId && routine.icon) {
      const emojiItem = emojiData?.result?.items?.find(
        (emoji: any) => emoji.emojiUrl === routine.icon,
      );
      emojiId = emojiItem?.emojiId;
    }

    // 이모지 ID를 찾지 못한 경우 로깅
    if (!emojiId) {
      console.log('🔍 템플릿에서 이모지 ID를 찾을 수 없음:', {
        routine,
        availableEmojis: emojiData?.result?.items?.map((e: any) => ({
          emojiId: e.emojiId,
          emojiUrl: e.emojiUrl,
        })),
      });
      return; // 이모지 ID가 없으면 루틴 추가하지 않음
    }

    // 완성된 루틴 아이템을 화면에 추가
    const newItem = {
      emoji: routine.icon,
      emojiId: emojiId,
      text: routine.title,
      time: selectedTime || '30분', // 선택된 시간 사용, 없으면 기본값
      isCompleted: false, // 생성 화면에서는 미완료 상태로
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

  const isFormValid = routineItems.length > 0;

  const handleSave = () => {
    if (mode === 'edit') {
      // 수정 모드: 단체 루틴 상세 수정

      const routines = routineItems
        .map((item, index) => {
          // 실제 API에서 받아온 routineId 사용
          const originalRoutine = routineData?.RoutineInfos?.[index];

          // routineId가 undefined인 경우 건너뛰기
          if (!originalRoutine?.id) {
            return null;
          }

          return {
            routineId: originalRoutine.id,
            templateId: null,
            emojiId: item.emojiId,
            name: item.text,
            time: parseInt(item.time.replace('분', '')),
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null); // 타입 가드로 null 제거

      const detailData = {
        routines,
      };

      updateGroupRoutineDetail(
        {
          groupRoutineListId:
            routineData.groupRoutineListId?.toString() ||
            routineData.id.toString(),
          data: detailData,
        },
        {
          onSuccess: (data) => {
            // 캐시 무효화로 데이터 새로고침
            const groupRoutineListId =
              routineData.groupRoutineListId || routineData.id;
            queryClient.invalidateQueries({
              queryKey: ['groupRoutineDetail', groupRoutineListId],
            });
            queryClient.invalidateQueries({
              queryKey: ['infiniteGroupRoutines'],
            });

            navigation.navigate('Result', {
              type: 'success',
              title: '단체 루틴 상세 수정 완료',
              description: '단체 루틴 상세가 성공적으로 수정되었습니다.',
              nextScreen: 'GroupRoutineDetail',
              updatedRoutineData: {
                routineId: routineData.groupRoutineListId || routineData.id,
              },
            });
          },
          onError: (error) => {
            console.error('🔍 단체 루틴 상세 수정 실패:', error);
            // 에러 처리 (나중에 토스트나 알림 추가)
          },
        },
      );
      return;
    }

    // 생성 모드: 단체 루틴 생성 데이터 준비
    const groupRoutineData = {
      title: routineData?.name || '새 단체 루틴',
      description: routineData?.description || '단체 루틴 설명', // 전달받은 설명 사용
      startTime: routineData?.startTime || '09:00',
      endTime: routineData?.endTime || '11:00',
      routineType: (routineData?.category === 'life'
        ? 'DAILY'
        : 'FINANCE') as any,
      daysOfWeek: selectedDays,
    };

    console.log('🔍 단체 루틴 생성 데이터:', groupRoutineData);

    // 1단계: 단체 루틴 생성
    createGroupRoutine(groupRoutineData, {
      onSuccess: (groupData) => {
        // 생성된 단체 루틴 ID 추출 (result 자체가 ID 값)
        const groupRoutineId = groupData.result;

        if (!groupRoutineId) {
          return;
        }

        // 2단계: 단체 루틴 상세 생성
        const detailData = {
          routines: routineItems.map((item) => ({
            templateId: null, // 템플릿 연결 안 함
            emojiId: item.emojiId,
            name: item.text,
            time: parseInt(item.time.replace('분', '')), // "30분" -> 30
          })),
        };

        createGroupRoutineDetail(
          {
            groupRoutineListId: groupRoutineId.toString(),
            data: detailData,
          },
          {
            onSuccess: (detailData) => {
              navigation.navigate('Result', {
                type: 'success',
                title: '단체 루틴 생성 완료',
                description:
                  '단체 루틴과 상세 루틴이 성공적으로 생성되었습니다.',
                nextScreen: 'HomeMain',
              });
            },
            onError: (error) => {
              console.error('🔍 상세 생성 실패:', error);
              // 에러 처리 (나중에 토스트나 알림 추가)
            },
          },
        );
      },
      onError: (error) => {
        console.error('🔍 단체 루틴 생성 실패:', error);
        // 에러 처리 (나중에 토스트나 알림 추가)
      },
    });
  };

  return (
    <Container edges={['top', 'left', 'right', 'bottom']}>
      <Header
        title={mode === 'edit' ? '단체 루틴 상세 수정' : '단체 루틴 상세 생성'}
        onBackPress={handleBack}
      />
      <Content>
        <RoutineCard>
          <RoutineTitle>
            {routineData?.title || routineData?.name || '새 단체 루틴'}
          </RoutineTitle>
          <DescriptionText>{routineData.description}</DescriptionText>
          <RoutineTime>
            {routineData?.startTime || '오후 7:00'} -{' '}
            {routineData?.endTime || '오후 10:00'}
          </RoutineTime>
          <DayOfWeekSelector
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
            readOnly={true}
            buttonSize={40}
            borderRadius={20}
          />

          {/* 새로운 루틴 추가 */}
          {editingIndex === null && (
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
                  console.log('🔍 CompletedRoutineItem onEdit:', {
                    index,
                    emoji,
                    text,
                    time,
                  });
                  const updatedItems = [...routineItems];
                  // 새로운 이모지에 해당하는 emojiId 찾기
                  const emojiItem = emojiData?.result?.items?.find(
                    (emojiData: any) => emojiData.emojiUrl === emoji,
                  );
                  const newEmojiId = emojiItem?.emojiId || 1;

                  console.log('🔍 이모지 매칭 결과:', {
                    selectedEmoji: emoji,
                    foundEmojiItem: emojiItem,
                    newEmojiId,
                  });

                  updatedItems[index] = {
                    emoji,
                    emojiId: newEmojiId, // 새로운 emojiId 사용
                    text,
                    time,
                    isCompleted: false, // 생성 화면에서는 미완료 상태로
                  };
                  setRoutineItems(updatedItems);
                }}
                onDelete={handleDeleteItem}
                isEditMode={true} // 생성 화면에서는 항상 편집 가능
              />
            </AdderContainer>
          ))}
        </RoutineCard>

        {/* 루틴 생성 버튼 */}
        <CreateButton onPress={handleSave} disabled={!isFormValid}>
          <CreateButtonText isDisabled={!isFormValid}>
            {mode === 'edit' ? '단체 루틴 상세 수정' : '단체 루틴 상세 생성'}
          </CreateButtonText>
        </CreateButton>
      </Content>

      <TimePickerModal
        visible={timePickerVisible}
        onRequestClose={() => setTimePickerVisible(false)}
        onTimeSelect={handleTimeSelect}
        type="minutes"
      />

      <EmojiPickerModal
        visible={emojiPickerVisible}
        onRequestClose={() => setEmojiPickerVisible(false)}
        onEmojiSelect={handleEmojiSelect}
      />

      <RoutineSuggestionModal
        visible={routineSuggestionVisible}
        onRequestClose={handleRoutineSuggestionClose}
        onRoutineSelect={handleRoutineSuggestionSelect}
        onPlusPress={() => setRoutineSuggestionVisible(true)}
        onClockPress={handleClockPress}
        onTextChange={handleTextChange}
        onTimeChange={setSelectedTime}
        selectedTime={selectedTime}
        selectedEmoji={selectedEmoji}
        currentText={currentText}
        templates={templateData?.result?.items || []} // 템플릿 데이터 전달
        emojis={emojiData?.result?.items || []} // 이모지 데이터 전달
        isLoading={isLoadingTemplates || isLoadingEmojis} // 로딩 상태 전달
      />
    </Container>
  );
};

export default CreateGroupRoutineDetailScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const DescriptionCard = styled.View`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray200};
  border-radius: 12px;
  padding: 16px;
  margin: 16px;
`;

const DescriptionTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 14px;
  color: ${theme.colors.gray700};
  margin-bottom: 8px;
`;

const DescriptionText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  line-height: 20px;
`;

const RoutineCard = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 12px;
  padding: 24px 16px;
  margin: 16px;
`;

const RoutineTitle = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray800};
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

const CreateButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) =>
    disabled ? theme.colors.gray300 : theme.colors.primary};
  border-radius: 12px;
  padding: 16px;
  margin: 0 16px;
  align-items: center;
  justify-content: center;
`;

const CreateButtonText = styled.Text<{ isDisabled?: boolean }>`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${({ isDisabled }) =>
    isDisabled ? theme.colors.gray500 : theme.colors.white};
`;

const LoadingContainer = styled.View`
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray500};
`;
