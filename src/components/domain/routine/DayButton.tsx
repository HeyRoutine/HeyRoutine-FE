import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text } from 'react-native';
import { theme } from '../../../styles/theme';

interface DayButtonProps {
  day: string;
  isSelected: boolean;
  onPress: () => void;
}

const DayButton = ({ day, isSelected, onPress }: DayButtonProps) => {
  return (
    <Button onPress={onPress} isSelected={isSelected}>
      <ButtonText isSelected={isSelected}>{day}</ButtonText>
    </Button>
  );
};

export default DayButton;

const Button = styled(TouchableOpacity)<{ isSelected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.gray100};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const ButtonText = styled(Text)<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.gray600};
`;
