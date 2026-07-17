// src/navigation/BottomTabNavigator.jsx
import React, { useMemo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationBar } from 'expo-navigation-bar'; // ← named component import (SDK 56+)
import {
  Home,
  Compass,
  UsersRound,
  BookOpen,
  CircleUser,
} from 'lucide-react-native';

import { useColors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

import HomeScreen       from '../screens/home/HomeScreen';
import MentorshipScreen from '../screens/mentorship/MentorshipScreen';
import CommunityScreen  from '../screens/community/CommunityScreen';
import ResourcesScreen  from '../screens/resources/ResourcesScreen';
import ProfileScreen    from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

// Hex values that match your light/dark palette backgrounds.
// Must be plain 6-digit hex — NavigationBar's backgroundColor prop requires it.
const NAV_BAR_BG = {
  light: '#FFFFFF',
  dark:  '#0F0F0F',
};

const ICON_MAP = {
  Home:       Home,
  Mentorship: Compass,
  Community:  UsersRound,
  Resources:  BookOpen,
  Profile:    CircleUser,
};

function TabIcon({ IconComponent, color, focused, activeColor }) {
  return (
    <View style={[
      styles.iconWrap,
      focused && { backgroundColor: activeColor + '18' },
    ]}>
      <IconComponent
        size={22}
        color={color}
        strokeWidth={focused ? 2.2 : 1.6}
      />
    </View>
  );
}

export default function BottomTabNavigator() {
  const insets  = useSafeAreaInsets();
  const colors  = useColors();
  const { isDark } = useTheme();

  const bottomInset   = insets.bottom;
  const TAB_ICON_AREA = Platform.OS === 'ios' ? 50 : 48;
  const tabBarHeight  = TAB_ICON_AREA + (bottomInset > 0 ? bottomInset : 6);

  const tabBarStyle = useMemo(() => ({
    height:          tabBarHeight,
    paddingTop:      6,
    paddingBottom:   bottomInset > 0 ? bottomInset : 6,
    backgroundColor: colors.tabBarBackground ?? colors.surface,
    borderTopColor:  colors.tabBarBorder     ?? colors.divider,
    shadowColor:     '#000',
  }), [bottomInset, tabBarHeight, colors]);

  return (
    <>
      {/*
        ── Android physical navigation bar theming ──────────────────────────
        SDK 56 uses a declarative <NavigationBar> component instead of the
        old setBackgroundColorAsync / setButtonStyleAsync functions.

        - backgroundColor: matches the app's background so the bar blends in
        - style: "light" = white back/home icons (for dark bg)
                 "dark"  = black back/home icons (for light bg)

        Re-renders whenever isDark changes → bar updates instantly on toggle.
        No-op on iOS (the component does nothing outside Android).
        ─────────────────────────────────────────────────────────────────────
      */}
      <NavigationBar
        backgroundColor={isDark ? NAV_BAR_BG.dark : NAV_BAR_BG.light}
        style={isDark ? 'light' : 'dark'}
      />

      <Tab.Navigator
        screenOptions={({ route }) => {
          const IconComponent = ICON_MAP[route.name];
          return {
            headerShown:             false,
            tabBarShowLabel:         false,
            tabBarActiveTintColor:   colors.tabBarActive   ?? colors.primary,
            tabBarInactiveTintColor: colors.tabBarInactive ?? colors.textSecondary,
            tabBarStyle:             [styles.tabBarBase, tabBarStyle],

            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                IconComponent={IconComponent}
                color={color}
                focused={focused}
                activeColor={colors.tabBarActive ?? colors.primary}
              />
            ),
            tabBarHeight,
          };
        }}
      >
        <Tab.Screen name="Home"       component={HomeScreen}       />
        <Tab.Screen name="Mentorship" component={MentorshipScreen} />
        <Tab.Screen name="Community"  component={CommunityScreen}  />
        <Tab.Screen name="Resources"  component={ResourcesScreen}  />
        <Tab.Screen name="Profile"    component={ProfileScreen}    />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  tabBarBase: {
    paddingHorizontal: 8,
    borderTopWidth:    0.5,
    shadowOffset:      { width: 0, height: -2 },
    shadowOpacity:     0.06,
    shadowRadius:      12,
    elevation:         12,
  },
  iconWrap: {
    width:          44,
    height:         34,
    borderRadius:   10,
    justifyContent: 'center',
    alignItems:     'center',
  },
});