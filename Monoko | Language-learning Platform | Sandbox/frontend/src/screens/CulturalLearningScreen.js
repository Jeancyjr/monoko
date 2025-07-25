import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import MonokoLogo from '../components/MonokoLogo';

const { width } = Dimensions.get('window');

const CulturalLearningScreen = ({ navigation }) => {
  const { selectedLanguage } = useSelector(state => state.user);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Rich cultural content organized by language and category
  const culturalContent = {
    sw: {
      proverbs: [
        {
          id: 'sw-p1',
          swahili: 'Haba na haba, hujaza kibaba',
          english: 'Little by little fills the measure',
          meaning: 'Small consistent efforts lead to great achievements',
          context: 'Used to encourage patience and persistence in learning',
          audio: '/audio/sw/proverbs/haba-na-haba.mp3',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
        },
        {
          id: 'sw-p2',
          swahili: 'Haraka haraka haina baraka',
          english: 'Hurry hurry has no blessing',
          meaning: 'Rushing through things often leads to poor results',
          context: 'Emphasizes the value of taking time to do things properly',
          audio: '/audio/sw/proverbs/haraka-haraka.mp3',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300',
        },
        {
          id: 'sw-p3',
          swahili: 'Ukweli hauogopi uchunguzi',
          english: 'Truth does not fear investigation',
          meaning: 'The truth stands up to scrutiny',
          context: 'Reflects the value of honesty in East African culture',
          audio: '/audio/sw/proverbs/ukweli-hauogopi.mp3',
          image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300',
        },
      ],
      traditions: [
        {
          id: 'sw-t1',
          title: 'Ugali - More Than Food',
          description: 'Ugali is not just a staple food, but a symbol of unity and sharing in East African communities.',
          culturalSignificance: 'Eating ugali brings families together, and the act of sharing from one plate represents trust and community.',
          modernRelevance: 'Understanding food culture helps in business and social interactions across East Africa.',
          vocabulary: ['ugali', 'chakula', 'jamii (family)', 'kushiriki (to share)'],
          image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300',
          region: 'East Africa',
        },
        {
          id: 'sw-t2',
          title: 'Jambo vs. Salama - Greeting Etiquette',
          description: 'Different greetings are used based on age, social status, and time of day in Swahili culture.',
          culturalSignificance: 'Proper greetings show respect and understanding of social hierarchy.',
          modernRelevance: 'Essential for business relationships and showing cultural awareness.',
          vocabulary: ['jambo', 'salama', 'hujambo', 'habari'],
          image: 'https://images.unsplash.com/photo-1578928278653-c76b1b8b9d05?w=300',
          region: 'Kenya, Tanzania',
        },
      ],
      music: [
        {
          id: 'sw-m1',
          title: 'Taarab - Poetry in Music',
          description: 'Taarab music combines Swahili poetry with musical storytelling, popular along the East African coast.',
          culturalSignificance: 'Uses metaphor and allegory to comment on social issues and relationships.',
          vocabulary: ['muziki', 'nyimbo', 'mashairi (poetry)', 'mchezo (performance)'],
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
          region: 'Zanzibar, Coastal Kenya',
        },
      ],
    },
    ln: {
      proverbs: [
        {
          id: 'ln-p1',
          lingala: 'Libaku moko etongaka te',
          english: 'One hand does not build',
          meaning: 'Success requires cooperation and teamwork',
          context: 'Emphasizes the importance of community and working together',
          audio: '/audio/ln/proverbs/libaku-moko.mp3',
          image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300',
        },
        {
          id: 'ln-p2',
          lingala: 'Nkisi ya bato ezali na bato',
          english: 'The medicine of people is with people',
          meaning: 'Human problems are solved through human connection',
          context: 'Reflects the communal approach to problem-solving in Central Africa',
          audio: '/audio/ln/proverbs/nkisi-ya-bato.mp3',
          image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300',
        },
      ],
      traditions: [
        {
          id: 'ln-t1',
          title: 'Libala - Traditional Marriage Ceremonies',
          description: 'Congolese wedding ceremonies involve elaborate negotiations, music, and community participation.',
          culturalSignificance: 'Marriage is viewed as a union between families, not just individuals.',
          modernRelevance: 'Understanding family structures is crucial for business and social relationships.',
          vocabulary: ['libala', 'mobali (husband)', 'mwasi (wife)', 'libota (family)'],
          image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300',
          region: 'Congo DRC, Congo Republic',
        },
      ],
      music: [
        {
          id: 'ln-m1',
          title: 'Soukous - The Dance of Central Africa',
          description: 'Soukous music, sung in Lingala, has influenced African music across the continent.',
          culturalSignificance: 'Represents joy, celebration, and the resilience of Congolese people.',
          vocabulary: ['miziki', 'kobina (to dance)', 'esengo (joy)', 'fete (party)'],
          image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300',
          region: 'Central Africa',
        },
        {
          id: 'ln-m2',
          title: 'Rumba Congolaise - Musical Heritage',
          description: 'Congolese rumba is recognized by UNESCO as an Intangible Cultural Heritage of Humanity.',
          culturalSignificance: 'Expresses urban experiences and social commentary through music.',
          vocabulary: ['rumba', 'gitara (guitar)', 'mongala (rhythm)', 'mokili (world)'],
          image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300',
          region: 'Kinshasa, Brazzaville',
        },
      ],
    },
    am: {
      proverbs: [
        {
          id: 'am-p1',
          amharic: 'የመጣ ያክል ይወስዳል',
          english: 'What comes, it takes equally',
          meaning: 'Life gives and takes in equal measure',
          context: 'Reflects the Ethiopian philosophy of balance and acceptance',
          audio: '/audio/am/proverbs/yemeta-yakil.mp3',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
        },
        {
          id: 'am-p2',
          amharic: 'ዝናብ በማይዘንብበት ቦታ ኳስ መጫወት ይወዳል',
          english: 'A ball likes to be played where it does not rain',
          meaning: 'People prefer favorable conditions for their activities',
          context: 'Used to explain why people choose easier paths',
          audio: '/audio/am/proverbs/zinab-bemayzenbbet.mp3',
          image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=300',
        },
      ],
      traditions: [
        {
          id: 'am-t1',
          title: 'የቡና ስነ-ስርዓት - Coffee Ceremony',
          description: 'The Ethiopian coffee ceremony is a sacred social ritual that can last hours.',
          culturalSignificance: 'Represents hospitality, community bonding, and spiritual connection.',
          modernRelevance: 'Essential for building business relationships and showing respect in Ethiopia.',
          vocabulary: ['ቡና (buna - coffee)', 'ጓደኝነት (guadegninet - friendship)', 'እንግዳ (ingeda - guest)'],
          image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300',
          region: 'All of Ethiopia',
        },
        {
          id: 'am-t2',
          title: 'ጥምቀት - Timkat Celebration',
          description: 'Ethiopian Orthodox celebration of Epiphany, involving colorful processions and water blessings.',
          culturalSignificance: 'Renewal of faith and community unity through shared spiritual experience.',
          modernRelevance: 'Understanding religious festivals helps in cultural sensitivity and business timing.',
          vocabulary: ['ጥምቀት (timkat)', 'በዓል (beal - festival)', 'ሃይማኖት (haymanot - religion)'],
          image: 'https://images.unsplash.com/photo-1578928301814-c32397c4ab4e?w=300',
          region: 'Ethiopia (Orthodox regions)',
        },
      ],
      writing: [
        {
          id: 'am-w1',
          title: 'ግዕዝ - Ancient Script Legacy',
          description: 'The Ge\'ez script used for Amharic has ancient roots and unique characteristics.',
          culturalSignificance: 'One of the few indigenous African writing systems still in active use.',
          vocabulary: ['ፊደል (fidel)', 'ጽሁፍ (tsiehuf - writing)', 'ቋንቋ (kuankua - language)'],
          image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
          region: 'Ethiopia, Eritrea',
        },
      ],
    },
  };

  const categories = [
    { id: 'all', name: 'All', icon: 'explore' },
    { id: 'proverbs', name: 'Proverbs', icon: 'format-quote' },
    { id: 'traditions', name: 'Traditions', icon: 'account-balance' },
    { id: 'music', name: 'Music', icon: 'music-note' },
    { id: 'writing', name: 'Writing', icon: 'edit' },
  ];

  const getCurrentLanguageContent = () => {
    return culturalContent[selectedLanguage] || culturalContent.sw;
  };

  const getFilteredContent = () => {
    const content = getCurrentLanguageContent();
    if (selectedCategory === 'all') {
      return Object.entries(content).flatMap(([category, items]) =>
        items.map(item => ({ ...item, category }))
      );
    }
    return content[selectedCategory] || [];
  };

  const getLanguageInfo = () => {
    const info = {
      sw: { name: 'Swahili', flag: '🇰🇪', region: 'East Africa' },
      ln: { name: 'Lingala', flag: '🇨🇩', region: 'Central Africa' },
      am: { name: 'Amharic', flag: '🇪🇹', region: 'Ethiopia' },
    };
    return info[selectedLanguage] || info.sw;
  };

  const renderContentCard = (item) => {
    const isProverb = item.swahili || item.lingala || item.amharic;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.contentCard}
        activeOpacity={0.8}
      >
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.cardImage}
          imageStyle={styles.cardImageStyle}
        >
          <View style={styles.cardOverlay}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardCategory}>
                {item.category?.toUpperCase() || 'CULTURE'}
              </Text>
              {item.region && (
                <Text style={styles.cardRegion}>{item.region}</Text>
              )}
            </View>
          </View>
        </ImageBackground>

        <View style={styles.cardContent}>
          {isProverb ? (
            <>
              <Text style={styles.nativeText}>
                {item.swahili || item.lingala || item.amharic}
              </Text>
              <Text style={styles.englishText}>{item.english}</Text>
              <Text style={styles.meaningText}>{item.meaning}</Text>
              <View style={styles.contextContainer}>
                <Icon name="info" size={16} color={colors.primary} />
                <Text style={styles.contextText}>{item.context}</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <Text style={styles.culturalSignificance}>
                <Text style={styles.boldText}>Cultural Significance: </Text>
                {item.culturalSignificance}
              </Text>
              {item.modernRelevance && (
                <Text style={styles.modernRelevance}>
                  <Text style={styles.boldText}>Modern Relevance: </Text>
                  {item.modernRelevance}
                </Text>
              )}
              {item.vocabulary && (
                <View style={styles.vocabularyContainer}>
                  <Text style={styles.vocabularyTitle}>Key Vocabulary:</Text>
                  <View style={styles.vocabularyTags}>
                    {item.vocabulary.map((word, index) => (
                      <View key={index} style={styles.vocabularyTag}>
                        <Text style={styles.vocabularyWord}>{word}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}

          <TouchableOpacity style={styles.learnMoreButton}>
            <Text style={styles.learnMoreText}>Learn More</Text>
            <Icon name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const languageInfo = getLanguageInfo();
  const filteredContent = getFilteredContent();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Cultural Learning</Text>
          <Text style={styles.headerSubtitle}>
            {languageInfo.flag} {languageInfo.name} • {languageInfo.region}
          </Text>
        </View>
        <MonokoLogo size="small" color="white" />
      </View>

      {/* Introduction */}
      <Animated.View style={[styles.introContainer, { opacity: fadeAnim }]}>
        <Text style={styles.introTitle}>
          Discover the Heart of {languageInfo.name} Culture
        </Text>
        <Text style={styles.introText}>
          Language and culture are inseparable. Explore proverbs, traditions, and customs 
          that give depth and meaning to your {languageInfo.name} learning journey.
        </Text>
      </Animated.View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.activeCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Icon 
              name={category.icon} 
              size={20} 
              color={selectedCategory === category.id ? colors.white : colors.primary} 
            />
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {filteredContent.length > 0 ? (
          filteredContent.map(renderContentCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="explore" size={64} color={colors.lightGray} />
            <Text style={styles.emptyTitle}>More Content Coming Soon</Text>
            <Text style={styles.emptyText}>
              We're working on adding more {selectedCategory} content for {languageInfo.name}.
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Cultural content curated with native speakers and cultural experts
          </Text>
          <TouchableOpacity style={styles.contributeButton}>
            <Text style={styles.contributeText}>Contribute Cultural Content</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingTop: spacing.xl + 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.primaryLight,
    marginTop: spacing.xs,
  },
  introContainer: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  introTitle: {
    fontSize: fonts.xl,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  introText: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.gray,
    lineHeight: fonts.lineHeights.relaxed * fonts.md,
    textAlign: 'center',
  },
  categoriesContainer: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing.xs,
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  activeCategoryText: {
    color: colors.white,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  contentCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cardImage: {
    height: 120,
    justifyContent: 'space-between',
  },
  cardImageStyle: {
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  cardOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flex: 1,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardCategory: {
    fontSize: fonts.xs,
    fontFamily: fonts.bold,
    color: colors.white,
    letterSpacing: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  cardRegion: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.white,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  cardContent: {
    padding: spacing.lg,
  },
  nativeText: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  englishText: {
    fontSize: fonts.md,
    fontFamily: fonts.medium,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  meaningText: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  contextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary + '10',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  contextText: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  cardTitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.darkGray,
    lineHeight: fonts.lineHeights.relaxed * fonts.md,
    marginBottom: spacing.md,
  },
  culturalSignificance: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
    marginBottom: spacing.sm,
  },
  modernRelevance: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
    marginBottom: spacing.md,
  },
  boldText: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  vocabularyContainer: {
    marginBottom: spacing.md,
  },
  vocabularyTitle: {
    fontSize: fonts.sm,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  vocabularyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  vocabularyTag: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  vocabularyWord: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  learnMoreText: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.gray,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.lightGray,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  contributeButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  contributeText: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.white,
  },
});

export default CulturalLearningScreen;
