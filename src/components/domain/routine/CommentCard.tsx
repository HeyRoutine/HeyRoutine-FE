import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface CommentCardProps {
  profileImage: string;
  username: string;
  role?: string;
  timeAgo: string;
  message: string;
}

const CommentCard = ({
  profileImage,
  username,
  role,
  timeAgo,
  message,
}: CommentCardProps) => {
  return (
    <Container>
      <ProfileImage source={{ uri: profileImage }} />
      <ContentContainer>
        <Header>
          <Username>{username}</Username>
          {role && <Role>({role})</Role>}
          <TimeAgo>{timeAgo}</TimeAgo>
        </Header>
        <Message>{message}</Message>
      </ContentContainer>
    </Container>
  );
};

export default CommentCard;

const Container = styled.View`
  flex-direction: row;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.gray100};
`;

const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const Username = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray800};
`;

const Role = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray600};
  margin-left: 4px;
`;

const TimeAgo = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray500};
  margin-left: auto;
`;

const Message = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray700};
  line-height: 20px;
`;
