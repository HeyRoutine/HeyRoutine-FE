import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';

interface RoutineItemAdderProps {
  onPlusPress: () => void;
  onClockPress: () => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  selectedTime?: string;
  selectedEmoji?: string;
  currentText?: string;
}

const RoutineItemAdder = ({
  onPlusPress,
  onClockPress,
  onTextChange,
  placeholder = '루틴을 추가해주세요',
  selectedTime,
  selectedEmoji,
  currentText,
}: RoutineItemAdderProps) => {
  const [text, setText] = useState(currentText || '');

  // 디버깅용 로그
  console.log('RoutineItemAdder selectedTime:', selectedTime);
  console.log('RoutineItemAdder selectedEmoji:', selectedEmoji);
  console.log('RoutineItemAdder currentText:', currentText);

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
        {selectedEmoji ? (
          <EmojiText>{selectedEmoji}</EmojiText>
        ) : (
          <Ionicons name="add" size={28} color={theme.colors.gray400} />
        )}
      </PlusSection>
      <TextSection>
        <TextInput
          value={text}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray400}
          style={{
            fontFamily: theme.fonts.Medium,
            fontSize: 13,
            color: theme.colors.gray800,
            width: '100%',
            height: '100%',
          }}
        />
      </TextSection>
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

const TextSection = styled.View`
  flex: 2;
  align-items: flex-start;
  justify-content: center;
  height: 48px;
  padding: 0 12px;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray200};
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
