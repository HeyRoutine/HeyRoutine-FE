import React, { useRef } from 'react';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

interface OtpInputProps {
  code: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  autoFocus?: boolean;
}

const OtpInput = ({
  code,
  onChangeText,
  maxLength = 4,
  autoFocus = true,
}: OtpInputProps) => {
  const inputRef = useRef<TextInput>(null);

  const handleCodeChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, ''); // 숫자만 허용
    onChangeText(numericText);
  };

  return (
    <OtpInputContainer>
      {Array.from({ length: maxLength }).map((_, index) => (
        <OtpBox key={index} isFocused={index === code.length}>
          <OtpText>{code[index] || ''}</OtpText>
        </OtpBox>
      ))}
      <HiddenTextInput
        ref={inputRef}
        value={code}
        onChangeText={handleCodeChange}
        maxLength={maxLength}
        keyboardType="number-pad"
        autoFocus={autoFocus}
      />
    </OtpInputContainer>
  );
};

export default OtpInput;

const OtpInputContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const OtpBox = styled.View<{ isFocused: boolean }>`
  width: 60px;
  height: 50px;
  border-bottom-width: 2px;
  border-color: ${(props) =>
    props.isFocused ? theme.colors.primary : theme.colors.gray300};
  justify-content: center;
  align-items: center;
`;

const OtpText = styled.Text`
  font-size: ${theme.fonts.title}px;
  font-family: ${theme.fonts.Medium};
`;

const HiddenTextInput = styled.TextInput`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
`;
