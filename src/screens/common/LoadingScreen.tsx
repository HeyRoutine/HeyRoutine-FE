import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../styles/theme';
import ProgressCircle from '../../components/common/ProgressCircle';
import StatusCard from '../../components/common/StatusCard';

interface LoadingScreenProps {
  navigation: any;
  route: any;
}

const LoadingScreen = ({ navigation, route }: LoadingScreenProps) => {
  const {
    title = '로딩 중...',
    description = '잠시만 기다려주세요',
    statusItems = [],
    nextScreen,
    duration = 5000,
  } = route.params || {};
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // 하드웨어 백 버튼 비활성화
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // 이벤트 소비하여 뒤로가기 동작 방지
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  useEffect(() => {
    // 실시간 프로그레스 업데이트 (100ms마다)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2; // 2%씩 증가 (5초에 100% 완료)
      });
    }, 100);

    // 상태 아이템 업데이트 (1초마다)
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= statusItems.length - 1) {
          clearInterval(stepInterval);
          return statusItems.length - 1;
        }
        return prev + 1;
      });
    }, 1000);

    // 5초 후 완료 처리 (100% 완료 후에만)
    const completionTimer = setTimeout(() => {
      setProgress(100);
      setCurrentStep(statusItems.length - 1);
      // 100% 완료 후 1초 더 기다린 후 완료
      setTimeout(() => {
        if (nextScreen && navigation && navigation.replace) {
          navigation.replace(nextScreen);
        }
      }, 1000);
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(completionTimer);
    };
  }, [statusItems.length, nextScreen, navigation]);

  const getStatusForItem = (index: number) => {
    if (index <= currentStep) return 'isCompleted';
    return 'pending';
  };

  return (
    <Container>
      <Content>
        <ProgressSection>
          <ProgressCircle progress={progress} />
        </ProgressSection>

        <TextSection>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </TextSection>

        <StatusSection>
          {statusItems.map((item, index) => (
            <StatusCard
              key={index}
              text={item.text}
              status={getStatusForItem(index)}
            />
          ))}
        </StatusSection>
      </Content>

      <CharacterImage
        source={require('../../assets/images/character_sol.png')}
        resizeMode="contain"
      />
    </Container>
  );
};

export default LoadingScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const ProgressSection = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: 60px;
`;

const TextSection = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  text-align: center;
  margin-bottom: 8px;
`;

const Description = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  text-align: center;
  line-height: 24px;
`;

const StatusSection = styled.View`
  flex: 1;
  justify-content: flex-start;
`;

const CharacterImage = styled.Image`
  position: absolute;
  bottom: -72px;
  right: 24px;
  width: 389px;
  height: 336px;
  opacity: 0.2;
  z-index: 1;
`;
