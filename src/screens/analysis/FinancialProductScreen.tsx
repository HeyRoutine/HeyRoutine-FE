import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';

interface FinancialProductScreenProps {
  navigation: any;
}

const FinancialProductScreen = ({
  navigation,
}: FinancialProductScreenProps) => {
  const handleBack = () => {
    navigation.navigate('Home');
  };

  return (
    <Container>
      <Header title="맞춤 금융 상품 추천" onBackPress={handleBack} />

      <Content>
        {/* 봇 메시지 섹션 */}
        <BotMessageSection>
          <BotIcon source={require('../../assets/images/character_mori.png')} />
          <MessageBubble>
            <MessageText>
              사용자에게는 <HighlightText>식비</HighlightText>와{' '}
              <HighlightText>여행</HighlightText>의 소비가 많아요!
            </MessageText>
            <MessageText>그래서 아래 통장을 추천드려요.</MessageText>
          </MessageBubble>
        </BotMessageSection>

        {/* 금융 상품 카드들 */}
        <ProductSection>
          <ProductCard>
            <ProductTitle>신한 땡겨요페이 통장</ProductTitle>
            <ProductContent>
              <FeaturesContainer>
                <FeatureText>하루만 맡겨도 이자제공</FeatureText>
                <FeatureText>12,000원 쿠폰 제공</FeatureText>
              </FeaturesContainer>
              <InterestContainer>
                <MaxInterestRate>최고 2.5 %</MaxInterestRate>
                <MinInterestRate>최저 0.1 %</MinInterestRate>
              </InterestContainer>
            </ProductContent>
            <HashtagContainer>
              <Hashtag>#땡겨요 쿠폰</Hashtag>
              <Hashtag>#최고 연이율 2.5%</Hashtag>
            </HashtagContainer>
          </ProductCard>

          <ProductCard>
            <ProductTitle>SOL글로벌 통장 저축예금</ProductTitle>
            <ProductContent>
              <FeaturesContainer>
                <FeatureText>해외 송금 환율 및 수수료 할인 50%</FeatureText>
                <FeatureText>ATM인출 수수료도 면제..!</FeatureText>
              </FeaturesContainer>
              <InterestContainer>
                <MaxInterestRate>최고 2.5 %</MaxInterestRate>
                <MinInterestRate>최저 0.5 %</MinInterestRate>
              </InterestContainer>
            </ProductContent>
            <HashtagContainer>
              <Hashtag>#해외송금환율50%</Hashtag>
              <Hashtag>#해외송금수수료50%</Hashtag>
            </HashtagContainer>
          </ProductCard>
        </ProductSection>
      </Content>
    </Container>
  );
};

export default FinancialProductScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const BotMessageSection = styled.View`
  align-items: center;
  margin-bottom: 32px;
`;

const BotIcon = styled.Image`
  width: 40px;
  height: 40px;
  margin-bottom: 12px;
`;

const MessageBubble = styled.View`
  background-color: ${theme.colors.primary}20;
  padding: 16px 20px;
  border-radius: 20px;
  max-width: 280px;
`;

const MessageText = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray900};
  line-height: 24px;
  text-align: center;
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.Bold};
`;

const ProductSection = styled.View`
  flex: 1;
  gap: 16px;
`;

const ProductCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 16px;
  padding: 20px;
  border: 1px solid ${theme.colors.gray200};
`;

const ProductTitle = styled.Text`
  font-size: 18px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  margin-bottom: 16px;
`;

const ProductContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const FeaturesContainer = styled.View`
  flex: 1;
  gap: 8px;
`;

const FeatureText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray700};
  line-height: 20px;
`;

const InterestContainer = styled.View`
  align-items: flex-end;
  margin-left: 16px;
`;

const MaxInterestRate = styled.Text`
  font-size: 18px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.primary};
  margin-bottom: 4px;
`;

const MinInterestRate = styled.Text`
  font-size: 12px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray500};
`;

const HashtagContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const Hashtag = styled.Text`
  font-size: 12px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray500};
  background-color: ${theme.colors.gray100};
  padding: 4px 8px;
  border-radius: 12px;
`;
