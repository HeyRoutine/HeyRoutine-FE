import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface RoutineItemAdderProps {
  onPress: () => void;
}

const RoutineItemAdder = ({ onPress }: RoutineItemAdderProps) => {
  return (
    <Container onPress={onPress}>
      <PlusIcon>+</PlusIcon>
      <AddText>루틴을 추가해주세요.</AddText>
      <ClockIcon>⏰</ClockIcon>
    </Container>
  );
};

export default RoutineItemAdder;

const Container = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const PlusIcon = styled.Text`
  font-size: 20px;
  color: ${theme.colors.gray500};
`;

const AddText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray500};
  flex: 1;
  text-align: center;
`;

const ClockIcon = styled.Text`
  font-size: 20px;
  color: ${theme.colors.gray500};
`;
