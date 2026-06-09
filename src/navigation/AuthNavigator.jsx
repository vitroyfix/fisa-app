import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import VerifyCodeScreen from '../screens/auth/VerifyCodeScreen';
import VerificationSuccessScreen from '../screens/auth/VerificationSuccessScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator({ onLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <Stack.Screen name="VerificationSuccess">
        {(props) => <VerificationSuccessScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}