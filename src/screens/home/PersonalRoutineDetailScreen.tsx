import React, { useState, useEffect } from 'react';
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
  TimePickerModal,
  DayOfWeekSelector,
  EmojiPickerModal,
  RoutineSuggestionModal,
} from '../../components/domain/routine';
import CompletedRoutineItem from '../../components/domain/routine/CompletedRoutineItem';
import { useRoutineStore } from '../../store';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

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
  >([
    {
      emoji: '🍞',
      text: '식빵 굽기',
      time: '30분',
      isCompleted: false,
    },
    {
      emoji: '☕',
      text: '커피 마시기',
      time: '15분',
      isCompleted: false,
    },
  ]);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [currentText, setCurrentText] = useState<string>('');
  const [moreSheetVisible, setMoreSheetVisible] = useState(false);
  const [exitConfirmVisible, setExitConfirmVisible] = useState(false);

  // 수정 중인 아이템 인덱스 (null이면 새로 추가하는 중)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 루틴 추천 모달 상태
  const [routineSuggestionVisible, setRoutineSuggestionVisible] =
    useState(false);

  // 화면 진입 시 편집 모드 해제
  useEffect(() => {
    setEditMode(false);
  }, [setEditMode]);

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
    setRoutineSuggestionVisible(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    console.log('선택된 이모지:', emoji);
    setSelectedEmoji(emoji);
  };

  const handleTimeSelect = (time: string | number) => {
    console.log('시간 선택됨:', time, typeof time);
    if (typeof time === 'number') {
      const timeString = `${time}분`;
      setSelectedTime(timeString);
      console.log('분 설정됨:', timeString);
    } else {
      setSelectedTime(time);
      console.log('시간 설정됨:', time);
    }
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
    const updatedItems = routineItems.filter((_, i) => i !== index);
    setRoutineItems(updatedItems);
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
    // 루틴 저장 로직
    console.log('루틴 저장:', {
      ...routineData,
      selectedDays,
      routineItems,
      selectedTime,
    });

    // 수정 모드 비활성화
    setEditMode(false);

    // 결과 화면으로 이동
    navigation.navigate('Result', {
      type: 'success',
      title: '루틴 상세 수정 완료',
      description: '루틴 상세가 성공적으로 수정되었습니다.',
      nextScreen: 'RoutineDetail',
    });
  };

  const handleStartRoutine = () => {
    if (isEditMode) {
      // 편집 모드일 때는 수정 완료 처리
      setEditMode(false);
      // ResultScreen으로 이동
      navigation.replace('Result', {
        type: 'success',
        title: '루틴 상세 수정 완료',
        description: '루틴 상세가 성공적으로 수정되었습니다.',
        nextScreen: 'HomeMain',
      });
      return;
    }

    // 일반 모드일 때는 루틴 실행
    const routineName = routineData?.name;
    const tasks = routineItems.map((item) => ({
      icon: item.emoji,
      title: item.text,
      duration: item.time,
    }));
    navigation.navigate('ActiveRoutine', {
      routineName,
      tasks,
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

  const handleEditRoutine = () => {
    closeMoreSheet();
    const data = {
      name: routineData?.name || '빵빵이의 점심루틴',
      category: routineData?.category,
      days: selectedDays,
      startTime: routineData?.startTime || '오후 7:00',
      endTime: routineData?.endTime || '오후 10:00',
      startDate: routineData?.startDate,
    };
    navigation.navigate('EditRoutine', { routineData: data });
  };

  const handleEditRoutineDetail = () => {
    closeMoreSheet();
    setEditMode(true);
  };

  const handleDeleteRoutine = () => {
    closeMoreSheet();
    Alert.alert('루틴 삭제', '이 루틴을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          // 루틴 삭제 로직
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <Container>
      <Header
        title={isEditMode ? '루틴 상세 수정' : '루틴 상세'}
        onBackPress={handleBack}
      />
      <Content>
        <RoutineCard>
          <TitleContainer>
            <RoutineTitle>
              {routineData?.name || '빵빵이의 점심루틴'}
            </RoutineTitle>
            {!isEditMode && (
              <MoreButton onPress={handleMorePress}>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color={theme.colors.gray600}
                />
              </MoreButton>
            )}
          </TitleContainer>
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

        {/* 루틴 실행 버튼 */}
        <CreateButton onPress={handleStartRoutine}>
          <CreateButtonText>
            {isEditMode ? '수정 완료' : '루틴 실행하기'}
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
      />

      {/* 더보기 바텀시트 */}
      <BottomSheetDialog
        visible={moreSheetVisible}
        onRequestClose={closeMoreSheet}
      >
        <SheetActions>
          <CustomButton
            text="루틴 수정"
            onPress={handleEditRoutine}
            backgroundColor={theme.colors.white}
            textColor={theme.colors.primary}
            borderColor="#8B5CF6"
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
            textColor={theme.colors.gray800}
            borderColor={theme.colors.gray300}
            borderWidth={1}
          />
        </SheetActions>
      </BottomSheetDialog>

      {/* 나가기 확인 모달 */}
      <BottomSheetDialog
        visible={exitConfirmVisible}
        onRequestClose={closeExitConfirm}
      >
        <ModalTitle>정말 나가시겠습니까?</ModalTitle>
        <ModalSubtitle>변경한 내용은 저장되지 않습니다.</ModalSubtitle>
        <ButtonRow>
          <ButtonWrapper>
            <CancelButton onPress={closeExitConfirm}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <ConfirmButton onPress={handleConfirmExit}>
              <ConfirmText>나가기</ConfirmText>
            </ConfirmButton>
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>
    </Container>
  );
};

export default PersonalRoutineDetailScreen;

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

const CreateButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 16px;
  margin: 0 16px;
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

const MoreButton = styled.TouchableOpacity`
  padding: 4px;
`;

const SheetTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 20px;
  color: ${theme.colors.gray900};
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
  padding: 14px;
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
