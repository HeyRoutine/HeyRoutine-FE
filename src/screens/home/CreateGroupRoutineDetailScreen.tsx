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
} from '../../hooks/routine/group/useGroupRoutines';
import { getGroupRoutineDetail } from '../../api/routine/group/routineDetails';
import {
  useRoutineTemplates,
  useRoutineEmojis,
} from '../../hooks/routine/common/useCommonRoutines';

interface CreateGroupRoutineDetailScreenProps {
  navigation: any;
  route: { params?: { routineData?: any } };
}

const CreateGroupRoutineDetailScreen = ({
  navigation,
  route,
}: CreateGroupRoutineDetailScreenProps) => {
  const routineData = route?.params?.routineData;

  const [selectedDays, setSelectedDays] = useState<string[]>(
    routineData?.days || [],
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

  // 그룹루틴 생성 + 상세 생성 훅
  const { mutate: createGroupRoutine, isPending: isCreatingGroup } =
    useCreateGroupRoutine();
  const { mutate: createGroupRoutineDetail, isPending: isCreatingDetail } =
    useCreateGroupRoutineDetail();

  const isPending = isCreatingGroup || isCreatingDetail;

  // 루틴 템플릿 조회 훅 - 모든 템플릿을 가져오기 위해 카테고리 필터링 제거
  const { data: templateData, isLoading: isLoadingTemplates } =
    useRoutineTemplates({
      size: 50, // 더 많은 템플릿을 가져오기 위해 size 증가
    });

  // 이모지 조회 훅 - 모든 이모지를 가져오기 위해 카테고리 필터링 제거
  const { data: emojiData, isLoading: isLoadingEmojis } = useRoutineEmojis({});

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
      const emojiId = emojiItem?.emojiId || 1; // 기본값 1

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
    const emojiId = routine.emojiId || 1; // 기본값 1

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
    // 그룹 루틴 생성 데이터 준비
    const groupRoutineData = {
      title: routineData?.name || '새 그룹 루틴',
      description: routineData?.description || '그룹 루틴 설명', // 전달받은 설명 사용
      startTime: routineData?.startTime || '09:00',
      endTime: routineData?.endTime || '11:00',
      routineType: (routineData?.category === 'life'
        ? 'DAILY'
        : 'FINANCE') as any,
      daysOfWeek: selectedDays,
    };

    console.log('🔍 1단계: 그룹 루틴 생성 시작');
    console.log('🔍 그룹 루틴 생성 요청 데이터:', groupRoutineData);

    // 1단계: 그룹 루틴 생성
    createGroupRoutine(groupRoutineData, {
      onSuccess: (groupData) => {
        console.log('🔍 그룹 루틴 생성 성공:', groupData);

        // 생성된 그룹 루틴 ID 추출 (result 자체가 ID 값)
        const groupRoutineId = groupData.result;
        console.log('🔍 생성된 그룹 루틴 ID:', groupRoutineId);

        if (!groupRoutineId) {
          console.error('🔍 그룹 루틴 ID가 반환되지 않았습니다:', groupData);
          return;
        }

        // 2단계: 그룹 루틴 상세 생성
        const detailData = {
          routines: routineItems.map((item) => ({
            templateId: null, // 템플릿 연결 안 함
            emojiId: item.emojiId,
            name: item.text,
            time: parseInt(item.time.replace('분', '')), // "30분" -> 30
          })),
        };

        console.log('🔍 2단계: 그룹 루틴 상세 생성 시작');
        console.log('🔍 상세 생성 요청 데이터:', detailData);
        console.log('🔍 사용할 그룹 루틴 ID:', groupRoutineId);

        createGroupRoutineDetail(
          {
            groupRoutineListId: groupRoutineId.toString(),
            data: detailData,
          },
          {
            onSuccess: (detailData) => {
              console.log('🔍 상세 생성 성공:', detailData);

              // 3단계: 생성 완료 후 즉시 조회 테스트
              console.log('🔍 3단계: 생성된 루틴 조회 테스트');

              // 조회 API를 직접 호출해서 확인해보기
              getGroupRoutineDetail(groupRoutineId.toString())
                .then((testResponse) => {
                  console.log('🔍 조회 테스트 응답:', testResponse);
                  console.log(
                    '🔍 routineInfos 존재 여부:',
                    !!testResponse.result?.routineInfos,
                  );
                  console.log(
                    '🔍 routineInfos 길이:',
                    testResponse.result?.routineInfos?.length || 0,
                  );
                  console.log(
                    '🔍 routineInfos 내용:',
                    testResponse.result?.routineInfos,
                  );
                })
                .catch((testError) => {
                  console.error('🔍 조회 테스트 실패:', testError);
                });

              navigation.navigate('Result', {
                type: 'success',
                title: '그룹 루틴 생성 완료',
                description:
                  '그룹 루틴과 상세 루틴이 성공적으로 생성되었습니다.',
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
        console.error('🔍 그룹 루틴 생성 실패:', error);
        // 에러 처리 (나중에 토스트나 알림 추가)
      },
    });
  };

  return (
    <Container edges={['top', 'left', 'right', 'bottom']}>
      <Header title="그룹 루틴 상세 생성" onBackPress={handleBack} />
      <Content>
        <RoutineCard>
          <RoutineTitle>{routineData?.name || '새 그룹 루틴'}</RoutineTitle>
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
                  const updatedItems = [...routineItems];
                  // 기존 아이템의 emojiId 유지
                  const existingItem = routineItems[index];
                  updatedItems[index] = {
                    emoji,
                    emojiId: existingItem?.emojiId || 1, // 기존 emojiId 유지
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
            그룹 루틴 상세 생성
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
