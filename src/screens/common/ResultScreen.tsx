import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';

import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';
import SuccessIcon from '../../components/common/SuccessIcon';

interface IResultScreenProps {
  type: 'success' | 'failure' | 'celebration';
  title: string;
  description: string;
  points?: number;
  lottieSource?: any;
  nextScreen?: string;
  onSuccess?: () => void;
}

const ResultScreen = ({ navigation, route }: any) => {
  const {
    type = 'celebration',
    title = '등록 성공',
    description = '계좌 등록을 성공적으로 완료했어요',
    points,
    lottieSource,
    nextScreen = 'MyPage',
    onSuccess,
  } = route.params || {};

  // 뒤로가기 버튼 차단
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // 뒤로가기 버튼을 완전히 차단
        return true; // 이벤트 소비하여 뒤로가기 동작 방지
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  const handleComplete = () => {
    if (onSuccess) {
      onSuccess();
    }

    // 루틴 등록 완료인 경우 홈으로 이동
    if (title === '루틴 등록 완료!') {
      // 온보딩 완료 처리
      const { completeOnboarding } =
        require('../../store').useOnboardingStore.getState();
      completeOnboarding();
      // 로그인 상태로 변경하여 홈 화면으로 이동
      const { setLoggedIn } = require('../../store').useAuthStore.getState();
      setLoggedIn(true);
    } else if (nextScreen) {
      navigation.navigate(nextScreen);
    }
  };

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return (
          <LottieView
            source={
              lottieSource ||
              require('../../assets/images/animation/success.json')
            }
            autoPlay
            loop={true}
            style={{ width: 120, height: 120 }}
          />
        );
      case 'failure':
        return (
          <LottieView
            source={
              lottieSource ||
              require('../../assets/images/animation/failure.json')
            }
            autoPlay
            loop={true}
            style={{ width: 120, height: 120 }}
          />
        );
      case 'celebration':
      default:
        return <SuccessIcon size={120} />;
    }
  };

  return (
    <Container>
      <CenterContainer>
        <IconContainer>{renderIcon()}</IconContainer>

        <Content>
          <Title>{title}</Title>

          <Description>{description}</Description>

          {points > 0 && <PointsText>+{points}p</PointsText>}
        </Content>
      </CenterContainer>

      <ButtonWrapper>
        <CustomButton
          text="완료"
          onPress={handleComplete}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.white}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default ResultScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const CenterContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const Content = styled.View`
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: ${theme.fonts.title}px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  text-align: center;
  line-height: 34px;
  margin-bottom: 12px;
`;

const Description = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  text-align: center;
  line-height: 24px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;

const PointsText = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.primary};
  margin-top: 8px;
`;
