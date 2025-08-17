import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeStack, ProfileStack, AnalysisStack } from './stack';
import { theme } from '../styles/theme';

const Tab = createBottomTabNavigator();

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
        component={AnalysisStack}
        options={{ tabBarLabel: '분석' }}
      />
      <Tab.Screen
        name="Home"
        component={HomeStack}
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
