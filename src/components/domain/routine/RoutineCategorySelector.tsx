import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface RoutineCategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const RoutineCategorySelector = ({
  selectedCategory,
  onCategoryChange,
}: RoutineCategorySelectorProps) => {
  return (
    <Container>
      <CategoryButton
        isSelected={selectedCategory === '생활'}
        onPress={() => onCategoryChange('생활')}
      >
        <CategoryText isSelected={selectedCategory === '생활'}>
          생활 루틴
        </CategoryText>
      </CategoryButton>
      <CategoryButton
        isSelected={selectedCategory === '소비'}
        onPress={() => onCategoryChange('소비')}
      >
        <CategoryText isSelected={selectedCategory === '소비'}>
          소비 루틴
        </CategoryText>
      </CategoryButton>
    </Container>
  );
};

export default RoutineCategorySelector;

const Container = styled.View`
  flex-direction: row;
  background-color: ${theme.colors.gray100};
  border-radius: 8px;
  padding: 4px;
`;

const CategoryButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border-radius: 6px;
  background-color: ${({ isSelected }) =>
    isSelected ? theme.colors.white : 'transparent'};
  align-items: center;
`;

const CategoryText = styled.Text<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.gray600};
`;
