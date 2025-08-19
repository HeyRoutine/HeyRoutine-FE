import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface IGroupRoutineCardProps {
  onPress: () => void;
}

const GroupRoutineCard = ({ onPress }: IGroupRoutineCardProps) => {
  return (
    <Container onPress={onPress}>
      <Title>함께 도전할</Title>
      <Subtitle>루틴 그룹</Subtitle>
    </Container>
  );
};

export default GroupRoutineCard;

const Container = styled.TouchableOpacity`
  background-color: #e9f0ff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 8px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.white};
  margin-bottom: 4px;
`;

const Subtitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.white};
`;
