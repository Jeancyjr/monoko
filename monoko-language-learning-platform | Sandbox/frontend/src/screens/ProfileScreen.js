import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { logout } from '../store/store';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { profile, selectedLanguage, streak, totalXP } = useSelector(state => state.user);
  const { currentLevel } = useSelector(state => state.progress);

  const profileSections = [
    { title: 'Learning Preferences', icon: 'settings', onPress: () => console.log('Preferences') },
    { title: 'Download Content', icon: 'download', onPress: () => console.log('Downloads') },
    { title: 'Notifications', icon: 'notifications', onPress: () => console.log('Notifications') },
    { title: 'Help & Support', icon: 'help', onPress: () => console.log('Help') },
    { title: 'About Monoko', icon: 'info', onPress: () => console.log('About') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileAvatar}>
          <Icon name="person" size={48} color={colors.white} />
        </View>
        <Text style={styles.profileName}>Demo User</Text>
        <Text style={styles.profileEmail}>demo@monoko.app</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNumber}>{streak}</Text>
            <Text style={styles.quickStatLabel}>Day Streak</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNumber}>{totalXP}</Text>
            <Text style={styles.quickStatLabel}>Total XP</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNumber}>{currentLevel}</Text>
            <Text style={styles.quickStatLabel}>Level</Text>
          </View>
        </View>

        <View style={styles.sectionsContainer}>
          {profileSections.map((section, index) => (
            <TouchableOpacity key={index} style={styles.sectionItem} onPress={section.onPress}>
              <Icon name={section.icon} size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Icon name="chevron-right" size={20} color={colors.gray} />
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={[styles.sectionItem, styles.logoutItem]} onPress={() => dispatch(logout())}>
            <Icon name="logout" size={24} color={colors.error} />
            <Text style={[styles.sectionTitle, styles.logoutText]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, padding: spacing.lg, paddingTop: spacing.xl, alignItems: 'center' },
  profileAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryDark, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  profileName: { fontSize: fonts.xl, fontFamily: fonts.bold, color: colors.white },
  profileEmail: { fontSize: fonts.md, fontFamily: fonts.regular, color: colors.white, opacity: 0.9 },
  content: { flex: 1 },
  quickStats: { flexDirection: 'row', backgroundColor: colors.white, margin: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.lg, ...shadows.medium },
  quickStat: { flex: 1, alignItems: 'center' },
  quickStatNumber: { fontSize: fonts.xl, fontFamily: fonts.bold, color: colors.primary },
  quickStatLabel: { fontSize: fonts.xs, fontFamily: fonts.regular, color: colors.gray, marginTop: spacing.xs },
  sectionsContainer: { paddingHorizontal: spacing.lg },
  sectionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.sm, ...shadows.small },
  sectionTitle: { flex: 1, fontSize: fonts.md, fontFamily: fonts.medium, color: colors.black, marginLeft: spacing.md },
  logoutItem: { marginTop: spacing.lg },
  logoutText: { color: colors.error },
});

export default ProfileScreen;
