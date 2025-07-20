import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius } from '../theme';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Animated entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const languages = [
    { name: 'Swahili', flag: '🇰🇪', speakers: '200M+', color: colors.swahili },
    { name: 'Lingala', flag: '🇨🇩', speakers: '70M+', color: colors.lingala },
    { name: 'Amharic', flag: '🇪🇹', speakers: '57M+', color: colors.amharic },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0' }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Logo/Title Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logo}>
                  M<Text style={styles.logoIcon}>💬</Text>noko
                </Text>
              </View>
              <Text style={styles.tagline}>Speak the Heart of Africa</Text>
              <Text style={styles.subtitle}>
                Learn African languages through culture, connection, and community
              </Text>
            </View>

            {/* Languages Section */}
            <View style={styles.languagesContainer}>
              <Text style={styles.sectionTitle}>Start Your Journey</Text>
              {languages.map((language, index) => (
                <Animated.View
                  key={language.name}
                  style={[
                    styles.languageCard,
                    { backgroundColor: `${language.color}20` },
                  ]}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageFlag}>{language.flag}</Text>
                    <View style={styles.languageText}>
                      <Text style={styles.languageName}>{language.name}</Text>
                      <Text style={styles.languageSpeakers}>
                        {language.speakers} speakers
                      </Text>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={24} color={language.color} />
                </Animated.View>
              ))}
            </View>

            {/* Features Preview */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Icon name="camera-alt" size={24} color={colors.primary} />
                <Text style={styles.featureText}>Snap & Learn AI</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="video-call" size={24} color={colors.secondary} />
                <Text style={styles.featureText}>Live with Locals</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="games" size={24} color={colors.accent} />
                <Text style={styles.featureText}>Fun Games</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('MainTabs')}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Start Learning</Text>
                <Icon name="arrow-forward" size={20} color={colors.white} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {/* Handle sign in */}}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>I already have an account</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.3,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 56,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -2,
  },
  logoIcon: {
    fontSize: 44,
  },
  tagline: {
    fontSize: fonts.lg,
    fontFamily: fonts.medium,
    color: colors.primaryLight,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: 'center',
    lineHeight: fonts.lineHeights.relaxed * fonts.md,
    opacity: 0.9,
  },
  languagesContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fonts.xl,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    ...require('../theme').shadows.small,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  languageSpeakers: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginTop: 2,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.white,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  actionButtons: {
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...require('../theme').shadows.medium,
  },
  primaryButtonText: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.white,
    marginRight: spacing.sm,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: borderRadius.lg,
  },
  secondaryButtonText: {
    fontSize: fonts.md,
    fontFamily: fonts.medium,
    color: colors.white,
  },
});

export default WelcomeScreen;
