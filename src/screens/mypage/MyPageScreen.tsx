import React, { useState } from 'react';
import styled from 'styled-components/native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { FlatList } from 'react-native';

import { theme } from '../../styles/theme';
import ProfileImage from '../../components/common/ProfileImage';
import MyPageListItem from '../../components/domain/mypage/MyPageListItem';
import { useUserStore } from '../../store';

/**
 * MyPageScreen의 props 인터페이스
 */
interface IMyPageScreenProps {
  /** 네비게이션 객체 */
  navigation: any;
}

/**
 * 마이페이지 화면 컴포넌트
 * 사용자의 메인 마이페이지를 표시합니다.
 * @param props - 컴포넌트 props
 * @returns 마이페이지 화면 컴포넌트
 */
const MyPageScreen = ({ navigation }: IMyPageScreenProps) => {
  const insets = useSafeAreaInsets();

  // Zustand 스토어에서 사용자 정보 가져오기
  const { userInfo } = useUserStore();

  // 리스트 데이터
  const listData = [
    {
      id: 'profile',
      type: 'item',
      title: '내 정보 관리',
      onPress: () => navigation.navigate('ProfileEdit'),
    },
    {
      id: 'points',
      type: 'item',
      title: '포인트 상점',
      onPress: () => navigation.navigate('PointShop'),
    },
    {
      id: 'suggestion',
      type: 'item',
      title: '서비스 건의하기',
      onPress: () => navigation.navigate('Suggestion'),
    },
    {
      id: 'license',
      type: 'item',
      title: '오픈소스 라이선스',
      onPress: () => navigation.navigate('License'),
    },
    {
      id: 'privacy',
      type: 'item',
      title: '개인정보 처리방침',
      onPress: () => navigation.navigate('Privacy'),
    },
    {
      id: 'terms',
      type: 'item',
      title: '서비스 이용약관',
      onPress: () => navigation.navigate('Terms'),
    },
  ];

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <>
        <MyPageListItem
          title={item.title}
          onPress={item.onPress}
          showArrow={true}
        />
        {index === 2 && <Separator />}
      </>
    );
  };

  return (
    <Container>
      <Content>
        <ProfileSection insets={insets}>
          <ProfileImage
            imageUri={userInfo?.profileImage}
            onEditPress={() => {}}
            size={64}
            showEditButton={false}
          />
          <ProfileInfo>
            <UserName>
              {userInfo?.nickname || 'SSAFY 14기 부울경 화이팅'}
            </UserName>
          </ProfileInfo>
        </ProfileSection>

        <Separator />

        <ListContainer>
          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </ListContainer>
      </Content>
    </Container>
  );
};

export default MyPageScreen;

// 스타일 컴포넌트 정의
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
`;

const ProfileSection = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 48px 24px 24px 24px;
`;

const ProfileInfo = styled.View`
  margin-left: 16px;
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 18px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
`;

const ListContainer = styled.View`
  flex: 1;
`;

const Separator = styled.View`
  height: 4px;
  background-color: ${theme.colors.gray200};
  width: 100%;
`;
