import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../styles/theme';
import BottomSheetDialog from '../../common/BottomSheetDialog';
import RoutineItemAdder from './RoutineItemAdder';
import TabNavigation from '../../common/TabNavigation';
import RoutineSuggestionItem from './RoutineSuggestionItem';
import EmojiPickerModal from './EmojiPickerModal';
import TimePickerModal from './TimePickerModal';

interface RoutineSuggestionModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onRoutineSelect: (routine: RoutineItem) => void;
  onPlusPress?: () => void;
  onClockPress?: () => void;
  onTextChange?: (text: string) => void;
  selectedTime?: string;
  selectedEmoji?: string;
  currentText?: string;
}

interface RoutineItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

const categories = [
  { id: 'food', name: '음식', icon: 'restaurant' },
  { id: 'activity', name: '활동', icon: 'fitness' },
  { id: 'preference', name: '기호', icon: 'heart' },
  { id: 'learning', name: '학습', icon: 'school' },
  { id: 'people', name: '사람', icon: 'people' },
];

const routineSuggestions: RoutineItem[] = [
  {
    id: '1',
    title: '커피 내리기',
    description:
      '기억력과 집중력을 향상시키는 따뜻한 커피와 함께 하루를 시작해봐요',
    icon: '☕',
    category: 'food',
  },
  {
    id: '2',
    title: '운동',
    description:
      '기억력과 집중력을 향상시키는 따뜻한 커피와 함께 하루를 시작해봐요',
    icon: '💪',
    category: 'activity',
  },
  {
    id: '3',
    title: '식빵 굽기',
    description:
      '기억력과 집중력을 향상시키는 따뜻한 커피와 함께 하루를 시작해봐요',
    icon: '🍞',
    category: 'food',
  },
  {
    id: '4',
    title: '독서',
    description:
      '기억력과 집중력을 향상시키는 따뜻한 커피와 함께 하루를 시작해봐요',
    icon: '📚',
    category: 'learning',
  },
  {
    id: '5',
    title: '명상',
    description:
      '기억력과 집중력을 향상시키는 따뜻한 커피와 함께 하루를 시작해봐요',
    icon: '🧘',
    category: 'activity',
  },
  {
    id: '6',
    title: '가족과 대화',
    description:
      '기억력과 집중력을 향상시키는 따뜻한 커피와 함께 하루를 시작해봐요',
    icon: '👨‍👩‍👧‍👦',
    category: 'people',
  },
];

