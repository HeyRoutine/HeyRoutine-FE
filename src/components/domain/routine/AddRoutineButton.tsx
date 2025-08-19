import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface AddRoutineButtonProps {
  onPress: () => void;
}

const AddRoutineButton = ({ onPress }: AddRoutineButtonProps) => {
  return (
    <Container onPress={onPress}>
      <PlusIcon>+</PlusIcon>
    </Container>
  );
};

export default AddRoutineButton;

const Container = styled.TouchableOpacity`
  position: absolute;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${theme.colors.primary};
  align-items: center;
  justify-content: center;
  elevation: 8;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
`;

const PlusIcon = styled.Text`
  font-size: 24px;
  color: ${theme.colors.white};
  font-weight: bold;
`;
