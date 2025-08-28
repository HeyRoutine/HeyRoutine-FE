import React, { useState, useRef, useEffect } from 'react';
import { Modal, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Swipeable, ScrollView } from 'react-native-gesture-handler';

import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';
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

const { height: screenHeight } = Dimensions.get('window');

const GuestbookModal = ({
  isVisible,
  onClose,
  groupRoutineListId,
}: GuestbookModalProps) => {
  const [message, setMessage] = useState('');
  const swipeableRefs = useRef<{ [key: number]: Swipeable | null }>({});
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: guestbookData, isLoading } = useGroupGuestbooks(
    groupRoutineListId,
    {},
    isVisible,
  );
  const { mutate: createGuestbook, isPending: isCreating } =
    useCreateGroupGuestbook();
  const { mutate: deleteGuestbook } = useDeleteGroupGuestbook();

  // 초기 로딩 시 맨 아래로 스크롤
  useEffect(() => {
    if (guestbookData?.result?.items && guestbookData.result.items.length > 0) {
      // 더 긴 지연시간으로 스크롤뷰가 완전히 렌더링된 후 스크롤
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
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
        scrollViewRef.current?.scrollToEnd({ animated: false });
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
              scrollViewRef.current?.scrollToEnd({ animated: true });
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

  const handleDelete = (guestbookId: number) => {
    // 스와이프 상태 초기화
    swipeableRefs.current[guestbookId]?.close();

    console.log('방명록 삭제: 정말로 이 방명록을 삭제하시겠습니까?');
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

  const renderRightActions = (guestbookId: number) => {
    return (
      <DeleteActionContainer>
        <DeleteActionButton onPress={() => handleDelete(guestbookId)}>
          <MaterialIcons name="delete" size={24} color={theme.colors.white} />
        </DeleteActionButton>
      </DeleteActionContainer>
    );
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
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 0 }}
              onLayout={() => {
                // 레이아웃이 완료되면 맨 아래로 스크롤
                if (
                  guestbookData?.result?.items &&
                  guestbookData.result.items.length > 0
                ) {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: false });
                  }, 100);
                }
              }}
            >
              {isLoading ? (
                <LoadingContainer>
                  <LoadingText>로딩 중...</LoadingText>
                </LoadingContainer>
              ) : guestbookData?.result?.items &&
                guestbookData.result.items.length > 0 ? (
                <GuestbookListContainer>
                  {guestbookData.result.items.map((item) => {
                    console.log('🔍 방명록 아이템:', {
                      id: item.id,
                      nickname: item.nickname,
                      isWriter: item.isWriter,
                      content: item.content,
                    });
                    return (
                      <Swipeable
                        key={item.id}
                        ref={(ref) => {
                          swipeableRefs.current[item.id] = ref;
                        }}
                        renderRightActions={
                          item.isWriter
                            ? () => renderRightActions(item.id)
                            : undefined
                        }
                        rightThreshold={40}
                        enabled={item.isWriter}
                      >
                        <GuestbookItemContainer>
                          <ProfileContainer>
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
                                <TimeText>
                                  {formatTimeAgo(item.createdAt)}
                                </TimeText>
                              </UserNameTimeContainer>
                            </UserInfoContainer>
                          </ProfileContainer>
                          <MessageContainer>
                            <MessageText>{item.content}</MessageText>
                          </MessageContainer>
                        </GuestbookItemContainer>
                      </Swipeable>
                    );
                  })}
                </GuestbookListContainer>
              ) : (
                <EmptyContainer>
                  <EmptyText>아직 방명록이 없어요.</EmptyText>
                </EmptyContainer>
              )}
            </ScrollView>
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

const GuestbookListContainer = styled.View`
  padding: 16px;
`;

const GuestbookItemContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid ${theme.colors.gray100};
`;

const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
`;

const UserInfoContainer = styled.View`
  flex: 1;
`;

const UserNameTimeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
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
  margin-left: 52px;
`;

const MessageText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray800};
  line-height: 20px;
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
  border-radius: 8px;
`;
