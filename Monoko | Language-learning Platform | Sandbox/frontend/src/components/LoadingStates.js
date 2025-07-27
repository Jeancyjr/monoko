import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

export const SkeletonLoader = ({ width, height, style }) => {
  const pulseAnim = React.useRef(new Animated.Value(0.3)).current;
  
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.skeleton, 
        { width, height, opacity: pulseAnim },
        style
      ]} 
    />
  );
};

export const LoadingDots = ({ size = 8, color = colors.primary, style }) => {
  const dot1 = React.useRef(new Animated.Value(0.3)).current;
  const dot2 = React.useRef(new Animated.Value(0.3)).current;
  const dot3 = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      );
    };

    Animated.parallel([
      animateDot(dot1, 0),
      animateDot(dot2, 200),
      animateDot(dot3, 400),
    ]).start();
  }, []);

  return (
    <View style={[styles.dotsContainer, style]}>
      <Animated.View style={[styles.dot, { width: size, height: size, backgroundColor: color, opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { width: size, height: size, backgroundColor: color, opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { width: size, height: size, backgroundColor: color, opacity: dot3 }]} />
    </View>
  );
};

export const ProgressRing = ({ progress, size = 60, strokeWidth = 4, color = colors.primary, style }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Animated.View
        style={[
          styles.progressRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: `${color}20`,
          }
        ]}
      />
      <Animated.View
        style={[
          styles.progressRingFill,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            transform: [{ rotate: '-90deg' }],
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dot: {
    borderRadius: 50,
  },
  progressRing: {
    position: 'absolute',
  },
  progressRingFill: {
    position: 'absolute',
  },
});
