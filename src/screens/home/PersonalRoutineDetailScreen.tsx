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
} from '../../components/domain/routine';

interface PersonalRoutineDetailScreenProps {
  navigation: any;
  route: { params?: { routineData?: any } };
}

const PersonalRoutineDetailScreen = ({
  navigation,
  route,
}: PersonalRoutineDetailScreenProps) => {
  const routineData = route?.params?.routineData;
  const [selectedDays, setSelectedDays] = useState<string[]>(
    routineData?.days || [],
  );
  const [routineItems, setRoutineItems] = useState<
    Array<{
      emoji: string;
      text: string;
      time: string;
    }>
  >([]);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [currentText, setCurrentText] = useState<string>('');

  // 수정 중인 아이템 인덱스 (null이면 새로 추가하는 중)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDayPress = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handlePlusPress = () => {
    // 이모지 선택 모달 열기
    setEmojiPickerVisible(true);
  };

  const handleClockPress = () => {
    // 시간 선택 모달 열기
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
        };
        setRoutineItems(updatedItems);
        setEditingIndex(null);
      } else {
        // 새 아이템 추가
        const newItem = {
          emoji: selectedEmoji,
          text: currentText,
          time: selectedTime,
        };
        setRoutineItems([...routineItems, newItem]);
      }

      // 필드 초기화
      setSelectedEmoji('');
      setCurrentText('');
      setSelectedTime('');
    }
  };

  // 텍스트 입력 후 포커스가 벗어날 때 자동으로 추가/수정
  const handleTextBlur = () => {
    if (currentText && currentText.trim() && selectedEmoji && selectedTime) {
      handleCompleteEdit();
    }
  };

  const handleSave = () => {
    // 루틴 저장 로직
    console.log('루틴 저장:', {
      ...routineData,
      selectedDays,
      routineItems,
      selectedTime,
    });

    // 결과 화면으로 이동
    navigation.navigate('Result', {
      type: 'success',
      title: '루틴 생성이 완료되었습니다',
      description: '새로운 루틴이 성공적으로 생성되었습니다.',
      onSuccess: () => {
        // 홈 화면으로 이동
        navigation.navigate('HomeMain');
      },
    });
  };

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header title="루틴 상세 설정" onBackPress={handleBack} />
      <Content>
        <RoutineCard>
          <RoutineTitle>
            {routineData?.name || '빵빵이의 점심루틴'}
          </RoutineTitle>
          <RoutineTime>
            {routineData?.startTime || '오후 7:00'} -{' '}
            {routineData?.endTime || '오후 10:00'}
          </RoutineTime>
          <DayOfWeekSelector
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
            readOnly={true}
          />

          {/* 새로운 루틴 추가 (첫 번째 빈 adder) */}
          {editingIndex === null && (
            <AdderContainer>
              <RoutineItemAdder
                onPlusPress={handlePlusPress}
                onClockPress={handleClockPress}
                onTextChange={handleTextChange}
                onBlur={handleTextBlur}
                selectedTime={selectedTime}
                selectedEmoji={selectedEmoji}
                currentText={currentText}
                placeholder="루틴을 추가해주세요"
              />
            </AdderContainer>
          )}

          {/* 기존 루틴 아이템들 */}
          {routineItems.map((item, index) => (
            <AdderContainer key={index}>
              <RoutineItemAdder
                onPlusPress={() => handleEditItem(index)}
                onClockPress={() => handleEditItem(index)}
                onTextChange={(text) => {
                  if (editingIndex === index) {
                    setCurrentText(text);
                  }
                }}
                onBlur={editingIndex === index ? handleTextBlur : undefined}
                selectedTime={editingIndex === index ? selectedTime : item.time}
                selectedEmoji={
                  editingIndex === index ? selectedEmoji : item.emoji
                }
                currentText={editingIndex === index ? currentText : item.text}
                placeholder="루틴을 추가해주세요"
              />
            </AdderContainer>
          ))}
        </RoutineCard>

        {/* 루틴 생성 버튼 */}
        <CreateButton onPress={handleSave}>
          <CreateButtonText>루틴 생성</CreateButtonText>
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
