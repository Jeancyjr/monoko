import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { addXP, updateStreak } from '../store/store';
import { AchievementMascot } from '../components/AfricanCharacters';

const { width } = Dimensions.get('window');

const MemoryCardsGameScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { selectedLanguage } = useSelector(state => state.user);
  
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [gameState, setGameState] = useState('ready');
  const [moves, setMoves] = useState(0);
  const [animations] = useState({});

  const  cardDatabase = {
    sw: [
      { id: 1, word: 'Simba', characterType: 'conversation', meaning: 'Lion', category: 'animals' },
      { id: 2, word: 'Nyoka', characterType: 'cultural', meaning: 'Snake', category: 'animals' },
      { id: 3, word: 'Ndege', characterType: 'vocabulary', meaning: 'Bird', category: 'animals' },
      { id: 4, word: 'Mti', characterType: 'cultural', meaning: 'Tree', category: 'nature' },
      { id: 5, word: 'Jua', characterType: 'streak', meaning: 'Sun', category: 'nature' },
      { id: 6, word: 'Maji', characterType: 'vocabulary', meaning: 'Water', category: 'nature' },
      { id: 7, word: 'Nyumba', characterType: 'first-steps', meaning: 'House', category: 'objects' },
      { id: 8, word: 'Gari', characterType: 'vocabulary', meaning: 'Car', category: 'objects' }
    ],
    ln: [
      { id: 1, word: 'Nkosi', characterType: 'conversation', meaning: 'Lion', category: 'animals' },
      { id: 2, word: 'Nyoka', characterType: 'cultural', meaning: 'Snake', category: 'animals' },
      { id: 3, word: 'Ndeke', characterType: 'vocabulary', meaning: 'Bird', category: 'animals' },
      { id: 4, word: 'Nzete', characterType: 'cultural', meaning: 'Tree', category: 'nature' },
      { id: 5, word: 'Moyi', characterType: 'streak', meaning: 'Sun', category: 'nature' },
      { id: 6, word: 'Mai', characterType: 'vocabulary', meaning: 'Water', category: 'nature' }
    ],
    am: [
      { id: 1, word: 'አንበሳ', characterType: 'conversation', meaning: 'Lion', category: 'animals' },
      { id: 2, word: 'እባብ', characterType: 'cultural', meaning: 'Snake', category: 'animals' },
      { id: 3, word: 'ወፍ', characterType: 'vocabulary', meaning: 'Bird', category: 'animals' },
      { id: 4, word: 'ዛፍ', characterType: 'cultural', meaning: 'Tree', category: 'nature' },
      { id: 5, word: 'ፀሐይ', characterType: 'streak', meaning: 'Sun', category: 'nature' },
      { id: 6, word: 'ውሃ', characterType: 'vocabulary', meaning: 'Water', category: 'nature' }
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
    const words = cardDatabase[selectedLanguage] || cardDatabase.sw;
    const selectedWords = words.slice(0, 6);
    
    const gameCards = [];
    selectedWords.forEach(word => {
      gameCards.push({
        id: `${word.id}_word`,
        type: 'word',
        content: word.word,
        pairId: word.id,
        meaning: word.meaning,
        category: word.category
      });
      gameCards.push({
        id: `${word.id}_image`,
        type: 'image',
        content: word.characterType,
        characterType: word.characterType,
        pairId: word.id,
        meaning: word.meaning,
        category: word.category
      });
    });

    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setTimer(60);
    setMoves(0);
    setGameState('ready');
  };

  const startGame = () => {
    setGameState('playing');
  };

  const flipCard = (cardId) => {
    if (gameState !== 'playing' || 
        flippedCards.length >= 2 || 
        flippedCards.includes(cardId) || 
        matchedPairs.some(pair => pair.includes(cardId))) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    animateCard(cardId, 'flip');

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setTimeout(() => {
        checkMatch(newFlippedCards);
      }, 1000);
    }
  };

  const checkMatch = (flipped) => {
    const [card1Id, card2Id] = flipped;
    const card1 = cards.find(c => c.id === card1Id);
    const card2 = cards.find(c => c.id === card2Id);

    if (card1.pairId === card2.pairId && card1.type !== card2.type) {
      setMatchedPairs(prev => [...prev, flipped]);
      setScore(prev => prev + 20);
      
      animateCard(card1Id, 'match');
      animateCard(card2Id, 'match');
      
      if (matchedPairs.length + 1 === 6) {
        setTimeout(() => endGame(true), 500);
      }
    } else {
      animateCard(card1Id, 'nomatch');
      animateCard(card2Id, 'nomatch');
    }

    setTimeout(() => {
      setFlippedCards([]);
    }, 1500);
  };

  const animateCard = (cardId, type) => {
    if (!animations[cardId]) {
      animations[cardId] = new Animated.Value(0);
    }

    const animation = animations[cardId];
    
    switch (type) {
      case 'flip':
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
    
    const bonusPoints = completed ? Math.max(0, 60 - moves) * 2 : 0;
    const finalScore = score + bonusPoints + (completed ? timer : 0);
    const xpEarned = Math.floor(finalScore / 2);
    
    dispatch(addXP(xpEarned));
    
    setTimeout(() => {
      Alert.alert(
        completed ? 'Memory Master!' : 'Time\'s Up!',
        `Final Score: ${finalScore}\nXP Earned: ${xpEarned}\nMoves: ${moves}\nMatched Pairs: ${matchedPairs.length}/6`,
        [
          { text: 'Play Again', onPress: initializeGame },
          { text: 'Back to Games', onPress: () => navigation.goBack() }
        ]
      );
    }, 500);
  };

  const renderCard = (card) => {
    const isFlipped = flippedCards.includes(card.id);
    const isMatched = matchedPairs.some(pair => pair.includes(card.id));
    const showContent = isFlipped || isMatched;
    
    const cardStyle = [
      styles.card,
      isMatched && styles.matchedCard,
      { backgroundColor: showContent ? colors.white : colors.primary }
    ];

    const transform = animations[card.id] ? [{
      scale: animations[card.id]
    }] : [];

    return (
      <TouchableOpacity
        key={card.id}
        style={cardStyle}
        onPress={() => flipCard(card.id)}
        disabled={gameState !== 'playing'}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.cardContent, { transform }]}>
          {showContent ? (
            <>
              {card.type === 'image' ? (
                <View style={styles.cardCharacter}>
                  <AchievementMascot type={card.characterType || 'vocabulary'} size={24} />
                </View>
              ) : (
                <Text style={styles.cardWord}>{card.content}</Text>
              )}
              <Text style={styles.cardMeaning}>{card.meaning}</Text>
              {isMatched && (
                <Icon name="check-circle" size={20} color={colors.success} style={styles.checkIcon} />
              )}
            </>
          ) : (
            <Icon name="help-outline" size={32} color={colors.white} />
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Memory Cards</Text>
        <View style={styles.headerRight}>
          <Text style={styles.languageText}>{getLanguageName()}</Text>
        </View>
      </View>

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
          <Text style={styles.statLabel}>Moves</Text>
          <Text style={styles.statValue}>{moves}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Pairs</Text>
          <Text style={styles.statValue}>{matchedPairs.length}/6</Text>
        </View>
      </View>

      {gameState === 'ready' ? (
        <View style={styles.readyContainer}>
          <Icon name="memory" size={64} color={colors.primary} />
          <Text style={styles.readyTitle}>Ready to Play?</Text>
          <Text style={styles.readyText}>
            Match {getLanguageName()} words with their corresponding images to test your memory!
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.cardsGrid}>
            {cards.map(renderCard)}
          </View>
        </View>
      )}

      {gameState === 'playing' && (
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Tap cards to flip them and find matching pairs
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
    fontSize: fonts.lg,
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
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  card: {
    width: (width - spacing.lg * 2 - spacing.sm * 2) / 3,
    aspectRatio: 0.8,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadows.small,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  matchedCard: {
    borderColor: colors.success,
    backgroundColor: colors.success + '20',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    padding: spacing.xs,
  },
  cardCharacter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  cardWord: {
    fontSize: fonts.md,
    fontFamily: fonts.bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  cardMeaning: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.gray,
    textAlign: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
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

export default MemoryCardsGameScreen;
