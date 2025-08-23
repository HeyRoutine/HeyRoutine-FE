import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

interface YesNoButtonProps {
  type: 'yes' | 'no';
  onPress: () => void;
  isSelected?: boolean;
}

const YesNoButton = ({
  type,
  onPress,
  isSelected = false,
}: YesNoButtonProps) => {
  return (
    <ButtonContainer onPress={onPress} isSelected={isSelected}>
      <IconText type={type}>{type === 'yes' ? 'O' : 'X'}</IconText>
      <ButtonText type={type} isSelected={isSelected}>
        {type === 'yes' ? '좋아요' : '괜찮아요'}
      </ButtonText>
    </ButtonContainer>
  );
};

export default YesNoButton;

const ButtonContainer = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex: 1;
  aspect-ratio: 1.2;
  background-color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.white};
  border-radius: 16px;
  padding: 24px;
  justify-content: center;
  align-items: center;
  margin: 0 8px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  border: 2px solid
    ${({ isSelected }) => (isSelected ? theme.colors.primary : 'transparent')};
`;

const IconText = styled.Text<{ type: 'yes' | 'no' }>`
  font-size: 48px;
  font-weight: bold;
  color: ${({ type }) => (type === 'yes' ? '#007AFF' : theme.colors.error)};
  margin-bottom: 16px;
`;

const ButtonText = styled.Text<{ type: 'yes' | 'no'; isSelected: boolean }>`
  font-family: ${theme.fonts.SemiBold};
  font-size: 24px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.gray700};
  text-align: center;
`;
