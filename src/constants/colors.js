// src/constants/colors.js
//
// Single source of truth for every color token in the FISA app.
// Two palettes: LIGHT (default) and DARK.
// Every token exists in both palettes under the same name.
//
// ─── Two ways to consume ─────────────────────────────────────────────────────
//
//  1. STATIC (existing screens — zero changes needed):
//       import colors from '../../constants/colors';
//       style={{ color: colors.primary }}
//       → Always returns the LIGHT palette. Works today, no dark mode.
//
//  2. THEME-AWARE (new / migrated screens):
//       import { useColors } from '../../constants/colors';
//       const colors = useColors();   // call inside component body
//       style={{ color: colors.primary }}
//       → Re-renders automatically when the user toggles dark mode.
//
// ─── Full token reference ─────────────────────────────────────────────────────
//
//  BRAND          primary, primaryDark, primaryLight, primaryShadow
//  NEUTRALS       black, white, lightGray, mediumGray, darkGray
//  TEXT           textPrimary, textSecondary, textHint, textDisabled, textInverse
//  SURFACES       background, surface, surfaceAlt, surfaceElevated, surfaceOverlay
//  BORDERS        divider, border, borderStrong, borderFocus
//  SEMANTIC       success, successLight, successDark
//                 error,   errorLight,   errorDark
//                 warning, warningLight, warningDark
//                 info,    infoLight,    infoDark
//  TAGS / BADGES  tagGreen, tagGreenText, tagAmber, tagAmberText,
//                 tagBlue,  tagBlueText,  tagPurple, tagPurpleText,
//                 tagRed,   tagRedText
//  CHARTS         chart1 … chart6
//  MISC           shadow, overlay, skeleton
//
// ─────────────────────────────────────────────────────────────────────────────

import { useTheme, lightColors } from '../context/ThemeContext';

// Hook — live, responds to theme toggle.
export function useColors() {
  return useTheme().colors;
}

// Default export — static light palette (backwards-compatible).
const colors = lightColors;
export default colors;