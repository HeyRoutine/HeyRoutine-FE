import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import EmailLoginScreen from '../screens/auth/EmailLoginScreen';
import EmailInputScreen from '../screens/auth/email-signup/EmailInputScreen';
import EmailVerificationScreen from '../screens/auth/email-signup/EmailVerificationScreen';
import PasswordScreen from '../screens/auth/email-signup/PasswordScreen';
import NicknameScreen from '../screens/auth/NicknameScreen';
import ProfileImageScreen from '../screens/auth/ProfileImageScreen';
import TermsAgreementScreen from '../screens/auth/TermsAgreementScreen';

const Stack = createNativeStackNavigator();
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
      <Stack.Screen name="EmailInput" component={EmailInputScreen} />
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
      />
      <Stack.Screen name="Password" component={PasswordScreen} />
      <Stack.Screen name="Nickname" component={NicknameScreen} />
      <Stack.Screen name="ProfileImage" component={ProfileImageScreen} />
      <Stack.Screen name="TermsAgreeMent" component={TermsAgreementScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
