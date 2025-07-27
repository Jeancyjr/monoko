import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import AnimatedStatCard from '../components/AnimatedStatCard';
import { FadeInView, SlideInView, ScaleInView } from '../components/AnimatedComponents';

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
          {[
            { icon: 'local-fire-department', value: streak, label: 'Day Streak', color: colors.warning },
            { icon: 'stars', value: totalXP, label: 'Total XP', color: colors.primary },
            { icon: 'trending-up', value: currentLevel, label: 'Level', color: colors.secondary },
            { icon: 'school', value: completedLessons.length, label: 'Lessons', color: colors.accent },
          ].map((stat, index) => (
            <AnimatedStatCard 
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              color={stat.color}
              delay={index * 150}
            />
          ))}
        </View>

        <SlideInView delay={600} style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map((achievement, index) => (
            <ScaleInView key={achievement.id} delay={700 + index * 100}>
              <View style={[styles.achievementCard, !achievement.unlocked && styles.lockedAchievement]}>
                <Icon name={achievement.icon} size={24} color={achievement.unlocked ? colors.primary : colors.lightGray} />
                <View style={styles.achievementText}>
                  <Text style={[styles.achievementTitle, !achievement.unlocked && styles.lockedText]}>{achievement.title}</Text>
                  <Text style={[styles.achievementDesc, !achievement.unlocked && styles.lockedText]}>{achievement.description}</Text>
                </View>
                {achievement.unlocked && (
                  <ScaleInView delay={100}>
                    <Icon name="check-circle" size={20} color={colors.success} />
                  </ScaleInView>
                )}
              </View>
            </ScaleInView>
          ))}
        </SlideInView>
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
  statCard: { flex: 1, minWidth: '45%', backgroundColor: colors.white, padding: spacing.md, borderRadius: borderRadius.lg, alignItems: 'center', ...shadows.medium },
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
