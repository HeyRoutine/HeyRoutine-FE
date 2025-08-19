import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

type ButtonType = 'edit' | 'delete' | 'ai';

interface ActionButtonProps {
  type: ButtonType;
  text: string;
  onPress: () => void;
  disabled?: boolean;
}

const ActionButton = ({
  type,
  text,
  onPress,
  disabled = false,
}: ActionButtonProps) => {
  const getButtonStyle = () => {
    switch (type) {
      case 'edit':
        return {
          backgroundColor: theme.colors.white,
          borderColor: theme.colors.gray200,
          textColor: theme.colors.gray700,
        };
      case 'delete':
        return {
          backgroundColor: theme.colors.white,
          borderColor: theme.colors.error,
          textColor: theme.colors.error,
        };
      case 'ai':
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
          textColor: theme.colors.white,
        };
      default:
        return {
          backgroundColor: theme.colors.white,
          borderColor: theme.colors.gray200,
          textColor: theme.colors.gray700,
        };
    }
  };

  const style = getButtonStyle();

  return (
    <Button
      style={{
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <ButtonText style={{ color: style.textColor }}>{text}</ButtonText>
    </Button>
  );
};

export default ActionButton;

const Button = styled.TouchableOpacity`
  border-width: 1px;
  border-radius: 8px;
  padding: 16px;
  align-items: center;
  margin-bottom: 8px;
`;

const ButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
`;
