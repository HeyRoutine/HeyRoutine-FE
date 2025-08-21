import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { theme } from '../../../styles/theme';
import BottomSheetDialog from '../../common/BottomSheetDialog';

interface EmojiPickerModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  categories?: string[];
  hideTitle?: boolean;
}

const EmojiPickerModal = ({
  visible,
  onRequestClose,
  onEmojiSelect,
  categories = [
    '음식',
    '운동',
    '취미',
    '일상',
    '감정',
    '동물',
    '자연',
    '기타',
  ],
  hideTitle = false,
}: EmojiPickerModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // 이모지 데이터 (랜덤하게 선택된 이모지들)
  const emojiData = {
    음식: [
      '🍞',
      '🍗',
      '🥖',
      '🍔',
      '🍺',
      '🍕',
      '🍜',
      '🍣',
      '🍙',
      '🍪',
      '🍰',
      '🍦',
      '☕',
      '🥤',
      '🍷',
      '🍸',
      '🥗',
      '🥪',
      '🍟',
      '🌮',
      '🍱',
      '🥘',
      '🍲',
      '🥣',
      '🍳',
      '🥚',
      '🥓',
      '🍖',
      '🥩',
      '🍤',
      '🦐',
      '🦞',
      '🦀',
      '🐟',
      '🐠',
      '🐡',
      '🦑',
      '🦈',
      '🐙',
      '🦪',
      '🦞',
      '🦐',
      '🦑',
      '🦈',
      '🐙',
      '🦪',
      '🦞',
      '🦐',
      '🦑',
      '🦈',
      '🐙',
      '🦪',
    ],
    운동: [
      '🏃‍♂️',
      '🚴‍♂️',
      '🏋️‍♂️',
      '🧘‍♀️',
      '🏊‍♂️',
      '⚽',
      '🏀',
      '🎾',
      '🏸',
      '🎯',
      '🏃‍♀️',
      '🚴‍♀️',
      '🏋️‍♀️',
      '🧘‍♂️',
      '🏊‍♀️',
      '⚾',
      '🏈',
      '🏉',
      '🎱',
      '🏓',
      '🏒',
      '🏑',
      '🥅',
      '⛳',
      '🏌️‍♂️',
      '🏌️‍♀️',
      '🏇',
      '🤺',
      '🤾‍♂️',
      '🤾‍♀️',
      '🏊‍♂️',
      '🏊‍♀️',
      '🚣‍♂️',
      '🚣‍♀️',
      '🏄‍♂️',
      '🏄‍♀️',
      '🏊‍♂️',
      '🏊‍♀️',
      '🚣‍♂️',
      '🚣‍♀️',
      '🏄‍♂️',
      '🏄‍♀️',
      '🏊‍♂️',
      '🏊‍♀️',
      '🚣‍♂️',
      '🚣‍♀️',
    ],
    취미: [
      '🎨',
      '🎭',
      '🎪',
      '🎮',
      '🎲',
      '🎸',
      '🎹',
      '🎤',
      '💃',
      '🕺',
      '🎬',
      '📚',
      '✍️',
      '🎓',
      '🎨',
      '🎭',
      '🎪',
      '🎮',
      '🎲',
      '🎸',
      '🎹',
      '🎤',
      '💃',
      '🕺',
      '🎬',
      '📚',
      '✍️',
      '🎓',
      '🎨',
      '🎭',
      '🎪',
      '🎮',
      '🎲',
      '🎸',
      '🎹',
      '🎤',
      '💃',
      '🕺',
      '🎬',
      '📚',
      '✍️',
      '🎓',
      '🎨',
      '🎭',
      '🎪',
      '🎮',
      '🎲',
      '🎸',
      '🎹',
      '🎤',
      '💃',
      '🕺',
    ],
    일상: [
      '🛏️',
      '🚿',
      '🪑',
      '🪞',
      '🪟',
      '🛋️',
      '🛁',
      '🚽',
      '🧻',
      '🧽',
      '🧴',
      '🧼',
      '🪒',
      '🧹',
      '🧺',
      '🪣',
      '🪤',
      '🪡',
      '🧵',
      '🪢',
      '🧶',
      '🪨',
      '🪩',
      '🪪',
      '🛏️',
      '🚿',
      '🪑',
      '🪞',
      '🪟',
      '🛋️',
      '🛁',
      '🚽',
      '🧻',
      '🧽',
      '🧴',
      '🧼',
      '🪒',
      '🧹',
      '🧺',
      '🪣',
      '🪤',
      '🪡',
      '🧵',
      '🪢',
      '🧶',
      '🪨',
      '🪩',
      '🪪',
      '🛏️',
      '🚿',
      '🪑',
      '🪞',
      '🪟',
    ],
    감정: [
      '😀',
      '😃',
      '😄',
      '😁',
      '😆',
      '😅',
      '😂',
      '🤣',
      '😊',
      '😇',
      '🙂',
      '🙃',
      '😉',
      '😌',
      '😍',
      '🥰',
      '😘',
      '😗',
      '😙',
      '😚',
      '😋',
      '😛',
      '😝',
      '😜',
      '🤪',
      '🤨',
      '🧐',
      '🤓',
      '😎',
      '🤩',
      '🥳',
      '😏',
      '😒',
      '😞',
      '😔',
      '😟',
      '😕',
      '🙁',
      '☹️',
      '😣',
      '😖',
      '😫',
      '😩',
      '🥺',
      '😢',
      '😭',
      '😤',
      '😠',
      '😡',
      '🤬',
      '🤯',
      '😳',
    ],
    동물: [
      '🐶',
      '🐱',
      '🐭',
      '🐹',
      '🐰',
      '🦊',
      '🐻',
      '🐼',
      '🐨',
      '🐯',
      '🦁',
      '🐮',
      '🐷',
      '🐸',
      '🐵',
      '🐔',
      '🐧',
      '🐦',
      '🐤',
      '🐣',
      '🦆',
      '🦅',
      '🦉',
      '🦇',
      '🐺',
      '🐗',
      '🐴',
      '🦄',
      '🐝',
      '🐛',
      '🦋',
      '🐌',
      '🐞',
      '🐜',
      '🦟',
      '🦗',
      '🕷️',
      '🕸️',
      '🦂',
      '🐢',
      '🐍',
      '🦎',
      '🦖',
      '🦕',
      '🐙',
      '🦑',
      '🦐',
      '🦞',
      '🦀',
      '🐡',
      '🐠',
      '🐟',
    ],
    자연: [
      '🌱',
      '🌲',
      '🌳',
      '🌴',
      '🌵',
      '🌾',
      '🌿',
      '☘️',
      '🍀',
      '🍁',
      '🍂',
      '🍃',
      '🌺',
      '🌸',
      '🌼',
      '🌻',
      '🌞',
      '🌝',
      '🌛',
      '🌜',
      '🌚',
      '🌕',
      '🌖',
      '🌗',
      '🌘',
      '🌑',
      '🌒',
      '🌓',
      '🌔',
      '🌙',
      '🌎',
      '🌍',
      '🌏',
      '💫',
      '⭐',
      '🌟',
      '✨',
      '⚡',
      '☄️',
      '💥',
      '🔥',
      '🌪️',
      '🌈',
      '☀️',
      '🌤️',
      '⛅',
      '🌥️',
      '☁️',
      '🌦️',
      '🌧️',
      '⛈️',
      '🌩️',
      '🌨️',
    ],
    기타: [
      '⭐',
      '🌟',
      '✨',
      '💫',
      '🔥',
      '💥',
      '⚡',
      '🌈',
      '☀️',
      '🌙',
      '⭐',
      '🌠',
      '🎈',
      '🎉',
      '🎊',
      '🎋',
      '🎍',
      '🎎',
      '🎏',
      '🎐',
      '🎀',
      '🎁',
      '🎂',
      '🎃',
      '🎄',
      '🎅',
      '🎆',
      '🎇',
      '🧨',
      '🎈',
      '🎉',
      '🎊',
      '🎋',
      '🎍',
      '🎎',
      '🎏',
      '🎐',
      '🎀',
      '🎁',
      '🎂',
      '🎃',
      '🎄',
      '🎅',
      '🎆',
      '🎇',
      '🧨',
      '🎈',
      '🎉',
      '🎊',
      '🎋',
      '🎍',
      '🎎',
    ],
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleEmojiPress = (emoji: string) => {
    onEmojiSelect(emoji);
    onRequestClose();
  };

  return (
    <BottomSheetDialog
      visible={visible}
      onRequestClose={onRequestClose}
      dismissible={false}
    >
      {!hideTitle && <Title>이모지 선택</Title>}

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
        {emojiData[selectedCategory as keyof typeof emojiData]
          .slice(0, 24)
          .reduce((rows: any[], emoji, index) => {
            if (index % 6 === 0) rows.push([]);
            rows[rows.length - 1].push(
              <EmojiButton key={index} onPress={() => handleEmojiPress(emoji)}>
                <EmojiText>{emoji}</EmojiText>
              </EmojiButton>,
            );
            return rows;
          }, [])
          .map((row, rowIndex) => (
            <EmojiRow key={rowIndex}>{row}</EmojiRow>
          ))}
      </EmojiGrid>
    </BottomSheetDialog>
  );
};

export default EmojiPickerModal;

const Title = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray800};
  text-align: center;
  margin-bottom: 24px;
`;

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
  justify-content: space-between;
  padding-bottom: 20px;
`;

const EmojiRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 12px;
`;

const EmojiButton = styled(TouchableOpacity)`
  width: 15%;
  aspect-ratio: 1;
  background-color: ${theme.colors.gray50};
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const EmojiText = styled.Text`
  font-size: 16px;
`;
