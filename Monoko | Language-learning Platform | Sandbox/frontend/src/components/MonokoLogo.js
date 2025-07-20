import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

const MonokoLogo = ({ 
  size = 'medium', 
  variant = 'horizontal', 
  color = 'primary',
  showTagline = false,
  style = {}
}) => {
  const sizeStyles = {
    small: {
      fontSize: 20,
      iconSize: 16,
      taglineSize: 10,
    },
    medium: {
      fontSize: 32,
      iconSize: 24,
      taglineSize: 12,
    },
    large: {
      fontSize: 48,
      iconSize: 36,
      taglineSize: 14,
    },
    xlarge: {
      fontSize: 56,
      iconSize: 44,
      taglineSize: 16,
    },
  };

  const colorStyles = {
    primary: colors.primary,
    white: colors.white,
    black: colors.black,
    secondary: colors.secondary,
  };

  const currentSize = sizeStyles[size];
  const currentColor = colorStyles[color];

  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.logoContainer,
        variant === 'stacked' && styles.stackedContainer
      ]}>
        <Text style={[
          styles.logoText,
          {
            fontSize: currentSize.fontSize,
            color: currentColor,
          }
        ]}>
          M<Text style={[
            styles.logoIcon,
            { fontSize: currentSize.iconSize }
          ]}>💬</Text>noko
        </Text>
      </View>
      
      {showTagline && (
        <Text style={[
          styles.tagline,
          {
            fontSize: currentSize.taglineSize,
            color: currentColor === colors.white ? colors.primaryLight : colors.gray,
          }
        ]}>
          Speak the Heart of Africa
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackedContainer: {
    flexDirection: 'column',
  },
  logoText: {
    fontFamily: fonts.bold,
    letterSpacing: -1,
    textAlign: 'center',
  },
  logoIcon: {
    // Speech bubble emoji inherits color from parent
  },
  tagline: {
    fontFamily: fonts.medium,
    letterSpacing: 0.5,
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default MonokoLogo;

// Usage Examples:
/*
<MonokoLogo size="small" color="white" />
<MonokoLogo size="large" color="primary" showTagline />
<MonokoLogo size="medium" variant="stacked" color="black" showTagline />
*/
