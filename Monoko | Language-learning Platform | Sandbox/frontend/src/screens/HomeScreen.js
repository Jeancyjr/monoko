import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius, screenDimensions } from '../theme';
import { setSelectedLanguage } from '../store/store';
import MonokoLogo from '../components/MonokoLogo';
import { FadeInView, ScaleInView, SlideInView, StaggeredList } from '../components/AnimatedComponents';
import { LanguageCharacter, GuideCharacter } from '../components/AfricanCharacters';
import { 
  responsive, 
  getCardDimensions, 
  getIconSize, 
  getCharacterSize,
  getValueForDevice,
  getGridColumns 
} from '../utils/responsive';

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
      id: 'cultural-learning',
      title: 'Cultural Learning',
      subtitle: 'Traditions & proverbs',
      icon: 'explore',
      color: colors.amharic,
      screen: 'CulturalLearning',
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
      id: 'achievements',
      title: 'Achievements',
      subtitle: 'Your progress',
      icon: 'emoji-events',
      color: colors.lingala,
      screen: 'Achievements',
    },
    {
      id: 'live-local',
      title: 'Live with Local',
      subtitle: 'Speak with natives',
      icon: 'video-call',
      color: colors.swahili,
      screen: 'LiveSessions',
    },
  ];

  const languages = [
    { code: 'sw', name: 'Swahili', character: <LanguageCharacter language="sw" size={getCharacterSize(32)} />, color: colors.swahili },
    { code: 'ln', name: 'Lingala', character: <LanguageCharacter language="ln" size={getCharacterSize(32)} />, color: colors.lingala },
    { code: 'am', name: 'Amharic', character: <LanguageCharacter language="am" size={getCharacterSize(32)} />, color: colors.amharic },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MonokoLogo 
            size="medium" 
            color="white" 
            showTagline={true} 
            style={styles.logoContainer}
          />
          <View style={styles.greetingWrapper}>
            <View style={styles.greetingContainer}>
              <GuideCharacter type="welcome" size={24} color={colors.white} />
              <Text style={styles.greeting}>Jambo!</Text>
            </View>
            <Text style={styles.subtitle}>Ready to learn today?</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Icon name="person" size={getIconSize(24)} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        {[
          { icon: 'local-fire-department', value: streak, label: 'Day Streak', color: colors.warning },
          { icon: 'stars', value: totalXP, label: 'Total XP', color: colors.primary },
          { icon: 'trending-up', value: currentLevel, label: 'Level', color: colors.secondary },
        ].map((stat, index) => (
          <ScaleInView key={stat.label} delay={index * 100} style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
              <Icon name={stat.icon} size={getIconSize(24)} color={stat.color} />
            </View>
            <Text style={styles.statNumber}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </ScaleInView>
        ))}
      </View>

      <SlideInView delay={300} style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Language</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {languages.map((language, index) => (
            <FadeInView key={language.code} delay={400 + index * 100}>
              <TouchableOpacity
                style={[
                  styles.languageCard,
                  selectedLanguage === language.code && styles.selectedLanguageCard
                ]}
                onPress={() => dispatch(setSelectedLanguage(language.code))}
              >
                <View style={styles.languageFlag}>{language.character}</View>
                <Text style={styles.languageName}>{language.name}</Text>
                {selectedLanguage === language.code && (
                  <ScaleInView delay={0}>
                    <Icon name="check-circle" size={16} color={language.color} />
                  </ScaleInView>
                )}
              </TouchableOpacity>
            </FadeInView>
          ))}
        </ScrollView>
      </SlideInView>

      <SlideInView delay={500} style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <ScaleInView key={action.id} delay={600 + index * 100}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                  <Icon name={action.icon} size={getIconSize(24)} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            </ScaleInView>
          ))}
        </View>
      </SlideInView>

      <FadeInView delay={800} style={styles.section}>
        <View style={styles.goalContainer}>
          <View style={styles.goalHeader}>
            <Text style={styles.sectionTitle}>Daily Goal</Text>
            {dailyGoalMet && (
              <ScaleInView delay={0}>
                <Icon name="check-circle" size={getIconSize(24)} color={colors.success} />
              </ScaleInView>
            )}
          </View>
          <Text style={styles.goalText}>
            {dailyGoalMet ? 'Great job! Goal completed today!' : 'Complete 1 lesson today'}
          </Text>
          <View style={styles.progressBar}>
            <SlideInView 
              direction="right"
              delay={100}
              style={[
                styles.progressFill, 
                { width: dailyGoalMet ? '100%' : '60%' }
              ]} 
            />
          </View>
        </View>
      </FadeInView>

      <SlideInView delay={900} direction="up" style={styles.section}>
        <View style={styles.culturalTipCard}>
          <ScaleInView delay={100}>
            <Icon name="lightbulb" size={getIconSize(24)} color={colors.primary} />
          </ScaleInView>
          <View style={styles.tipContent}>
            <FadeInView delay={200}>
              <Text style={styles.tipTitle}>Cultural Tip</Text>
              <Text style={styles.tipText}>
                In Swahili culture, greeting is very important. "Jambo" is casual, 
                while "Habari yako?" shows more respect and interest in someone's well-being.
              </Text>
            </FadeInView>
          </View>
        </View>
      </SlideInView>
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
    alignItems: 'flex-start',
    backgroundColor: colors.primary,
    padding: getValueForDevice({
      'small-phone': spacing.md,
      'medium-phone': spacing.lg,
      'large-phone': spacing.lg,
      'tablet': spacing.xl,
    }),
    paddingTop: getValueForDevice({
      'small-phone': spacing.xl + 20,
      'medium-phone': spacing.xl + 24,
      'large-phone': spacing.xl + 24,
      'tablet': spacing.xl + 32,
    }),
  },
  headerLeft: {
    flex: 1,
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: fonts.xxl,
    fontFamily: fonts.bold,
    color: colors.white,
    letterSpacing: -1,
  },
  logoIcon: {
    fontSize: fonts.xl,
  },
  logoTagline: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.primaryLight,
    marginTop: spacing.xs,
    letterSpacing: 0.5,
  },
  greetingWrapper: {
    marginTop: spacing.sm,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  greeting: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  subtitle: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.primaryLight,
    marginTop: spacing.xs,
  },
  profileButton: {
    width: getValueForDevice({
      'small-phone': 40,
      'medium-phone': 44,
      'large-phone': 44,
      'tablet': 52,
    }),
    height: getValueForDevice({
      'small-phone': 40,
      'medium-phone': 44,
      'large-phone': 44,
      'tablet': 52,
    }),
    borderRadius: getValueForDevice({
      'small-phone': 20,
      'medium-phone': 22,
      'large-phone': 22,
      'tablet': 26,
    }),
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: responsive.isSmallPhone ? 'column' : 'row',
    padding: getValueForDevice({
      'small-phone': spacing.md,
      'medium-phone': spacing.lg,
      'large-phone': spacing.lg,
      'tablet': spacing.xl,
    }),
    gap: spacing.md,
  },
  statCard: {
    flex: responsive.isSmallPhone ? 0 : 1,
    backgroundColor: colors.white,
    padding: getValueForDevice({
      'small-phone': spacing.sm,
      'medium-phone': spacing.md,
      'large-phone': spacing.md,
      'tablet': spacing.lg,
    }),
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: responsive.isSmallPhone ? spacing.sm : 0,
    ...require('../theme').shadows.medium,
  },
  iconContainer: {
    width: getValueForDevice({
      'small-phone': 40,
      'medium-phone': 48,
      'large-phone': 48,
      'tablet': 56,
    }),
    height: getValueForDevice({
      'small-phone': 40,
      'medium-phone': 48,
      'large-phone': 48,
      'tablet': 56,
    }),
    borderRadius: getValueForDevice({
      'small-phone': 20,
      'medium-phone': 24,
      'large-phone': 24,
      'tablet': 28,
    }),
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
  },
  section: {
    paddingHorizontal: getValueForDevice({
      'small-phone': spacing.md,
      'medium-phone': spacing.lg,
      'large-phone': spacing.lg,
      'tablet': spacing.xl,
    }),
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
    padding: getValueForDevice({
      'small-phone': spacing.sm,
      'medium-phone': spacing.md,
      'large-phone': spacing.md,
      'tablet': spacing.lg,
    }),
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minWidth: getValueForDevice({
      'small-phone': 80,
      'medium-phone': 100,
      'large-phone': 100,
      'tablet': 120,
    }),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLanguageCard: {
    borderColor: colors.primary,
  },
  languageFlag: {
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: responsive.isTablet ? 'space-between' : 'flex-start',
  },
  actionCard: {
    width: responsive.isTablet ? getCardDimensions().width : (screenDimensions.width - getValueForDevice({
      'small-phone': spacing.md * 2,
      'medium-phone': spacing.lg * 2,
      'large-phone': spacing.lg * 2,
      'tablet': spacing.xl * 2,
    }) - spacing.md) / 2,
    backgroundColor: colors.white,
    padding: getValueForDevice({
      'small-phone': spacing.sm,
      'medium-phone': spacing.md,
      'large-phone': spacing.md,
      'tablet': spacing.lg,
    }),
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...require('../theme').shadows.small,
  },
  actionIcon: {
    width: getValueForDevice({
      'small-phone': 40,
      'medium-phone': 48,
      'large-phone': 48,
      'tablet': 56,
    }),
    height: getValueForDevice({
      'small-phone': 40,
      'medium-phone': 48,
      'large-phone': 48,
      'tablet': 56,
    }),
    borderRadius: getValueForDevice({
      'small-phone': 20,
      'medium-phone': 24,
      'large-phone': 24,
      'tablet': 28,
    }),
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