const RoutineSuggestionModal: React.FC<RoutineSuggestionModalProps> = ({
  visible,
  onRequestClose,
  onRoutineSelect,
  onPlusPress,
  onClockPress,
  onTextChange,
  selectedTime,
  selectedEmoji,
  currentText,
}) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedEmojiLocal, setSelectedEmojiLocal] = useState(
    selectedEmoji || '',
  );
  const [selectedTimeLocal, setSelectedTimeLocal] = useState(
    selectedTime || '',
  );
  const [currentTextLocal, setCurrentTextLocal] = useState(currentText || '');

  const categoryTabs = ['음식', '활동', '기호', '학습', '사람'];
  const categoryIds = ['food', 'activity', 'preference', 'learning', 'people'];
  const selectedCategory = categoryIds[selectedCategoryIndex];

  const filteredRoutines = routineSuggestions.filter(
    (routine) => routine.category === selectedCategory,
  );

  const handleRoutineSelect = (routine: RoutineItem) => {
    // 루틴 추천 아이템 선택 시 모달의 입력 필드들에 반영 (시간은 제외)
    setSelectedEmojiLocal(routine.icon);
    setCurrentTextLocal(routine.title);
    // 시간은 선택되지 않은 상태로 유지
  };

  const handlePlusPress = () => {
    // 루틴 추천 모달을 숨기고 이모지 선택 모달을 열기
    setEmojiPickerVisible(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmojiLocal(emoji);
    // 이모지는 + 버튼에만 반영되도록 하고, 텍스트 인풋에는 전달하지 않음
    setEmojiPickerVisible(false);
    // 이모지 선택 완료 후 숨겨진 루틴 추천 모달이 다시 보임
  };

  const handleClockPress = () => {
    // 루틴 추천 모달을 숨기고 시간 선택 모달을 열기
    setTimePickerVisible(true);
  };

  const handleTimeSelect = (time: string | number) => {
    setSelectedTimeLocal(time.toString());
    // 부모 컴포넌트에 선택된 시간 전달
    if (onClockPress) {
      onClockPress();
    }
    setTimePickerVisible(false);
    // 시간 선택 완료 후 숨겨진 루틴 추천 모달이 다시 보임
  };

  // 완료 버튼 활성화 조건: 이모지, 텍스트, 시간이 모두 채워져야 함
  const isCompleteButtonEnabled =
    selectedEmojiLocal && currentTextLocal && selectedTimeLocal;

  const handleComplete = () => {
    // 완료 버튼 클릭 시 부모 컴포넌트에 완성된 루틴 아이템 전달
    if (onRoutineSelect) {
      onRoutineSelect({
        id: Date.now().toString(),
        icon: selectedEmojiLocal,
        title: currentTextLocal,
        description: '',
        category: categoryTabs[selectedCategoryIndex],
      });
    }
    onRequestClose();
  };

  return (
    <BottomSheetDialog
      visible={visible}
      onRequestClose={onRequestClose}
      dismissible={false}
    >
      <ModalContainer>
        {/* 이모지/시간 선택 모달이 열려있을 때는 루틴 추천 내용을 숨김 */}
        {!emojiPickerVisible && !timePickerVisible && (
          <>
            {/* RoutineItemAdder */}
            <AdderContainer>
              <RoutineItemAdder
                onPlusPress={handlePlusPress}
                onClockPress={handleClockPress}
                onTextChange={(text) => {
                  setCurrentTextLocal(text);
                  onTextChange?.(text);
                }}
                selectedTime={selectedTimeLocal}
                selectedEmoji={selectedEmojiLocal}
                currentText={currentTextLocal}
                placeholder="루틴을 추가해주세요"
              />
            </AdderContainer>

            {/* 카테고리 선택 */}
            <CategoryContainer>
              <TabNavigation
                selectedIndex={selectedCategoryIndex}
                onTabChange={setSelectedCategoryIndex}
                tabs={categoryTabs}
                containerStyle={{ gap: 16 }}
              />
            </CategoryContainer>

            {/* 루틴 목록 */}
            <RoutineList>
              <ScrollView showsVerticalScrollIndicator={false}>
                {filteredRoutines.map((routine) => (
                  <RoutineSuggestionItem
                    key={routine.id}
                    icon={routine.icon}
                    title={routine.title}
                    description={routine.description}
                    onPress={() => handleRoutineSelect(routine)}
                  />
                ))}
              </ScrollView>
            </RoutineList>

            {/* 완료 버튼 */}
            <CompleteButton
              onPress={handleComplete}
              disabled={!isCompleteButtonEnabled}
              enabled={isCompleteButtonEnabled}
            >
              <CompleteButtonText enabled={isCompleteButtonEnabled}>
                완료
              </CompleteButtonText>
            </CompleteButton>
          </>
        )}
      </ModalContainer>

      <EmojiPickerModal
        visible={emojiPickerVisible}
        onRequestClose={() => setEmojiPickerVisible(false)}
        onEmojiSelect={handleEmojiSelect}
        categories={categoryTabs}
        hideTitle={true}
      />

      <TimePickerModal
        visible={timePickerVisible}
        onRequestClose={() => setTimePickerVisible(false)}
        onTimeSelect={handleTimeSelect}
        type="minutes"
        hideTitle={true}
      />
    </BottomSheetDialog>
  );
};

export default RoutineSuggestionModal;

const ModalContainer = styled.View`
  background-color: ${theme.colors.white};
`;

const AdderContainer = styled.View`
  padding: 16px;
  background-color: ${theme.colors.white};
  margin-bottom: 16px;
`;

const CategoryContainer = styled.View`
  margin-bottom: 20px;
`;

const RoutineList = styled.View`
  height: 300px;
`;

const CompleteButton = styled.TouchableOpacity<{ enabled: boolean }>`
  background-color: ${({ enabled }) =>
    enabled ? theme.colors.primary : theme.colors.gray300};
  border-radius: 12px;
  padding: 16px;
  margin: 0 16px 16px 16px;
  align-items: center;
  justify-content: center;
`;

const CompleteButtonText = styled.Text<{ enabled: boolean }>`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${({ enabled }) =>
    enabled ? theme.colors.white : theme.colors.gray500};
`;
