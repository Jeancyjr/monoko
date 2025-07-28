import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius, shadows, screenDimensions } from '../theme';
import { addXP, updateStreak } from '../store/store';
import { 
  responsive, 
  getIconSize,
  getValueForDevice 
} from '../utils/responsive';

const EchoMeGameScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { selectedLanguage } = useSelector(state => state.user);
  
  const [currentWord, setCurrentWord] = useState(null);
  const [gameWords, setGameWords] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [gameState, setGameState] = useState('ready');
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  const wordDatabase = {
    sw: [
      { id: 1, word: 'Jambo', pronunciation: 'JAM-bo', meaning: 'Hello', difficulty: 'easy' },
      { id: 2, word: 'Asante', pronunciation: 'ah-SAHN-teh', meaning: 'Thank you', difficulty: 'easy' },
      { id: 3, word: 'Karibu', pronunciation: 'kah-REE-boo', meaning: 'Welcome', difficulty: 'medium' },
      { id: 4, word: 'Habari', pronunciation: 'hah-BAH-ree', meaning: 'News/How are you', difficulty: 'medium' },
      { id: 5, word: 'Baadaye', pronunciation: 'bah-ah-DAH-yeh', meaning: 'See you later', difficulty: 'hard' },
      { id: 6, word: 'Pole pole', pronunciation: 'POH-leh POH-leh', meaning: 'Slowly', difficulty: 'hard' }
    ],
    ln: [
      { id: 1, word: 'Mbote', pronunciation: 'mm-BOH-teh', meaning: 'Hello', difficulty: 'easy' },
      { id: 2, word: 'Melesi', pronunciation: 'meh-LEH-see', meaning: 'Thank you', difficulty: 'easy' },
      { id: 3, word: 'Boyei', pronunciation: 'boh-YEH-ee', meaning: 'Welcome', difficulty: 'medium' },
      { id: 4, word: 'Sango nini', pronunciation: 'SAHN-go NEE-nee', meaning: 'What news', difficulty: 'medium' },
      { id: 5, word: 'Tokomona', pronunciation: 'toh-koh-MOH-nah', meaning: 'See you later', difficulty: 'hard' }
    ],
    am: [
      { id: 1, word: 'ሰላም', pronunciation: 'se-LAHM', meaning: 'Hello/Peace', difficulty: 'easy' },
      { id: 2, word: 'አመሰግናለሁ', pronunciation: 'ah-meh-seg-nah-LEH-hu', meaning: 'Thank you', difficulty: 'hard' },
      { id: 3, word: 'እንኳን ደህና መጣህ', pronunciation: 'en-kwan deh-nah meh-TAH', meaning: 'Welcome', difficulty: 'hard' },
      { id: 4, word: 'ደህና ነህ', pronunciation: 'deh-nah NEH', meaning: 'How are you', difficulty: 'medium' }
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
    const shuffledWords = words.sort(() => Math.random() - 0.5);
    setGameWords(shuffledWords);
    setCurrentWord(shuffledWords[0]);
    setWordIndex(0);
    setScore(0);
    setTimer(60);
    setGameState('ready');
    setPronunciationScore(0);
  };

  const startGame = () => {
    setGameState('playing');
  };

  const simulatePronunciation = () => {
    if (gameState !== 'playing' || isRecording) return;
    
    setIsRecording(true);
    
    setTimeout(() => {
      const accuracy = Math.random() * 100;
      const roundedAccuracy = Math.round(accuracy);
      setPronunciationScore(roundedAccuracy);
      
      let points = 0;
      if (roundedAccuracy >= 80) points = 15;
      else if (roundedAccuracy >= 60) points = 10;
      else if (roundedAccuracy >= 40) points = 5;
      
      setScore(prev => prev + points);
      setIsRecording(false);
      
      animateWordTransition();
      
      setTimeout(() => {
        nextWord();
      }, 2000);
    }, 2000);
  };

  const animateWordTransition = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
    ]).start();
  };

  const nextWord = () => {
    const nextIndex = wordIndex + 1;
    if (nextIndex >= gameWords.length) {
      endGame(true);
    } else {
      setWordIndex(nextIndex);
      setCurrentWord(gameWords[nextIndex]);
      setPronunciationScore(0);
    }
  };

  const endGame = (completed = false) => {
    setGameState('finished');
    
    const finalScore = completed ? score + timer : score;
    const xpEarned = Math.floor(finalScore / 3);
    
    dispatch(addXP(xpEarned));
    
    setTimeout(() => {
      Alert.alert(
        completed ? '🎉 Great Pronunciation!' : '⏰ Time\'s Up!',
        `Final Score: ${finalScore}\nXP Earned: ${xpEarned}\nWords Practiced: ${wordIndex + 1}/${gameWords.length}`,
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.primary;
    }
  };

  const getPronunciationFeedback = (score) => {
    if (score >= 80) return { text: 'Excellent!', color: colors.success, icon: 'star' };
    if (score >= 60) return { text: 'Good!', color: colors.warning, icon: 'thumb-up' };
    if (score >= 40) return { text: 'Keep trying!', color: colors.error, icon: 'refresh' };
    return { text: 'Try again!', color: colors.error, icon: 'refresh' };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Echo Me</Text>
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
          <Text style={styles.statValue}>{wordIndex + 1}/{gameWords.length}</Text>
        </View>
      </View>

      {gameState === 'ready' ? (
        <View style={styles.readyContainer}>
          <Icon name="record-voice-over" size={64} color={colors.primary} />
          <Text style={styles.readyTitle}>Ready to Practice?</Text>
          <Text style={styles.readyText}>
            Listen and repeat {getLanguageName()} words to improve your pronunciation!
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameArea}>
          {currentWord && (
            <Animated.View style={[styles.wordCard, { opacity: fadeAnim }]}>
              <View style={styles.difficultyBadge}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(currentWord.difficulty) }]}>
                  {currentWord.difficulty.toUpperCase()}
                </Text>
              </View>
              
              <Text style={styles.nativeWord}>{currentWord.word}</Text>
              <Text style={styles.pronunciation}>/{currentWord.pronunciation}/</Text>
              <Text style={styles.meaning}>"{currentWord.meaning}"</Text>
              
              <TouchableOpacity 
                style={[styles.recordButton, isRecording && styles.recordingButton]}
                onPress={simulatePronunciation}
                disabled={isRecording}
              >
                <Icon 
                  name={isRecording ? "mic" : "mic-none"} 
                  size={32} 
                  color={colors.white} 
                />
                <Text style={styles.recordButtonText}>
                  {isRecording ? 'Listening...' : 'Tap to Speak'}
                </Text>
              </TouchableOpacity>
              
              {pronunciationScore > 0 && (
                <View style={styles.feedbackContainer}>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{pronunciationScore}%</Text>
                    <Icon 
                      name={getPronunciationFeedback(pronunciationScore).icon} 
                      size={24} 
                      color={getPronunciationFeedback(pronunciationScore).color} 
                    />
                  </View>
                  <Text style={[styles.feedbackText, { color: getPronunciationFeedback(pronunciationScore).color }]}>
                    {getPronunciationFeedback(pronunciationScore).text}
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
            Tap the microphone and repeat the word clearly
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
  wordCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.medium,
    position: 'relative',
  },
  difficultyBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  difficultyText: {
    fontSize: fonts.xs,
    fontFamily: fonts.bold,
  },
  nativeWord: {
    fontSize: fonts.xxxl,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  pronunciation: {
    fontSize: fonts.lg,
    fontFamily: fonts.medium,
    color: colors.gray,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  meaning: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.darkGray,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
    marginBottom: spacing.lg,
  },
  recordingButton: {
    backgroundColor: colors.error,
  },
  recordButtonText: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.white,
    marginTop: spacing.xs,
  },
  feedbackContainer: {
    alignItems: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  scoreText: {
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

export default EchoMeGameScreen;
