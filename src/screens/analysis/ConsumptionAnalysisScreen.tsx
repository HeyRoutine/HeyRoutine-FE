import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../../components/common/Header';
import { theme } from '../../styles/theme';

// 카테고리 아이콘 이미지 (임시로 동일 이미지 사용, 실제 아이콘으로 교체하세요)
const iconShopping = require('../../assets/images/robot.png');
// const iconShopping = require('../../assets/images/shopping.png');
const iconFood = require('../../assets/images/robot.png');
// const iconFood = require('../../assets/images/food_cost.png');
const iconTransport = require('../../assets/images/robot.png');
// const iconTransport = require('../../assets/images/transportation.png');
const iconOthers = require('../../assets/images/robot.png');
// const iconOthers = require('../../assets/images/others.png');
const aiIcon = require('../../assets/images/robot.png');

type CategoryItem = {
  id: string;
  label: string;
  ratio: number;
  amount: number;
  color: string;
  icon: ImageSourcePropType;
};

const categories: CategoryItem[] = [
  {
    id: 'shopping',
    label: '쇼핑',
    ratio: 50.0,
    amount: 97000,
    color: '#F7D3D3',
    icon: iconShopping,
  },
  {
    id: 'food',
    label: '식비',
    ratio: 25.8,
    amount: 47472,
    color: '#FFE4B5',
    icon: iconFood,
  },
  {
    id: 'transport',
    label: '교통 및 자동차',
    ratio: 13.6,
    amount: 25024,
    color: '#D3D8FF',
    icon: iconTransport,
  },
  {
    id: 'others',
    label: '그 외 8개',
    ratio: 10.6,
    amount: 19504,
    color: '#E6E6E8',
    icon: iconOthers,
  },
];

const formatWon = (n: number) => `${n.toLocaleString()}원`;

const ConsumptionAnalysisScreen = ({ navigation }: any) => {
  const goFinancial = () => {
    navigation.navigate('Loading', {
      title: '맞춤 금융 상품 찾는중...',
      description: 'AI가 내게 잘 맞는 상품을 찾고 있어요',
      statusItems: [
        { text: '소비 내역 확인..', status: 'pending' },
        { text: '소비 패턴 분석...', status: 'pending' },
        { text: '금융 상품 매칭...', status: 'pending' },
        { text: '추천 결과 생성...', status: 'pending' },
      ],
      nextScreen: 'FinancialProduct',
    });
  };

  const goRoutine = () => {
    navigation.navigate('Loading', {
      title: 'AI 루틴 추천 중...',
      description: '당신에게 맞는 최적의 루틴을 찾고 있어요',
      statusItems: [
        { text: '루틴 패턴 분석...', status: 'pending' },
        { text: '개인 맞춤 추천...', status: 'pending' },
        { text: '최적화된 루틴 생성...', status: 'pending' },
      ],
      nextScreen: 'RoutineSuggestion',
    });
  };

  return (
    <Container>
      <Header
        title="이번 주 소비패턴 분석"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 지표 카드 */}
        <Card>
          <Row>
            <Muted>20대 평균</Muted>
            <Strong>{formatWon(122000)}</Strong>
          </Row>
          <RowSpaced>
            <MutedSmall>내 지출</MutedSmall>
            <StrongMutedSmall>{formatWon(184000)}</StrongMutedSmall>
          </RowSpaced>

          <ProgressWrap>
            <ProgressBg />
            <ProgressFill style={{ width: '70%' }} />
          </ProgressWrap>
          <Hint>평균보다 34% 높음</Hint>
        </Card>

        {/* 카테고리 리스트 */}
        <Card>
          {categories.map((c, idx) => (
            <CategoryRow key={c.id} isLast={idx === categories.length - 1}>
              <IconBox>
                <CategoryImg source={c.icon} resizeMode="contain" />
              </IconBox>
              <ColLeft>
                <Label>{c.label}</Label>
                <SubLabel>{c.ratio}%</SubLabel>
              </ColLeft>
              <Amount>{formatWon(c.amount)}</Amount>
            </CategoryRow>
          ))}
        </Card>

        {/* AI 분석 카드 */}
        <AICard>
          <AIHeader>
            <AIIcon>
              <AIImg source={aiIcon} resizeMode="contain" />
            </AIIcon>
            <AITitle>AI 소비패턴 분석</AITitle>
          </AIHeader>

          <AIItem>
            <Check>
              <CheckSquare>
                <Ionicons
                  name="checkmark"
                  size={12}
                  color={theme.colors.white}
                />
              </CheckSquare>
            </Check>
            <AIText>사용자께서는 저축을 전혀 하지 않아요..!</AIText>
          </AIItem>
          <AIItem>
            <Check>
              <CheckSquare>
                <Ionicons
                  name="checkmark"
                  size={12}
                  color={theme.colors.white}
                />
              </CheckSquare>
            </Check>
            <AIText>
              지난 주에 비해 식비 카테고리의 소비가 20% 감소했어요.
            </AIText>
          </AIItem>
          <AIItem>
            <Check>
              <CheckSquare>
                <Ionicons
                  name="checkmark"
                  size={12}
                  color={theme.colors.white}
                />
              </CheckSquare>
            </Check>
            <AIText>
              이번 주 소비패턴에 기반한 다음 주 지출 예정 금액은
              130,000원이에요.
            </AIText>
          </AIItem>

          <ButtonRow>
            <GhostButton onPress={goFinancial}>
              <GhostContent>
                <GhostIcon name="card-outline" size={16} />
                <GhostText>맞춤 금융 상품 추천</GhostText>
              </GhostContent>
            </GhostButton>
            <GhostButton onPress={goRoutine}>
              <GhostContent>
                <GhostIcon name="sparkles-outline" size={16} />
                <GhostText>루틴 추천</GhostText>
              </GhostContent>
            </GhostButton>
          </ButtonRow>
        </AICard>
      </ScrollView>
    </Container>
  );
};

