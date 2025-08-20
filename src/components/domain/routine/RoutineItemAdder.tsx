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
      <AddText>루틴 추가</AddText>
    </Container>
  );
};

export default RoutineItemAdder;

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: ${theme.colors.gray50};
  border-radius: 8px;
  border: 1px dashed ${theme.colors.gray300};
`;

const PlusIcon = styled.Text`
  font-size: 16px;
  color: ${theme.colors.gray500};
  margin-right: 8px;
`;

const AddText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray600};
`;
