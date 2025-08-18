import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';
import { Image } from 'react-native';

import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';
import SuccessIcon from '../../components/common/SuccessIcon';

interface IResultScreenProps {
  type: 'success' | 'failure' | 'celebration';
  title: string;
  description: string;
  lottieSource?: any;
  imageSource?: any;
  onComplete: () => void;
}

const ResultScreen = ({ navigation, route }: any) => {
  const {
    type = 'celebration',
    title = '등록 성공',
    description = '계좌 등록을 성공적으로 완료했어요',
    lottieSource,
    imageSource,
    onComplete = () => navigation.navigate('MyPage'),
  } = route.params || {};

  const handleComplete = () => {
    onComplete();
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
            style={{ width: 60, height: 60 }}
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
            style={{ width: 60, height: 60 }}
          />
        );
      case 'celebration':
      default:
        return imageSource ? (
          <Image
            source={imageSource}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        ) : (
          <SuccessIcon size={60} />
        );
    }
  };

  return (
    <Container>
      <Content>
        {renderIcon()}

        <Title>{title}</Title>

        <Description>{description}</Description>
      </Content>

      <ButtonWrapper>
        <CustomButton text="완료" onPress={handleComplete} />
      </ButtonWrapper>
    </Container>
  );
};

export default ResultScreen;

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
