import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../styles/theme';

interface RoutineSuggestionItemProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}

const RoutineSuggestionItem: React.FC<RoutineSuggestionItemProps> = ({
  icon,
  title,
  description,
  onPress,
}) => {
  return (
    <Container onPress={onPress}>
      <IconContainer>
        <IconText>{icon}</IconText>
      </IconContainer>

      <ContentContainer>
        <TitleText>{title}</TitleText>
        <DescriptionText>{description}</DescriptionText>
      </ContentContainer>

      <AddButton>
        <Ionicons name="add" size={24} color={theme.colors.gray400} />
      </AddButton>
    </Container>
  );
};

export default RoutineSuggestionItem;

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.white};
  padding: 16px;
  margin-bottom: 8px;
`;

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${theme.colors.gray100};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const IconText = styled.Text`
  font-size: 20px;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

const TitleText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 4px;
`;

const DescriptionText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 13px;
  color: ${theme.colors.gray400};
  line-height: 18px;
`;

const AddButton = styled.View`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;
