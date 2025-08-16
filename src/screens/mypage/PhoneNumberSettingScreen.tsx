import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';

interface IPhoneNumberSettingScreenProps {
  navigation: any;
}

const PhoneNumberSettingScreen = ({
  navigation,
}: IPhoneNumberSettingScreenProps) => {
  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.gray900}
          />
        </BackButton>
        <HeaderTitle>전화번호 설정</HeaderTitle>
        <Spacer />
      </Header>

      <Content>
        <Title>전화번호 설정</Title>
        <Subtitle>전화번호 설정 화면입니다.</Subtitle>
      </Content>
    </Container>
  );
};

export default PhoneNumberSettingScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.gray200};
`;

const BackButton = styled.TouchableOpacity`
  padding: 4px;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
`;

const Spacer = styled.View`
  width: 32px;
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
