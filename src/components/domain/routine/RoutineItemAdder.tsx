import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';

interface RoutineItemAdderProps {
  onPlusPress: () => void;
  onClockPress: () => void;
  onTextChange?: (text: string) => void;
  onBlur?: () => void;
  onTextPress?: () => void;
  placeholder?: string;
  selectedTime?: string;
  selectedEmoji?: string;
  currentText?: string;
  isCompleted?: boolean;
}

const RoutineItemAdder = ({
  onPlusPress,
  onClockPress,
  onTextChange,
  onBlur,
  onTextPress,
  placeholder = '루틴을 추가해주세요',
  selectedTime,
  selectedEmoji,
  currentText,
  isCompleted = false,
}: RoutineItemAdderProps) => {
  const [text, setText] = useState(currentText || '');

  const handleTextChange = (newText: string) => {
    setText(newText);
    onTextChange?.(newText);
  };

  useEffect(() => {
    setText(currentText || '');
  }, [currentText]);

  return (
    <Container>
      <PlusSection onPress={onPlusPress}>
        {isCompleted ? (
          <Ionicons name="checkmark" size={24} color={theme.colors.primary} />
        ) : selectedEmoji ? (
          <EmojiText>{selectedEmoji}</EmojiText>
        ) : (
          <Ionicons name="add" size={28} color={theme.colors.gray400} />
        )}
      </PlusSection>
      {isCompleted ? (
        <TextSectionCompleted onPress={onTextPress}>
          <CompletedText>{text}</CompletedText>
        </TextSectionCompleted>
      ) : (
        <TextSection onPress={onTextPress}>
          <TextInput
            value={text}
            onChangeText={handleTextChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.gray400}
            style={{
              fontFamily: theme.fonts.Medium,
              fontSize: 13,
              color: theme.colors.gray800,
              width: '100%',
              height: '100%',
            }}
            editable={true}
          />
        </TextSection>
      )}
      <TimeSection onPress={onClockPress}>
        {selectedTime ? (
          <TimeText>{selectedTime}</TimeText>
        ) : (
          <Ionicons
            name="time-outline"
            size={28}
            color={theme.colors.gray400}
          />
        )}
      </TimeSection>
    </Container>
  );
};

export default RoutineItemAdder;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const PlusSection = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray200};
`;

const TextSection = styled.TouchableOpacity`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  height: 48px;
  padding: 0 12px;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray200};
`;

const TextSectionCompleted = styled.TouchableOpacity`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  height: 48px;
  padding: 0 12px;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray200};
`;

const CompletedText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 13px;
  color: ${theme.colors.gray800};
  text-decoration-line: line-through;
`;

const TimeSection = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray200};
`;

const TimeText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  color: ${theme.colors.gray400};
  text-align: center;
`;

const EmojiText = styled.Text`
  font-size: 24px;
  text-align: center;
  line-height: 28px;
`;
