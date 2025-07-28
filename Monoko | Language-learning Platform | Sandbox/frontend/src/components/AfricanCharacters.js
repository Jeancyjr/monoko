import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, Polygon, Ellipse, G } from 'react-native-svg';
import { colors } from '../theme';

export const GuideCharacter = ({ type = 'welcome', size = 64, color = colors.primary, style }) => {
  const getCharacterByType = (type) => {
    switch (type) {
      case 'welcome':
        return <WelcomeGuide size={size} color={color} />;
      case 'camera':
        return <CameraGuide size={size} color={color} />;
      case 'conversation':
        return <ConversationGuide size={size} color={color} />;
      case 'games':
        return <GamesGuide size={size} color={color} />;
      case 'language':
        return <LanguageGuide size={size} color={color} />;
      case 'lesson':
        return <LessonGuide size={size} color={color} />;
      default:
        return <WelcomeGuide size={size} color={color} />;
    }
  };

  return (
    <View style={[{ width: size, height: size }, style]}>
      {getCharacterByType(type)}
    </View>
  );
};

export const AchievementMascot = ({ type, size = 48, style }) => {
  const getCharacterByType = (type) => {
    switch (type) {
      case 'first-steps':
        return <FirstStepsCharacter size={size} />;
      case 'streak':
        return <StreakWarriorCharacter size={size} />;
      case 'vocabulary':
        return <WordCollectorCharacter size={size} />;
      case 'cultural':
        return <CulturalExplorerCharacter size={size} />;
      case 'conversation':
        return <ConversationStarterCharacter size={size} />;
      case 'music':
        return <MusicLoverCharacter size={size} />;
      case 'script':
        return <ScriptMasterCharacter size={size} />;
      case 'coffee':
        return <CoffeeCeremonyCharacter size={size} />;
      case 'polyglot':
        return <PolyglotCharacter size={size} />;
      case 'kinshasa':
        return <KinshasaNavigatorCharacter size={size} />;
      default:
        return <FirstStepsCharacter size={size} />;
    }
  };

  return (
    <View style={[{ width: size, height: size }, style]}>
      {getCharacterByType(type)}
    </View>
  );
};

export const LanguageCharacter = ({ language, size = 64, style }) => {
  const getLanguageCharacter = (lang) => {
    switch (lang) {
      case 'sw':
        return <SwahiliCharacter size={size} />;
      case 'ln':
        return <LingalaCharacter size={size} />;
      case 'am':
        return <AmharicCharacter size={size} />;
      default:
        return <SwahiliCharacter size={size} />;
    }
  };

  return (
    <View style={[{ width: size, height: size }, style]}>
      {getLanguageCharacter(language)}
    </View>
  );
};

const WelcomeGuide = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Circle cx="32" cy="20" r="12" fill={color} />
    <Path d="M20 32 Q32 28 44 32 L44 50 Q32 54 20 50 Z" fill={color} opacity="0.8" />
    <Path d="M26 16 Q32 12 38 16" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="28" cy="18" r="2" fill="white" />
    <Circle cx="36" cy="18" r="2" fill="white" />
    <Path d="M28 22 Q32 26 36 22" stroke="white" strokeWidth="2" fill="none" />
    <Rect x="24" y="35" width="16" height="8" rx="2" fill="white" opacity="0.9" />
  </Svg>
);

const CameraGuide = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Circle cx="32" cy="18" r="10" fill={color} />
    <Path d="M22 28 Q32 24 42 28 L42 46 Q32 50 22 46 Z" fill={color} opacity="0.8" />
    <Circle cx="28" cy="16" r="1.5" fill="white" />
    <Circle cx="36" cy="16" r="1.5" fill="white" />
    <Rect x="26" y="32" width="12" height="8" rx="2" fill="white" opacity="0.9" />
    <Circle cx="32" cy="36" r="3" fill={color} />
    <Path d="M29 20 Q32 24 35 20" stroke="white" strokeWidth="1.5" fill="none" />
  </Svg>
);

const ConversationGuide = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Circle cx="32" cy="18" r="10" fill={color} />
    <Path d="M22 28 Q32 24 42 28 L42 46 Q32 50 22 46 Z" fill={color} opacity="0.8" />
    <Circle cx="28" cy="16" r="1.5" fill="white" />
    <Circle cx="36" cy="16" r="1.5" fill="white" />
    <Ellipse cx="32" cy="20" rx="3" ry="2" fill="white" opacity="0.8" />
    <Path d="M24 32 Q28 30 32 32 Q36 30 40 32" stroke="white" strokeWidth="2" fill="none" />
    <Circle cx="20" cy="38" r="4" fill="white" opacity="0.7" />
    <Circle cx="44" cy="38" r="4" fill="white" opacity="0.7" />
  </Svg>
);

