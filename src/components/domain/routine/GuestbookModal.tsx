import React, { useState, useRef } from 'react';
import { ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';
import BottomSheetDialog from '../../common/BottomSheetDialog';
import {
  useGroupGuestbooks,
  useCreateGroupGuestbook,
  useDeleteGroupGuestbook,
} from '../../../hooks/routine/group/useGroupRoutines';

interface GuestbookModalProps {
  isVisible: boolean;
  onClose: () => void;
  groupRoutineListId: string;
}

const GuestbookModal = ({
  isVisible,
  onClose,
  groupRoutineListId,
}: GuestbookModalProps) => {
  const [message, setMessage] = useState('');

  // 방명록 조회
  const { data: guestbookData, isLoading } =
    useGroupGuestbooks(groupRoutineListId);

  // 방명록 작성
  const { mutate: createGuestbook, isPending: isCreating } =
    useCreateGroupGuestbook();

  // 방명록 삭제
  const { mutate: deleteGuestbook, isPending: isDeleting } =
    useDeleteGroupGuestbook();

  const handleSend = () => {
    if (message.trim()) {
      createGuestbook(
        {
          groupRoutineListId,
          data: { content: message.trim() },
        },
        {
          onSuccess: (newGuestbook) => {
            setMessage('');
            console.log('🔍 방명록 작성 성공:', newGuestbook);
          },
          onError: (error) => {
            console.error('🔍 방명록 작성 실패:', error);
          },
        },
      );
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMs = now.getTime() - messageTime.getTime();

    // 미래 시간이거나 잘못된 시간인 경우
    if (diffInMs < 0) {
      return '방금 전';
    }

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return '방금 전';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      return `${diffInDays}일 전`;
    }
  };

  const renderRightActions = (guestbookId: number) => {
    return (
      <DeleteActionContainer>
        <DeleteActionButton onPress={() => handleDelete(guestbookId)}>
          <MaterialIcons name="delete" size={24} color={theme.colors.white} />
        </DeleteActionButton>
      </DeleteActionContainer>
    );
  };

  const handleDelete = (guestbookId: number) => {
    // 바로 삭제 실행
    deleteGuestbook(
      {
        groupRoutineListId,
        guestbookId: guestbookId.toString(),
      },
      {
        onSuccess: () => {
          console.log('🔍 방명록 삭제 성공');
        },
        onError: (error) => {
          console.error('🔍 방명록 삭제 실패:', error);
        },
      },
    );
  };

  return (
    <BottomSheetDialog
      visible={isVisible}
      onRequestClose={onClose}
      dismissible={false}
      showHandle={true}
    >
      <GuestbookContainer>
        <Container>
          {/* Header */}
          <Header>
            <Title>단체 루틴 방명록</Title>
            <CloseButton onPress={onClose}>
              <MaterialIcons
                name="close"
                size={24}
                color={theme.colors.gray600}
              />
            </CloseButton>
          </Header>

          {/* Guestbook List */}
          <ScrollView
            style={{ flex: 1, maxHeight: '70%' }}
            showsVerticalScrollIndicator={false}
          >
            {isLoading ? (
              <LoadingText>방명록을 불러오는 중...</LoadingText>
            ) : guestbookData?.result?.items &&
              guestbookData.result.items.length > 0 ? (
              <GuestbookList>
                {guestbookData.result.items
                  .slice()
                  .reverse()
                  .map((item) => (
                    <Swipeable
                      key={item.id}
                      renderRightActions={
                        item.isWriter
                          ? () => renderRightActions(item.id)
                          : undefined
                      }
                      rightThreshold={40}
                      enabled={item.isWriter}
                    >
                      <GuestbookItem>
                        <ProfileSection>
                          <ProfileImage
                            source={
                              item.profileImageUrl
                                ? { uri: item.profileImageUrl }
                                : require('../../../assets/images/default_profile.png')
                            }
                            defaultSource={require('../../../assets/images/default_profile.png')}
                          />
                          <UserInfo>
                            <UserName>{item.nickname}</UserName>
                            <TimeText>{formatTimeAgo(item.createdAt)}</TimeText>
                          </UserInfo>
                        </ProfileSection>
                        <MessageText>{item.content}</MessageText>
                      </GuestbookItem>
                    </Swipeable>
                  ))}
              </GuestbookList>
            ) : (
              <EmptyText>아직 방명록이 없어요.</EmptyText>
            )}
          </ScrollView>

          {/* Input Section */}
          <InputSection>
            <InputContainer>
              <MessageInput
                placeholder="팀원들에게 응원을 해봐요."
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={200}
                placeholderTextColor={theme.colors.gray400}
              />
              <SendButton
                onPress={handleSend}
                disabled={!message.trim() || isCreating}
              >
                <MaterialIcons
                  name="send"
                  size={20}
                  color={
                    message.trim() && !isCreating
                      ? theme.colors.primary
                      : theme.colors.gray400
                  }
                />
              </SendButton>
            </InputContainer>
          </InputSection>
        </Container>
      </GuestbookContainer>
    </BottomSheetDialog>
  );
};

export default GuestbookModal;

const GuestbookContainer = styled.View`
  height: 50%;
  width: 100%;
`;

const Container = styled.View`
  background-color: ${theme.colors.white};
  flex: 1;
  flex-direction: column;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px 16px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.gray100};
  position: relative;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 18px;
  color: ${theme.colors.gray900};
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 16px;
  top: 20px;
  padding: 4px;
`;

const GuestbookList = styled.View`
  padding: 16px;
  gap: 16px;
`;

const GuestbookItem = styled.View`
  gap: 8px;
`;

const ProfileSection = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const ProfileImage = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const UserName = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 13px;
  color: ${theme.colors.gray600};
`;

const TimeText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray400};
`;

const MessageText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 15px;
  color: ${theme.colors.gray800};
  line-height: 22px;
  margin-left: 56px;
`;

const InputSection = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.gray100};
  background-color: ${theme.colors.white};
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: ${theme.colors.gray50};
  border-radius: 20px;
  padding: 8px 12px;
`;

const MessageInput = styled.TextInput`
  flex: 1;
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray900};
  max-height: 80px;
  padding: 0;
  text-align-vertical: center;
`;

const SendButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${theme.colors.white};
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  padding: 40px 16px;
`;

const EmptyText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  padding: 40px 16px;
`;

const DeleteButton = styled.TouchableOpacity`
  margin-left: auto;
  padding: 4px;
`;

const DeleteActionContainer = styled.View`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.error};
  border-radius: 8px;
  margin-left: 10px;
`;

const DeleteActionButton = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
