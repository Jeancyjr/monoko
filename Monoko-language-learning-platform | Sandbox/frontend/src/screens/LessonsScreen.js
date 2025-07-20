import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';

const LessonsScreen = ({ navigation }) => {
  const { selectedLanguage } = useSelector(state => state.user);
  const { completedLessons } = useSelector(state => state.progress);
  
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample lesson data - would come from API
  const sampleLessons = {
    sw: [
      {
        id: 'sw-basics-1',
        title: 'Greetings & Introductions',
        description: 'Learn essential greetings and how to introduce yourself',
        difficulty: 'Beginner',
        duration: 10,
        xp: 50,
        topics: ['Jambo', 'Habari', 'Names', 'Countries'],
        completed: false,
        locked: false,
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150'
      },
      {
        id: 'sw-basics-2',
        title: 'Family & Relationships',
        description: 'Talk about family members and relationships',
        difficulty: 'Beginner',
        duration: 12,
        xp: 60,
        topics: ['Familia', 'Mama', 'Baba', 'Relationships'],
        completed: false,
        locked: false,
        image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=150'
      },
      {
        id: 'sw-basics-3',
        title: 'Numbers & Time',
        description: 'Master numbers, time, and basic counting',
        difficulty: 'Beginner',
        duration: 15,
        xp: 75,
        topics: ['Numbers 1-20', 'Time', 'Days', 'Months'],
        completed: false,
        locked: true,
        image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=150'
      },
      {
        id: 'sw-food-1',
        title: 'Food & Dining',
        description: 'Order food and discuss East African cuisine',
        difficulty: 'Intermediate',
        duration: 18,
        xp: 90,
        topics: ['Ugali', 'Restaurant', 'Ordering', 'Cooking'],
        completed: false,
        locked: true,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150'
      }
    ],
    ln: [
      {
        id: 'ln-basics-1',
        title: 'Basic Greetings',
        description: 'Essential Lingala greetings and politeness',
        difficulty: 'Beginner',
        duration: 8,
        xp: 40,
        topics: ['Mbote', 'Politeness', 'Respect'],
        completed: false,
        locked: false,
        image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=150'
      },
      {
        id: 'ln-music-1',
        title: 'Music & Culture',
        description: 'Learn through Congolese music and culture',
        difficulty: 'Intermediate',
        duration: 20,
        xp: 100,
        topics: ['Songs', 'Culture', 'Expressions'],
        completed: false,
        locked: true,
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150'
      }
    ],
    am: [
      {
        id: 'am-script-1',
        title: 'Introduction to Fidel',
        description: 'Learn the beautiful Ethiopian script',
        difficulty: 'Beginner',
        duration: 20,
        xp: 80,
        topics: ['Fidel basics', 'Writing', 'Reading'],
        completed: false,
        locked: false,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150'
      },
      {
        id: 'am-basics-1',
        title: 'Essential Phrases',
        description: 'Common greetings and everyday expressions',
        difficulty: 'Beginner',
        duration: 15,
        xp: 70,
        topics: ['Selam', 'Daily phrases', 'Courtesy'],
        completed: false,
        locked: true,
        image: 'https://images.unsplash.com/photo-1609450514548-bdf3dd38b2a6?w=150'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLessons(sampleLessons[selectedLanguage] || sampleLessons.sw);
      setLoading(false);
    }, 1000);
  }, [selectedLanguage]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return colors.success;
      case 'Intermediate': return colors.warning;
      case 'Advanced': return colors.error;
      default: return colors.gray;
    }
  };

  const getLanguageName = () => {
    const names = { sw: 'Swahili', ln: 'Lingala', am: 'Amharic' };
    return names[selectedLanguage] || 'Swahili';
  };

  const renderLesson = (lesson, index) => {
    const isCompleted = completedLessons.includes(lesson.id);
    const isLocked = lesson.locked && !isCompleted;

    return (
      <TouchableOpacity
        key={lesson.id}
        style={[styles.lessonCard, isLocked && styles.lockedCard]}
        onPress={() => !isLocked && handleLessonPress(lesson)}
        activeOpacity={isLocked ? 1 : 0.7}
      >
        <View style={styles.lessonImageContainer}>
          <Image source={{ uri: lesson.image }} style={styles.lessonImage} />
          {isLocked && (
            <View style={styles.lockOverlay}>
              <Icon name="lock" size={24} color={colors.white} />
            </View>
          )}
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Icon name="check-circle" size={20} color={colors.success} />
            </View>
          )}
        </View>
        
        <View style={styles.lessonContent}>
          <View style={styles.lessonHeader}>
            <Text style={[styles.lessonTitle, isLocked && styles.lockedText]}>
              {lesson.title}
            </Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(lesson.difficulty) }]}>
              <Text style={styles.difficultyText}>{lesson.difficulty}</Text>
            </View>
          </View>
          
          <Text style={[styles.lessonDescription, isLocked && styles.lockedText]}>
            {lesson.description}
          </Text>
          
          <View style={styles.lessonMeta}>
            <View style={styles.metaItem}>
              <Icon name="schedule" size={16} color={isLocked ? colors.lightGray : colors.gray} />
              <Text style={[styles.metaText, isLocked && styles.lockedText]}>
                {lesson.duration} min
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="stars" size={16} color={isLocked ? colors.lightGray : colors.primary} />
              <Text style={[styles.metaText, isLocked && styles.lockedText]}>
                {lesson.xp} XP
              </Text>
            </View>
          </View>
          
          <View style={styles.topicsContainer}>
            {lesson.topics.slice(0, 3).map((topic, i) => (
              <View key={i} style={[styles.topicTag, isLocked && styles.lockedTag]}>
                <Text style={[styles.topicText, isLocked && styles.lockedText]}>
                  {topic}
                </Text>
              </View>
            ))}
            {lesson.topics.length > 3 && (
              <Text style={[styles.moreTopics, isLocked && styles.lockedText]}>
                +{lesson.topics.length - 3} more
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleLessonPress = (lesson) => {
    navigation.navigate('LessonPlayer', { lesson });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="school" size={48} color={colors.primary} />
        <Text style={styles.loadingText}>Loading {getLanguageName()} lessons...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{getLanguageName()} Lessons</Text>
        <Text style={styles.headerSubtitle}>
          {completedLessons.length}/{lessons.length} completed
        </Text>
      </View>
      
      <ScrollView style={styles.lessonsContainer} showsVerticalScrollIndicator={false}>
        {lessons.map((lesson, index) => renderLesson(lesson, index))}
        
        <View style={styles.comingSoonCard}>
          <Icon name="construction" size={32} color={colors.warning} />
          <Text style={styles.comingSoonTitle}>More lessons coming soon!</Text>
          <Text style={styles.comingSoonText}>
            We're working on adding more {getLanguageName()} content. 
            Stay tuned for updates!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: fonts.lg,
    fontFamily: fonts.medium,
    color: colors.gray,
    marginTop: spacing.md,
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  headerTitle: {
    fontSize: fonts.xxl,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  lessonsContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  lessonCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  lockedCard: {
    opacity: 0.6,
  },
  lessonImageContainer: {
    height: 120,
    position: 'relative',
  },
  lessonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 2,
  },
  lessonContent: {
    padding: spacing.md,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  lessonTitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.black,
    flex: 1,
    marginRight: spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    fontSize: fonts.xs,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  lessonDescription: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginBottom: spacing.md,
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
  },
  lessonMeta: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.gray,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    alignItems: 'center',
  },
  topicTag: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  lockedTag: {
    backgroundColor: colors.lightGray + '40',
  },
  topicText: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  moreTopics: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.gray,
    fontStyle: 'italic',
  },
  lockedText: {
    color: colors.lightGray,
  },
  comingSoonCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.small,
  },
  comingSoonTitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.warning,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  comingSoonText: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
  },
});

export default LessonsScreen;
