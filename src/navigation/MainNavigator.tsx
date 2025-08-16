import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/home/HomeScreen';
import AnalysisScreen from '../screens/analysis/AnalysisScreen';
import MyPageScreen from '../screens/mypage/MyPageScreen';
import ProfileEditScreen from '../screens/mypage/ProfileEditScreen';
import AccountRegistrationScreen from '../screens/mypage/AccountRegistrationScreen';
import PointGifticonScreen from '../screens/mypage/PointGifticonScreen';
import PointCashoutScreen from '../screens/mypage/PointCashoutScreen';
import NicknameSettingScreen from '../screens/mypage/NicknameSettingScreen';
import EmailSettingScreen from '../screens/mypage/EmailSettingScreen';
import PhoneNumberSettingScreen from '../screens/mypage/PhoneNumberSettingScreen';
import { theme } from '../styles/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyPage" component={MyPageScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen
        name="AccountRegistration"
        component={AccountRegistrationScreen}
      />
      <Stack.Screen name="PointGifticon" component={PointGifticonScreen} />
      <Stack.Screen name="PointCashout" component={PointCashoutScreen} />
      <Stack.Screen name="NicknameSetting" component={NicknameSettingScreen} />
      <Stack.Screen name="EmailSetting" component={EmailSettingScreen} />
      <Stack.Screen
        name="PhoneNumberSetting"
        component={PhoneNumberSettingScreen}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Analysis') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray500,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.gray200,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.fonts.Regular,
        },
      })}
    >
      <Tab.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{ tabBarLabel: '분석' }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: '홈' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ tabBarLabel: '내 정보' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
