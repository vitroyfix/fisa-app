// src/context/ThemeContext.jsx
//
// Global theme provider — NO external dependencies.
// Uses React Native's built-in AsyncStorage-free persistence via
// a simple module-level variable (persists for the app session)
// combined with useColorScheme() as the system default.
//
// If you later install @react-native-async-storage/async-storage,
// uncomment the three AsyncStorage lines at the bottom and remove
// the module-level `_savedMode` variable.
//
// ─── Wire into App.jsx ───────────────────────────────────────────────────────
//   import { ThemeProvider } from './src/context/ThemeContext';
//   export default function App() {
//     return (
//       <ThemeProvider>
//         <SafeAreaProvider>
//           <NavigationContainer>
//             <AppNavigator />
//           </NavigationContainer>
//         </SafeAreaProvider>
//       </ThemeProvider>
//     );
//   }
//
// ─── Consume anywhere ────────────────────────────────────────────────────────
//   import { useTheme } from '../../context/ThemeContext';
//   const { colors, isDark, toggleTheme } = useTheme();
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';
import { useColorScheme } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// LIGHT PALETTE
// ─────────────────────────────────────────────────────────────────────────────
export const lightColors = {

  // Brand
  primary:       '#E8192C',
  primaryDark:   '#C0121F',
  primaryLight:  '#FFE8EA',
  primaryShadow: 'rgba(232, 25, 44, 0.25)',

  // Neutrals
  black:         '#111111',
  white:         '#FFFFFF',
  lightGray:     '#F7F7F7',
  mediumGray:    '#E8E8E8',
  darkGray:      '#8A8A8A',
  trueGray:      '#D1D5DB',

  // Text
  textPrimary:   '#111111',
  textSecondary: '#8A8A8A',
  textHint:      '#BBBBBB',
  textDisabled:  '#CCCCCC',
  textInverse:   '#FFFFFF',

  // Surfaces
  background:      '#FFFFFF',
  surface:         '#FFFFFF',
  surfaceAlt:      '#F7F7F7',
  surfaceElevated: '#FFFFFF',
  surfaceOverlay:  'rgba(0, 0, 0, 0.45)',

  // Borders / Dividers
  divider:      '#F2F2F2',
  border:       'rgba(0,0,0,0.08)',
  borderStrong: 'rgba(0,0,0,0.14)',
  borderFocus:  '#E8192C',

  // Cards / Shadows
  cardBackground: '#FFFFFF',
  cardShadow:     '#000000',
  shadowSm:  'rgba(0, 0, 0, 0.06)',
  shadowMd:  'rgba(0, 0, 0, 0.10)',
  shadowLg:  'rgba(0, 0, 0, 0.16)',

  // Semantic — Success
  success:      '#00C853',
  successLight: '#DCFCE7',
  successDark:  '#166534',

  // Semantic — Error
  error:       '#E8192C',
  errorLight:  '#FFE8EA',
  errorDark:   '#9B0D1A',

  // Semantic — Warning
  warning:      '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark:  '#92400E',

  // Semantic — Info
  info:      '#6366F1',
  infoLight: '#EEF2FF',
  infoDark:  '#3730A3',

  // Tag / Badge system
  tagGreen:       '#DCFCE7',  tagGreenText:  '#166534',
  tagAmber:       '#FEF3C7',  tagAmberText:  '#92400E',
  tagBlue:        '#EEF2FF',  tagBlueText:   '#3730A3',
  tagPurple:      '#F3E8FF',  tagPurpleText: '#6B21A8',
  tagRed:         '#FFE8EA',  tagRedText:    '#9B0D1A',
  tagGray:        '#F3F4F6',  tagGrayText:   '#374151',
  tagTeal:        '#CCFBF1',  tagTealText:   '#134E4A',

  // Online / status dots
  onlineGreen: '#22C55E',
  awayAmber:   '#F59E0B',
  offlineGray: '#9CA3AF',

  // Charts
  chart1: '#E8192C',
  chart2: '#6366F1',
  chart3: '#22C55E',
  chart4: '#F59E0B',
  chart5: '#0EA5E9',
  chart6: '#EC4899',

  // Skeleton / loading
  skeleton:     '#EBEBEB',
  skeletonShim: '#F5F5F5',

  // Overlay / scrim
  overlay:      'rgba(0, 0, 0, 0.45)',
  overlayLight: 'rgba(0, 0, 0, 0.20)',

  // Tab bar
  tabBarBackground: '#FFFFFF',
  tabBarBorder:     '#EEEEEE',
  tabBarActive:     '#E8192C',
  tabBarInactive:   '#AAAAAA',

  // Input
  inputBackground:  '#F7F7F7',
  inputBorder:      'rgba(0,0,0,0.10)',
  inputBorderFocus: '#E8192C',
  inputPlaceholder: '#BBBBBB',

  // Navigation / header
  headerBackground: '#FFFFFF',
  headerBorder:     '#F2F2F2',
  headerText:       '#111111',
};

