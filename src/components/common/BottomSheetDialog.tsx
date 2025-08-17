import React from 'react';
import styled from 'styled-components/native';
import { Modal, Dimensions } from 'react-native';
import { theme } from '../../styles/theme';

interface BottomSheetDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  primaryText: string;
  onPrimary: () => void;
  secondaryText?: string;
  onSecondary?: () => void;
  onRequestClose?: () => void;
  /** 화면 높이 대비 시트 최소 높이 비율 (예: 0.45 => 화면의 45%) */
  heightRatio?: number;
}

const BottomSheetDialog: React.FC<BottomSheetDialogProps> = ({
  visible,
  title,
  message,
  primaryText,
  onPrimary,
  secondaryText,
  onSecondary,
  onRequestClose,
  heightRatio = 0.40, // 기본값: 화면의 40%
}) => {
  const hasSecondary = Boolean(secondaryText && onSecondary);
  const screenHeight = Dimensions.get('window').height;
  const minHeight = Math.max(240, Math.round(screenHeight * heightRatio));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <ModalBackdrop>
        <BottomSheet minHeight={minHeight}>
          <SheetHandle />

          {/* 가운데 영역 (버튼 제외 공간의 중앙 정렬) */}
          <ContentCenter>
            <SheetTitle>{title}</SheetTitle>
            {!!message && <SheetMessage>{message}</SheetMessage>}
          </ContentCenter>

          {/* 하단 버튼 영역 */}
          {hasSecondary ? (
            <ButtonsRow>
              <SheetButton variant="ghost" onPress={onSecondary!}>
                <SheetButtonText variant="ghost">{secondaryText}</SheetButtonText>
              </SheetButton>
              <SheetButton variant="primary" onPress={onPrimary}>
                <SheetButtonText variant="primary">{primaryText}</SheetButtonText>
              </SheetButton>
            </ButtonsRow>
          ) : (
            <ButtonsRow>
              <SheetButton variant="primary" onPress={onPrimary}>
                <SheetButtonText variant="primary">{primaryText}</SheetButtonText>
              </SheetButton>
            </ButtonsRow>
          )}
        </BottomSheet>
      </ModalBackdrop>
    </Modal>
  );
};

export default BottomSheetDialog;

// styles
const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.35);
  justify-content: flex-end;
`;

const BottomSheet = styled.View<{ minHeight: number }>`
  background-color: ${theme.colors.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px 20px 24px 20px;
  min-height: ${(p) => p.minHeight}px;
`;

const SheetHandle = styled.View`
  align-self: center;
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background-color: ${theme.colors.gray300};
  margin-bottom: 14px;
`;

const ContentCenter = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 8px 4px 16px 4px;
`;

const SheetTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 24px;
  color: ${theme.colors.gray900};
  text-align: center;
  margin-bottom: 8px;
`;

const SheetMessage = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

type ButtonVariant = 'primary' | 'ghost';

const SheetButton = styled.TouchableOpacity<{ variant: ButtonVariant }>`
  flex: 1;
  padding: 16px 12px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) =>
    p.variant === 'primary' ? theme.colors.primary : theme.colors.gray200};
`;

const SheetButtonText = styled.Text<{ variant: ButtonVariant }>`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${(p) => (p.variant === 'primary' ? theme.colors.white : theme.colors.gray600)};
`;
