import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/common/Header';
import { theme } from '../../styles/theme';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { useUserStore } from '../../store';
import { validateNickname } from '../../utils/validation';
import { useResetNickname } from '../../hooks/user';
import { checkNicknameDuplicate } from '../../api/user';

interface INicknameSettingScreenProps {
  navigation: any;
}

const NicknameSettingScreen = ({ navigation }: INicknameSettingScreenProps) => {
  const [nickname, setNickname] = useState('');
  const [isValidNickname, setIsValidNickname] = useState(false);
  const [currentNickname, setCurrentNickname] = useState(''); // 현재 사용자 닉네임
  const [validationMessage, setValidationMessage] = useState('');
  const { mutateAsync: resetNicknameMutate } = useResetNickname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Zustand 스토어에서 사용자 정보 가져오기
  const { userInfo, updateUserInfo } = useUserStore();

  // 현재 사용자 닉네임 가져오기 (Zustand 스토어에서 가져오기)
  useEffect(() => {
    if (userInfo?.nickname) {
      setCurrentNickname(userInfo.nickname);
      setNickname(userInfo.nickname); // 입력창에도 현재 닉네임 표시
    }
  }, [userInfo?.nickname]);

  const validateNicknameInput = async (text: string) => {
    console.log('🔍 닉네임 검증 시작:', text);

    // 빈 문자열 체크
    if (text.length === 0) {
      setValidationMessage('');
      setIsValidNickname(false);
      return;
    }

    // 길이 체크 (2글자 이상, 10글자 이하)
    if (text.length < 2 || text.length > 10) {
      setValidationMessage('닉네임은 2글자 이상 10글자 이하여야 합니다.');
      setIsValidNickname(false);
      return;
    }

    // 한글, 영어, 숫자만 허용하는 정규식 (유틸리티 함수 사용)
    if (!validateNickname(text)) {
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

    // 중복 검사 API 호출
    try {
      console.log('🔍 중복 검사 API 호출 시작');
      const response = await checkNicknameDuplicate(text);
      console.log('🔍 중복 검사 API 응답:', response);

      if (response.isSuccess) {
        // 중복되지 않음
        setValidationMessage('');
        setIsValidNickname(true);
        console.log('🔍 닉네임 사용 가능');
      } else {
        // 이미 사용 중인 닉네임
        setValidationMessage('이미 사용 중인 닉네임입니다.');
        setIsValidNickname(false);
        console.log('🔍 닉네임 중복됨');
      }
    } catch (error: any) {
      console.error('🔍 중복 검사 API 에러:', error);
      // API 호출 실패 시 에러 메시지
      // setValidationMessage('닉네임 중복 확인에 실패했습니다.');
      // setIsValidNickname(false);

      if (error.response.data.message == '사용중인 닉네임 입니다.') {
        setValidationMessage('이미 사용 중인 닉네임입니다.');
        setIsValidNickname(false);
      }
      // else if (error.response.data.message == ) {

      // }
      else {
        setValidationMessage('닉네임 중복 확인에 실패했습니다.');
        setIsValidNickname(false);
      }
    }
  };

  const handleNicknameChange = (text: string) => {
    setNickname(text);

    // 이전 타이머가 있다면 클리어
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 빈 문자열이거나 2글자 미만인 경우 즉시 검증
    if (text.length === 0 || text.length < 2) {
      validateNicknameInput(text);
      return;
    }

    // 2글자 이상인 경우 디바운싱 적용
    timeoutRef.current = setTimeout(() => {
      validateNicknameInput(text);
    }, 500);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 닉네임이 변경될 때마다 검증 상태 초기화
  useEffect(() => {
    if (nickname !== currentNickname) {
      setIsValidNickname(false);
      setValidationMessage('');
    }
  }, [nickname, currentNickname]);

  const handleComplete = async () => {
    if (!isValidNickname) return;

    try {
      const response = await resetNicknameMutate({ nickname });
      if (response.isSuccess) {
        navigation.replace('Result', {
          type: 'success',
          title: '변경 완료',
          description: '닉네임을 성공적으로 변경했어요',
          nextScreen: 'ProfileEdit',
          onSuccess: () => {
            updateUserInfo({ nickname });
          },
        });
      } else {
        navigation.replace('Result', {
          type: 'failure',
          title: '변경 실패',
          description: response.message || '닉네임 변경에 실패했어요',
          nextScreen: 'ProfileEdit',
        });
      }
    } catch (error: any) {
      navigation.replace('Result', {
        type: 'failure',
        title: '변경 실패',
        description:
          error?.response?.data?.message || '닉네임 변경에 실패했어요',
        nextScreen: 'ProfileEdit',
      });
    }
  };

  const getInstructionText = () => {
    return (
      <InstructionText>
        <InstructionTextPart>* 닉네임을 재설정하면 </InstructionTextPart>
        <HighlightedText>30일간 변경할 수 없습니다.</HighlightedText>
      </InstructionText>
    );
  };

  return (
    <Container>
      <Header title="닉네임 설정" onBackPress={() => navigation.goBack()} />

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
          <ErrorContainer>
            {validationMessage ? (
              <ErrorText>{validationMessage}</ErrorText>
            ) : null}
          </ErrorContainer>
        </NicknameSection>
      </Content>

      <ButtonContainer>
        <CustomButton
          text="완료"
          onPress={handleComplete}
          disabled={!isValidNickname || nickname.length === 0}
          backgroundColor={
            isValidNickname && nickname.length > 0
              ? theme.colors.primary
              : theme.colors.gray200
          }
          textColor={
            isValidNickname && nickname.length > 0
              ? theme.colors.white
              : theme.colors.gray500
          }
        />
      </ButtonContainer>
    </Container>
  );
};

export default NicknameSettingScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
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

const ErrorContainer = styled.View`
  height: 20px;
  justify-content: center;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
`;

const ButtonContainer = styled.View`
  padding: 24px;
`;