const GamesGuide = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Circle cx="32" cy="18" r="10" fill={color} />
    <Path d="M22 28 Q32 24 42 28 L42 46 Q32 50 22 46 Z" fill={color} opacity="0.8" />
    <Circle cx="28" cy="16" r="1.5" fill="white" />
    <Circle cx="36" cy="16" r="1.5" fill="white" />
    <Path d="M29 20 Q32 24 35 20" stroke="white" strokeWidth="1.5" fill="none" />
    <Rect x="26" y="32" width="12" height="8" rx="2" fill="white" opacity="0.9" />
    <Circle cx="29" cy="35" r="1.5" fill={color} />
    <Circle cx="35" cy="35" r="1.5" fill={color} />
    <Rect x="31" y="37" width="2" height="2" fill={color} />
  </Svg>
);

const LanguageGuide = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Circle cx="32" cy="18" r="10" fill={color} />
    <Path d="M22 28 Q32 24 42 28 L42 46 Q32 50 22 46 Z" fill={color} opacity="0.8" />
    <Circle cx="28" cy="16" r="1.5" fill="white" />
    <Circle cx="36" cy="16" r="1.5" fill="white" />
    <Path d="M26 20 Q32 16 38 20" stroke="white" strokeWidth="2" fill="none" />
    <Path d="M24 32 L40 32 M24 36 L40 36 M24 40 L36 40" stroke="white" strokeWidth="2" />
    <Circle cx="18" cy="34" r="3" fill="white" opacity="0.7" />
    <Circle cx="46" cy="34" r="3" fill="white" opacity="0.7" />
  </Svg>
);

const LessonGuide = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Circle cx="32" cy="18" r="10" fill={color} />
    <Path d="M22 28 Q32 24 42 28 L42 46 Q32 50 22 46 Z" fill={color} opacity="0.8" />
    <Circle cx="28" cy="16" r="1.5" fill="white" />
    <Circle cx="36" cy="16" r="1.5" fill="white" />
    <Path d="M29 20 Q32 24 35 20" stroke="white" strokeWidth="1.5" fill="none" />
    <Rect x="26" y="30" width="12" height="12" rx="2" fill="white" opacity="0.9" />
    <Path d="M28 34 L30 36 L36 30" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

const FirstStepsCharacter = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Circle cx="24" cy="16" r="8" fill={colors.primary} />
    <Path d="M16 24 Q24 20 32 24 L32 40 Q24 44 16 40 Z" fill={colors.primary} opacity="0.9" />
    <Path d="M20 12 Q24 8 28 12" stroke={colors.primary} strokeWidth="1.5" fill="none" />
    <Circle cx="21" cy="14" r="1.5" fill="white" />
    <Circle cx="27" cy="14" r="1.5" fill="white" />
    <Path d="M20 18 Q24 22 28 18" stroke="white" strokeWidth="1.5" fill="none" />
    <Path d="M18 28 L30 28 M18 32 L30 32" stroke="white" strokeWidth="1.5" />
  </Svg>
);

const StreakWarriorCharacter = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Circle cx="24" cy="16" r="8" fill={colors.error} />
    <Path d="M16 24 Q24 20 32 24 L32 40 Q24 44 16 40 Z" fill={colors.error} opacity="0.9" />
    <Path d="M20 12 Q24 8 28 12" stroke={colors.error} strokeWidth="1.5" fill="none" />
    <Circle cx="21" cy="14" r="1.5" fill="white" />
    <Circle cx="27" cy="14" r="1.5" fill="white" />
    <Path d="M20 18 Q24 22 28 18" stroke="white" strokeWidth="1.5" fill="none" />
    <Path d="M22 28 L26 32 L22 36 L26 40" stroke="white" strokeWidth="2" fill="none" />
    <Circle cx="18" cy="30" r="2" fill="white" opacity="0.8" />
    <Circle cx="30" cy="30" r="2" fill="white" opacity="0.8" />
  </Svg>
);

const WordCollectorCharacter = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Circle cx="24" cy="16" r="8" fill={colors.success} />
    <Path d="M16 24 Q24 20 32 24 L32 40 Q24 44 16 40 Z" fill={colors.success} opacity="0.9" />
    <Path d="M20 12 Q24 8 28 12" stroke={colors.success} strokeWidth="1.5" fill="none" />
    <Circle cx="21" cy="14" r="1.5" fill="white" />
    <Circle cx="27" cy="14" r="1.5" fill="white" />
    <Path d="M20 18 Q24 22 28 18" stroke="white" strokeWidth="1.5" fill="none" />
    <Polygon points="24,28 26,30 24,32 22,30" fill="white" />
    <Polygon points="20,32 22,34 20,36 18,34" fill="white" opacity="0.8" />
    <Polygon points="28,32 30,34 28,36 26,34" fill="white" opacity="0.8" />
  </Svg>
);

