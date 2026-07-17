// src/context/TabBarHeightContext.js
//
// Shares the runtime tab bar height with any screen that needs it for KAV.
// Usage:
//   Provider → wrap BottomTabNavigator in AppNavigator
//   Consumer → call useTabBarHeight() inside any screen

import React, { createContext, useContext, useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabBarHeightContext = createContext(0);

export function TabBarHeightProvider({ children }) {
  const insets        = useSafeAreaInsets();
  const bottomInset   = insets.bottom;
  const TAB_ICON_AREA = Platform.OS === 'ios' ? 60 : 58;
  // Exact same formula as BottomTabNavigator's tabBarHeight
  const tabBarHeight  = TAB_ICON_AREA + (bottomInset > 0 ? bottomInset : 8);

  return (
    <TabBarHeightContext.Provider value={tabBarHeight}>
      {children}
    </TabBarHeightContext.Provider>
  );
}

export function useTabBarHeight() {
  return useContext(TabBarHeightContext);
}