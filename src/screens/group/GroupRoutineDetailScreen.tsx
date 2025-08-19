import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';

interface GroupRoutineDetailScreenProps {
  navigation: any;
}

const GroupRoutineDetailScreen = ({
  navigation,
}: GroupRoutineDetailScreenProps) => {
  const handleBack = () => {
    navigation.goBack();
  };

  const handleJoin = () => {
    // 참여 신청 로직
  };

  return (
    <Container>
      <Header title="단체 루틴 상세" onBackPress={handleBack} />
      <Content>
        <RoutineInfo>
          <RoutineTitle>저축 그룹 루틴</RoutineTitle>
          <RoutineCategory>[소비] 67%</RoutineCategory>
          <RoutineTime>오후 8:00 ~ 오후 9:00</RoutineTime>
          <RoutineDays>화 토 일</RoutineDays>
        </RoutineInfo>

        <MemberSection>
          <SectionTitle>멤버별 진행률</SectionTitle>
          <MemberList>{/* 멤버 목록이 여기에 표시됩니다 */}</MemberList>
        </MemberSection>

        <JoinSection>
          <JoinButton onPress={handleJoin}>
            <JoinText>참여 신청</JoinText>
          </JoinButton>
        </JoinSection>

        <GuestbookSection>
          <SectionTitle>그룹 방명록</SectionTitle>
          <GuestbookList>{/* 방명록 목록이 여기에 표시됩니다 */}</GuestbookList>
        </GuestbookSection>
      </Content>
    </Container>
  );
};

export default GroupRoutineDetailScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const RoutineInfo = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

const RoutineTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 20px;
  color: ${theme.colors.gray800};
  margin-bottom: 8px;
`;

const RoutineCategory = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray600};
  margin-bottom: 4px;
`;

const RoutineTime = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  margin-bottom: 4px;
`;

const RoutineDays = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
`;

const MemberSection = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 16px;
`;

const MemberList = styled.View`
  /* 멤버 목록 스타일 */
`;

const JoinSection = styled.View`
  margin-bottom: 16px;
`;

const JoinButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  align-items: center;
`;

const JoinText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const GuestbookSection = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 20px;
`;

const GuestbookList = styled.View`
  /* 방명록 목록 스타일 */
`;