const CulturalExplorerCharacter = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Circle cx="24" cy="16" r="8" fill={colors.warning} />
    <Path d="M16 24 Q24 20 32 24 L32 40 Q24 44 16 40 Z" fill={colors.warning} opacity="0.9" />
    <Path d="M20 12 Q24 8 28 12" stroke={colors.warning} strokeWidth="1.5" fill="none" />
    <Circle cx="21" cy="14" r="1.5" fill="white" />
    <Circle cx="27" cy="14" r="1.5" fill="white" />
    <Path d="M20 18 Q24 22 28 18" stroke="white" strokeWidth="1.5" fill="none" />
    <Rect x="20" y="28" width="8" height="8" rx="1" fill="white" opacity="0.9" />
    <Path d="M22 30 L26 30 M22 32 L26 32 M22 34 L24 34" stroke={colors.warning} strokeWidth="1" />
  </Svg>
);

const ConversationStarterCharacter = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Circle cx="24" cy="16" r="8" fill={colors.secondary} />
    <Path d="M16 24 Q24 20 32 24 L32 40 Q24 44 16 40 Z" fill={colors.secondary} opacity="0.9" />
    <Path d="M20 12 Q24 8 28 12" stroke={colors.secondary} strokeWidth="1.5" fill="none" />
    <Circle cx="21" cy="14" r="1.5" fill="white" />
    <Circle cx="27" cy="14" r="1.5" fill="white" />
    <Ellipse cx="24" cy="18" rx="3" ry="2" fill="white" opacity="0.8" />
    <Ellipse cx="20" cy="32" rx="4" ry="3" fill="white" opacity="0.7" />
    <Ellipse cx="28" cy="32" rx="4" ry="3" fill="white" opacity="0.7" />
  </Svg>
);

const MusicLoverCharacter = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Circle cx="24" cy="16" r="8" fill={colors.lingala} />
    <Path d="M16 24 Q24 20 32 24 L32 40 Q24 44 16 40 Z" fill={colors.lingala} opacity="0.9" />
    <Path d="M20 12 Q24 8 28 12" stroke={colors.lingala} strokeWidth="1.5" fill="none" />
    <Circle cx="21" cy="14" r="1.5" fill="white" />
    <Circle cx="27" cy="14" r="1.5" fill="white" />
    <Path d="M20 18 Q24 22 28 18" stroke="white" strokeWidth="1.5" fill="none" />
    <Path d="M20 28 Q22 26 24 28 Q26 30 28 28" stroke="white" strokeWidth="2" fill="none" />
    <Circle cx="19" cy="32" r="2" fill="white" />
    <Circle cx="29" cy="32" r="2" fill="white" />
  </Svg>
);

const ScriptMasterCharacter = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Circle cx="24" cy="16" r="8" fill={colors.amharic} />
    <Path d="M16 24 Q24 20 32 24 L32 40 Q24 44 16 40 Z" fill={colors.amharic} opacity="0.9" />
    <Path d="M20 12 Q24 8 28 12" stroke={colors.amharic} strokeWidth="1.5" fill="none" />
    <Circle cx="21" cy="14" r="1.5" fill="white" />
    <Circle cx="27" cy="14" r="1.5" fill="white" />
    <Path d="M20 18 Q24 22 28 18" stroke="white" strokeWidth="1.5" fill="none" />
    <Rect x="19" y="28" width="10" height="8" rx="1" fill="white" opacity="0.9" />
    <Path d="M21 30 Q24 28 27 30 M21 32 L27 32 M21 34 Q24 36 27 34" stroke={colors.amharic} strokeWidth="1" fill="none" />
  </Svg>
);

const CoffeeCeremonyCharacter = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Circle cx="24" cy="16" r="8" fill={colors.amharic} />
    <Path d="M16 24 Q24 20 32 24 L32 40 Q24 44 16 40 Z" fill={colors.amharic} opacity="0.9" />
    <Path d="M20 12 Q24 8 28 12" stroke={colors.amharic} strokeWidth="1.5" fill="none" />
    <Circle cx="21" cy="14" r="1.5" fill="white" />
    <Circle cx="27" cy="14" r="1.5" fill="white" />
    <Path d="M20 18 Q24 22 28 18" stroke="white" strokeWidth="1.5" fill="none" />
    <Ellipse cx="24" cy="32" rx="4" ry="6" fill="white" opacity="0.9" />
    <Path d="M28 30 Q30 28 32 30" stroke="white" strokeWidth="1.5" fill="none" />
    <Path d="M22 28 Q24 26 26 28" stroke="white" strokeWidth="1" fill="none" />
  </Svg>
);

