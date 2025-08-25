import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';
import BottomSheetDialog from '../../common/BottomSheetDialog';

interface DeleteRoutineModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  routineName?: string;
  isDeleting?: boolean;
}

const DeleteRoutineModal = ({
  visible,
  onRequestClose,
  onConfirm,
  routineName = '루틴',
  isDeleting = false,
}: DeleteRoutineModalProps) => {
  return (
    <BottomSheetDialog visible={visible} onRequestClose={onRequestClose}>
      <ModalTitle>루틴 삭제</ModalTitle>
      <ModalSubtitle>"{routineName}" 루틴을 삭제하시겠습니까?</ModalSubtitle>
      <ModalDescription>삭제된 루틴은 복구할 수 없습니다.</ModalDescription>
      <ButtonRow>
        <ButtonWrapper>
          <CancelButton onPress={onRequestClose} disabled={isDeleting}>
            <CancelText isDisabled={isDeleting}>취소</CancelText>
          </CancelButton>
        </ButtonWrapper>
        <ButtonWrapper>
          <DeleteButton onPress={onConfirm} disabled={isDeleting}>
            <DeleteText isDisabled={isDeleting}>
              {isDeleting ? '삭제 중...' : '삭제'}
            </DeleteText>
          </DeleteButton>
        </ButtonWrapper>
      </ButtonRow>
    </BottomSheetDialog>
  );
};

export default DeleteRoutineModal;

const ModalTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 18px;
  color: ${theme.colors.gray900};
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ModalSubtitle = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray800};
  text-align: center;
  margin-bottom: 8px;
`;

const ModalDescription = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  margin-bottom: 36px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;

const CancelButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) =>
    disabled ? theme.colors.gray200 : theme.colors.gray100};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const CancelText = styled.Text<{ isDisabled?: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${({ isDisabled }) =>
    isDisabled ? theme.colors.gray400 : theme.colors.gray700};
`;

const DeleteButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) =>
    disabled ? theme.colors.gray300 : theme.colors.error};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const DeleteText = styled.Text<{ isDisabled?: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${({ isDisabled }) =>
    isDisabled ? theme.colors.gray500 : theme.colors.white};
`;
