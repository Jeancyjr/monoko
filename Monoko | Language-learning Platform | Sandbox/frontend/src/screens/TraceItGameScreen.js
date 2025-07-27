import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  PanResponder,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { addXP, updateStreak } from '../store/store';

const { width, height } = Dimensions.get('window');

const TraceItGameScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { selectedLanguage } = useSelector(state => state.user);
  
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [gameState, setGameState] = useState('ready');
  const [characterIndex, setCharacterIndex] = useState(0);
  const [tracePath, setTracePath] = useState('');
  const [isTracing, setIsTracing] = useState(false);
  const [traceAccuracy, setTraceAccuracy] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  const characterDatabase = {
    sw: [
      { id: 1, char: 'A', name: 'A', sound: 'ah', difficulty: 'easy', strokes: 3 },
      { id: 2, char: 'B', name: 'B', sound: 'bah', difficulty: 'easy', strokes: 2 },
      { id: 3, char: 'M', name: 'M', sound: 'mah', difficulty: 'medium', strokes: 4 },
      { id: 4, char: 'N', name: 'N', sound: 'nah', difficulty: 'medium', strokes: 3 },
      { id: 5, char: 'S', name: 'S', sound: 'sah', difficulty: 'hard', strokes: 1 },
      { id: 6, char: 'T', name: 'T', sound: 'tah', difficulty: 'hard', strokes: 2 }
    ],
    ln: [
      { id: 1, char: 'A', name: 'A', sound: 'ah', difficulty: 'easy', strokes: 3 },
      { id: 2, char: 'B', name: 'B', sound: 'bah', difficulty: 'easy', strokes: 2 },
      { id: 3, char: 'M', name: 'M', sound: 'mah', difficulty: 'medium', strokes: 4 },
      { id: 4, char: 'N', name: 'N', sound: 'nah', difficulty: 'medium', strokes: 3 },
      { id: 5, char: 'S', name: 'S', sound: 'sah', difficulty: 'hard', strokes: 1 }
    ],
    am: [
      { id: 1, char: 'ሀ', name: 'Hoy', sound: 'ha', difficulty: 'easy', strokes: 2 },
      { id: 2, char: 'ለ', name: 'Lawe', sound: 'la', difficulty: 'easy', strokes: 2 },
      { id: 3, char: 'መ', name: 'May', sound: 'ma', difficulty: 'medium', strokes: 3 },
      { id: 4, char: 'ረ', name: 'Rees', sound: 'ra', difficulty: 'medium', strokes: 3 },
      { id: 5, char: 'ሰ', name: 'Sat', sound: 'sa', difficulty: 'hard', strokes: 4 },
      { id: 6, char: 'ተ', name: 'Taw', sound: 'ta', difficulty: 'hard', strokes: 4 }
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

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => gameState === 'playing',
    onMoveShouldSetPanResponder: () => gameState === 'playing',
    
    onPanResponderGrant: (evt) => {
      if (gameState !== 'playing') return;
      setIsTracing(true);
      const { locationX, locationY } = evt.nativeEvent;
      setTracePath(`M${locationX},${locationY}`);
    },
    
    onPanResponderMove: (evt) => {
      if (gameState !== 'playing' || !isTracing) return;
      const { locationX, locationY } = evt.nativeEvent;
      setTracePath(prev => `${prev} L${locationX},${locationY}`);
    },
    
    onPanResponderRelease: () => {
      if (gameState !== 'playing') return;
      setIsTracing(false);
      evaluateTrace();
    }
  });

  const initializeGame = () => {
    const chars = characterDatabase[selectedLanguage] || characterDatabase.sw;
    const shuffledChars = chars.sort(() => Math.random() - 0.5);
    setCharacters(shuffledChars);
    setCurrentCharacter(shuffledChars[0]);
    setCharacterIndex(0);
    setScore(0);
    setTimer(60);
    setGameState('ready');
    setTracePath('');
    setTraceAccuracy(0);
  };

  const startGame = () => {
    setGameState('playing');
  };

  const evaluateTrace = () => {
    const accuracy = Math.random() * 100;
    const roundedAccuracy = Math.round(accuracy);
    setTraceAccuracy(roundedAccuracy);
    
    let points = 0;
    if (roundedAccuracy >= 80) points = 20;
    else if (roundedAccuracy >= 60) points = 15;
    else if (roundedAccuracy >= 40) points = 10;
    else points = 5;
    
    setScore(prev => prev + points);
    
    animateCharacterTransition();
    
    setTimeout(() => {
      nextCharacter();
    }, 2000);
  };

  const animateCharacterTransition = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
    ]).start();
  };

  const nextCharacter = () => {
    const nextIndex = characterIndex + 1;
    if (nextIndex >= characters.length) {
      endGame(true);
    } else {
      setCharacterIndex(nextIndex);
      setCurrentCharacter(characters[nextIndex]);
      setTracePath('');
      setTraceAccuracy(0);
    }
  };

  const clearTrace = () => {
    setTracePath('');
    setTraceAccuracy(0);
  };

  const endGame = (completed = false) => {
    setGameState('finished');
    
    const finalScore = completed ? score + timer : score;
    const xpEarned = Math.floor(finalScore / 3);
    
    dispatch(addXP(xpEarned));
    
    setTimeout(() => {
      Alert.alert(
        completed ? '🎉 Script Master!' : '⏰ Time\'s Up!',
        `Final Score: ${finalScore}\nXP Earned: ${xpEarned}\nCharacters Traced: ${characterIndex + 1}/${characters.length}`,
        [
          { text: 'Practice Again', onPress: initializeGame },
          { text: 'Back to Games', onPress: () => navigation.goBack() }
        ]
      );
    }, 500);
  };

  const getLanguageName = () => {
    const names = { sw: 'Swahili', ln: 'Lingala', am: 'Amharic' };
    return names[selectedLanguage] || 'Swahili';
  };

  const getScriptName = () => {
    const scripts = { sw: 'Latin', ln: 'Latin', am: 'Fidel' };
    return scripts[selectedLanguage] || 'Latin';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.primary;
    }
  };

  const getAccuracyFeedback = (accuracy) => {
    if (accuracy >= 80) return { text: 'Perfect!', color: colors.success, icon: 'star' };
    if (accuracy >= 60) return { text: 'Good!', color: colors.warning, icon: 'thumb-up' };
    if (accuracy >= 40) return { text: 'Keep trying!', color: colors.error, icon: 'refresh' };
    return { text: 'Try again!', color: colors.error, icon: 'refresh' };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Trace It</Text>
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
          <Text style={styles.statLabel}>Progress</Text>
          <Text style={styles.statValue}>{characterIndex + 1}/{characters.length}</Text>
        </View>
      </View>

      {gameState === 'ready' ? (
        <View style={styles.readyContainer}>
          <Icon name="edit" size={64} color={colors.primary} />
          <Text style={styles.readyTitle}>Ready to Trace?</Text>
          <Text style={styles.readyText}>
            Practice writing {getScriptName()} script characters by tracing them with your finger!
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Tracing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameArea}>
          {currentCharacter && (
            <Animated.View style={[styles.characterCard, { opacity: fadeAnim }]}>
              <View style={styles.characterHeader}>
                <View style={styles.difficultyBadge}>
                  <Text style={[styles.difficultyText, { color: getDifficultyColor(currentCharacter.difficulty) }]}>
                    {currentCharacter.difficulty.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.strokeCount}>{currentCharacter.strokes} strokes</Text>
              </View>
              
              <Text style={styles.characterDisplay}>{currentCharacter.char}</Text>
              <Text style={styles.characterName}>{currentCharacter.name}</Text>
              <Text style={styles.characterSound}>/{currentCharacter.sound}/</Text>
              
              <View style={styles.traceArea} {...panResponder.panHandlers}>
                <Svg height="200" width="300" style={styles.traceSvg}>
                  <Text 
                    x="150" 
                    y="100" 
                    fontSize="120" 
                    textAnchor="middle" 
                    fill={colors.lightGray}
                    opacity={0.3}
                  >
                    {currentCharacter.char}
                  </Text>
                  {tracePath && (
                    <Path
                      d={tracePath}
                      stroke={colors.primary}
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </Svg>
                <Text style={styles.traceInstruction}>
                  {isTracing ? 'Keep tracing...' : 'Trace the character above'}
                </Text>
              </View>
              
              <View style={styles.traceControls}>
                <TouchableOpacity style={styles.clearButton} onPress={clearTrace}>
                  <Icon name="clear" size={20} color={colors.white} />
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
              
              {traceAccuracy > 0 && (
                <View style={styles.feedbackContainer}>
                  <View style={styles.accuracyContainer}>
                    <Text style={styles.accuracyText}>{traceAccuracy}%</Text>
                    <Icon 
                      name={getAccuracyFeedback(traceAccuracy).icon} 
                      size={24} 
                      color={getAccuracyFeedback(traceAccuracy).color} 
                    />
                  </View>
                  <Text style={[styles.feedbackText, { color: getAccuracyFeedback(traceAccuracy).color }]}>
                    {getAccuracyFeedback(traceAccuracy).text}
                  </Text>
                </View>
              )}
            </Animated.View>
          )}
        </View>
      )}

      {gameState === 'playing' && (
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Use your finger to trace the character in the gray area
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
    justifyContent: 'center',
  },
  characterCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.medium,
  },
  characterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.md,
  },
  difficultyBadge: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    fontSize: fonts.xs,
    fontFamily: fonts.bold,
  },
  strokeCount: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.gray,
  },
  characterDisplay: {
    fontSize: 80,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  characterName: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  characterSound: {
    fontSize: fonts.md,
    fontFamily: fonts.medium,
    color: colors.gray,
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  traceArea: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderStyle: 'dashed',
  },
  traceSvg: {
    backgroundColor: 'transparent',
  },
  traceInstruction: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.gray,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  traceControls: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  clearButton: {
    backgroundColor: colors.gray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  clearButtonText: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  feedbackContainer: {
    alignItems: 'center',
  },
  accuracyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  accuracyText: {
    fontSize: fonts.xl,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  feedbackText: {
    fontSize: fonts.md,
    fontFamily: fonts.bold,
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

export default TraceItGameScreen;
