import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, Image } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

interface RoutineItemAdderProps {
  onPlusPress: () => void;
  onClockPress: () => void;
  onTextChange?: (text: string) => void;
  onBlur?: () => void;
  onTextPress?: () => void;
  onDelete?: () => void; // 삭제 함수 추가
  placeholder?: string;
  selectedTime?: string;
  selectedEmoji?: string;
  currentText?: string;
  completed?: boolean;
  editable?: boolean;
  showDeleteButton?: boolean; // 삭제 버튼 표시 여부
}

const RoutineItemAdder = ({
  onPlusPress,
  onClockPress,
  onTextChange,
  onBlur,
  onTextPress,
  onDelete,
  placeholder = '루틴을 추가해주세요',
  selectedTime,
  selectedEmoji,
  currentText,
  completed = false,
  editable = true,
  showDeleteButton = false,
}: RoutineItemAdderProps) => {
  const [text, setText] = useState(currentText || '');
  const swipeableRef = useRef<Swipeable>(null);

  const handleTextChange = (newText: string) => {
    setText(newText);
    onTextChange?.(newText);
  };

  useEffect(() => {
    setText(currentText || '');
  }, [currentText]);

  // 디버깅용 로그
  useEffect(() => {
    console.log('🔍 RoutineItemAdder - completed:', completed);
    console.log('🔍 RoutineItemAdder - text:', text);
    console.log('🔍 RoutineItemAdder - selectedTime:', selectedTime);
  }, [completed, text, selectedTime]);

  // 삭제 액션 렌더링
  const renderRightActions = () => {
    if (!showDeleteButton || !onDelete) return null;

    return (
      <DeleteAction onPress={onDelete}>
        <Ionicons name="trash-outline" size={24} color={theme.colors.white} />
      </DeleteAction>
    );
  };

  const RoutineContent = () => (
    <Container>
      <PlusSection onPress={onPlusPress}>
        {completed ? (
          <Ionicons name="checkmark" size={24} color={theme.colors.primary} />
        ) : selectedEmoji ? (
          // 이모지가 URL인지 텍스트 이모지인지 판단
          selectedEmoji.startsWith('http') ? (
            <EmojiImage
              source={{ uri: selectedEmoji }}
              resizeMode="contain"
              defaultSource={require('../../../assets/images/robot.png')}
              onError={() =>
                console.log('이모지 이미지 로드 실패:', selectedEmoji)
              }
            />
          ) : (
            <EmojiText>{selectedEmoji}</EmojiText>
          )
        ) : (
          <Ionicons name="add" size={28} color={theme.colors.gray400} />
        )}
      </PlusSection>
      {completed ? (
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
            editable={editable}
          />
        </TextSection>
      )}
      <TimeSection onPress={onClockPress}>
        {selectedTime ? (
          completed ? (
            <CompletedTimeText>{selectedTime}</CompletedTimeText>
          ) : (
            <TimeText>{selectedTime}</TimeText>
          )
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

  // 삭제 버튼이 표시되어야 하는 경우에만 Swipeable 사용
  if (showDeleteButton && onDelete) {
    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        rightThreshold={40}
      >
        <RoutineContent />
      </Swipeable>
    );
  }

  return <RoutineContent />;
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

const CompletedTimeText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  color: ${theme.colors.gray400};
  text-align: center;
  text-decoration-line: line-through;
`;

const EmojiText = styled.Text`
  font-size: 24px;
  text-align: center;
  line-height: 28px;
`;

const EmojiImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const DeleteAction = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  background-color: ${theme.colors.error};
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin-left: 8px;
`;