// ─────────────────────────────────────────────────────────────────────────────
// DARK PALETTE  — every token from lightColors, dark values
// ─────────────────────────────────────────────────────────────────────────────
export const darkColors = {

  // Brand
  primary:       '#FF4D5E',
  primaryDark:   '#FFB3B8',
  primaryLight:  '#3D0A0E',
  primaryShadow: 'rgba(255, 77, 94, 0.30)',

  // Neutrals
  black:         '#F5F5F5',
  white:         '#FFFFFF',
  lightGray:     '#1C1C1E',
  mediumGray:    '#3A3A3C',
  darkGray:      '#8A8A8A',
  trueGray:      '#48484A',

  // Text
  textPrimary:   '#F5F5F5',
  textSecondary: '#9CA3AF',
  textHint:      '#6B7280',
  textDisabled:  '#4B5563',
  textInverse:   '#111111',

  // Surfaces
  background:      '#0F0F0F',
  surface:         '#1C1C1E',
  surfaceAlt:      '#2C2C2E',
  surfaceElevated: '#2C2C2E',
  surfaceOverlay:  'rgba(0, 0, 0, 0.65)',

  // Borders / Dividers
  divider:      '#2C2C2E',
  border:       'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  borderFocus:  '#FF4D5E',

  // Cards / Shadows
  cardBackground: '#1C1C1E',
  cardShadow:     '#000000',
  shadowSm:  'rgba(0, 0, 0, 0.30)',
  shadowMd:  'rgba(0, 0, 0, 0.45)',
  shadowLg:  'rgba(0, 0, 0, 0.60)',

  // Semantic — Success
  success:      '#4ADE80',
  successLight: '#14532D',
  successDark:  '#86EFAC',

  // Semantic — Error
  error:       '#FF4D5E',
  errorLight:  '#3D0A0E',
  errorDark:   '#FFB3B8',

  // Semantic — Warning
  warning:      '#FBBF24',
  warningLight: '#451A03',
  warningDark:  '#FDE68A',

  // Semantic — Info
  info:      '#818CF8',
  infoLight: '#1E1B4B',
  infoDark:  '#C7D2FE',

  // Tag / Badge system
  tagGreen:       '#14532D',  tagGreenText:  '#4ADE80',
  tagAmber:       '#451A03',  tagAmberText:  '#FDE68A',
  tagBlue:        '#1E1B4B',  tagBlueText:   '#C7D2FE',
  tagPurple:      '#3B0764',  tagPurpleText: '#E9D5FF',
  tagRed:         '#3D0A0E',  tagRedText:    '#FFB3B8',
  tagGray:        '#374151',  tagGrayText:   '#D1D5DB',
  tagTeal:        '#042F2E',  tagTealText:   '#99F6E4',

  // Online / status dots
  onlineGreen: '#4ADE80',
  awayAmber:   '#FBBF24',
  offlineGray: '#6B7280',

  // Charts
  chart1: '#FF4D5E',
  chart2: '#818CF8',
  chart3: '#4ADE80',
  chart4: '#FBBF24',
  chart5: '#38BDF8',
  chart6: '#F472B6',

  // Skeleton / loading
  skeleton:     '#2C2C2E',
  skeletonShim: '#3A3A3C',

  // Overlay / scrim
  overlay:      'rgba(0, 0, 0, 0.65)',
  overlayLight: 'rgba(0, 0, 0, 0.40)',

  // Tab bar
  tabBarBackground: '#1C1C1E',
  tabBarBorder:     '#2C2C2E',
  tabBarActive:     '#FF4D5E',
  tabBarInactive:   '#6B7280',

  // Input
  inputBackground:  '#2C2C2E',
  inputBorder:      'rgba(255,255,255,0.10)',
  inputBorderFocus: '#FF4D5E',
  inputPlaceholder: '#6B7280',

  // Navigation / header
  headerBackground: '#1C1C1E',
  headerBorder:     '#2C2C2E',
  headerText:       '#F5F5F5',
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

// Module-level variable: survives re-renders, persists for the app session.
// Replace with AsyncStorage once you install the package (see top comment).
let _savedMode = null;

const ThemeContext = createContext({
  isDark:      false,
  toggleTheme: () => {},
  colors:      lightColors,
});

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'dark' | 'light' | null

  const [isDark, setIsDark] = useState(() => {
    // Use saved session preference if available, otherwise fall back to system
    if (_savedMode === 'dark')  return true;
    if (_savedMode === 'light') return false;
    return systemScheme === 'dark';
  });

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      _savedMode = next ? 'dark' : 'light'; // save for session
      // ── Uncomment below once @react-native-async-storage/async-storage is installed ──
      // AsyncStorage.setItem('@fisa_theme_mode', next ? 'dark' : 'light').catch(() => {});
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggleTheme,
      colors: isDark ? darkColors : lightColors,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}