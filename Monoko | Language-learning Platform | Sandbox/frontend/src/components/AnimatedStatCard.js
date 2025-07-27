import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { ScaleInView, createTimingAnimation } from './AnimatedComponents';

const AnimatedStatCard = ({ icon, value, label, color, delay = 0 }) => {
  const countAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
        createTimingAnimation(fadeAnim, 1, 600),
        Animated.timing(countAnim, {
          toValue: value,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ]).start();
  }, [value, delay]);

  return (
    <Animated.View 
      style={[
        styles.statCard, 
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Animated.Text style={styles.statNumber}>
        {countAnim.interpolate({
          inputRange: [0, value],
          outputRange: [0, value],
          extrapolate: 'clamp',
        }).__getValue().toFixed(0)}
      </Animated.Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.medium,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statNumber: {
    fontSize: fonts.xl,
    fontFamily: fonts.bold,
    color: colors.black,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: fonts.xs,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default AnimatedStatCard;
