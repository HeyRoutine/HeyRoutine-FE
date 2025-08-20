import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';

interface TimetableUploadScreenProps {
  navigation: any;
}

const TimetableUploadScreen = ({ navigation }: TimetableUploadScreenProps) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

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

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      // 권한 거부도 실패 케이스로 처리
      handleCancel();
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      handlePhotoUpload();
    } else {
      handleCancel();
    }
  };

  return (
    <Container>
      <Header onBackPress={() => navigation.goBack()} />

      <Content>
        <Title>시간표 이미지를{"\n"}업로드해주세요.</Title>
        <SubTitle>
          {imageUri
            ? '업로드한 이미지에서 시간을 자동 인식할게요.'
            : '명확한 해상도의 이미지를 올려주세요!'}
        </SubTitle>

        <UploadContainer onPress={handlePickImage} activeOpacity={0.8}>
          {imageUri ? (
            <UploadImage source={{ uri: imageUri }} resizeMode="cover" />
          ) : (
            <Placeholder>
              <MaterialCommunityIcons name="calendar-month" size={44} color={theme.colors.primary} />
            </Placeholder>
          )}
          <EditIconWrapper>
            <MaterialCommunityIcons name="pencil" size={18} color={theme.colors.white} />
          </EditIconWrapper>
        </UploadContainer>
      </Content>

      <ButtonWrapper>
        <CustomButton
          text={imageUri ? '업로드하고 계속' : '건너뛰기'}
          onPress={imageUri ? handlePhotoUpload : handleCancel}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.white}
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
  padding: 24px;
`;

const Title = styled.Text`
  font-size: ${theme.fonts.title}px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-top: 16px;
`;

const SubTitle = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-top: 8px;
  margin-bottom: 60px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
  margin-top: auto;
`;

const UploadContainer = styled.TouchableOpacity`
  align-self: center;
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 80px;
  background-color: ${theme.colors.accent}33;
`;

const UploadImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const Placeholder = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const PlaceholderText = styled.Text`
  margin-top: 8px;
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray500};
`;

const EditIconWrapper = styled.View`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: ${theme.colors.primary};
  width: 32px;
  height: 32px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: ${theme.colors.white};
  z-index: 999;
  elevation: 10;
`;
