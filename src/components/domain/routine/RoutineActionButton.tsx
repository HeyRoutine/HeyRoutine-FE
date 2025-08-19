import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

type ActionType = 'pause' | 'complete' | 'next';

interface RoutineActionButtonProps {
  type: ActionType;
  onPress: () => void;
  disabled?: boolean;
}

const RoutineActionButton = ({
  type,
  onPress,
  disabled = false,
}: RoutineActionButtonProps) => {
  const getIcon = () => {
    switch (type) {
      case 'pause':
        return '⏸';
      case 'complete':
        return '✓';
      case 'next':
        return '▶';
      default:
        return '';
    }
  };

  const isPrimary = type === 'complete';

  return (
    <Button
      type={type}
      onPress={onPress}
      disabled={disabled}
      isPrimary={isPrimary}
    >
      <IconText isPrimary={isPrimary}>{getIcon()}</IconText>
    </Button>
  );
};

export default RoutineActionButton;

const Button = styled.TouchableOpacity<{
  type: ActionType;
  isPrimary: boolean;
}>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ isPrimary, disabled }) => {
    if (disabled) return theme.colors.gray300;
    return isPrimary ? theme.colors.primary : theme.colors.gray200;
  }};
  align-items: center;
  justify-content: center;
`;

const IconText = styled.Text<{ isPrimary: boolean }>`
  font-size: 20px;
  color: ${({ isPrimary }) =>
    isPrimary ? theme.colors.white : theme.colors.gray700};
`;
