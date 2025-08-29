import React, { useState, useRef, useEffect } from 'react';
import { Modal, Dimensions, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';
import {
  useGroupGuestbooks,
  useCreateGroupGuestbook,
} from '../../../hooks/routine/group/useGroupRoutines';

interface GuestbookModalProps {
  isVisible: boolean;
  onClose: () => void;
  groupRoutineListId: string;
}

const { height: screenHeight } = Dimensions.get('window');

const GuestbookModal = ({
  isVisible,
  onClose,
  groupRoutineListId,
}: GuestbookModalProps) => {
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const { data: guestbookData, isLoading } = useGroupGuestbooks(
    groupRoutineListId,
    {},
    isVisible,
  );
  const { mutate: createGuestbook, isPending: isCreating } =
    useCreateGroupGuestbook();

  // 초기 로딩 시 맨 아래로 스크롤
  useEffect(() => {
    if (guestbookData?.result?.items && guestbookData.result.items.length > 0) {
      // 더 긴 지연시간으로 FlatList가 완전히 렌더링된 후 스크롤
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 300);
    }
  }, [guestbookData]);

  // 모달이 열릴 때마다 맨 아래로 스크롤
  useEffect(() => {
    if (
      isVisible &&
      guestbookData?.result?.items &&
      guestbookData.result.items.length > 0
    ) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 500);
    }
  }, [isVisible, guestbookData]);

  const handleSend = () => {
    if (message.trim()) {
      createGuestbook(
        {
          groupRoutineListId,
          data: { content: message.trim() },
        },
        {
          onSuccess: () => {
            setMessage('');
            console.log('🔍 방명록 작성 성공');
            // 새 댓글 작성 후 맨 아래로 스크롤
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
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

    if (diffInMs < 0) return '방금 전';

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    return `${diffInDays}일 전`;
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ModalOverlay>
        <ModalContainer>
          {/* 헤더 */}
          <HeaderContainer>
            <HeaderTitle>방명록</HeaderTitle>
            <CloseButton onPress={onClose}>
              <MaterialIcons
                name="close"
                size={24}
                color={theme.colors.gray600}
              />
            </CloseButton>
          </HeaderContainer>

          {/* 스크롤 영역 */}
          <ScrollContainer>
            {isLoading ? (
              <LoadingContainer>
                <LoadingText>로딩 중...</LoadingText>
              </LoadingContainer>
            ) : guestbookData?.result?.items &&
              guestbookData.result.items.length > 0 ? (
              <FlatList
                ref={flatListRef}
                data={guestbookData.result.items}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                renderItem={({ item }) => {
                  return (
                    <GuestbookItemContainer>
                      <ProfileImage
                        source={
                          item.profileImageUrl
                            ? { uri: item.profileImageUrl }
                            : require('../../../assets/images/default_profile.png')
                        }
                        defaultSource={require('../../../assets/images/default_profile.png')}
                      />
                      <UserInfoContainer>
                        <UserNameTimeContainer>
                          <UserNameText>{item.nickname}</UserNameText>
                          <TimeText>{formatTimeAgo(item.createdAt)}</TimeText>
                        </UserNameTimeContainer>
                        <MessageText numberOfLines={1} ellipsizeMode="tail">
                          {item.content}
                        </MessageText>
                      </UserInfoContainer>
                    </GuestbookItemContainer>
                  );
                }}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={true}
                onLayout={() => {
                  // 레이아웃이 완료되면 맨 아래로 스크롤
                  if (
                    guestbookData?.result?.items &&
                    guestbookData.result.items.length > 0
                  ) {
                    setTimeout(() => {
                      flatListRef.current?.scrollToEnd({ animated: false });
                    }, 100);
                  }
                }}
              />
            ) : (
              <EmptyContainer>
                <EmptyText>아직 방명록이 없어요.</EmptyText>
              </EmptyContainer>
            )}
          </ScrollContainer>

          {/* 입력 영역 */}
          <InputContainer>
            <InputWrapper>
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
                  color={theme.colors.primary}
                />
              </SendButton>
            </InputWrapper>
          </InputContainer>
        </ModalContainer>
      </ModalOverlay>
    </Modal>
  );
};

export default GuestbookModal;

// 스타일 컴포넌트
const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const ModalContainer = styled.View`
  background-color: ${theme.colors.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  height: ${screenHeight * 0.8}px;
  width: 100%;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.gray100};
  position: relative;
`;

const HeaderTitle = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 18px;
  color: ${theme.colors.gray800};
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  padding: 4px;
`;

const ScrollContainer = styled.View`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
`;

const GuestbookItemContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  height: 60px;
  flex-direction: row;
  align-items: center;
`;

const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const ProfileImage = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  margin-right: 12px;
`;

const UserInfoContainer = styled.View`
  flex: 1;
`;

const UserNameTimeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const UserNameText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray800};
`;

const TimeText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray500};
`;

const MessageContainer = styled.View`
  flex: 1;
  margin-left: 0;
`;

const MessageText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 13px;
  color: ${theme.colors.gray800};
  line-height: 16px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const EmptyText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
`;

const InputContainer = styled.View`
  padding: 16px;
  background-color: ${theme.colors.white};
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: flex-end;
  background-color: ${theme.colors.gray50};
  border-radius: 24px;
  padding: 8px 12px;
`;

const MessageInput = styled.TextInput`
  flex: 1;
  min-height: 36px;
  max-height: 80px;
  padding: 8px 0;
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray800};
  /* text-align-vertical: top; */
`;

const SendButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${theme.colors.white};
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`;
