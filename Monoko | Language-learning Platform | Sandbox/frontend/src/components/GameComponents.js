import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { ScaleInView, FadeInView, createSpringAnimation } from './AnimatedComponents';

export const GameCard = ({ title, description, difficulty, playtime, xpReward, icon, onPress, delay = 0 }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    createSpringAnimation(scaleAnim, 0.95, { tension: 150, friction: 8 }).start();
  };

  const handlePressOut = () => {
    createSpringAnimation(scaleAnim, 1, { tension: 150, friction: 8 }).start();
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Easy': return colors.success;
      case 'Medium': return colors.warning;
      case 'Hard': return colors.error;
      default: return colors.primary;
    }
  };

  return (
    <ScaleInView delay={delay}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.gameCard}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <View style={styles.gameHeader}>
            <View style={[styles.gameIcon, { backgroundColor: `${colors.primary}20` }]}>
              <Icon name={icon} size={24} color={colors.primary} />
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>{title}</Text>
              <Text style={styles.gameDescription}>{description}</Text>
            </View>
          </View>
          
          <View style={styles.gameStats}>
            <View style={styles.statItem}>
              <Icon name="trending-up" size={16} color={getDifficultyColor(difficulty)} />
              <Text style={[styles.statText, { color: getDifficultyColor(difficulty) }]}>
                {difficulty}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="schedule" size={16} color={colors.gray} />
              <Text style={styles.statText}>{playtime}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="stars" size={16} color={colors.warning} />
              <Text style={styles.statText}>{xpReward} XP</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </ScaleInView>
  );
};

export const ProgressIndicator = ({ current, total, style }) => {
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: current / total,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [current, total]);

  return (
    <View style={[styles.progressContainer, style]}>
      <View style={styles.progressTrack}>
        <Animated.View 
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              })
            }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{current}/{total}</Text>
    </View>
  );
};

export const ScoreDisplay = ({ score, streak, style }) => {
  const scoreAnim = React.useRef(new Animated.Value(0)).current;
  const streakAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(scoreAnim, {
      toValue: score,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [score]);

  React.useEffect(() => {
    if (streak > 0) {
      Animated.sequence([
        createSpringAnimation(streakAnim, 1.2, { tension: 150, friction: 8 }),
        createSpringAnimation(streakAnim, 1, { tension: 150, friction: 8 }),
      ]).start();
    }
  }, [streak]);

  return (
    <View style={[styles.scoreContainer, style]}>
      <View style={styles.scoreItem}>
        <Icon name="stars" size={20} color={colors.warning} />
        <Animated.Text style={styles.scoreText}>
          {scoreAnim.interpolate({
            inputRange: [0, score],
            outputRange: [0, score],
            extrapolate: 'clamp',
          }).__getValue().toFixed(0)}
        </Animated.Text>
      </View>
      <Animated.View 
        style={[
          styles.scoreItem,
          { transform: [{ scale: streakAnim }] }
        ]}
      >
        <Icon name="local-fire-department" size={20} color={colors.error} />
        <Text style={styles.scoreText}>{streak}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  gameCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  gameIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  gameDescription: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.gray,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.gray,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  scoreText: {
    fontSize: fonts.md,
    fontFamily: fonts.bold,
    color: colors.black,
  },
});
