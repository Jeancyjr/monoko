import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { addXP, updateStreak } from '../store/store';

const { width } = Dimensions.get('window');

const WordMatchGameScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { selectedLanguage } = useSelector(state => state.user);
  
  const [gameWords, setGameWords] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60); // 60 seconds
  const [gameState, setGameState] = useState('ready'); // ready, playing, paused, finished
  const [animations] = useState({});

  // Sample word pairs based on selected language
  const wordDatabase = {
    sw: [
      { id: 1, swahili: 'Jambo', english: 'Hello', category: 'greetings' },
      { id: 2, swahili: 'Asante', english: 'Thank you', category: 'courtesy' },
      { id: 3, swahili: 'Mama', english: 'Mother', category: 'family' },
      { id: 4, swahili: 'Baba', english: 'Father', category: 'family' },
      { id: 5, swahili: 'Maji', english: 'Water', category: 'needs' },
      { id: 6, swahili: 'Chakula', english: 'Food', category: 'needs' },
      { id: 7, swahili: 'Nyumba', english: 'House', category: 'home' },
      { id: 8, swahili: 'Pesa', english: 'Money', category: 'practical' },
      { id: 9, swahili: 'Mti', english: 'Tree', category: 'nature' },
      { id: 10, swahili: 'Mvua', english: 'Rain', category: 'weather' }
    ],
    ln: [
      { id: 1, lingala: 'Mbote', english: 'Hello', category: 'greetings' },
      { id: 2, lingala: 'Melesi', english: 'Thank you', category: 'courtesy' },
      { id: 3, lingala: 'Mama', english: 'Mother', category: 'family' },
      { id: 4, lingala: 'Tata', english: 'Father', category: 'family' },
      { id: 5, lingala: 'Mai', english: 'Water', category: 'needs' },
      { id: 6, lingala: 'Bilei', english: 'Food', category: 'needs' }
    ],
    am: [
      { id: 1, amharic: 'ሰላም', english: 'Hello', category: 'greetings' },
      { id: 2, amharic: 'አመሰግናለሁ', english: 'Thank you', category: 'courtesy' },
      { id: 3, amharic: 'እናት', english: 'Mother', category: 'family' },
      { id: 4, amharic: 'አባት', english: 'Father', category: 'family' }
    ]
  };

  useEffect(() => {
    initializeGame();
  }, [selectedLanguage]);

  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  const initializeGame = () => {
    const words = wordDatabase[selectedLanguage] || wordDatabase.sw;
    const selectedWords = words.slice(0, 6); // Use 6 pairs for this game
    
    // Create card pairs
    const cards = [];
    selectedWords.forEach(word => {
      const nativeKey = selectedLanguage === 'sw' ? 'swahili' : 
                       selectedLanguage === 'ln' ? 'lingala' : 'amharic';
      
      cards.push({
        id: `${word.id}_native`,
        text: word[nativeKey],
        type: 'native',
        pairId: word.id,
        category: word.category
      });
      cards.push({
        id: `${word.id}_english`,
        text: word.english,
        type: 'english',
        pairId: word.id,
        category: word.category
      });
    });

    // Shuffle cards
    const shuffledCards = cards.sort(() => Math.random() - 0.5);
    setGameWords(shuffledCards);
    setSelectedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setTimer(60);
    setGameState('ready');
  };

  const startGame = () => {
    setGameState('playing');
  };

  const selectCard = (card) => {
    if (gameState !== 'playing' || selectedCards.length >= 2 || 
        selectedCards.find(c => c.id === card.id) || 
        matchedPairs.includes(card.pairId)) {
      return;
    }

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    // Animate card selection
    animateCard(card.id, 'select');

    if (newSelected.length === 2) {
      setTimeout(() => {
        checkMatch(newSelected);
      }, 500);
    }
  };

  const checkMatch = (selected) => {
    const [card1, card2] = selected;
    
    if (card1.pairId === card2.pairId && card1.type !== card2.type) {
      // Match found!
      setMatchedPairs(prev => [...prev, card1.pairId]);
      setScore(prev => prev + 10);
      
      // Animate success
      animateCard(card1.id, 'match');
      animateCard(card2.id, 'match');
      
      // Check if game is complete
      if (matchedPairs.length + 1 === 6) { // 6 pairs total
        setTimeout(() => endGame(true), 500);
      }
    } else {
      // No match
      animateCard(card1.id, 'nomatch');
      animateCard(card2.id, 'nomatch');
    }

    setTimeout(() => {
      setSelectedCards([]);
    }, 1000);
  };

  const animateCard = (cardId, type) => {
    if (!animations[cardId]) {
      animations[cardId] = new Animated.Value(0);
    }

    const animation = animations[cardId];
    
    switch (type) {
      case 'select':
        Animated.spring(animation, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        break;
      case 'match':
        Animated.sequence([
          Animated.timing(animation, { toValue: 1.2, duration: 200, useNativeDriver: true }),
          Animated.timing(animation, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
        break;
      case 'nomatch':
        Animated.sequence([
          Animated.timing(animation, { toValue: 0.8, duration: 100, useNativeDriver: true }),
          Animated.timing(animation, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
        break;
    }
  };

  const endGame = (completed = false) => {
    setGameState('finished');
    
    const finalScore = completed ? score + timer : score; // Bonus for time remaining
    const xpEarned = Math.floor(finalScore / 2); // Convert score to XP
    
    dispatch(addXP(xpEarned));
    
    setTimeout(() => {
      Alert.alert(
        completed ? '🎉 Congratulations!' : '⏰ Time\'s Up!',
        `Final Score: ${finalScore}\nXP Earned: ${xpEarned}\nMatched Pairs: ${matchedPairs.length}/6`,
        [
          { text: 'Play Again', onPress: initializeGame },
          { text: 'Back to Games', onPress: () => navigation.goBack() }
        ]
      );
    }, 500);
  };

  const renderCard = (card) => {
    const isSelected = selectedCards.find(c => c.id === card.id);
    const isMatched = matchedPairs.includes(card.pairId);
    const isNative = card.type === 'native';
    
    const cardStyle = [
      styles.gameCard,
      isSelected && styles.selectedCard,
      isMatched && styles.matchedCard,
      { backgroundColor: isMatched ? colors.success + '20' : 
                        isSelected ? colors.primary + '20' : 
                        isNative ? colors.primaryLight + '10' : colors.white }
    ];

    const transform = animations[card.id] ? [{
      scale: animations[card.id]
    }] : [];

    return (
      <TouchableOpacity
        key={card.id}
        style={cardStyle}
        onPress={() => selectCard(card)}
        disabled={gameState !== 'playing'}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform }}>
          <Text style={[
            styles.cardText,
            isNative && styles.nativeText,
            isMatched && styles.matchedText
          ]}>
            {card.text}
          </Text>
          {isMatched && (
            <Icon name="check-circle" size={20} color={colors.success} style={styles.checkIcon} />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const getLanguageName = () => {
    const names = { sw: 'Swahili', ln: 'Lingala', am: 'Amharic' };
    return names[selectedLanguage] || 'Swahili';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Word Match Blitz</Text>
        <View style={styles.headerRight}>
          <Text style={styles.languageText}>{getLanguageName()}</Text>
        </View>
      </View>

      {/* Game Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={[styles.statValue, timer < 10 && styles.urgentTime]}>
            {timer}s
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Pairs</Text>
          <Text style={styles.statValue}>{matchedPairs.length}/6</Text>
        </View>
      </View>

      {/* Game Area */}
      {gameState === 'ready' ? (
        <View style={styles.readyContainer}>
          <Icon name="flash-on" size={64} color={colors.primary} />
          <Text style={styles.readyTitle}>Ready to Play?</Text>
          <Text style={styles.readyText}>
            Match {getLanguageName()} words with their English translations as fast as you can!
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.cardsGrid}>
            {gameWords.map(renderCard)}
          </View>
        </View>
      )}

      {/* Instructions */}
      {gameState === 'playing' && (
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Tap cards to match {getLanguageName()} words with English translations
          </Text>
        </View>
      )}
    </View>
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
    paddingTop: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
  },
  title: {
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
  languageText: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.white,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.medium,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: fonts.xl,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  urgentTime: {
    color: colors.error,
  },
  readyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  readyTitle: {
    fontSize: fonts.xxl,
    fontFamily: fonts.bold,
    color: colors.black,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  readyText: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: fonts.lineHeights.relaxed * fonts.md,
    marginBottom: spacing.xl,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  startButtonText: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  gameArea: {
    flex: 1,
    padding: spacing.lg,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  gameCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    aspectRatio: 1.5,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.primary,
    ...shadows.medium,
  },
  matchedCard: {
    borderColor: colors.success,
  },
  cardText: {
    fontSize: fonts.md,
    fontFamily: fonts.medium,
    color: colors.black,
    textAlign: 'center',
  },
  nativeText: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  matchedText: {
    color: colors.success,
  },
  checkIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  instructions: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  instructionText: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.gray,
    textAlign: 'center',
  },
});

export default WordMatchGameScreen;
