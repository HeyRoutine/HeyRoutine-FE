import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';

/**
 * HomeScreen의 props 인터페이스
 */
interface IHomeScreenProps {
  /** 네비게이션 객체 */
  navigation: any;
}

/**
 * 홈 화면 컴포넌트
 * 사용자의 메인 대시보드를 표시합니다.
 * @param props - 컴포넌트 props
 * @returns 홈 화면 컴포넌트
 */
const HomeScreen = ({ navigation }: IHomeScreenProps) => {
  const handleFinancialProductLoading = () => {
    navigation.navigate('Loading', {
      title: '맞춤 금융 상품 찾는중...',
      description: 'AI가 내게 잘 맞는 상품을 찾고 있어요',
      statusItems: [
        { text: '소비 내역 확인..', status: 'pending' },
        { text: '소비 패턴 분석...', status: 'pending' },
        { text: '금융 상품 매칭...', status: 'pending' },
        { text: '추천 결과 생성...', status: 'pending' },
      ],
      onComplete: () => navigation.navigate('FinancialProduct'),
    });
  };

  const handleRoutineRecommendationLoading = () => {
    navigation.navigate('Loading', {
      title: 'AI 루틴 추천 중...',
      description: '당신에게 맞는 최적의 루틴을 찾고 있어요',
      statusItems: [
        { text: '루틴 패턴 분석...', status: 'pending' },
        { text: '개인 맞춤 추천...', status: 'pending' },
        { text: '최적화된 루틴 생성...', status: 'pending' },
      ],
      onComplete: () => navigation.navigate('HomeMain'),
    });
  };

  return (
    <Container>
      <Content>
        <Title>홈</Title>
        <Subtitle>메인 홈 화면입니다.</Subtitle>

        <ButtonContainer>
          <CustomButton
            text="금융 상품 추천"
            onPress={handleFinancialProductLoading}
          />

          <CustomButton
            text="AI 루틴 추천"
            onPress={handleRoutineRecommendationLoading}
          />
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default HomeScreen;

// 스타일 컴포넌트 정의
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-bottom: 40px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  gap: 16px;
`;
