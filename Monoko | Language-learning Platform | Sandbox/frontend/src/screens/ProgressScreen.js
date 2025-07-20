import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';

const ProgressScreen = () => {
  const { streak, totalXP, selectedLanguage } = useSelector(state => state.user);
  const { currentLevel, completedLessons } = useSelector(state => state.progress);

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first lesson', icon: 'star', unlocked: true },
    { id: 2, title: 'Week Warrior', description: 'Maintain 7-day streak', icon: 'local-fire-department', unlocked: streak >= 7 },
    { id: 3, title: 'Vocabulary Master', description: 'Learn 100 words', icon: 'psychology', unlocked: false },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <Text style={styles.headerSubtitle}>Keep up the great work!</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Icon name="local-fire-department" size={32} color={colors.warning} />
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="stars" size={32} color={colors.primary} />
            <Text style={styles.statNumber}>{totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="trending-up" size={32} color={colors.secondary} />
            <Text style={styles.statNumber}>{currentLevel}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="school" size={32} color={colors.accent} />
            <Text style={styles.statNumber}>{completedLessons.length}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map(achievement => (
            <View key={achievement.id} style={[styles.achievementCard, !achievement.unlocked && styles.lockedAchievement]}>
              <Icon name={achievement.icon} size={24} color={achievement.unlocked ? colors.primary : colors.lightGray} />
              <View style={styles.achievementText}>
                <Text style={[styles.achievementTitle, !achievement.unlocked && styles.lockedText]}>{achievement.title}</Text>
                <Text style={[styles.achievementDesc, !achievement.unlocked && styles.lockedText]}>{achievement.description}</Text>
              </View>
              {achievement.unlocked && <Icon name="check-circle" size={20} color={colors.success} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.secondary, padding: spacing.lg, paddingTop: spacing.xl },
  headerTitle: { fontSize: fonts.xxl, fontFamily: fonts.bold, color: colors.white },
  headerSubtitle: { fontSize: fonts.md, fontFamily: fonts.regular, color: colors.white, opacity: 0.9, marginTop: spacing.xs },
  content: { flex: 1, padding: spacing.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: colors.white, padding: spacing.md, borderRadius: borderRadius.md, alignItems: 'center', ...shadows.small },
  statNumber: { fontSize: fonts.xl, fontFamily: fonts.bold, color: colors.black, marginTop: spacing.xs },
  statLabel: { fontSize: fonts.xs, fontFamily: fonts.regular, color: colors.gray, marginTop: spacing.xs },
  achievementsSection: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: fonts.lg, fontFamily: fonts.bold, color: colors.black, marginBottom: spacing.md },
  achievementCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.sm, ...shadows.small },
  lockedAchievement: { opacity: 0.6 },
  achievementText: { flex: 1, marginLeft: spacing.md },
  achievementTitle: { fontSize: fonts.md, fontFamily: fonts.bold, color: colors.black },
  achievementDesc: { fontSize: fonts.sm, fontFamily: fonts.regular, color: colors.gray, marginTop: 2 },
  lockedText: { color: colors.lightGray },
});

export default ProgressScreen;
