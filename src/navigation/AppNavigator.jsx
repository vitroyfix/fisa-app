import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth">
          {(props) => <AuthNavigator {...props} onLogin={() => setIsAuthenticated(true)} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      )}
    </Stack.Navigator>
  );
}