import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { DarkTheme, ThemeProvider } from 'expo-router/react-navigation';
import Colors from '../constants/Colors';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack 
        initialRouteName="index"
        screenOptions={{ 
          headerShown: false, 
          contentStyle: { backgroundColor: Colors.dark.background } 
        }}
      >
        {/* Explicitly register the Welcome screen as the first screen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Register the tabs navigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