export default ConsumptionAnalysisScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Card = styled.View`
  margin: 12px 16px 0 16px;
  padding: 16px;
  background-color: ${theme.colors.gray50};
  border-radius: 16px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RowSpaced = styled(Row)`
  margin-top: 6px;
`;

const Muted = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: ${theme.fonts.body}px;
  color: ${theme.colors.gray700};
`;

const MutedSmall = styled(Muted)`
  font-size: ${theme.fonts.body - 2}px;
`;

const Strong = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
  font-size: ${theme.fonts.body}px;
`;

const StrongMuted = styled(Strong)`
  color: ${theme.colors.gray600};
`;

const StrongMutedSmall = styled(StrongMuted)`
  font-size: ${theme.fonts.body - 2}px;
`;

const ProgressWrap = styled.View`
  position: relative;
  margin: 12px 0 6px 0;
  height: 10px;
`;

const ProgressBg = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: ${theme.colors.gray200};
  border-radius: 999px;
`;

const ProgressFill = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: ${theme.colors.primary};
  border-radius: 999px;
`;

const Hint = styled.Text`
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-top: 4px;
`;

const CategoryRow = styled.View<{ isLast: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 12px 4px;
  border-bottom-width: ${(p) => (p.isLast ? 0 : 1)}px;
  border-bottom-color: ${theme.colors.gray200};
`;

const IconBox = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const CategoryImg = styled(Image)`
  width: 32px;
  height: 32px;
`;

const ColLeft = styled.View`
  flex: 1;
`;

const Label = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
`;

const SubLabel = styled.Text`
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const Amount = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
`;

const AICard = styled(Card)`
  background-color: ${theme.colors.gray50};
`;

const AIHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const AIIcon = styled.View`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  background-color: transparent;
`;

const AIImg = styled(Image)`
  width: 28px;
  height: 28px;
`;

const AITitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
`;

const AIItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 8px 0;
`;

const Check = styled.View`
  margin-right: 8px;
`;

const CheckSquare = styled.View`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background-color: ${theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

const AIText = styled.Text`
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray700};
  flex: 1;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 8px;
`;

const GhostButton = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  background-color: ${theme.colors.white};
  border-radius: 20px;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.colors.primary};
`;

const GhostContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const GhostIcon = styled(Ionicons)`
  color: ${theme.colors.primary};
`;

const GhostText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.primary};
`;
