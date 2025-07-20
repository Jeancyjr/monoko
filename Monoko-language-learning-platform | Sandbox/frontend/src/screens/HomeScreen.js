import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius } from '../theme';
import { setSelectedLanguage } from '../store/store';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { selectedLanguage, streak, totalXP } = useSelector(state => state.user);
  const { currentLevel, dailyGoalMet } = useSelector(state => state.progress);

  const quickActions = [
    {
      id: 'daily-lesson',
      title: 'Daily Lesson',
      subtitle: 'Continue your journey',
      icon: 'school',
      color: colors.primary,
      screen: 'Lessons',
    },
    {
      id: 'snap-learn',
      title: 'Snap & Learn',
      subtitle: 'Photo vocabulary',
      icon: 'camera-alt',
      color: colors.secondary,
      screen: 'SnapLearn',
    },
    {
      id: 'practice-games',
      title: 'Practice Games',
      subtitle: 'Fun exercises',
      icon: 'games',
      color: colors.accent,
      screen: 'Games',
    },
    {
      id: 'live-local',
      title: 'Live with Local',
      subtitle: 'Speak with natives',
      icon: 'video-call',
      color: colors.lingala,
      screen: 'LiveSessions',
    },
  ];

  const languages = [
    { code: 'sw', name: 'Swahili', flag: '🇰🇪', color: colors.swahili },
    { code: 'ln', name: 'Lingala', flag: '🇨🇩', color: colors.lingala },
    { code: 'am', name: 'Amharic', flag: '🇪🇹', color: colors.amharic },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Jambo! 👋</Text>
          <Text style={styles.subtitle}>Ready to learn today?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Icon name="person" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="local-fire-department" size={24} color={colors.warning} />
          <Text style={styles.statNumber}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="stars" size={24} color={colors.primary} />
          <Text style={styles.statNumber}>{totalXP}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="trending-up" size={24} color={colors.secondary} />
          <Text style={styles.statNumber}>{currentLevel}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      {/* Language Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Language</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageCard,
                selectedLanguage === language.code && styles.selectedLanguageCard
              ]}
              onPress={() => dispatch(setSelectedLanguage(language.code))}
            >
              <Text style={styles.languageFlag}>{language.flag}</Text>
              <Text style={styles.languageName}>{language.name}</Text>
              {selectedLanguage === language.code && (
                <Icon name="check-circle" size={16} color={language.color} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => navigation.navigate(action.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                <Icon name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Daily Goal */}
      <View style={styles.section}>
        <View style={styles.goalContainer}>
          <View style={styles.goalHeader}>
            <Text style={styles.sectionTitle}>Daily Goal</Text>
            {dailyGoalMet && (
              <Icon name="check-circle" size={24} color={colors.success} />
            )}
          </View>
          <Text style={styles.goalText}>
            {dailyGoalMet ? 'Great job! Goal completed today! 🎉' : 'Complete 1 lesson today'}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: dailyGoalMet ? '100%' : '60%' }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Cultural Tip */}
      <View style={styles.section}>
        <View style={styles.culturalTipCard}>
          <Icon name="lightbulb" size={24} color={colors.primary} />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Cultural Tip</Text>
            <Text style={styles.tipText}>
              In Swahili culture, greeting is very important. "Jambo" is casual, 
              while "Habari yako?" shows more respect and interest in someone's well-being.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
  },
  greeting: {
    fontSize: fonts.xxl,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  subtitle: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...require('../theme').shadows.small,
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
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: spacing.md,
  },
  languageCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLanguageCard: {
    borderColor: colors.primary,
  },
  languageFlag: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  languageName: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...require('../theme').shadows.small,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    fontSize: fonts.md,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: fonts.xs,
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  goalContainer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...require('../theme').shadows.small,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  goalText: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
  },
  culturalTipCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    ...require('../theme').shadows.small,
  },
  tipContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  tipTitle: {
    fontSize: fonts.md,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
  },
});

export default HomeScreen;
