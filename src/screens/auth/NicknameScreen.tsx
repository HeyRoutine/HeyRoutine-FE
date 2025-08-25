import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '../../components/common/Header';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { theme } from '../../styles/theme';
import { useAuthStore } from '../../store';
import { validateNickname } from '../../utils/validation';
import { useCheckNicknameDuplicate } from '../../hooks/user/useUser';

const NicknameScreen = ({ navigation, route }: any) => {
  const [nickname, setNickname] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<
    boolean | null
  >(null);

  // Zustand 회원가입 스토어에서 닉네임 설정 함수 가져오기
  const { setSignupNickname } = useAuthStore();

  // 닉네임 중복 확인 API hook - 실시간으로 호출
  const {
    data: duplicateCheckData,
    isLoading: isCheckingDuplicate,
    error: duplicateCheckError,
  } = useCheckNicknameDuplicate(
    nickname,
    nickname.length >= 2 && validateNickname(nickname),
  );

  // 닉네임 유효성 검사 (한글, 영어, 숫자만 허용, 2~10자)
  useEffect(() => {
    const isValid = validateNickname(nickname);
    setIsNicknameValid(isValid);

    // 에러 메시지 처리
    if (nickname.length > 0) {
      if (nickname.length < 2) {
        setErrorMessage('닉네임은 2자 이상 입력해주세요.');
      } else if (nickname.length > 10) {
        setErrorMessage('닉네임은 10자 이하로 입력해주세요.');
      } else if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname)) {
        setErrorMessage('닉네임에는 한글, 영어, 숫자만 사용 가능합니다.');
      } else {
        setErrorMessage('');
      }
    } else {
      setErrorMessage('');
    }
  }, [nickname]);

  // 닉네임 입력 시 상태 초기화
  useEffect(() => {
    if (nickname.length === 0) {
      // 닉네임이 비어있을 때 상태 초기화
      setIsNicknameAvailable(null);
      setErrorMessage('');
    }
  }, [nickname]);

  // 닉네임 중복 확인 결과 처리 - 실시간
  useEffect(() => {
    if (
      nickname.length > 0 &&
      validateNickname(nickname) &&
      !isCheckingDuplicate
    ) {
      if (duplicateCheckError) {
        // API 에러 처리
        console.log('🔍 닉네임 중복 확인 에러:', duplicateCheckError);
        setErrorMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
        setIsNicknameAvailable(false);
      } else if (duplicateCheckData) {
        // API 응답 확인
        console.log('🔍 닉네임 중복 확인 응답:', duplicateCheckData);
        if (
          duplicateCheckData.isSuccess &&
          duplicateCheckData.code === 'COMMON200'
        ) {
          // 중복 확인 성공 - 사용 가능한 닉네임
          console.log('🔍 닉네임 중복 확인 성공:', duplicateCheckData.result);
          setErrorMessage('');
          setIsNicknameAvailable(true);
        } else {
          // API는 성공했지만 비즈니스 로직 실패 (중복된 닉네임)
          console.log('🔍 닉네임 중복 확인 실패:', duplicateCheckData.message);
          setErrorMessage(
            duplicateCheckData.message || '이미 사용 중인 닉네임입니다.',
          );
          setIsNicknameAvailable(false);
        }
      }
    } else if (nickname.length === 0) {
      // 닉네임이 비어있을 때
      setErrorMessage('');
      setIsNicknameAvailable(null);
    }
  }, [nickname, isCheckingDuplicate, duplicateCheckData, duplicateCheckError]);

  const handleNext = () => {
    if (isNicknameValid && isNicknameAvailable === true) {
      // Zustand 스토어에 닉네임 저장
      setSignupNickname(nickname);
      console.log('🔍 닉네임 저장됨:', nickname);

      // 저장 후 스토어 상태 확인
      const currentState = useAuthStore.getState();
      console.log('🔍 닉네임 저장 후 스토어 상태:', currentState.signupData);

      // route.params로 이메일, 비밀번호, 닉네임 전달
      const { email, password } = route.params || {};
      navigation.navigate('ProfileImage', { email, password, nickname });
    }
  };

  const clearNickname = () => {
    setNickname('');
  };

  return (
    <Container>
      <Header
        onBackPress={() => navigation.goBack()}
        rightComponent={<ProgressText>3/5</ProgressText>}
      />

      <Content>
        <Title>
          사용자님을{'\n'}
          어떻게 불러드리면 될까요?
        </Title>
        <ErrorContainer>
          {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
        </ErrorContainer>
      </Content>

      <CenterContent>
        <InputContainer>
          <CustomInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력해주세요."
            maxLength={10}
            onClear={clearNickname}
          />
        </InputContainer>
      </CenterContent>

      <ButtonWrapper>
        <CustomButton
          text={isCheckingDuplicate ? '확인 중...' : '다음'}
          onPress={handleNext}
          disabled={
            !isNicknameValid ||
            isCheckingDuplicate ||
            isNicknameAvailable !== true
          }
          backgroundColor={
            isNicknameValid &&
            !isCheckingDuplicate &&
            isNicknameAvailable === true
              ? theme.colors.primary
              : theme.colors.gray200
          }
          textColor={
            isNicknameValid &&
            !isCheckingDuplicate &&
            isNicknameAvailable === true
              ? theme.colors.white
              : theme.colors.gray500
          }
        />
      </ButtonWrapper>
    </Container>
  );
};

export default NicknameScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ProgressText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const Content = styled.View`
  padding: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-top: 16px;
  margin-bottom: 12px;
`;

const ErrorContainer = styled.View`
  height: 20px;
  justify-content: center;
`;

const ErrorMessage = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
`;

const CenterContent = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding: 100px 24px 0 24px;
`;

const InputContainer = styled.View`
  width: 100%;
  position: relative;
`;

const ClearButton = styled.TouchableOpacity`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-10px);
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
