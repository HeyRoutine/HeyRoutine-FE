import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Modal, TouchableOpacity, ScrollView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../styles/theme';
import RoutineSuggestionItem from './RoutineSuggestionItem';
import EmojiPickerModal from './EmojiPickerModal';
import TimePickerModal from './TimePickerModal';
import BottomSheetDialog from '../../common/BottomSheetDialog';
import RoutineItemAdder from './RoutineItemAdder';
import { useRoutineTemplates } from '../../../hooks/routine/common/useCommonRoutines';

interface RoutineSuggestionModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onRoutineSelect: (routine: RoutineItem) => void;
  onPlusPress?: () => void;
  onClockPress?: () => void;
  onTextChange?: (text: string) => void;
  onTimeChange?: (time: string) => void;
  selectedTime?: string;
  selectedEmoji?: string;
  currentText?: string;
  templates?: any[]; // 루틴 템플릿 데이터
  emojis?: any[]; // 이모지 데이터
  isLoading?: boolean; // 템플릿 로딩 상태
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
  onTimeChange,
  selectedTime,
  selectedEmoji,
  currentText,
  templates: propTemplates = [],
  emojis = [],
  isLoading = false,
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

  // 모달이 열릴 때마다 시간 초기화
  useEffect(() => {
    if (visible) {
      setSelectedTimeLocal('');
    }
  }, [visible]);

  // selectedTime prop 변경 시 selectedTimeLocal 즉시 업데이트
  useEffect(() => {
    console.log(
      '🔍 RoutineSuggestionModal - selectedTime 변경됨:',
      selectedTime,
    );
    setSelectedTimeLocal(selectedTime || '');
  }, [selectedTime]);
  const [currentTextLocal, setCurrentTextLocal] = useState(currentText || '');

  // 백엔드 카테고리에 맞게 수정
  const categoryTabs = ['생활', '소비', '식사', '학습', '건강', '취미'];
  const categoryIds = [
    'LIFE',
    'CONSUMPTION',
    'EATING',
    'STUDY',
    'HEALTH',
    'HOBBY',
  ];
  const selectedCategory = categoryIds[selectedCategoryIndex];

  // 선택된 카테고리에 따라 템플릿 조회
  const { data: templatesData, isLoading: isLoadingTemplates } =
    useRoutineTemplates({
      category: selectedCategory,
      page: 0,
      size: 50, // 충분한 수의 템플릿을 가져오기 위해 크기 증가
    });

  const templates = templatesData?.result?.items || [];

  // 이모지 ID를 URL로 매핑하는 함수 (성능 최적화)
  const getEmojiUrl = (emojiId: number) => {
    if (!emojiId || !emojis || emojis.length === 0) {
      return '📝'; // 기본 아이콘
    }

    const emoji = emojis.find((e) => e.emojiId === emojiId);
    if (!emoji || !emoji.emojiUrl) {
      return '📝'; // 기본 아이콘
    }

    return emoji.emojiUrl;
  };

  // 템플릿 데이터가 있으면 템플릿을 사용하고, 없으면 기본 추천 루틴을 사용
  const availableRoutines = React.useMemo(() => {
    console.log('🔍 RoutineSuggestionModal - 템플릿 데이터:', {
      templatesLength: templates?.length,
      emojisLength: emojis?.length,
      isLoading,
    });

    if (templates && templates.length > 0) {
      return templates.map((template) => ({
        id: template.templateId?.toString() || `template-${Date.now()}`,
        title: template.name?.trim() || '', // 타이틀 앞뒤 공백 제거
        description: template.content || '',
        icon: getEmojiUrl(template.emojiId), // 템플릿의 emojiId에 해당하는 이모지 URL 사용
        category: selectedCategory, // 현재 선택된 카테고리 사용
      }));
    }
    return routineSuggestions;
  }, [templates, emojis, isLoading]);

  // 카테고리별 필터링 로직 - 선택된 카테고리의 템플릿만 표시
  const filteredRoutines = availableRoutines.filter((routine) => {
    // 템플릿 데이터인 경우 선택된 카테고리의 템플릿만 표시
    if (templates && templates.length > 0) {
      return routine.category === selectedCategory;
    }
    // 기본 추천 루틴인 경우 카테고리별 필터링
    return routine.category === selectedCategory;
  });

  // 디버깅용 로그

  const handleRoutineSelect = (routine: RoutineItem) => {
    // 루틴 추천 아이템 선택 시 모달의 입력 필드들에 반영 (시간은 제외)
    setSelectedEmojiLocal(routine.icon);
    setCurrentTextLocal(routine.title.trim()); // 타이틀 앞뒤 공백 제거
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
    const timeString = time.toString();

    console.log('🔍 RoutineSuggestionModal - 시간 선택됨:', timeString);

    // 부모 컴포넌트에 즉시 시간 변경을 알림
    if (onTimeChange) {
      onTimeChange(timeString);
    }

    // 로컬 상태도 즉시 업데이트
    setSelectedTimeLocal(timeString);

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
        title: currentTextLocal.trim(), // 타이틀 앞뒤 공백 제거
        description: '',
        category: categoryTabs[selectedCategoryIndex],
      });
    }

    // 완료 후 입력 필드들 초기화
    setSelectedEmojiLocal('');
    setSelectedTimeLocal('');
    setCurrentTextLocal('');

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
              {/* 디버깅용 로그 */}
            </AdderContainer>

            {/* 카테고리 선택 */}
            <CategoryContainer>
              <CategoryScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {categoryTabs.map((category, index) => (
                  <CategoryButton
                    key={index}
                    onPress={() => {
                      setSelectedCategoryIndex(index);
                      // 카테고리 변경 시 새로운 템플릿 데이터를 가져오기 위해 컴포넌트가 리렌더링됨
                    }}
                    isSelected={selectedCategoryIndex === index}
                  >
                    <CategoryText isSelected={selectedCategoryIndex === index}>
                      {category}
                    </CategoryText>
                  </CategoryButton>
                ))}
              </CategoryScrollView>
            </CategoryContainer>

            {/* 루틴 목록 */}
            <RoutineList>
              <ScrollView showsVerticalScrollIndicator={false}>
                {isLoadingTemplates ? (
                  <LoadingContainer>{null}</LoadingContainer>
                ) : filteredRoutines.length > 0 ? (
                  filteredRoutines.map((routine) => (
                    <RoutineSuggestionItem
                      key={routine.id}
                      icon={routine.icon}
                      title={routine.title}
                      description={routine.description}
                      onPress={() => handleRoutineSelect(routine)}
                    />
                  ))
                ) : (
                  <EmptyContainer>
                    <EmptyText>사용 가능한 루틴 템플릿이 없습니다.</EmptyText>
                  </EmptyContainer>
                )}
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
      />

      <TimePickerModal
        visible={timePickerVisible}
        onRequestClose={() => setTimePickerVisible(false)}
        onTimeSelect={handleTimeSelect}
        type="minutes"
        initialMinutes={
          selectedTimeLocal
            ? parseInt(selectedTimeLocal.replace('분', ''))
            : undefined
        }
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

const CategoryScrollView = styled.ScrollView`
  flex-direction: row;
`;

const CategoryButton = styled(TouchableOpacity)<{ isSelected: boolean }>`
  padding: 8px 16px;
  margin-right: 16px;
  border-bottom-width: 2px;
  border-bottom-color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : 'transparent'};
`;

const CategoryText = styled.Text<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.gray600};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray500};
  text-align: center;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const EmptyText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray500};
  text-align: center;
`;
