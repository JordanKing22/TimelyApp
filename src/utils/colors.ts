import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// Calming teal/indigo palette — ADHD-friendly (high contrast, low visual noise)
export const palette = {
  // Primary — calming teal
  primary: '#4F7CAC',
  primaryLight: '#8AAFD4',
  primaryDark: '#2D5A84',

  // Accent — soft indigo
  accent: '#7B68EE',
  accentLight: '#A99FF5',

  // Semantic colors
  success: '#4CAF87',
  warning: '#F4A261',
  error: '#E76F51',
  info: '#4F7CAC',

  // Priority colors
  priorityLow: '#4CAF87',
  priorityMedium: '#F4A261',
  priorityHigh: '#E9C46A',
  priorityUrgent: '#E76F51',

  // Distraction category colors
  categoryPhone: '#7B68EE',
  categoryThought: '#4F7CAC',
  categoryEnvironment: '#4CAF87',
  categoryOther: '#A8DADC',

  // Neutrals
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceVariant: '#EEF2F7',
  border: '#DDE3ED',
  textPrimary: '#1A2332',
  textSecondary: '#5A6472',
  textDisabled: '#A0A8B3',

  // Dark mode neutrals
  darkBackground: '#0F1923',
  darkSurface: '#1A2332',
  darkSurfaceVariant: '#243040',
  darkBorder: '#2E3D50',
  darkTextPrimary: '#EEF2F7',
  darkTextSecondary: '#8A9BB0',
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    secondary: palette.accent,
    background: palette.background,
    surface: palette.surface,
    error: palette.error,
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: palette.textPrimary,
    onSurface: palette.textPrimary,
    surfaceVariant: palette.surfaceVariant,
    outline: palette.border,
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: palette.primaryLight,
    secondary: palette.accentLight,
    background: palette.darkBackground,
    surface: palette.darkSurface,
    error: palette.error,
    onPrimary: palette.darkBackground,
    onSecondary: palette.darkBackground,
    onBackground: palette.darkTextPrimary,
    onSurface: palette.darkTextPrimary,
    surfaceVariant: palette.darkSurfaceVariant,
    outline: palette.darkBorder,
  },
};

export const priorityColor = (priority: string): string => {
  switch (priority) {
    case 'low': return palette.priorityLow;
    case 'medium': return palette.priorityMedium;
    case 'high': return palette.priorityHigh;
    case 'urgent': return palette.priorityUrgent;
    default: return palette.priorityMedium;
  }
};

export const categoryColor = (category: string): string => {
  switch (category) {
    case 'phone': return palette.categoryPhone;
    case 'thought': return palette.categoryThought;
    case 'environment': return palette.categoryEnvironment;
    default: return palette.categoryOther;
  }
};