const PolyglotCharacter = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Circle cx="24" cy="16" r="8" fill={colors.primary} />
    <Path d="M16 24 Q24 20 32 24 L32 40 Q24 44 16 40 Z" fill={colors.primary} opacity="0.9" />
    <Path d="M20 12 Q24 8 28 12" stroke={colors.primary} strokeWidth="1.5" fill="none" />
    <Circle cx="21" cy="14" r="1.5" fill="white" />
    <Circle cx="27" cy="14" r="1.5" fill="white" />
    <Path d="M20 18 Q24 22 28 18" stroke="white" strokeWidth="1.5" fill="none" />
    <Circle cx="18" cy="30" r="3" fill="white" opacity="0.8" />
    <Circle cx="24" cy="32" r="3" fill="white" opacity="0.8" />
    <Circle cx="30" cy="30" r="3" fill="white" opacity="0.8" />
  </Svg>
);

const KinshasaNavigatorCharacter = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Circle cx="24" cy="16" r="8" fill={colors.lingala} />
    <Path d="M16 24 Q24 20 32 24 L32 40 Q24 44 16 40 Z" fill={colors.lingala} opacity="0.9" />
    <Path d="M20 12 Q24 8 28 12" stroke={colors.lingala} strokeWidth="1.5" fill="none" />
    <Circle cx="21" cy="14" r="1.5" fill="white" />
    <Circle cx="27" cy="14" r="1.5" fill="white" />
    <Path d="M20 18 Q24 22 28 18" stroke="white" strokeWidth="1.5" fill="none" />
    <Rect x="20" y="28" width="8" height="8" rx="1" fill="white" opacity="0.9" />
    <Rect x="22" y="30" width="4" height="4" rx="0.5" fill={colors.lingala} />
    <Path d="M18 32 L30 32 M24 26 L24 38" stroke="white" strokeWidth="1" />
  </Svg>
);

const SwahiliCharacter = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Circle cx="32" cy="20" r="12" fill={colors.swahili} />
    <Path d="M20 32 Q32 28 44 32 L44 50 Q32 54 20 50 Z" fill={colors.swahili} opacity="0.8" />
    <Path d="M26 16 Q32 12 38 16" stroke={colors.swahili} strokeWidth="2" fill="none" />
    <Circle cx="28" cy="18" r="2" fill="white" />
    <Circle cx="36" cy="18" r="2" fill="white" />
    <Path d="M28 22 Q32 26 36 22" stroke="white" strokeWidth="2" fill="none" />
    <Path d="M24 36 Q28 34 32 36 Q36 34 40 36" stroke="white" strokeWidth="2" fill="none" />
    <Rect x="26" y="40" width="12" height="6" rx="2" fill="white" opacity="0.9" />
  </Svg>
);

const LingalaCharacter = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Circle cx="32" cy="20" r="12" fill={colors.lingala} />
    <Path d="M20 32 Q32 28 44 32 L44 50 Q32 54 20 50 Z" fill={colors.lingala} opacity="0.8" />
    <Path d="M26 16 Q32 12 38 16" stroke={colors.lingala} strokeWidth="2" fill="none" />
    <Circle cx="28" cy="18" r="2" fill="white" />
    <Circle cx="36" cy="18" r="2" fill="white" />
    <Path d="M28 22 Q32 26 36 22" stroke="white" strokeWidth="2" fill="none" />
    <Path d="M22 36 Q26 34 30 36 Q34 34 38 36 Q42 34 46 36" stroke="white" strokeWidth="2" fill="none" />
    <Circle cx="24" cy="42" r="3" fill="white" opacity="0.8" />
    <Circle cx="32" cy="44" r="3" fill="white" opacity="0.8" />
    <Circle cx="40" cy="42" r="3" fill="white" opacity="0.8" />
  </Svg>
);

const AmharicCharacter = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Circle cx="32" cy="20" r="12" fill={colors.amharic} />
    <Path d="M20 32 Q32 28 44 32 L44 50 Q32 54 20 50 Z" fill={colors.amharic} opacity="0.8" />
    <Path d="M26 16 Q32 12 38 16" stroke={colors.amharic} strokeWidth="2" fill="none" />
    <Circle cx="28" cy="18" r="2" fill="white" />
    <Circle cx="36" cy="18" r="2" fill="white" />
    <Path d="M28 22 Q32 26 36 22" stroke="white" strokeWidth="2" fill="none" />
    <Rect x="24" y="36" width="16" height="8" rx="2" fill="white" opacity="0.9" />
    <Path d="M26 38 Q30 36 34 38 Q38 36 42 38 M26 40 L38 40 M26 42 Q30 44 34 42" stroke={colors.amharic} strokeWidth="1.5" fill="none" />
  </Svg>
);
