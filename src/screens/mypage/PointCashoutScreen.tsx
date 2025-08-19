import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/common/Header';
import CustomInput from '../../components/common/CustomInput';
import PointButton from '../../components/domain/mypage/PointButton';
import MyPageListItem from '../../components/domain/mypage/MyPageListItem';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import { theme } from '../../styles/theme';
import { useUserStore } from '../../store';

interface IPointCashoutScreenProps {
  navigation: any;
}

const PointCashoutScreen = ({ navigation }: IPointCashoutScreenProps) => {
  const [pointAmount, setPointAmount] = useState('0');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const { userInfo, deductPoints } = useUserStore();
  const maxPoints = userInfo?.points ?? 0; // Zustand에서 가져온 포인트

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

  const handleTransfer = () => {
    const amount = parseInt(pointAmount) || 0;
    if (amount > 0) {
      setIsTransferModalOpen(true);
    }
  };

  const handleConfirmTransfer = () => {
    const amount = parseInt(pointAmount) || 0;
    deductPoints(amount);
    setIsTransferModalOpen(false);
    navigation.navigate('PointCashoutComplete', { transferredPoints: amount });
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
          rightText="123-12-123456-1"
          rightTextColor={theme.colors.gray900}
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
          rightText={`${Math.floor((parseInt(pointAmount) || 0) * 0.7).toLocaleString()}원`}
          rightTextColor={theme.colors.gray900}
          showArrow={false}
          disabled={true}
        />
      </InfoSection>

      <ButtonWrapper>
        <TransferButton onPress={handleTransfer}>
          <TransferButtonText>전환하기</TransferButtonText>
        </TransferButton>
      </ButtonWrapper>

      <BottomSheetDialog
        visible={isTransferModalOpen}
        title="포인트 전환"
        message={`${pointAmount}P를 현금으로 전환하시겠습니까?`}
        primaryText="확인"
        onPrimary={handleConfirmTransfer}
        secondaryText="취소"
        onSecondary={() => setIsTransferModalOpen(false)}
        onRequestClose={() => setIsTransferModalOpen(false)}
      />
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
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${theme.colors.white};
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
