import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, fonts, spacing } from '../theme';

const MonokoLogo = ({ 
  size = 'medium', 
  color = 'primary', 
  showTagline = false, 
  style 
}) => {
  const sizeStyles = {
    small: { width: 80, height: 24 },
    medium: { width: 120, height: 36 },
    large: { width: 160, height: 48 },
  };

  const colorStyles = {
    primary: { color: colors.primary },
    white: { color: colors.white },
    black: { color: colors.black },
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/monoko-logo.png')}
          style={[styles.logoImage, sizeStyles[size]]}
          resizeMode="contain"
        />
      </View>
      {showTagline && (
        <Text style={[styles.tagline, colorStyles[color]]}>
          Learn African Languages
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
  logoImage: {
    tintColor: undefined,
  },
  tagline: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    marginTop: spacing.xs,
    letterSpacing: 0.5,
    opacity: 0.8,
  },
});

export default MonokoLogo;
