import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { theme } from '../../../styles/theme';
import BottomSheetDialog from '../../common/BottomSheetDialog';
import { useRoutineEmojis } from '../../../hooks/routine/common/useCommonRoutines';
import SvgImage from '../../common/SvgImage';

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
  // 화면 너비를 기준으로 이모지 크기와 간격 계산
  const screenWidth = Dimensions.get('window').width;
  const containerPadding = 24; // 좌우 패딩
  const availableWidth = screenWidth - containerPadding * 2;
  const numColumns = 6;
  const gap = 8; // 이모지 간 간격
  const totalGaps = numColumns - 1; // 총 간격 수
  const emojiSize = (availableWidth - totalGaps * gap) / numColumns;
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

      <EmojiFlatList
        data={emojis}
        keyExtractor={(item, index) => `${item.emojiId}-${index}`}
        renderItem={({ item }) => (
          <EmojiButton
            onPress={() => handleEmojiPress(item.emojiUrl)}
            size={emojiSize}
            gap={gap}
          >
            <SvgImage
              uri={item.emojiUrl}
              width={emojiSize * 0.4}
              height={emojiSize * 0.4}
            />
          </EmojiButton>
        )}
        numColumns={6}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => null}
        ListHeaderComponent={() =>
          isLoadingEmojis ? <LoadingText>로딩 중...</LoadingText> : null
        }
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 0 }}
      />
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

const EmojiFlatList = styled(FlatList)`
  height: 300px;
`;

const EmojiButton = styled(TouchableOpacity)<{ size: number; gap: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: ${theme.colors.gray50};
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin: ${({ gap }) => gap / 2}px;
`;

const EmojiText = styled.Text`
  font-size: 16px;
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
