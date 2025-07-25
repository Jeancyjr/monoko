import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import MonokoLogo from '../components/MonokoLogo';

const { width } = Dimensions.get('window');

const AchievementsScreen = ({ navigation }) => {
  const { totalXP, completedLessons, streak } = useSelector(state => state.user);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [animatedValues] = useState({});

  // Enhanced achievements with cultural context
  const achievements = [
    // Learning Milestones
    {
      id: 'first-steps',
      title: 'Hatua za Kwanza',
      titleEnglish: 'First Steps',
      description: 'Complete your first lesson',
      culturalNote: '"Hatua za kwanza" - Every journey begins with the first step',
      icon: '👶',
      xpReward: 25,
      category: 'learning',
      rarity: 'common',
      unlocked: completedLessons.length >= 1,
      progress: Math.min(completedLessons.length, 1),
      maxProgress: 1,
      language: 'sw',
    },
    {
      id: 'week-warrior',
      title: 'Shujaa wa Juma',
      titleEnglish: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      culturalNote: 'Consistency is valued in African culture - "Haba na haba, hujaza kibaba"',
      icon: '🔥',
      xpReward: 100,
      category: 'consistency',
      rarity: 'uncommon',
      unlocked: streak >= 7,
      progress: Math.min(streak, 7),
      maxProgress: 7,
      language: 'sw',
    },
    {
      id: 'vocabulary-collector',
      title: 'Mkusanyaji wa Maneno',
      titleEnglish: 'Word Collector',
      description: 'Learn 50 new words',
      culturalNote: 'Building vocabulary is like collecting precious gems',
      icon: '💎',
      xpReward: 150,
      category: 'vocabulary',
      rarity: 'uncommon',
      unlocked: completedLessons.length * 8 >= 50,
      progress: Math.min(completedLessons.length * 8, 50),
      maxProgress: 50,
      language: 'sw',
    },
    {
      id: 'cultural-explorer',
      title: 'Mchunguzi wa Utamaduni',
      titleEnglish: 'Cultural Explorer',
      description: 'Read 20 cultural notes',
      culturalNote: 'Understanding culture is the key to understanding language',
      icon: '🗺️',
      xpReward: 75,
      category: 'culture',
      rarity: 'common',
      unlocked: completedLessons.length >= 5,
      progress: Math.min(completedLessons.length * 2, 20),
      maxProgress: 20,
      language: 'sw',
    },
    {
      id: 'conversation-starter',
      title: 'Mwanzilishi wa Mazungumzo',
      titleEnglish: 'Conversation Starter',
      description: 'Complete your first live session',
      culturalNote: 'Real conversation is where language comes alive',
      icon: '💬',
      xpReward: 200,
      category: 'speaking',
      rarity: 'rare',
      unlocked: false, // Based on live session completion
      progress: 0,
      maxProgress: 1,
      language: 'sw',
    },
    // Lingala Achievements
    {
      id: 'music-lover',
      title: 'Molinga Miziki',
      titleEnglish: 'Music Lover',
      description: 'Complete music-themed lessons',
      culturalNote: 'Lingala is the language of Central African music',
      icon: '🎵',
      xpReward: 125,
      category: 'culture',
      rarity: 'uncommon',
      unlocked: false,
      progress: 0,
      maxProgress: 3,
      language: 'ln',
    },
    {
      id: 'kinshasa-navigator',
      title: 'Motambolaki ya Kinshasa',
      titleEnglish: 'Kinshasa Navigator',
      description: 'Master urban Lingala expressions',
      culturalNote: 'Navigate the vibrant streets of Kinshasa with confidence',
      icon: '🏙️',
      xpReward: 175,
      category: 'practical',
      rarity: 'rare',
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      language: 'ln',
    },
    // Amharic Achievements
    {
      id: 'script-master',
      title: 'የፊደል ሰለጠነ',
      titleEnglish: 'Fidel Script Master',
      description: 'Master 50 Fidel characters',
      culturalNote: 'The ancient Ge\'ez script is a treasure of Ethiopian heritage',
      icon: '📜',
      xpReward: 250,
      category: 'writing',
      rarity: 'legendary',
      unlocked: false,
      progress: 0,
      maxProgress: 50,
      language: 'am',
    },
    {
      id: 'coffee-ceremony',
      title: 'የቡና ስነ-ስርዓት',
      titleEnglish: 'Coffee Ceremony Expert',
      description: 'Learn coffee ceremony vocabulary',
      culturalNote: 'Ethiopia is the birthplace of coffee - learn the sacred ceremony',
      icon: '☕',
      xpReward: 100,
      category: 'culture',
      rarity: 'uncommon',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      language: 'am',
    },
    // Special Achievements
    {
      id: 'polyglot-aspirant',
      title: 'Multilingual Learner',
      titleEnglish: 'African Polyglot',
      description: 'Start learning 2 different African languages',
      culturalNote: 'Africa\'s linguistic diversity is a beautiful tapestry',
      icon: '🌍',
      xpReward: 300,
      category: 'special',
      rarity: 'legendary',
      unlocked: false,
      progress: 1,
      maxProgress: 2,
      language: 'multi',
    },
    {
      id: 'community-builder',
      title: 'Community Ambassador',
      titleEnglish: 'Community Builder',
      description: 'Help 5 other learners in community features',
      culturalNote: 'Ubuntu - "I am because we are"',
      icon: '🤝',
      xpReward: 200,
      category: 'community',
      rarity: 'rare',
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      language: 'multi',
    },
  ];

  const categories = [
    { id: 'all', name: 'All', icon: 'apps', count: achievements.length },
    { id: 'learning', name: 'Learning', icon: 'school', count: achievements.filter(a => a.category === 'learning').length },
    { id: 'consistency', name: 'Consistency', icon: 'local-fire-department', count: achievements.filter(a => a.category === 'consistency').length },
    { id: 'vocabulary', name: 'Vocabulary', icon: 'psychology', count: achievements.filter(a => a.category === 'vocabulary').length },
    { id: 'culture', name: 'Culture', icon: 'explore', count: achievements.filter(a => a.category === 'culture').length },
    { id: 'speaking', name: 'Speaking', icon: 'record-voice-over', count: achievements.filter(a => a.category === 'speaking').length },
    { id: 'special', name: 'Special', icon: 'star', count: achievements.filter(a => a.category === 'special').length },
  ];

  const getRarityColor = (rarity) => {
    const rarityColors = {
      common: colors.gray,
      uncommon: colors.primary,
      rare: colors.secondary,
      epic: colors.accent,
      legendary: colors.amharic,
    };
    return rarityColors[rarity] || colors.gray;
  };

  const getRarityGradient = (rarity) => {
    const gradients = {
      common: ['#95A5A6', '#BDC3C7'],
      uncommon: ['#4CAF50', '#66BB6A'],
      rare: ['#FF6B35', '#FF8A65'],
      epic: ['#9B59B6', '#BB8FCE'],
      legendary: ['#F1C40F', '#F39C12'],
    };
    return gradients[rarity] || gradients.common;
  };

  useEffect(() => {
    // Initialize animations for unlocked achievements
    achievements.forEach(achievement => {
      if (achievement.unlocked && !animatedValues[achievement.id]) {
        animatedValues[achievement.id] = new Animated.Value(0);
        Animated.timing(animatedValues[achievement.id], {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }
    });
  }, []);

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXPFromAchievements = achievements
    .filter(a => a.unlocked)
    .reduce((total, a) => total + a.xpReward, 0);

  const handleAchievementPress = (achievement) => {
    setSelectedAchievement(achievement);
    setModalVisible(true);
  };

  const renderAchievementCard = (achievement) => {
    const isUnlocked = achievement.unlocked;
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
    const rarityColor = getRarityColor(achievement.rarity);

    return (
      <TouchableOpacity
        key={achievement.id}
        style={[
          styles.achievementCard,
          isUnlocked && styles.unlockedCard,
          { borderColor: rarityColor },
        ]}
        onPress={() => handleAchievementPress(achievement)}
        activeOpacity={0.8}
      >
        <View style={styles.achievementHeader}>
          <View style={[styles.achievementIcon, { backgroundColor: rarityColor + '20' }]}>
            <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
            {isUnlocked && (
              <View style={[styles.unlockedBadge, { backgroundColor: rarityColor }]}>
                <Icon name="check" size={12} color={colors.white} />
              </View>
            )}
          </View>
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementTitle, !isUnlocked && styles.lockedText]}>
              {achievement.title}
            </Text>
            <Text style={[styles.achievementTitleEnglish, !isUnlocked && styles.lockedText]}>
              {achievement.titleEnglish}
            </Text>
            <Text style={[styles.achievementDescription, !isUnlocked && styles.lockedText]}>
              {achievement.description}
            </Text>
          </View>
          <View style={styles.achievementReward}>
            <Text style={[styles.xpReward, { color: rarityColor }]}>
              +{achievement.xpReward} XP
            </Text>
            <Text style={[styles.rarity, { color: rarityColor }]}>
              {achievement.rarity.toUpperCase()}
            </Text>
          </View>
        </View>

        {!isUnlocked && achievement.maxProgress > 1 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: rarityColor,
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {achievement.progress}/{achievement.maxProgress}
            </Text>
          </View>
        )}

        {achievement.language !== 'multi' && (
          <View style={styles.languageTag}>
            <Text style={styles.languageText}>
              {achievement.language === 'sw' ? 'Swahili' : 
               achievement.language === 'ln' ? 'Lingala' : 'Amharic'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderAchievementModal = () => {
    if (!selectedAchievement) return null;

    const rarityColor = getRarityColor(selectedAchievement.rarity);

    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { borderColor: rarityColor }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={24} color={colors.gray} />
            </TouchableOpacity>

            <View style={[styles.modalIcon, { backgroundColor: rarityColor + '20' }]}>
              <Text style={styles.modalEmoji}>{selectedAchievement.icon}</Text>
            </View>

            <Text style={styles.modalTitle}>{selectedAchievement.title}</Text>
            <Text style={styles.modalTitleEnglish}>{selectedAchievement.titleEnglish}</Text>
            
            <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
              <Text style={styles.rarityBadgeText}>
                {selectedAchievement.rarity.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.modalDescription}>
              {selectedAchievement.description}
            </Text>

            <View style={styles.culturalNoteContainer}>
              <Icon name="info" size={20} color={colors.primary} />
              <Text style={styles.culturalNoteText}>
                {selectedAchievement.culturalNote}
              </Text>
            </View>

            <View style={styles.modalReward}>
              <Icon name="stars" size={24} color={colors.accent} />
              <Text style={styles.modalRewardText}>
                Reward: {selectedAchievement.xpReward} XP
              </Text>
            </View>

            {!selectedAchievement.unlocked && (
              <View style={styles.progressSection}>
                <Text style={styles.progressLabel}>Progress</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}%`,
                        backgroundColor: rarityColor,
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {selectedAchievement.progress}/{selectedAchievement.maxProgress}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={styles.headerRight}>
          <MonokoLogo size="small" color="white" />
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{unlockedCount}</Text>
          <Text style={styles.statLabel}>Unlocked</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{achievements.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalXPFromAchievements}</Text>
          <Text style={styles.statLabel}>XP Earned</Text>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.activeCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Icon 
              name={category.icon} 
              size={20} 
              color={selectedCategory === category.id ? colors.white : colors.primary} 
            />
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText,
              ]}
            >
              {category.name}
            </Text>
            <View style={styles.categoryCount}>
              <Text style={styles.categoryCountText}>{category.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Achievements List */}
      <ScrollView style={styles.achievementsList} showsVerticalScrollIndicator={false}>
        {filteredAchievements.map(renderAchievementCard)}
      </ScrollView>

      {renderAchievementModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    paddingTop: spacing.xl + 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: fonts.xl,
    fontFamily: fonts.bold,
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.medium,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fonts.xxl,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  categoriesContainer: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing.sm,
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  activeCategoryText: {
    color: colors.white,
  },
  categoryCount: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  categoryCountText: {
    fontSize: fonts.xs,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  achievementsList: {
    flex: 1,
    padding: spacing.lg,
  },
  achievementCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.lightGray,
    ...shadows.small,
  },
  unlockedCard: {
    ...shadows.medium,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    position: 'relative',
  },
  achievementEmoji: {
    fontSize: 28,
  },
  unlockedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  achievementTitle: {
    fontSize: fonts.md,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  achievementTitleEnglish: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  achievementDescription: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.darkGray,
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
  },
  lockedText: {
    opacity: 0.6,
  },
  achievementReward: {
    alignItems: 'flex-end',
  },
  xpReward: {
    fontSize: fonts.md,
    fontFamily: fonts.bold,
    marginBottom: spacing.xs,
  },
  rarity: {
    fontSize: fonts.xs,
    fontFamily: fonts.bold,
    letterSpacing: 0.5,
  },
  progressContainer: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.gray,
    minWidth: 40,
    textAlign: 'right',
  },
  languageTag: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  languageText: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    maxWidth: width * 0.9,
    borderWidth: 3,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    padding: spacing.sm,
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  modalEmoji: {
    fontSize: 40,
  },
  modalTitle: {
    fontSize: fonts.xl,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  modalTitleEnglish: {
    fontSize: fonts.lg,
    fontFamily: fonts.medium,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  rarityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  rarityBadgeText: {
    fontSize: fonts.xs,
    fontFamily: fonts.bold,
    color: colors.white,
    letterSpacing: 1,
  },
  modalDescription: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: fonts.lineHeights.relaxed * fonts.md,
    marginBottom: spacing.lg,
  },
  culturalNoteContainer: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  culturalNoteText: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.primary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
  },
  modalReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  modalRewardText: {
    fontSize: fonts.md,
    fontFamily: fonts.bold,
    color: colors.accent,
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.gray,
    marginBottom: spacing.sm,
  },
});

export default AchievementsScreen;
