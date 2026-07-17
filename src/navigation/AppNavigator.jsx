// src/navigation/AppNavigator.jsx
import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator      from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import PeerProfileScreen  from '../screens/community/PeerProfileScreen';
import GroupsScreen       from '../screens/community/GroupsScreen';
import { TabBarHeightProvider } from '../context/TabBarHeightContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    // TabBarHeightProvider wraps the entire navigator tree so any screen
    // can call useTabBarHeight() to get the exact tab bar height at runtime.
    <TabBarHeightProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth">
            {(props) => <AuthNavigator {...props} onLogin={() => setIsAuthenticated(true)} />}
          </Stack.Screen>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Main"        component={BottomTabNavigator} />
            <Stack.Screen name="PeerProfile" component={PeerProfileScreen}  />
            <Stack.Screen name="Groups"      component={GroupsScreen}       />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </TabBarHeightProvider>
  );
}