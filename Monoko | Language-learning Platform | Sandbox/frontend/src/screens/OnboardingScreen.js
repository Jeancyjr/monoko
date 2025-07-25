import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import MonokoLogo from '../components/MonokoLogo';
import { setOnboardingComplete, setSelectedLanguage } from '../store/store';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLanguage, setLocalSelectedLanguage] = useState(null);
  const scrollViewRef = useRef(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Monoko',
      subtitle: 'Your journey to speaking African languages starts here',
      content: 'Learn through culture, connect with native speakers, and discover the heart of Africa through language.',
      icon: '🌍',
      showLogo: true,
    },
    {
      id: 'ai-features',
      title: 'AI-Powered Learning',
      subtitle: 'Transform your world into a classroom',
      content: 'Use Snap & Learn to instantly translate objects around you into Swahili, Lingala, or Amharic.',
      icon: '📸',
      features: [
        { icon: 'camera-alt', text: 'Point and learn vocabulary' },
        { icon: 'volume-up', text: 'Hear native pronunciation' },
        { icon: 'bookmark', text: 'Save words to your collection' },
      ],
    },
    {
      id: 'live-sessions',
      title: 'Live with a Local',
      subtitle: 'Practice with native speakers',
      content: 'Connect with verified native speakers from Kenya, Congo, and Ethiopia for authentic conversation practice.',
      icon: '💬',
      features: [
        { icon: 'video-call', text: '1-on-1 video sessions' },
        { icon: 'schedule', text: 'Flexible scheduling' },
        { icon: 'favorite', text: 'Cultural insights included' },
      ],
    },
    {
      id: 'gamification',
      title: 'Learn Through Play',
      subtitle: 'Engaging games and achievements',
      content: 'Earn XP, maintain streaks, and unlock achievements as you progress through your language learning journey.',
      icon: '🎮',
      features: [
        { icon: 'videogame-asset', text: 'Interactive word games' },
        { icon: 'local-fire-department', text: 'Daily learning streaks' },
        { icon: 'emoji-events', text: 'Cultural achievements' },
      ],
    },
    {
      id: 'language-selection',
      title: 'Choose Your Language',
      subtitle: 'Which African language would you like to learn?',
      content: 'Start with one language and explore others as you progress.',
      icon: '🗣️',
      isLanguageSelection: true,
    },
  ];

  const languages = [
    {
      code: 'sw',
      name: 'Swahili',
      nativeName: 'Kiswahili',
      flag: '🇰🇪',
      speakers: '200M+ speakers',
      regions: 'Kenya, Tanzania, Uganda',
      color: colors.swahili,
      description: 'The most widely spoken African language, perfect for East African travel and business.',
    },
    {
      code: 'ln',
      name: 'Lingala',
      nativeName: 'Lingála',
      flag: '🇨🇩',
      speakers: '70M+ speakers',
      regions: 'Congo DRC, Congo Republic',
      color: colors.lingala,
      description: 'The language of Congolese music and urban culture, essential for Central Africa.',
    },
    {
      code: 'am',
      name: 'Amharic',
      nativeName: 'አማርኛ',
      flag: '🇪🇹',
      speakers: '57M+ speakers',
      regions: 'Ethiopia',
      color: colors.amharic,
      description: 'Ancient language with beautiful Fidel script, key to Ethiopian culture and business.',
    },
  ];

  useEffect(() => {
    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ x: (currentStep + 1) * width, animated: true });
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ x: (currentStep - 1) * width, animated: true });
    }
  };

  const handleLanguageSelect = (languageCode) => {
    setLocalSelectedLanguage(languageCode);
  };

  const completeOnboarding = () => {
    if (selectedLanguage) {
      dispatch(setSelectedLanguage(selectedLanguage));
    }
    dispatch(setOnboardingComplete(true));
    navigation.replace('Home');
  };

  const renderStep = (step, index) => {
    if (step.isLanguageSelection) {
      return (
        <View key={step.id} style={styles.stepContainer}>
          <Animated.View
            style={[
              styles.stepContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.stepIcon}>{step.icon}</Text>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
            <Text style={styles.stepDescription}>{step.content}</Text>

            <View style={styles.languagesContainer}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageCard,
                    selectedLanguage === language.code && styles.selectedLanguageCard,
                    { borderColor: language.color },
                  ]}
                  onPress={() => handleLanguageSelect(language.code)}
                  activeOpacity={0.8}
                >
                  <View style={styles.languageHeader}>
                    <Text style={styles.languageFlag}>{language.flag}</Text>
                    <View style={styles.languageInfo}>
                      <Text style={styles.languageName}>{language.name}</Text>
                      <Text style={styles.languageNative}>{language.nativeName}</Text>
                    </View>
                  </View>
                  <Text style={styles.languageSpeakers}>{language.speakers}</Text>
                  <Text style={styles.languageRegions}>{language.regions}</Text>
                  <Text style={styles.languageDescription}>{language.description}</Text>
                  
                  {selectedLanguage === language.code && (
                    <View style={[styles.selectedIndicator, { backgroundColor: language.color }]}>
                      <Icon name="check" size={20} color={colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>
      );
    }

    return (
      <View key={step.id} style={styles.stepContainer}>
        <Animated.View
          style={[
            styles.stepContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {step.showLogo ? (
            <View style={styles.logoSection}>
              <MonokoLogo size="large" color="primary" showTagline={true} />
            </View>
          ) : (
            <Text style={styles.stepIcon}>{step.icon}</Text>
          )}
          
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
          <Text style={styles.stepDescription}>{step.content}</Text>

          {step.features && (
            <View style={styles.featuresContainer}>
              {step.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Icon name={feature.icon} size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      </View>
    );
  };

  const currentStepData = onboardingSteps[currentStep];
  const canProceed = !currentStepData.isLanguageSelection || selectedLanguage;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={completeOnboarding}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {onboardingSteps.map((step, index) => renderStep(step, index))}
      </ScrollView>

      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        {onboardingSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentStep && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.previousButton]}
          onPress={handlePrevious}
          disabled={currentStep === 0}
        >
          <Icon 
            name="arrow-back" 
            size={20} 
            color={currentStep === 0 ? colors.lightGray : colors.primary} 
          />
          <Text 
            style={[
              styles.navButtonText, 
              currentStep === 0 && styles.disabledButtonText
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton, 
            styles.nextButton,
            !canProceed && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!canProceed}
        >
          <Text style={[
            styles.navButtonText, 
            styles.nextButtonText,
            !canProceed && styles.disabledButtonText
          ]}>
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <Icon 
            name="arrow-forward" 
            size={20} 
            color={!canProceed ? colors.lightGray : colors.white} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  skipButton: {
    padding: spacing.sm,
  },
  skipText: {
    fontSize: fonts.md,
    fontFamily: fonts.medium,
    color: colors.gray,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  stepContainer: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  stepContent: {
    alignItems: 'center',
    maxWidth: width * 0.8,
  },
  logoSection: {
    marginBottom: spacing.xl,
  },
  stepIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  stepTitle: {
    fontSize: fonts.xxxl,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  stepSubtitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.medium,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  stepDescription: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: fonts.lineHeights.relaxed * fonts.md,
    marginBottom: spacing.xl,
  },
  featuresContainer: {
    width: '100%',
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureText: {
    fontSize: fonts.md,
    fontFamily: fonts.medium,
    color: colors.black,
    flex: 1,
  },
  languagesContainer: {
    width: '100%',
    gap: spacing.md,
  },
  languageCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.lightGray,
    position: 'relative',
    ...shadows.medium,
  },
  selectedLanguageCard: {
    borderWidth: 3,
    ...shadows.large,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  languageNative: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.gray,
  },
  languageSpeakers: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  languageRegions: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginBottom: spacing.sm,
  },
  languageDescription: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.darkGray,
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
  },
  selectedIndicator: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 24,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  previousButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.lightGray,
  },
  navButtonText: {
    fontSize: fonts.md,
    fontFamily: fonts.medium,
  },
  nextButtonText: {
    color: colors.white,
  },
  disabledButtonText: {
    color: colors.gray,
  },
});

export default OnboardingScreen;
