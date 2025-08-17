import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';

import Header from '../../components/common/Header';
import MyPageListItem from '../../components/domain/mypage/MyPageListItem';
import { theme } from '../../styles/theme';

interface IPointCashoutCompleteScreenProps {
  navigation: any;
}

const PointCashoutCompleteScreen = ({
  navigation,
}: IPointCashoutCompleteScreenProps) => {
  return (
    <Container>
      <Header title="포인트 현금화" onBackPress={() => navigation.goBack()} />

      <Content>
        <TitleSection>
          <Title>계좌로 입금이{'\n'}완료되었습니다.</Title>
        </TitleSection>

        <CharacterSection>
          <CharacterImage
            source={require('../../assets/images/character_pli.png')}
            resizeMode="contain"
          />
        </CharacterSection>
      </Content>

      <InfoSection>
        <MyPageListItem
          title="입금계좌"
          rightText="신한은행"
          rightTextColor={theme.colors.gray900}
          showArrow={false}
          disabled={true}
        />
        <MyPageListItem
          title=""
          subtitle="123-12-123456-1"
          showArrow={false}
          disabled={true}
        />
        <MyPageListItem
          title="입금포인트"
          rightText="2,000P"
          rightTextColor={theme.colors.gray900}
          showArrow={false}
          disabled={true}
        />
        <MyPageListItem
          title="현금"
          rightText="1,400원"
          rightTextColor={theme.colors.gray900}
          showArrow={false}
          disabled={true}
        />
        <MyPageListItem
          title="포인트 잔액"
          rightText="0P"
          rightTextColor={theme.colors.gray900}
          showArrow={false}
          disabled={true}
        />
      </InfoSection>

      <ButtonWrapper>
        <CompleteButton onPress={() => navigation.navigate('PointCashout')}>
          <CompleteButtonText>완료</CompleteButtonText>
        </CompleteButton>
      </ButtonWrapper>
    </Container>
  );
};

export default PointCashoutCompleteScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const TitleSection = styled.View`
  margin-bottom: 32px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  line-height: 34px;
`;

const CharacterSection = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: center;
`;

const CharacterImage = styled(Image)`
  width: 200px;
  height: 200px;
`;

const InfoSection = styled.View`
  background-color: ${theme.colors.white};
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;

const CompleteButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

const CompleteButtonText = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.white};
`;
