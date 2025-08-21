import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import { TouchableOpacity, Text } from 'react-native';
import {
  DayOfWeekSelector,
  RoutineItemAdder,
  TimePickerModal,
  EmojiPickerModal,
} from '../../components/domain/routine';
import CompletedRoutineItem from '../../components/domain/routine/CompletedRoutineItem';
import CustomButton from '../../components/common/CustomButton';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';

interface RoutineDetailScreenProps {
  navigation: any;
  route: { params?: { routineData?: any } };
}

const RoutineDetailScreen = ({
  navigation,
  route,
}: RoutineDetailScreenProps) => {
  const routineData = route?.params?.routineData;
  const [selectedDays, setSelectedDays] = useState<string[]>(
    routineData?.days || ['월', '화'],
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
      isCompleted: true,
    },
    {
      emoji: '☕',
      text: '커피 마시기',
      time: '15분',
      isCompleted: true,
    },
  ]);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [currentText, setCurrentText] = useState<string>('');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDayPress = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handlePlusPress = () => {
    // 루틴 추가 로직 (필요시 구현)
  };

  const handleClockPress = () => {
    setTimePickerVisible(true);
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
    // 텍스트 입력 로직 (필요시 구현)
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = routineItems.filter((_, i) => i !== index);
    setRoutineItems(updatedItems);
  };

  const handleExecuteRoutine = () => {
    navigation.navigate('ActiveRoutine');
  };

  const handleMorePress = () => {
    setShowActionSheet(true);
  };

  const handleEditRoutine = () => {
    setShowActionSheet(false);
    navigation.navigate('EditRoutine', {
      routineData: {
        name: routineData?.name || '빵빵이의 점심루틴',
        startTime: routineData?.startTime || '오후 7:00',
        endTime: routineData?.endTime || '오후 10:00',
        days: routineData?.days || ['월', '화'],
      },
    });
  };

  const handleEditRoutineDetail = () => {
    setShowActionSheet(false);
    navigation.navigate('PersonalRoutineDetail', {
      routineData: {
        name: routineData?.name || '빵빵이의 점심루틴',
        startTime: routineData?.startTime || '오후 7:00',
        endTime: routineData?.endTime || '오후 10:00',
        days: routineData?.days || ['월', '화'],
      },
    });
  };

  const handleDeleteRoutine = () => {
    setShowActionSheet(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    // TODO: 루틴 삭제 로직
    console.log('루틴 삭제');
    navigation.navigate('Result', {
      type: 'success',
      title: '루틴 삭제 완료',
      description: '루틴이 성공적으로 삭제되었습니다.',
      nextScreen: 'Home',
    });
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <Container>
      <Header title="루틴 상세" onBackPress={handleBack} />
      <Content>
        <RoutineCard>
          <RoutineHeader>
            <RoutineTitle>
              {routineData?.name || '빵빵이의 점심루틴'}
            </RoutineTitle>
            <MoreButton onPress={handleMorePress}>
              <MoreButtonText>⋯</MoreButtonText>
            </MoreButton>
          </RoutineHeader>
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
                    isCompleted: true,
                  };
                  setRoutineItems(updatedItems);
                }}
                onDelete={handleDeleteItem}
              />
            </AdderContainer>
          ))}
        </RoutineCard>

        {/* 루틴 실행 버튼 */}
        <ExecuteButton onPress={handleExecuteRoutine}>
          <ExecuteButtonText>루틴 실행</ExecuteButtonText>
        </ExecuteButton>
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

      {/* 루틴 액션 시트 */}
      <BottomSheetDialog
        visible={showActionSheet}
        onRequestClose={() => setShowActionSheet(false)}
      >
        <ActionButtonsContainer>
          <ActionButton onPress={handleEditRoutine}>
            <ActionButtonText>루틴 수정</ActionButtonText>
          </ActionButton>
          <ActionButton onPress={handleEditRoutineDetail}>
            <ActionButtonText>루틴 상세 수정</ActionButtonText>
          </ActionButton>
          <DeleteActionButton onPress={handleDeleteRoutine}>
            <DeleteButtonText>삭제</DeleteButtonText>
          </DeleteActionButton>
        </ActionButtonsContainer>
      </BottomSheetDialog>

      {/* 삭제 확인 모달 */}
      <BottomSheetDialog
        visible={showDeleteModal}
        onRequestClose={handleCancelDelete}
      >
        <DeleteModalContainer>
          <DeleteModalTitle>루틴 삭제</DeleteModalTitle>
          <DeleteModalMessage>
            정말 해당 루틴을 삭제하시겠습니까?
          </DeleteModalMessage>
          <DeleteModalButtons>
            <CancelButton onPress={handleCancelDelete}>
              <CancelButtonText>취소</CancelButtonText>
            </CancelButton>
            <ConfirmDeleteButton onPress={handleConfirmDelete}>
              <ConfirmDeleteButtonText>삭제</ConfirmDeleteButtonText>
            </ConfirmDeleteButton>
          </DeleteModalButtons>
        </DeleteModalContainer>
      </BottomSheetDialog>
    </Container>
  );
};

export default RoutineDetailScreen;

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

const RoutineHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const RoutineTitle = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray800};
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

const ExecuteButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 16px;
  margin: 0 16px;
  align-items: center;
  justify-content: center;
`;

const ExecuteButtonText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.white};
`;

// 액션 시트 관련 스타일
const ActionButtonsContainer = styled.View`
  gap: 8px;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray200};
  background-color: ${theme.colors.white};
  align-items: center;
`;

const DeleteActionButton = styled.TouchableOpacity`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.error};
  background-color: ${theme.colors.white};
  align-items: center;
`;

const ActionButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray800};
`;

const DeleteButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.error};
`;

const MoreButton = styled(TouchableOpacity)`
  padding: 4px;
`;

const MoreButtonText = styled(Text)`
  font-size: 16px;
  color: ${theme.colors.gray500};
`;

// 삭제 확인 모달 관련 스타일
const DeleteModalContainer = styled.View`
  padding: 24px;
`;

const DeleteModalTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray800};
  text-align: center;
  margin-bottom: 16px;
`;

const DeleteModalMessage = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
  text-align: center;
  margin-bottom: 24px;
`;

const DeleteModalButtons = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  background-color: ${theme.colors.gray300};
  align-items: center;
`;

const ConfirmDeleteButton = styled.TouchableOpacity`
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  background-color: ${theme.colors.error};
  align-items: center;
`;

const CancelButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const ConfirmDeleteButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;
