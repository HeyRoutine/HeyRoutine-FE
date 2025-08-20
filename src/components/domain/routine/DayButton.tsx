import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text } from 'react-native';
import { theme } from '../../../styles/theme';

interface DayButtonProps {
  day: string;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const DayButton = ({
  day,
  isSelected,
  onPress,
  disabled = false,
}: DayButtonProps) => {
  return (
    <Button
      onPress={disabled ? undefined : onPress}
      isSelected={isSelected}
      disabled={disabled}
    >
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
  margin-right: 10px;
`;

const ButtonText = styled(Text)<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.gray600};
`;
