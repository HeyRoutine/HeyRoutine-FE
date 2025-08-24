import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import BubbleCard from '../../components/domain/analysis/BubbleCard';
import FinancialProductCard from '../../components/domain/analysis/FinancialProductCard';

interface FinancialProductScreenProps {
  navigation: any;
}

const FinancialProductScreen = ({
  navigation,
}: FinancialProductScreenProps) => {
  const handleBack = () => {
    navigation.navigate('ConsumptionAnalysis');
  };

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header title="맞춤 금융 상품 추천" onBackPress={handleBack} />

      {/* 👇 이제 이 Content 영역은 스크롤이 가능합니다. */}
      <Content>
        <BotMessageSection>
          <BubbleCard
            robotImageSource={require('../../assets/images/robot.png')}
            direction="top"
            content={
              <>
                사용자에게는 <HighlightText>식비</HighlightText>와{' '}
                <HighlightText>여행</HighlightText>의 소비가 많아요!
                {'\n'}그래서 아래 통장을 추천드려요.
              </>
            }
          />
        </BotMessageSection>

        <ProductSection showsVerticalScrollIndicator={false}>
          <FinancialProductCard
            title="신한 땡겨요페이 통장"
            features={['하루만 맡겨도 이자제공', '12,000원 쿠폰 제공']}
            maxInterestRate="최고 2.5 %"
            minInterestRate="최저 0.1 %"
            hashtags={['#땡겨요 쿠폰', '#최고 연이율 2.5%']}
          />

          <FinancialProductCard
            title="SOL글로벌 통장 저축예금"
            features={[
              '해외 송금 환율 및 수수료 할인 50%',
              'ATM인출 수수료도 면제..!',
            ]}
            maxInterestRate="최고 2.5 %"
            minInterestRate="최저 0.5 %"
            hashtags={['#해외송금환율50%', '#해외송금수수료50%']}
          />
          {/* 카드를 더 추가해도 잘립니다. */}
          <FinancialProductCard
            title="추가 카드 예시"
            features={['특징 1', '특징 2']}
            maxInterestRate="최고 3.0 %"
            minInterestRate="최저 1.0 %"
            hashtags={['#예시태그1', '#예시태그2']}
          />
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
  padding: 0 24px;
  flex-direction: column;
`;

const BotMessageSection = styled.View`
  align-items: center;
  justify-content: flex-start;
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.Bold};
`;

const ProductSection = styled.ScrollView`
  gap: 16px;
  /* margin-top: 24px; */
`;
