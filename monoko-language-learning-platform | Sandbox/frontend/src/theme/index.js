// Monoko App Theme Configuration
// Colors inspired by African landscapes and cultures

export const colors = {
  // Primary colors - inspired by African sunsets
  primary: '#E67E22',        // Warm orange
  primaryLight: '#F39C12',   // Golden yellow
  primaryDark: '#D35400',    // Deep orange
  
  // Secondary colors - inspired by African nature
  secondary: '#27AE60',      // Savanna green
  secondaryLight: '#2ECC71', // Bright green
  secondaryDark: '#229954',  // Forest green
  
  // Accent colors
  accent: '#9B59B6',         // Purple (for achievements)
  accentLight: '#BB8FCE',    // Light purple
  
  // Language-specific colors
  swahili: '#3498DB',        // Ocean blue (East Africa)
  lingala: '#E74C3C',        // Rich red (Central Africa)
  amharic: '#F1C40F',        // Golden yellow (Ethiopia)
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#2C3E50',
  gray: '#7F8C8D',
  lightGray: '#BDC3C7',
  darkGray: '#34495E',
  
  // Background colors
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  
  // Status colors
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',
  
  // Game colors
  correct: '#27AE60',
  incorrect: '#E74C3C',
  neutral: '#95A5A6',
};

export const fonts = {
  // Font families (to be replaced with custom African-inspired fonts)
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
  
  // Font sizes
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const shadows = {
  small: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Animation durations
export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Screen dimensions helpers
export const layout = {
  window: {
    // These will be set dynamically based on device
    width: 0,
    height: 0,
  },
  isSmallDevice: false, // Will be set based on screen width
};
