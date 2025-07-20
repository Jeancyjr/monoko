const express = require('express');
const router = express.Router();

// Sample African languages data
const languages = [
  {
    id: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: '🇰🇪',
    countries: ['Kenya', 'Tanzania', 'Uganda', 'Congo DRC'],
    speakers: 200000000,
    difficulty: 'Beginner',
    description: 'Swahili is a Bantu language widely spoken in East Africa. It serves as a lingua franca in the region and is known for its rich cultural heritage.',
    features: [
      'Phonetic spelling',
      'Regular grammar patterns',
      'Rich vocabulary from Arabic, English, and other languages',
      'Widely used in media and education'
    ],
    lessons: [
      {
        id: 'sw-basics-1',
        title: 'Greetings and Introductions',
        difficulty: 'Beginner',
        duration: 10,
        topics: ['Jambo', 'Habari', 'Introductions']
      },
      {
        id: 'sw-basics-2',
        title: 'Family and Relationships',
        difficulty: 'Beginner',
        duration: 12,
        topics: ['Familia', 'Relationships', 'Age and numbers']
      }
    ]
  },
  {
    id: 'ln',
    name: 'Lingala',
    nativeName: 'Lingála',
    flag: '🇨🇩',
    countries: ['Congo DRC', 'Congo Republic', 'Central African Republic', 'Angola'],
    speakers: 70000000,
    difficulty: 'Intermediate',
    description: 'Lingala is a Bantu language spoken across Central Africa, especially in the Democratic Republic of Congo. It\'s known for its musical influence.',
    features: [
      'Tonal language with musical qualities',
      'Rich oral tradition',
      'Influenced Congolese music and culture',
      'Growing urban language'
    ],
    lessons: [
      {
        id: 'ln-basics-1',
        title: 'Basic Greetings',
        difficulty: 'Beginner',
        duration: 8,
        topics: ['Mbote', 'Basic phrases', 'Politeness']
      }
    ]
  },
  {
    id: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    flag: '🇪🇹',
    countries: ['Ethiopia'],
    speakers: 57000000,
    difficulty: 'Advanced',
    description: 'Amharic is the official language of Ethiopia, written in the unique Ge\'ez script. It has a rich literary tradition spanning centuries.',
    features: [
      'Unique Ge\'ez script (Fidel)',
      'Semitic language family',
      'Rich literary tradition',
      'Official language of Ethiopia'
    ],
    lessons: [
      {
        id: 'am-basics-1',
        title: 'Introduction to Fidel Script',
        difficulty: 'Beginner',
        duration: 15,
        topics: ['Basic letters', 'Writing system', 'Pronunciation']
      }
    ]
  }
];

// GET /api/languages - Get all available languages
router.get('/', (req, res) => {
  try {
    const languagesOverview = languages.map(lang => ({
      id: lang.id,
      name: lang.name,
      nativeName: lang.nativeName,
      flag: lang.flag,
      countries: lang.countries,
      speakers: lang.speakers,
      difficulty: lang.difficulty,
      description: lang.description,
      lessonCount: lang.lessons.length
    }));
    
    res.json({
      success: true,
      data: languagesOverview,
      count: languagesOverview.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch languages',
      message: error.message
    });
  }
});

// GET /api/languages/:id - Get specific language details
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const language = languages.find(lang => lang.id === id);
    
    if (!language) {
      return res.status(404).json({
        success: false,
        error: 'Language not found',
        message: `Language with ID '${id}' does not exist`
      });
    }
    
    res.json({
      success: true,
      data: language
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch language details',
      message: error.message
    });
  }
});

// GET /api/languages/:id/lessons - Get lessons for a specific language
router.get('/:id/lessons', (req, res) => {
  try {
    const { id } = req.params;
    const language = languages.find(lang => lang.id === id);
    
    if (!language) {
      return res.status(404).json({
        success: false,
        error: 'Language not found',
        message: `Language with ID '${id}' does not exist`
      });
    }
    
    res.json({
      success: true,
      data: {
        language: {
          id: language.id,
          name: language.name,
          nativeName: language.nativeName
        },
        lessons: language.lessons
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lessons',
      message: error.message
    });
  }
});

// GET /api/languages/:id/phrases - Get common phrases for a language
router.get('/:id/phrases', (req, res) => {
  try {
    const { id } = req.params;
    
    const commonPhrases = {
      sw: [
        { english: 'Hello', translation: 'Jambo', pronunciation: 'JAHM-boh' },
        { english: 'How are you?', translation: 'Habari yako?', pronunciation: 'hah-BAH-ree YAH-koh' },
        { english: 'Thank you', translation: 'Asante', pronunciation: 'ah-SAHN-teh' },
        { english: 'Good morning', translation: 'Habari za asubuhi', pronunciation: 'hah-BAH-ree zah ah-soo-BOO-hee' },
        { english: 'Goodbye', translation: 'Kwaheri', pronunciation: 'kwah-HEH-ree' }
      ],
      ln: [
        { english: 'Hello', translation: 'Mbote', pronunciation: 'mm-BOH-teh' },
        { english: 'How are you?', translation: 'Boni?', pronunciation: 'BOH-nee' },
        { english: 'Thank you', translation: 'Melesi', pronunciation: 'meh-LEH-see' },
        { english: 'Good morning', translation: 'Mbote na ntongo', pronunciation: 'mm-BOH-teh nah nn-TOHN-goh' }
      ],
      am: [
        { english: 'Hello', translation: 'ሰላም', pronunciation: 'seh-LAHM' },
        { english: 'How are you?', translation: 'እንዴት ነህ?', pronunciation: 'in-DEHT neh' },
        { english: 'Thank you', translation: 'አመሰግናለሁ', pronunciation: 'ah-meh-seh-gnah-leh-hoo' },
        { english: 'Good morning', translation: 'እንደምን አደርክ', pronunciation: 'in-deh-min ah-DEHRK' }
      ]
    };
    
    const phrases = commonPhrases[id];
    if (!phrases) {
      return res.status(404).json({
        success: false,
        error: 'Phrases not found',
        message: `Phrases for language '${id}' are not available yet`
      });
    }
    
    res.json({
      success: true,
      data: {
        languageId: id,
        phrases: phrases
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch phrases',
      message: error.message
    });
  }
});

module.exports = router;
