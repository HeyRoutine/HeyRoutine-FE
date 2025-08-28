import React, { useState } from 'react';
import styled from 'styled-components/native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';

import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import ProfileImage from '../../components/common/ProfileImage';
import MyPageListItem from '../../components/domain/mypage/MyPageListItem';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import { useAuthStore, useUserStore } from '../../store';
import {
  useUpdateProfileImage,
  useUpdateIsMarketing,
} from '../../hooks/user/useUser';
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
  const queryClient = useQueryClient();

  // Zustand 스토어에서 사용자 정보와 인증 상태 가져오기
  const { userInfo, updateUserInfo } = useUserStore();
  const { logout } = useAuthStore();

  // 프로필 이미지 업데이트 훅
  const { mutate: updateProfileImage, isPending: isUpdatingProfile } =
    useUpdateProfileImage();

  // 마케팅 수신동의 업데이트 훅
  const { mutate: updateIsMarketing, isPending: isUpdatingMarketing } =
    useUpdateIsMarketing();

  // 사용자 설정 상태 (userStore에서 관리)
  const marketingConsent = userInfo?.isMarketing ?? true;
  const notificationConsent = userInfo?.notificationConsent ?? true;
  const profileImageUri = userInfo?.profileImage;
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showWithdrawComplete, setShowWithdrawComplete] = useState(false);

  // 설정 변경 핸들러들
  const handleMarketingConsentChange = (value: boolean) => {
    console.log('🔍 마케팅 수신동의 변경:', value ? 'ON' : 'OFF');

    // API 호출하여 마케팅 수신동의 업데이트
    updateIsMarketing(
      { isMarketing: value },
      {
        onSuccess: (data) => {
          console.log('🔍 마케팅 수신동의 업데이트 성공:', data);
          // 로컬 상태도 즉시 업데이트 (낙관적 업데이트)
          updateUserInfo({ isMarketing: value });
        },
        onError: (error) => {
          console.error('🔍 마케팅 수신동의 업데이트 실패:', error);
          // 실패 시 원래 상태로 되돌리기
          updateUserInfo({ isMarketing: !value });
        },
      },
    );
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

  // 계좌번호 표시 로직 (항상 등록됨이 보장됨)
  const getAccountDisplayText = () => {
    const accountNumber = userInfo?.bankAccount;
    if (accountNumber) {
      // 계좌번호가 있으면 전체 표시하고 "신한" 텍스트 추가
      return `${accountNumber} 신한`;
    }
    return '계좌번호를 불러오는 중...';
  };

  const handleAccountAction = () => {
    // 테스트용: 인증 상태와 관계없이 항상 인증 화면으로 이동
    console.log('계좌 인증 화면으로 이동');
    navigation.navigate('AccountRegistration');
  };

  // 리스트 데이터
  const listData = [
    {
      id: 'account',
      type: 'item',
      title: '내 계좌 정보',
      subtitle: getAccountDisplayText(),
      rightText: userInfo?.accountCertificationStatus ? '인증완료' : '인증하기',
      rightTextColor: userInfo?.accountCertificationStatus
        ? theme.colors.gray400
        : theme.colors.primary,
      onPress: handleAccountAction, // 테스트용: 항상 클릭 가능
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
      disabled: isUpdatingMarketing,
    },
  ];

  const handleLogout = () => {
    // 로그아웃 확인 모달 표시
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    // React Query 캐시 초기화
    queryClient.clear();
    console.log('🔍 React Query 캐시 초기화 완료');

    // Zustand 스토어의 logout 함수 사용
    logout();
    console.log('🔍 로그아웃 완료');
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleWithdraw = () => {
    // 회원탈퇴 확인 모달 표시
    setShowWithdrawModal(true);
  };

  const handleWithdrawConfirm = () => {
    // 회원탈퇴 완료 화면 표시
    setShowWithdrawModal(false);
    setShowWithdrawComplete(true);
  };

  const handleWithdrawCancel = () => {
    setShowWithdrawModal(false);
  };

  const handleWithdrawComplete = () => {
    // 회원탈퇴 완료 후 내 정보 관리 화면으로 돌아가기
    setShowWithdrawComplete(false);
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
        // disabled={item.id === 'account' && userInfo?.accountCertificationStatus}
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

      <BottomSheetDialog
        visible={showLogoutModal}
        onRequestClose={handleLogoutCancel}
      >
        <ModalTitle>로그아웃</ModalTitle>
        <ModalSubtitle>헤이루틴을 로그아웃 하시겠습니까?</ModalSubtitle>
        <ButtonRow>
          <ButtonWrapper>
            <CancelButton onPress={handleLogoutCancel}>
              <CancelText>이전</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <LogoutButton onPress={handleLogoutConfirm}>
              <LogoutText>로그아웃</LogoutText>
            </LogoutButton>
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 회원탈퇴 확인 모달 */}
      <BottomSheetDialog
        visible={showWithdrawModal}
        onRequestClose={handleWithdrawCancel}
      >
        <ModalTitle>서비스 탈퇴</ModalTitle>
        <WithdrawModalSubtitle>
          정말 헤이루틴 서비스를{'\n'}탈퇴하시겠습니까?
        </WithdrawModalSubtitle>
        <ButtonRow>
          <ButtonWrapper>
            <CancelButton onPress={handleWithdrawCancel}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <WithdrawButton onPress={handleWithdrawConfirm}>
              <WithdrawText>회원 탈퇴</WithdrawText>
            </WithdrawButton>
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 회원탈퇴 완료 화면 */}
      <BottomSheetDialog
        visible={showWithdrawComplete}
        onRequestClose={handleWithdrawComplete}
      >
        <ModalTitle>탈퇴 완료</ModalTitle>
        <ModalSubtitle>
          탈퇴 완료되었습니다.{'\n'}이용해주셔서 감사합니다.
        </ModalSubtitle>
        <ButtonRow>
          <ButtonWrapper>
            <CompleteButton onPress={handleWithdrawComplete}>
              <CompleteText>확인</CompleteText>
            </CompleteButton>
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>
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

// 로그아웃 모달 스타일 컴포넌트
const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.gray800};
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ModalSubtitle = styled.Text`
  color: #6f7075;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 36px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: ${theme.colors.gray200};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const CancelText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray600};
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const LogoutText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const WithdrawButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const WithdrawText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const WithdrawModalSubtitle = styled.Text`
  color: var(--Gray-Scale-600, #6f7075);
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 36px;
`;

const CompleteButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const CompleteText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;
