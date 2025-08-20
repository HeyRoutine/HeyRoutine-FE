import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';

interface TimetableUploadScreenProps {
  navigation: any;
}

const TimetableUploadScreen = ({ navigation }: TimetableUploadScreenProps) => {
  const handlePhotoUpload = () => {
    // 사진으로 불러오기 로직
    navigation.navigate('OnboardingLoading', {
      nextScreen: 'Result',
      isUpload: true,
    });
  };

  const handleCancel = () => {
    // 취소 시 메인 화면으로 이동
    navigation.navigate('OnboardingLoading', {
      nextScreen: null,
    });
  };

  return (
    <Container>
      <Content>
        <Title>시간표 업로드</Title>
        <Description>
          시간표를 업로드하여 AI 루틴 추천을 받아보세요.
        </Description>
      </Content>

      <ButtonWrapper>
        <CustomButton
          text="사진으로 불러오기"
          onPress={handlePhotoUpload}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.white}
        />
        <CustomButton
          text="취소"
          onPress={handleCancel}
          backgroundColor={theme.colors.gray200}
          textColor={theme.colors.gray600}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default TimetableUploadScreen;

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
  font-family: ${theme.fonts.SemiBold};
  font-size: 24px;
  color: ${theme.colors.gray800};
  margin-bottom: 16px;
  text-align: center;
`;

const Description = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
  text-align: center;
  line-height: 24px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
  gap: 12px;
`;
