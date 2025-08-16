import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

/**
 * CustomButton의 props 인터페이스
 */
interface ICustomButtonProps {
  /** 버튼 텍스트 */
  text: string;
  /** 클릭 핸들러 */
  onPress: () => void;
  /** 비활성화 여부 */
  disabled?: boolean;
}

/**
 * 공통 커스텀 버튼 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 커스텀 버튼 컴포넌트
 */
const CustomButton = ({
  text,
  onPress,
  disabled = false,
}: ICustomButtonProps) => {
  return (
    <Container onPress={onPress} disabled={disabled}>
      <ButtonText active={!disabled}>{text}</ButtonText>
    </Container>
  );
};

export default CustomButton;

// 스타일 컴포넌트 정의
const Container = styled.TouchableOpacity`
  width: 100%;
  padding: 18px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;

  background-color: ${(props: { disabled: boolean }) =>
    props.disabled ? theme.colors.gray200 : theme.colors.primary};
`;

const ButtonText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;

  color: ${(props: { disabled: boolean }) =>
    props.disabled ? theme.colors.gray500 : theme.colors.white};
`;
