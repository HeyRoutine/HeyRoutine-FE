import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';

import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import { theme } from '../../styles/theme';

interface IGifticonProductScreenProps {
  navigation: any;
  route: any;
}

const GifticonProductScreen = ({
  navigation,
  route,
}: IGifticonProductScreenProps) => {
  const { product, userPoints } = route.params || {};

  const brand = product?.brand ?? '브랜드';
  const title = product?.title ?? '상품명';
  const price = product?.price ?? 0;
  const remain = product?.remain ?? 20;
  const imageSource = product?.image ?? null; // require(...) 또는 { uri }

  const myPoints: number = typeof userPoints === 'number' ? userPoints : 0;
  const hasEnoughPoints = myPoints >= price;

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isDoneOpen, setIsDoneOpen] = React.useState(false);
  const [showBarcode, setShowBarcode] = React.useState(false);

  const handlePurchase = () => {
    if (!hasEnoughPoints) return;
    setIsConfirmOpen(true);
  };

  const handleConfirmPurchase = () => {
    setIsConfirmOpen(false);
    // TODO: 실제 구매 로직 (포인트 차감/영수증 생성 등)
    setTimeout(() => setIsDoneOpen(true), 150);
  };

  const handleCloseDone = () => {
    setIsDoneOpen(false);
    setShowBarcode(false);
  };

  const handleShowBarcode = () => {
    setShowBarcode(true);
  };

  return (
    <Container edges={['top', 'left', 'right']}>
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

      <ButtonWrapper>
        <CustomButton
          text={hasEnoughPoints ? '구매하기' : '잔액이 부족합니다'}
          onPress={handlePurchase}
          disabled={!hasEnoughPoints}
          backgroundColor={
            hasEnoughPoints ? theme.colors.primary : theme.colors.gray200
          }
          textColor={
            hasEnoughPoints ? theme.colors.white : theme.colors.gray500
          }
        />
      </ButtonWrapper>

      <BottomSheetDialog
        visible={isConfirmOpen}
        onRequestClose={() => setIsConfirmOpen(false)}
      >
        <ModalTitle>구매 확인</ModalTitle>
        <ModalMessage>정말로 구매하시겠습니까?</ModalMessage>
        <ModalButtonsContainer>
          <ModalButton onPress={() => setIsConfirmOpen(false)}>
            <ModalButtonText>취소</ModalButtonText>
          </ModalButton>
          <ModalButton onPress={handleConfirmPurchase} variant="primary">
            <ModalButtonText variant="primary">확인</ModalButtonText>
          </ModalButton>
        </ModalButtonsContainer>
      </BottomSheetDialog>

      <BottomSheetDialog visible={isDoneOpen} onRequestClose={handleCloseDone}>
        <ModalTitle>구매 완료</ModalTitle>
        {!showBarcode && <ModalMessage>구매가 완료되었습니다.</ModalMessage>}
        {showBarcode && (
          <BarcodeBox>
            <BarcodeImage
              source={require('../../assets/images/party_popper.png')}
              resizeMode="contain"
            />
            <BarcodeHint>매장 직원에게 바코드를 제시하세요.</BarcodeHint>
          </BarcodeBox>
        )}
        <ModalButtonsContainer>
          <ModalButton
            onPress={showBarcode ? handleCloseDone : handleShowBarcode}
            variant="primary"
          >
            <ModalButtonText variant="primary">확인</ModalButtonText>
          </ModalButton>
        </ModalButtonsContainer>
      </BottomSheetDialog>
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
  padding-bottom: 80px;
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

const ButtonWrapper = styled.View`
  padding: 24px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${theme.colors.white};
`;

const BarcodeBox = styled.View`
  margin-top: 8px;
  width: 100%;
  align-items: center;
`;

const BarcodeImage = styled(Image)`
  width: 80%;
  height: 140px;
`;

const BarcodeHint = styled.Text`
  margin-top: 8px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

// 모달 관련 스타일
const ModalTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 24px;
  color: ${theme.colors.gray900};
  text-align: center;
  margin-bottom: 36px;
`;

const ModalMessage = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  margin-bottom: 36px;
`;

const ModalButtonsContainer = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const ModalButton = styled.TouchableOpacity<{ variant?: 'primary' }>`
  flex: 1;
  padding: 16px 12px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) =>
    p.variant === 'primary' ? theme.colors.primary : theme.colors.gray200};
`;

const ModalButtonText = styled.Text<{ variant?: 'primary' }>`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${(p) =>
    p.variant === 'primary' ? theme.colors.white : theme.colors.gray600};
`;
