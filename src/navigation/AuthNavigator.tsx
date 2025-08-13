import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import EmailLoginScreen from '../screens/auth/EmailLoginScreen';
import EmailInputScreen from '../screens/auth/email-signup/EmailInputScreen';

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
      <Stack.Screen name="EmailLoginScreen" component={EmailLoginScreen} />
      <Stack.Screen name="EmailInputScreen" component={EmailInputScreen} />
      {/* <Stack.Screen name="VerificationScreen" component={VerificationScreen} /> */}
      {/* <Stack.Screen name="PasswordResetScreen" component={PasswordResetScreen} /> */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
