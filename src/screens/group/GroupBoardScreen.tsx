import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';

interface GroupBoardScreenProps {
  navigation: any;
}

const GroupBoardScreen = ({ navigation }: GroupBoardScreenProps) => {
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Container>
      <Header title="단체 게시판" onBackPress={handleBack} />
      <Content>
        <BoardList>{/* 게시글 목록이 여기에 표시됩니다 */}</BoardList>
      </Content>
    </Container>
  );
};

export default GroupBoardScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
  padding: 16px;
`;

const BoardList = styled.ScrollView`
  flex: 1;
`;
