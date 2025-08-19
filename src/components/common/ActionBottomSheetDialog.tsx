import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

interface ActionBottomSheetDialogProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ActionBottomSheetDialog = ({
  visible,
  onClose,
  onEdit,
  onDelete,
}: ActionBottomSheetDialogProps) => {
  if (!visible) return null;

  return (
    <Overlay onPress={onClose}>
      <Container>
        <Handle />
        <EditButton onPress={onEdit}>
          <EditText>수정하기</EditText>
        </EditButton>
        <DeleteButton onPress={onDelete}>
          <DeleteText>삭제</DeleteText>
        </DeleteButton>
      </Container>
    </Overlay>
  );
};

export default ActionBottomSheetDialog;

const Overlay = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const Container = styled.View`
  background-color: ${theme.colors.white};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 16px;
  padding-bottom: 32px;
`;

const Handle = styled.View`
  width: 40px;
  height: 4px;
  background-color: ${theme.colors.gray300};
  border-radius: 2px;
  align-self: center;
  margin-bottom: 16px;
`;

const EditButton = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray200};
  border-radius: 8px;
  padding: 16px;
  align-items: center;
  margin-bottom: 8px;
`;

const EditText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray700};
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.error};
  border-radius: 8px;
  padding: 16px;
  align-items: center;
`; 

const DeleteText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.error};
`;
