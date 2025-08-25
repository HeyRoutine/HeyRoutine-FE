import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { theme } from '../../../styles/theme';
import BottomSheetDialog from '../../common/BottomSheetDialog';
import { useRoutineEmojis } from '../../../hooks/routine/common/useCommonRoutines';

interface EmojiPickerModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  categories?: string[];
}

const EmojiPickerModal = ({
  visible,
  onRequestClose,
  onEmojiSelect,
  categories = ['생활', '소비', '식사', '학습', '건강', '취미'],
}: EmojiPickerModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState(
    categories.length > 0 ? categories[0] : '생활',
  );

  // 이모지 API 호출
  const { data: emojiData, isLoading: isLoadingEmojis } = useRoutineEmojis({
    category: selectedCategory,
  });

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleEmojiPress = (emoji: string) => {
    onEmojiSelect(emoji);
    onRequestClose();
  };

  // API에서 받아온 이모지 데이터
  const emojis = emojiData?.result?.items || [];

  return (
    <BottomSheetDialog
      visible={visible}
      onRequestClose={onRequestClose}
      dismissible={false}
    >
      <CategoryContainer>
        <CategoryScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <CategoryButton
              key={category}
              onPress={() => handleCategoryPress(category)}
              isSelected={selectedCategory === category}
            >
              <CategoryText isSelected={selectedCategory === category}>
                {category}
              </CategoryText>
            </CategoryButton>
          ))}
        </CategoryScrollView>
      </CategoryContainer>

      <EmojiGrid>
        {isLoadingEmojis ? null : emojis.length === 0 ? (
          <EmptyText>이모지가 없습니다.</EmptyText>
        ) : (
          emojis.slice(0, 24).map((emoji, index) => (
            <EmojiButton
              key={index}
              onPress={() => handleEmojiPress(emoji.emojiUrl)}
            >
              <EmojiImage source={{ uri: emoji.emojiUrl }} />
            </EmojiButton>
          ))
        )}
      </EmojiGrid>
    </BottomSheetDialog>
  );
};

export default EmojiPickerModal;

const CategoryContainer = styled.View`
  margin-bottom: 24px;
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

const EmojiGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-bottom: 20px;
`;

const EmojiButton = styled(TouchableOpacity)`
  width: 50px;
  height: 50px;
  background-color: ${theme.colors.gray50};
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  margin-right: 12px;
`;

const EmojiText = styled.Text`
  font-size: 16px;
`;

const EmojiImage = styled.Image`
  width: 20px;
  height: 20px;
  resize-mode: contain;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray500};
  text-align: center;
  padding: 20px;
`;

const EmptyText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray500};
  text-align: center;
  padding: 20px;
`;
