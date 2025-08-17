import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';

import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import { theme } from '../../styles/theme';
import { useUserStore } from '../../store';

interface IGifticonProductScreenProps {
  navigation: any;
  route: any;
}

const GifticonProductScreen = ({
  navigation,
  route,
}: IGifticonProductScreenProps) => {
  const { product } = route.params || {};
  const { userInfo, deductPoints } = useUserStore();

  const brand = product?.brand ?? '브랜드';
  const title = product?.title ?? '상품명';
  const price = product?.price ?? 0;
  const remain = product?.remain ?? 20;
  const imageSource = product?.image ?? null; // require(...) 또는 { uri }

  const myPoints: number = userInfo?.points ?? 0;
  const hasEnoughPoints = myPoints >= price;

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isDoneOpen, setIsDoneOpen] = React.useState(false);

  const handlePurchase = () => {
    if (!hasEnoughPoints) return;
    setIsConfirmOpen(true);
  };

  const handleConfirmPurchase = () => {
    setIsConfirmOpen(false);
    // 실제 포인트 차감
    deductPoints(price);
    setTimeout(() => setIsDoneOpen(true), 150);
  };

  const handleCloseDone = () => {
    setIsDoneOpen(false);
  };

  return (
    <Container>
      <Header
        title={product?.title ?? '상품 상세'}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollContent>
        <ImageBox>
          {imageSource ? (
            <ProductImage resizeMode="contain" source={imageSource} />
          ) : (
            <PlaceholderText>이미지</PlaceholderText>
          )}
        </ImageBox>

        <InfoTable>
          <Row>
            <Label>브랜드</Label>
            <Value>{brand}</Value>
          </Row>
          <Divider />
          <Row>
            <Label>상품명</Label>
            <Value numberOfLines={1}>{title}</Value>
          </Row>
          <Divider />
          <Row>
            <Label>포인트</Label>
            <Value>{price.toLocaleString()}P</Value>
          </Row>
          <Divider />
          <Row>
            <Label>남은수량</Label>
            <Value>{remain}개</Value>
          </Row>
        </InfoTable>
      </ScrollContent>

      <Footer>
        <CustomButton
          text={hasEnoughPoints ? '구매하기' : '잔액이 부족합니다'}
          onPress={handlePurchase}
          disabled={!hasEnoughPoints}
        />
      </Footer>

      <BottomSheetDialog
        visible={isConfirmOpen}
        title="구매 확인"
        message="정말로 구매하시겠습니까?"
        primaryText="확인"
        onPrimary={handleConfirmPurchase}
        secondaryText="취소"
        onSecondary={() => setIsConfirmOpen(false)}
        onRequestClose={() => setIsConfirmOpen(false)}
      />

      <BottomSheetDialog
        visible={isDoneOpen}
        title="구매 완료"
        message="구매가 완료되었습니다."
        primaryText="확인"
        onPrimary={handleCloseDone}
        onRequestClose={handleCloseDone}
      />
    </Container>
  );
};

export default GifticonProductScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ScrollContent = styled.ScrollView`
  flex: 1;
  padding: 0 24px;
`;

const ImageBox = styled.View`
  margin-top: 16px;
  margin-bottom: 24px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${theme.colors.gray200};
  border-radius: 12px;
  overflow: hidden;
  align-self: center;
  width: 280px;
  height: 280px;
  background-color: ${theme.colors.white};
`;

const ProductImage = styled(Image)`
  width: 80%;
  height: 80%;
`;

const PlaceholderText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray500};
`;

const InfoTable = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  overflow: hidden;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 4px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${theme.colors.gray200};
`;

const Label = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray600};
`;

const Value = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
  max-width: 70%;
`;

const Footer = styled.View`
  padding: 16px 24px 24px 24px;
  background-color: ${theme.colors.white};
`;
