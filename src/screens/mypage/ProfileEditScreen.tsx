import React, { useState } from 'react';
import styled from 'styled-components/native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';
import ProfileImage from '../../components/common/ProfileImage';
import MyPageListItem from '../../components/domain/mypage/MyPageListItem';

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
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [notificationConsent, setNotificationConsent] = useState(true);
  const [profileImageUri, setProfileImageUri] = useState<string | undefined>();

  // 계좌 정보 (임시 데이터)
  const accountInfo = {
    hasAccount: false,
    accountNumber: '신한 123-12-123456-1',
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
      id: 'email',
      type: 'item',
      title: '이메일 설정',
      onPress: () => navigation.navigate('EmailSetting'),
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
      onToggleChange: setNotificationConsent,
    },
    {
      id: 'marketing',
      type: 'toggle',
      title: '마케팅 수신동의',
      toggleValue: marketingConsent,
      onToggleChange: setMarketingConsent,
    },
  ];

  const handleProfileEdit = () => {
    navigation.navigate('ProfileImage');
  };

  const handleLogout = () => {
    // 로그아웃 로직
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
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.gray900}
          />
        </BackButton>
        <HeaderTitle>내 정보 관리</HeaderTitle>
        <Spacer />
      </Header>

      <Content>
        <ProfileSection>
          <ProfileImage
            imageUri={profileImageUri}
            onEditPress={handleProfileEdit}
            size={100}
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

        <FooterSection insets={insets}>
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
  position: absolute;
  bottom: -80px;
  left: 0;
  right: 0;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  padding-bottom: ${(props) => props.insets?.bottom || 0}px;
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
