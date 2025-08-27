import React, { useState } from 'react';
import styled from 'styled-components/native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import ProfileImage from '../../components/common/ProfileImage';
import MyPageListItem from '../../components/domain/mypage/MyPageListItem';
import { useAuthStore, useUserStore } from '../../store';
import { useUpdateProfileImage } from '../../hooks/user/useUser';
import { uploadImage } from '../../utils/s3';
import * as ImagePicker from 'expo-image-picker';

/**
 * ProfileEditScreen의 props 인터페이스
 */
interface IProfileEditScreenProps {
  /** 네비게이션 객체 */
  navigation: any;
}

/**
 * 내 정보 관리 화면 컴포넌트
 * 사용자의 정보 관리 및 설정을 제공합니다.
 * @param props - 컴포넌트 props
 * @returns 내 정보 관리 화면 컴포넌트
 */
const ProfileEditScreen = ({ navigation }: IProfileEditScreenProps) => {
  const insets = useSafeAreaInsets();

  // Zustand 스토어에서 사용자 정보와 인증 상태 가져오기
  const { userInfo, updateUserInfo } = useUserStore();
  const { logout } = useAuthStore();

  // 프로필 이미지 업데이트 훅
  const { mutate: updateProfileImage, isPending: isUpdatingProfile } =
    useUpdateProfileImage();

  // 사용자 설정 상태 (userStore에서 관리)
  const marketingConsent = userInfo?.marketingConsent ?? true;
  const notificationConsent = userInfo?.notificationConsent ?? true;
  const profileImageUri = userInfo?.profileImage;

  // 설정 변경 핸들러들
  const handleMarketingConsentChange = (value: boolean) => {
    updateUserInfo({ marketingConsent: value });
  };

  const handleNotificationConsentChange = (value: boolean) => {
    updateUserInfo({ notificationConsent: value });
  };

  // 프로필 이미지 선택 및 업데이트 핸들러
  const handleProfileImageEdit = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;

      try {
        // S3에 이미지 업로드
        const fileName = `profile_${Date.now()}.jpg`;
        const userEmail = userInfo?.email || '';
        console.log('프로필 이미지 업로드 시작:', {
          email: userEmail,
          fileName,
        });

        const imageUrl = await uploadImage(
          userEmail,
          imageUri,
          fileName,
          'image/jpeg',
        );
        console.log('프로필 이미지 업로드 성공! 이미지 URL:', imageUrl);

        // API 호출하여 프로필 이미지 업데이트
        updateProfileImage(
          { profileImageUrl: imageUrl },
          {
            onSuccess: (data) => {
              console.log('프로필 이미지 업데이트 성공:', data);

              // 로컬 상태도 즉시 업데이트 (낙관적 업데이트)
              updateUserInfo({ profileImage: imageUrl });
            },
            onError: (error) => {
              console.error('프로필 이미지 업데이트 실패:', error);
            },
          },
        );
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
      }
    }
  };

  // 계좌 정보 (userStore에서 관리)
  const accountInfo = userInfo?.accountInfo || {
    hasAccount: false,
    accountNumber: '',
  };

  const handleAccountAction = () => {
    if (accountInfo.hasAccount) {
      // 계좌 삭제 로직
      console.log('계좌 삭제');
    } else {
      // 계좌 등록 화면으로 이동
      navigation.navigate('AccountRegistration');
    }
  };

  // 리스트 데이터
  const listData = [
    {
      id: 'account',
      type: 'item',
      title: '내 계좌 정보',
      subtitle: accountInfo.hasAccount
        ? accountInfo.accountNumber
        : '계좌 등록이 필요합니다.',
      rightText: accountInfo.hasAccount ? '삭제하기' : '등록하기',
      rightTextColor: accountInfo.hasAccount
        ? theme.colors.error
        : theme.colors.primary,
      onPress: handleAccountAction,
    },
    {
      id: 'password',
      type: 'item',
      title: '비밀번호 설정',
      onPress: () => navigation.navigate('PasswordSetting'),
    },
    {
      id: 'nickname',
      type: 'item',
      title: '닉네임 설정',
      onPress: () => navigation.navigate('NicknameSetting'),
    },
    {
      id: 'phone',
      type: 'item',
      title: '전화번호 설정',
      onPress: () => navigation.navigate('PhoneNumberSetting'),
    },
    {
      id: 'notification',
      type: 'toggle',
      title: '알림 설정',
      toggleValue: notificationConsent,
      onToggleChange: handleNotificationConsentChange,
    },
    {
      id: 'marketing',
      type: 'toggle',
      title: '마케팅 수신동의',
      toggleValue: marketingConsent,
      onToggleChange: handleMarketingConsentChange,
    },
  ];

  const handleLogout = () => {
    // Zustand 스토어의 logout 함수 사용
    logout();
    console.log('로그아웃');
  };

  const handleWithdraw = () => {
    // 회원탈퇴 로직
    console.log('회원탈퇴');
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <MyPageListItem
        title={item.title}
        subtitle={item.subtitle}
        rightText={item.rightText}
        rightTextColor={item.rightTextColor}
        onPress={item.onPress}
        isToggle={item.type === 'toggle'}
        toggleValue={item.toggleValue}
        onToggleChange={item.onToggleChange}
        showArrow={item.type === 'item'}
      />
    );
  };

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header title="내 정보 관리" onBackPress={() => navigation.goBack()} />

      <Content>
        <ProfileSection>
          <ProfileImage
            imageUri={userInfo?.profileImage || profileImageUri}
            onEditPress={handleProfileImageEdit}
            size={100}
            showEditButton={true}
          />
        </ProfileSection>

        <ListContainer>
          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </ListContainer>

        <FooterSection>
          <FooterButton onPress={handleLogout}>
            <FooterText>로그아웃</FooterText>
          </FooterButton>
          <Divider />
          <FooterButton onPress={handleWithdraw}>
            <FooterText>회원탈퇴</FooterText>
          </FooterButton>
        </FooterSection>
      </Content>
    </Container>
  );
};

export default ProfileEditScreen;

// 스타일 컴포넌트 정의
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  position: relative;
`;

const ProfileSection = styled.View`
  align-items: center;
  padding: 48px 0;
`;

const ProfileInfo = styled.View`
  margin-left: 16px;
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 18px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
  margin-bottom: 4px;
`;

const UserEmail = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const ListContainer = styled.View`
  flex: 1;
`;

const Separator = styled.View`
  height: 3px;
  background-color: ${theme.colors.gray200};
  margin: 0 20px;
`;

const FooterSection = styled.View`
  /* position: absolute;
  bottom: 0;
  left: 0;
  right: 0; */
  /* flex: 1; */
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 16px;
  background-color: ${theme.colors.white};
`;

const FooterButton = styled.TouchableOpacity`
  padding: 8px 8px;
`;

const FooterText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray400};
`;

const Divider = styled.View`
  width: 1px;
  height: 16px;
  background-color: ${theme.colors.gray100};
  margin: 0 8px;
`;
