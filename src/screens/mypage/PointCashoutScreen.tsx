import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/common/Header';
import CustomInput from '../../components/common/CustomInput';
import PointButton from '../../components/domain/mypage/PointButton';
import MyPageListItem from '../../components/domain/mypage/MyPageListItem';
import { theme } from '../../styles/theme';

interface IPointCashoutScreenProps {
  navigation: any;
}

const PointCashoutScreen = ({ navigation }: IPointCashoutScreenProps) => {
  const [pointAmount, setPointAmount] = useState('0');
  const maxPoints = 2000; // 최대 포인트 (나중에 Zustand에서 가져올 예정)

  const handleInputChange = (text: string) => {
    // 숫자만 입력 가능
    const numericValue = text.replace(/[^0-9]/g, '');

    // 최대 포인트를 넘으면 강제로 최대값으로 설정
    const pointValue = parseInt(numericValue) || 0;
    const finalValue =
      pointValue > maxPoints ? maxPoints.toString() : numericValue;

    setPointAmount(finalValue);
  };

  const handlePointChange = (points: number) => {
    // 최대 포인트를 넘으면 강제로 최대값으로 설정
    const finalValue = points > maxPoints ? maxPoints : points;
    setPointAmount(finalValue.toString());
  };

  return (
    <Container>
      <Header title="포인트 상점" onBackPress={() => navigation.goBack()} />

      <Content>
        <TitleSection>
          <Title>얼마나 보낼까요?</Title>
          <SubTitle>1P씩 입력 가능해요</SubTitle>
        </TitleSection>

        <BalanceSection>
          <BalanceLabel>보유 포인트</BalanceLabel>
          <BalanceAmount>{maxPoints.toLocaleString()}P</BalanceAmount>
        </BalanceSection>

        <CustomInput
          value={pointAmount}
          onChangeText={handleInputChange}
          placeholder="포인트를 입력해주세요"
          maxLength={10}
          suffix="P"
          showCharCounter={false}
        />
        <ButtonRow>
          <PointButton
            text="+1백P"
            onPress={() =>
              handlePointChange((parseInt(pointAmount) || 0) + 100)
            }
          />
          <PointButton
            text="+1천P"
            onPress={() =>
              handlePointChange((parseInt(pointAmount) || 0) + 1000)
            }
          />
          <PointButton
            text="+1만P"
            onPress={() =>
              handlePointChange((parseInt(pointAmount) || 0) + 10000)
            }
          />
          <PointButton
            text="전체사용"
            onPress={() => handlePointChange(2000)}
            flex={1.5}
          />
        </ButtonRow>
      </Content>

      <Divider />

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
          title="전환비율"
          rightText="1P당 0.7원"
          rightTextColor={theme.colors.gray900}
          showArrow={false}
          disabled={true}
        />
        <MyPageListItem
          title="전환될 금액"
          rightText={`${(parseInt(pointAmount) * 0.7).toLocaleString()}원`}
          rightTextColor={theme.colors.gray900}
          showArrow={false}
          disabled={true}
        />
      </InfoSection>

      <ButtonWrapper>
        <TransferButton
          onPress={() => navigation.navigate('PointCashoutComplete')}
        >
          <TransferButtonText>전환하기</TransferButtonText>
        </TransferButton>
      </ButtonWrapper>
    </Container>
  );
};

export default PointCashoutScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
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
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  text-align: right;
`;

const BalanceSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${theme.colors.gray50};
  border-radius: 8px;
  margin-bottom: 24px;
`;

const BalanceLabel = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray700};
`;

const BalanceAmount = styled.Text`
  font-size: 18px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.primary};
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-top: 16px;
`;

const Divider = styled.View`
  height: 8px;
  background-color: ${theme.colors.gray100};
  margin: 0;
`;

const InfoSection = styled.View`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;

const TransferButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

const TransferButtonText = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.white};
`;
