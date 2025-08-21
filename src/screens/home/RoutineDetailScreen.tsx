import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../../components/common/Header';
import DayOfWeekSelector from '../../components/domain/routine/DayOfWeekSelector';
import CompletedRoutineItem from '../../components/domain/routine/CompletedRoutineItem';
import CustomButton from '../../components/common/CustomButton';
import { theme } from '../../styles/theme';
import { useRoutineStore } from '../../store';

interface RoutineDetailScreenProps {
  navigation: any;
  route: { params?: { routineData?: any } };
}

const RoutineDetailScreen = ({
  navigation,
  route,
}: RoutineDetailScreenProps) => {
  const routineData = route?.params?.routineData;
  const { setActiveRoutineId, isEditMode, setEditMode } = useRoutineStore();

  // 로컬 상태 (화면 내에서만 사용)
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
    // 활성 루틴 ID 설정
    setActiveRoutineId('routine-1'); // 실제 루틴 ID로 변경 필요
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
    setEditMode(true); // 수정 모드 활성화
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
            {isEditMode ? (
              <EditButton onPress={() => setEditMode(false)}>
                <EditButtonText>완료</EditButtonText>
              </EditButton>
            ) : (
              <MoreButton onPress={handleMorePress}>
                <MoreButtonText>⋯</MoreButtonText>
              </MoreButton>
            )}
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
                  // 편집 로직
                }}
                onDelete={handleDeleteItem}
                isEditMode={isEditMode}
              />
            </AdderContainer>
          ))}
        </RoutineCard>

        {/* 루틴 실행 버튼 */}
        <ExecuteButton onPress={handleExecuteRoutine}>
          <ExecuteButtonText>루틴 실행</ExecuteButtonText>
        </ExecuteButton>
      </Content>

      {/* 루틴 액션 시트 */}
      {/* BottomSheetDialog 컴포넌트는 제거되었으므로, 직접 구현 또는 다른 방식으로 대체 */}
      {showActionSheet && (
        <ActionSheetOverlay>
          <ActionSheetContent>
            <ActionButton onPress={handleEditRoutine}>
              <ActionButtonText>루틴 수정</ActionButtonText>
            </ActionButton>
            <ActionButton onPress={handleEditRoutineDetail}>
              <ActionButtonText>루틴 상세 수정</ActionButtonText>
            </ActionButton>
            <DeleteActionButton onPress={handleDeleteRoutine}>
              <DeleteButtonText>삭제</DeleteButtonText>
            </DeleteActionButton>
          </ActionSheetContent>
        </ActionSheetOverlay>
      )}

      {/* 삭제 확인 모달 */}
      {/* BottomSheetDialog 컴포넌트는 제거되었으므로, 직접 구현 또는 다른 방식으로 대체 */}
      {showDeleteModal && (
        <DeleteModalOverlay>
          <DeleteModalContent>
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
          </DeleteModalContent>
        </DeleteModalOverlay>
      )}
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
const ActionSheetOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const ActionSheetContent = styled.View`
  background-color: ${theme.colors.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  width: 100%;
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

const MoreButtonText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.gray500};
`;

// 삭제 확인 모달 관련 스타일
const DeleteModalOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const DeleteModalContent = styled.View`
  background-color: ${theme.colors.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  width: 100%;
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

const EditButton = styled.TouchableOpacity`
  padding: 8px 12px;
  background-color: ${theme.colors.primary};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

const EditButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.white};
`;
