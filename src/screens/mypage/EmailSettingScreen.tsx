import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';

interface IEmailSettingScreenProps {
  navigation: any;
}

const EmailSettingScreen = ({ navigation }: IEmailSettingScreenProps) => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    // 간단한 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(text));
  };

  const handleVerification = () => {
    if (isValidEmail) {
      // 이메일 인증 로직 구현
      console.log('이메일 인증 요청:', email);
    }
  };

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
        <HeaderTitle>이메일 설정</HeaderTitle>
        <Spacer />
      </Header>

      <Content>
        <EmailSection>
          <EmailLabel>이메일</EmailLabel>
          <InputContainer>
            <CustomInput
              value={email}
              placeholder="example@exam.com"
              maxLength={30}
              onChangeText={handleEmailChange}
            />
          </InputContainer>
          <InstructionText>
            <InstructionTextPart>* </InstructionTextPart>
            <HighlightedText>사용가능한</HighlightedText>
            <InstructionTextPart> 이메일을 입력해주셔야합니다.</InstructionTextPart>
          </InstructionText>
        </EmailSection>

        <ButtonContainer>
          <CustomButton
            text="인증 하기"
            onPress={handleVerification}
            disabled={!isValidEmail || email.length === 0}
          />
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default EmailSettingScreen;

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
  padding: 24px;
`;

const EmailSection = styled.View`
  margin-top: 32px;
`;

const EmailLabel = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray900};
  margin-bottom: 12px;
`;

const InputContainer = styled.View`
  margin-bottom: 8px;
`;

const InstructionText = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const InstructionTextPart = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const HighlightedText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.primary};
`;

const ButtonContainer = styled.View`
  margin-top: auto;
  padding-bottom: 24px;
`;
