import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { addXP, completeLesson } from '../store/store';

const { width } = Dimensions.get('window');

const LessonPlayerScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { lesson } = route.params;
  const { selectedLanguage } = useSelector(state => state.user);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));

  // Sample lesson content based on the lesson ID
  const lessonContent = {
    'sw-basics-1': {
      title: 'Greetings & Introductions',
      steps: [
        {
          type: 'introduction',
          title: 'Welcome to Swahili Greetings!',
          content: 'In this lesson, you\'ll learn essential Swahili greetings and how to introduce yourself.',
          culturalNote: 'Greetings are very important in East African culture. Taking time to greet properly shows respect.',
          image: '👋'
        },
        {
          type: 'vocabulary',
          title: 'New Vocabulary',
          words: [
            { swahili: 'Jambo', english: 'Hello (casual)', pronunciation: 'JAHM-boh' },
            { swahili: 'Habari', english: 'How are you?', pronunciation: 'hah-BAH-ree' },
            { swahili: 'Nzuri', english: 'Good/Fine', pronunciation: 'nn-ZOO-ree' },
            { swahili: 'Jina langu ni...', english: 'My name is...', pronunciation: 'JEE-nah LAHN-goo nee' }
          ]
        },
        {
          type: 'practice',
          title: 'Practice: Choose the correct translation',
          question: 'What does "Jambo" mean in English?',
          options: ['Good morning', 'Hello', 'Thank you', 'Goodbye'],
          correct: 1,
          explanation: 'Jambo is the most common casual greeting in Swahili, meaning "Hello".'
        },
        {
          type: 'practice',
          title: 'Practice: Complete the phrase',
          question: 'How do you say "My name is John" in Swahili?',
          options: ['Jambo John', 'Jina langu ni John', 'Habari John', 'Asante John'],
          correct: 1,
          explanation: '"Jina langu ni..." means "My name is..." - a crucial phrase for introductions.'
        },
        {
          type: 'dialogue',
          title: 'Real Conversation',
          dialogue: [
            { speaker: 'Maria', text: 'Jambo!', translation: 'Hello!' },
            { speaker: 'John', text: 'Jambo! Habari yako?', translation: 'Hello! How are you?' },
            { speaker: 'Maria', text: 'Nzuri sana. Jina langu ni Maria.', translation: 'Very well. My name is Maria.' },
            { speaker: 'John', text: 'Jina langu ni John. Furaha kukuona!', translation: 'My name is John. Nice to meet you!' }
          ]
        },
        {
          type: 'review',
          title: 'Lesson Complete!',
          summary: 'You\'ve learned essential Swahili greetings and introductions.',
          wordsLearned: 4,
          xpEarned: 50
        }
      ]
    }
  };

  const currentLessonData = lessonContent[lesson.id] || lessonContent['sw-basics-1'];
  const currentStepData = currentLessonData.steps[currentStep];

  useEffect(() => {
    animateStepTransition();
  }, [currentStep]);

  const animateStepTransition = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 50, duration: 0, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true })
      ])
    ]).start();
  };

  const nextStep = () => {
    if (currentStep < currentLessonData.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowFeedback(false);
    } else {
      completeLessonFlow();
    }
  };

  const handleAnswer = (selectedIndex) => {
    if (currentStepData.type !== 'practice') return;

    const isCorrect = selectedIndex === currentStepData.correct;
    const newAnswer = {
      stepIndex: currentStep,
      selectedIndex,
      isCorrect,
      question: currentStepData.question
    };

    setUserAnswers(prev => [...prev, newAnswer]);
    setShowFeedback(true);

    // Auto-advance after showing feedback
    setTimeout(() => {
      nextStep();
    }, 2000);
  };

  const completeLessonFlow = () => {
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const totalQuestions = userAnswers.length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100;
    const xpEarned = Math.max(30, Math.floor(score * 0.5)); // Minimum 30 XP

    dispatch(addXP(xpEarned));
    dispatch(completeLesson(lesson.id));
    setLessonComplete(true);

    Alert.alert(
      '🎉 Lesson Complete!',
      `Score: ${score}%\nXP Earned: ${xpEarned}\nCorrect Answers: ${correctAnswers}/${totalQuestions}`,
      [
        { text: 'Continue Learning', onPress: () => navigation.goBack() },
        { text: 'Review Lesson', onPress: () => setCurrentStep(0) }
      ]
    );
  };

  const renderIntroduction = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepEmoji}>{currentStepData.image}</Text>
      <Text style={styles.stepTitle}>{currentStepData.title}</Text>
      <Text style={styles.stepContent}>{currentStepData.content}</Text>
      
      {currentStepData.culturalNote && (
        <View style={styles.culturalNote}>
          <Icon name="info" size={20} color={colors.primary} />
          <Text style={styles.culturalNoteText}>{currentStepData.culturalNote}</Text>
        </View>
      )}
      
      <TouchableOpacity style={styles.continueButton} onPress={nextStep}>
        <Text style={styles.continueButtonText}>Let's Learn!</Text>
        <Icon name="arrow-forward" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );

  const renderVocabulary = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{currentStepData.title}</Text>
      <ScrollView style={styles.vocabularyList}>
        {currentStepData.words.map((word, index) => (
          <View key={index} style={styles.vocabularyItem}>
            <View style={styles.wordPair}>
              <Text style={styles.swahiliWord}>{word.swahili}</Text>
              <Text style={styles.englishWord}>{word.english}</Text>
            </View>
            <Text style={styles.pronunciation}>[{word.pronunciation}]</Text>
          </View>
        ))}
      </ScrollView>
      
      <TouchableOpacity style={styles.continueButton} onPress={nextStep}>
        <Text style={styles.continueButtonText}>Practice Time!</Text>
        <Icon name="quiz" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );

  const renderPractice = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{currentStepData.title}</Text>
      <Text style={styles.practiceQuestion}>{currentStepData.question}</Text>
      
      <View style={styles.optionsContainer}>
        {currentStepData.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              showFeedback && index === currentStepData.correct && styles.correctOption,
              showFeedback && index !== currentStepData.correct && 
              userAnswers[userAnswers.length - 1]?.selectedIndex === index && styles.incorrectOption
            ]}
            onPress={() => handleAnswer(index)}
            disabled={showFeedback}
          >
            <Text style={styles.optionText}>{option}</Text>
            {showFeedback && index === currentStepData.correct && (
              <Icon name="check-circle" size={20} color={colors.success} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {showFeedback && (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>{currentStepData.explanation}</Text>
        </View>
      )}
    </View>
  );

  const renderDialogue = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{currentStepData.title}</Text>
      <Text style={styles.dialogueIntro}>Listen to this natural conversation:</Text>
      
      <ScrollView style={styles.dialogueContainer}>
        {currentStepData.dialogue.map((line, index) => (
          <View key={index} style={styles.dialogueLine}>
            <View style={styles.dialogueHeader}>
              <Text style={styles.speakerName}>{line.speaker}</Text>
            </View>
            <Text style={styles.dialogueSwahili}>{line.text}</Text>
            <Text style={styles.dialogueEnglish}>{line.translation}</Text>
          </View>
        ))}
      </ScrollView>
      
      <TouchableOpacity style={styles.continueButton} onPress={nextStep}>
        <Text style={styles.continueButtonText}>Complete Lesson</Text>
        <Icon name="celebration" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );

  const renderReview = () => (
    <View style={styles.stepContainer}>
      <Icon name="star" size={64} color={colors.warning} />
      <Text style={styles.stepTitle}>{currentStepData.title}</Text>
      <Text style={styles.reviewSummary}>{currentStepData.summary}</Text>
      
      <View style={styles.reviewStats}>
        <View style={styles.reviewStat}>
          <Text style={styles.reviewStatNumber}>{currentStepData.wordsLearned}</Text>
          <Text style={styles.reviewStatLabel}>Words Learned</Text>
        </View>
        <View style={styles.reviewStat}>
          <Text style={styles.reviewStatNumber}>{currentStepData.xpEarned}</Text>
          <Text style={styles.reviewStatLabel}>XP Earned</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.continueButton} onPress={nextStep}>
        <Text style={styles.continueButtonText}>Finish Lesson</Text>
        <Icon name="check" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );

  const renderStep = () => {
    switch (currentStepData.type) {
      case 'introduction': return renderIntroduction();
      case 'vocabulary': return renderVocabulary();
      case 'practice': return renderPractice();
      case 'dialogue': return renderDialogue();
      case 'review': return renderReview();
      default: return <Text>Unknown step type</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{currentLessonData.title}</Text>
        <Text style={styles.headerProgress}>
          {currentStep + 1}/{currentLessonData.steps.length}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / currentLessonData.steps.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      {/* Step Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {renderStep()}
      </Animated.View>
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
  headerTitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  headerProgress: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.white,
    opacity: 0.9,
  },
  progressBarContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  stepEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  stepTitle: {
    fontSize: fonts.xxl,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  stepContent: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: fonts.lineHeights.relaxed * fonts.md,
    marginBottom: spacing.lg,
  },
  culturalNote: {
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
  vocabularyList: {
    flex: 1,
    width: '100%',
  },
  vocabularyItem: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  wordPair: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  swahiliWord: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  englishWord: {
    fontSize: fonts.lg,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  pronunciation: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  practiceQuestion: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  optionsContainer: {
    width: '100%',
    gap: spacing.md,
  },
  optionButton: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.small,
  },
  correctOption: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success,
    borderWidth: 2,
  },
  incorrectOption: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error,
    borderWidth: 2,
  },
  optionText: {
    fontSize: fonts.md,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  feedback: {
    backgroundColor: colors.primary + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  feedbackText: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.primary,
    textAlign: 'center',
  },
  dialogueIntro: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginBottom: spacing.lg,
  },
  dialogueContainer: {
    flex: 1,
    width: '100%',
  },
  dialogueLine: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  dialogueHeader: {
    marginBottom: spacing.sm,
  },
  speakerName: {
    fontSize: fonts.sm,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  dialogueSwahili: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  dialogueEnglish: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
  reviewSummary: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  reviewStats: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.xl,
  },
  reviewStat: {
    alignItems: 'center',
  },
  reviewStatNumber: {
    fontSize: fonts.xxxl,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  reviewStatLabel: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.gray,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    ...shadows.medium,
  },
  continueButtonText: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});

export default LessonPlayerScreen;
