import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';

interface INicknameSettingScreenProps {
  navigation: any;
}

const NicknameSettingScreen = ({ navigation }: INicknameSettingScreenProps) => {
  const [nickname, setNickname] = useState('');
  const [isValidNickname, setIsValidNickname] = useState(false);
  const [currentNickname, setCurrentNickname] = useState(''); // 현재 사용자 닉네임
  const [validationMessage, setValidationMessage] = useState('');

  // 현재 사용자 닉네임 가져오기 (실제로는 API나 스토어에서 가져와야 함)
  useEffect(() => {
    // TODO: 실제 사용자 닉네임을 가져오는 로직으로 교체
    setCurrentNickname('기존닉네임');
  }, []);

  const validateNickname = (text: string) => {
    // 빈 문자열 체크
    if (text.length === 0) {
      setValidationMessage('');
      setIsValidNickname(false);
      return;
    }

    // 길이 체크 (1글자 이상, 10글자 이하)
    if (text.length < 1 || text.length > 10) {
      setValidationMessage('닉네임은 1글자 이상 10글자 이하여야 합니다.');
      setIsValidNickname(false);
      return;
    }

    // 한글, 영어, 숫자만 허용하는 정규식
    const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
    if (!nicknameRegex.test(text)) {
      setValidationMessage('닉네임은 한글, 영어, 숫자만 사용 가능합니다.');
      setIsValidNickname(false);
      return;
    }

    // 이전 닉네임과 동일한지 체크
    if (text === currentNickname) {
      setValidationMessage('이전 닉네임과 동일합니다.');
      setIsValidNickname(false);
      return;
    }

    // 모든 검증 통과
    setValidationMessage('');
    setIsValidNickname(true);
  };

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    validateNickname(text);
  };

  const handleComplete = () => {
    if (isValidNickname) {
      // 닉네임 설정 완료 로직 구현
      console.log('닉네임 설정 완료:', nickname);
    }
  };

  const getInstructionText = () => {
    if (validationMessage) {
      return (
        <InstructionText>
          <InstructionTextPart>* </InstructionTextPart>
          <ErrorText>{validationMessage}</ErrorText>
        </InstructionText>
      );
    }

    return (
      <InstructionText>
        <InstructionTextPart>* 닉네임을 재설정하면 </InstructionTextPart>
        <HighlightedText>30일간 변경할 수 없습니다.</HighlightedText>
      </InstructionText>
    );
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
        <HeaderTitle>닉네임 설정</HeaderTitle>
        <Spacer />
      </Header>

      <Content>
        <NicknameSection>
          <NicknameLabel>닉네임</NicknameLabel>
          <InputContainer>
            <CustomInput
              value={nickname}
              placeholder="닉네임을 입력해주세요."
              maxLength={10}
              onChangeText={handleNicknameChange}
            />
          </InputContainer>
          {getInstructionText()}
        </NicknameSection>

        <ButtonContainer>
          <CustomButton
            text="완료"
            onPress={handleComplete}
            disabled={!isValidNickname || nickname.length === 0}
          />
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default NicknameSettingScreen;

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

const NicknameSection = styled.View`
  margin-top: 32px;
`;

const NicknameLabel = styled.Text`
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

const ErrorText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
`;

const ButtonContainer = styled.View`
  margin-top: auto;
  padding-bottom: 24px;
`;
