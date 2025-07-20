import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';

const { width } = Dimensions.get('window');

const GamesScreen = ({ navigation }) => {
  const games = [
    {
      id: 'word-match',
      title: 'Word Match Blitz',
      description: 'Match words with their translations as fast as you can!',
      icon: 'flash-on',
      color: colors.primary,
      difficulty: 'Easy',
      playTime: '2-5 min',
      xpReward: 25,
    },
    {
      id: 'echo-me',
      title: 'Echo Me',
      description: 'Practice pronunciation with real-time feedback',
      icon: 'mic',
      color: colors.secondary,
      difficulty: 'Medium',
      playTime: '5-10 min',
      xpReward: 40,
    },
    {
      id: 'memory-cards',
      title: 'Memory Cards',
      description: 'Flip cards to match words with their meanings',
      icon: 'psychology',
      color: colors.accent,
      difficulty: 'Easy',
      playTime: '3-7 min',
      xpReward: 30,
    },
    {
      id: 'trace-it',
      title: 'Trace It',
      description: 'Draw and learn scripts like Amharic Fidel',
      icon: 'gesture',
      color: colors.amharic,
      difficulty: 'Hard',
      playTime: '10-15 min',
      xpReward: 60,
    },
  ];

  const renderGameCard = (game) => (
    <TouchableOpacity
      key={game.id}
      style={styles.gameCard}
      onPress={() => handleGamePress(game)}
      activeOpacity={0.8}
    >
      <View style={[styles.gameIcon, { backgroundColor: `${game.color}20` }]}>
        <Icon name={game.icon} size={32} color={game.color} />
      </View>
      
      <View style={styles.gameContent}>
        <Text style={styles.gameTitle}>{game.title}</Text>
        <Text style={styles.gameDescription}>{game.description}</Text>
        
        <View style={styles.gameStats}>
          <View style={styles.statItem}>
            <Icon name="schedule" size={14} color={colors.gray} />
            <Text style={styles.statText}>{game.playTime}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="stars" size={14} color={colors.primary} />
            <Text style={styles.statText}>{game.xpReward} XP</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(game.difficulty) }]}>
            <Text style={styles.difficultyText}>{game.difficulty}</Text>
          </View>
        </View>
      </View>
      
      <Icon name="play-arrow" size={24} color={game.color} />
    </TouchableOpacity>
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return colors.success;
      case 'Medium': return colors.warning;
      case 'Hard': return colors.error;
      default: return colors.gray;
    }
  };

  const handleGamePress = (game) => {
    switch (game.id) {
      case 'word-match':
        navigation.navigate('WordMatchGame');
        break;
      case 'echo-me':
        // TODO: Navigate to Echo Me game
        console.log('Echo Me game - coming soon!');
        break;
      case 'memory-cards':
        // TODO: Navigate to Memory Cards game
        console.log('Memory Cards game - coming soon!');
        break;
      case 'trace-it':
        // TODO: Navigate to Trace It game
        console.log('Trace It game - coming soon!');
        break;
      default:
        console.log('Game not implemented yet:', game.title);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practice Games</Text>
        <Text style={styles.headerSubtitle}>Make learning fun and engaging!</Text>
      </View>
      
      <ScrollView style={styles.gamesContainer} showsVerticalScrollIndicator={false}>
        {games.map(renderGameCard)}
        
        <View style={styles.comingSoonSection}>
          <Text style={styles.comingSoonTitle}>More Games Coming Soon!</Text>
          <Text style={styles.comingSoonText}>
            We're developing more interactive games to help you master African languages. 
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
  header: {
    backgroundColor: colors.accent,
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
  gamesContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  gameIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  gameContent: {
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
    marginBottom: spacing.md,
    lineHeight: fonts.lineHeights.normal * fonts.sm,
  },
  gameStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    fontSize: fonts.xs,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  comingSoonSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.lg,
    ...shadows.small,
  },
  comingSoonTitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.accent,
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

export default GamesScreen;
