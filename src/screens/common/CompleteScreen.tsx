import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';
import SuccessIcon from '../../components/common/SuccessIcon';

const CompleteScreen = ({ navigation, route }: any) => {
  const { title, description, onComplete } = route.params || {
    title: '등록 성공',
    description: '계좌 등록을 성공적으로 완료했어요',
    onComplete: () => navigation.navigate('MyPage'),
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <Container>
      <Content>
        <SuccessIcon size={80} />

        <Title>{title}</Title>

        <Description>{description}</Description>
      </Content>

      <ButtonWrapper>
        <CustomButton text="완료" onPress={handleComplete} />
      </ButtonWrapper>
    </Container>
  );
};

export default CompleteScreen;

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
