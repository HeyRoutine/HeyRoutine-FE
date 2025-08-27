import React, { useState, useRef } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  TextInput,
  View,
  Alert,
} from 'react-native';
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
    // Alert 제거 - 토스트나 다른 UI 컴포넌트로 대체 예정
    console.log('방명록 삭제: 정말로 이 방명록을 삭제하시겠습니까?');
    // 임시로 바로 삭제
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
    <BottomSheetDialog
      visible={isVisible}
      onRequestClose={onClose}
      dismissible={false}
      showHandle={true}
    >
      <Container>
        <Header>
          <Title>방명록</Title>
          <CloseButton onPress={onClose}>
            <MaterialIcons
              name="close"
              size={24}
              color={theme.colors.gray600}
            />
          </CloseButton>
        </Header>

        <ContentContainer>
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            onContentSizeChange={() => {
              // 데이터가 로드되거나 변경될 때 맨 아래로 스크롤
              scrollViewRef.current?.scrollToEnd({ animated: false });
            }}
          >
            {isLoading ? null : guestbookData?.result?.items &&
              guestbookData.result.items.length > 0 ? (
              <GuestbookList>
                {guestbookData.result.items.map((item) => (
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
        </ContentContainer>

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
    </BottomSheetDialog>
  );
};

export default GuestbookModal;

const Container = styled.View`
  height: 70%;
  min-height: 500px;
  max-height: 80%;
  background-color: ${theme.colors.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px 20px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.gray100};
  position: relative;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray800};
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  padding: 4px;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

const GuestbookList = styled.View`
  padding: 16px 20px;
  gap: 16px;
`;

const GuestbookItem = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  gap: 12px;
`;

const ProfileSection = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

const ProfileImage = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
`;

const UserInfo = styled.View`
  flex: 1;
  gap: 4px;
`;

const UserName = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray800};
`;

const TimeText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray500};
`;

const MessageText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray800};
  line-height: 20px;
  margin-left: 60px;
`;

const InputSection = styled.View`
  padding: 16px 20px 24px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.gray100};
  background-color: ${theme.colors.white};
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
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
  text-align-vertical: center;
`;

const SendButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${theme.colors.white};
  justify-content: center;
  align-items: center;
  shadow-color: ${theme.colors.gray900};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  elevation: 1;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  padding: 40px 20px;
`;

const EmptyText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  padding: 40px 20px;
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
