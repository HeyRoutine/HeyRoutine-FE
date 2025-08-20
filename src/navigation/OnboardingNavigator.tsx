import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TimetableUploadScreen from '../screens/onboarding/TimetableUploadScreen';
import AiConsentScreen from '../screens/onboarding/AiConsentScreen';
import AiRecommendationScreen from '../screens/onboarding/AiRecommendationScreen';
import OnboardingLoadingScreen from '../screens/onboarding/OnboardingLoadingScreen';
import ResultScreen from '../screens/common/ResultScreen';

const Stack = createNativeStackNavigator();

interface OnboardingNavigatorProps {
  onComplete?: () => void;
  initialRouteName?: string;
  initialParams?: any;
}

const OnboardingNavigator = ({
  onComplete,
  initialParams,
}: OnboardingNavigatorProps) => {
  return (
    <Stack.Navigator
      initialRouteName="OnboardingLoading"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="OnboardingLoading"
        component={OnboardingLoadingScreen}
        initialParams={initialParams}
      />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="TimetableUpload" component={TimetableUploadScreen} />
      <Stack.Screen name="AiConsent" component={AiConsentScreen} />
      <Stack.Screen
        name="AiRecommendation"
        component={AiRecommendationScreen}
      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
