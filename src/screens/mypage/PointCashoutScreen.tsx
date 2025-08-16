import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/common/Header';
import { theme } from '../../styles/theme';

interface IPointCashoutScreenProps {
  navigation: any;
}

const PointCashoutScreen = ({ navigation }: IPointCashoutScreenProps) => {
  return (
    <Container>
      <Header title="현금 전환" onBackPress={() => navigation.goBack()} />

      <Content>
        <Title>포인트 상점 - 현금전환</Title>
        <Subtitle>현금 전환 화면입니다.</Subtitle>
      </Content>
    </Container>
  );
};

export default PointCashoutScreen;

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
`;
