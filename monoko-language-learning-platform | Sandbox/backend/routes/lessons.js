const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validateLanguageCode } = require('../middleware/validation');

const router = express.Router();

// Helper function to load lesson content
const loadLessonContent = async (language, lessonId) => {
  try {
    const contentPath = path.join(__dirname, '../../content/languages', language);
    
    // For now, we'll map lesson IDs to content files
    const contentFileMap = {
      'sw-basics-1': 'basic-vocabulary.json',
      'ln-basics-1': 'basic-vocabulary.json', 
      'am-basics-1': 'basic-vocabulary.json'
    };
    
    const fileName = contentFileMap[lessonId] || 'basic-vocabulary.json';
    const filePath = path.join(contentPath, fileName);
    
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to load lesson content: ${error.message}`);
  }
};

// Generate lesson structure from vocabulary content
const generateLessonFromContent = (content, lessonId) => {
  const lessonData = {
    id: lessonId,
    title: `${content.languageName} Basics: ${content.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
    language: content.language,
    languageName: content.languageName,
    nativeName: content.nativeName,
    level: content.level,
    estimatedTime: content.estimatedLearningTime,
    totalWords: content.totalWords,
    
    // Generate lesson steps
    steps: [
      // Introduction step
      {
        type: 'introduction',
        title: `Welcome to ${content.languageName}!`,
        content: `In this lesson, you'll learn essential ${content.languageName} vocabulary for daily communication.`,
        culturalNote: content.culturalBackground?.overview || `${content.languageName} is an important African language with rich cultural heritage.`,
        emoji: getLanguageEmoji(content.language)
      },
      
      // Vocabulary introduction
      {
        type: 'vocabulary',
        title: 'New Vocabulary',
        words: content.words.slice(0, 6).map(word => ({
          native: word[content.language === 'sw' ? 'swahili' : content.language === 'ln' ? 'lingala' : 'amharic'],
          english: word.english,
          pronunciation: word.pronunciation,
          romanized: word.romanized || null,
          category: word.category
        }))
      },
      
      // Practice questions generated from vocabulary
      ...generatePracticeQuestions(content.words.slice(0, 6), content),
      
      // Cultural dialogue
      {
        type: 'dialogue',
        title: 'Real Conversation',
        dialogue: generateDialogue(content.words.slice(0, 4), content)
      },
      
      // Lesson summary
      {
        type: 'review',
        title: 'Lesson Complete!',
        summary: `You've learned essential ${content.languageName} vocabulary and cultural context.`,
        wordsLearned: content.words.slice(0, 6).length,
        xpEarned: Math.max(30, content.words.slice(0, 6).length * 8)
      }
    ],
    
    // Additional metadata
    culturalBackground: content.culturalBackground,
    scriptInfo: content.scriptInfo,
    categories: content.categories
  };
  
  return lessonData;
};

// Helper functions
const getLanguageEmoji = (language) => {
  const emojis = { sw: '🇰🇪', ln: '🇨🇩', am: '🇪🇹' };
  return emojis[language] || '📚';
};

const generatePracticeQuestions = (words, content) => {
  const questions = [];
  const lang = content.language;
  
  // Multiple choice questions
  words.slice(0, 3).forEach((word, index) => {
    const nativeWord = word[lang === 'sw' ? 'swahili' : lang === 'ln' ? 'lingala' : 'amharic'];
    const correctAnswer = word.english;
    
    // Create wrong answers from other words
    const wrongAnswers = words
      .filter(w => w.english !== correctAnswer)
      .slice(0, 3)
      .map(w => w.english);
    
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    questions.push({
      type: 'practice',
      title: `Practice: Choose the correct translation`,
      question: `What does "${nativeWord}" mean in English?`,
      options,
      correct: options.indexOf(correctAnswer),
      explanation: `"${nativeWord}" means "${correctAnswer}". ${word.culturalNote || 'This is a useful word to know!'}`
    });
  });
  
  return questions;
};

const generateDialogue = (words, content) => {
  const lang = content.language;
  
  if (lang === 'sw') {
    return [
      { speaker: 'Amara', text: 'Jambo!', translation: 'Hello!' },
      { speaker: 'You', text: 'Jambo! Habari yako?', translation: 'Hello! How are you?' },
      { speaker: 'Amara', text: 'Nzuri sana. Asante!', translation: 'Very well. Thank you!' },
      { speaker: 'You', text: 'Karibu sana!', translation: 'You\'re very welcome!' }
    ];
  } else if (lang === 'ln') {
    return [
      { speaker: 'Joseph', text: 'Mbote!', translation: 'Hello!' },
      { speaker: 'You', text: 'Mbote! Boni?', translation: 'Hello! How are you?' },
      { speaker: 'Joseph', text: 'Malamu. Melesi!', translation: 'Good. Thank you!' },
      { speaker: 'You', text: 'Malamu mingi!', translation: 'Very good!' }
    ];
  } else if (lang === 'am') {
    return [
      { speaker: 'Hanan', text: 'ሰላም!', translation: 'Hello!' },
      { speaker: 'You', text: 'ሰላም! እንዴት ነሽ?', translation: 'Hello! How are you?' },
      { speaker: 'Hanan', text: 'በጣም ደህና ነኝ፣ አመሰግናለሁ!', translation: 'I am very well, thank you!' },
      { speaker: 'You', text: 'በጣም ጥሩ!', translation: 'Very good!' }
    ];
  }
  
  return []; // Fallback
};

// Routes

// GET /api/lessons - Get all available lessons
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { language, level, category } = req.query;
    
    // Sample lesson catalog
    const allLessons = [
      {
        id: 'sw-basics-1',
        title: 'Swahili Greetings & Introductions',
        description: 'Learn essential Swahili greetings and how to introduce yourself',
        language: 'sw',
        languageName: 'Swahili',
        difficulty: 'Beginner',
        duration: 15,
        xp: 50,
        topics: ['Greetings', 'Introductions', 'Courtesy'],
        completed: req.user?.progress?.completedLessons?.includes('sw-basics-1') || false,
        locked: false,
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150'
      },
      {
        id: 'sw-family-1',
        title: 'Swahili Family & Relationships',
        description: 'Talk about family members and relationships in Swahili',
        language: 'sw',
        languageName: 'Swahili',
        difficulty: 'Beginner',
        duration: 18,
        xp: 60,
        topics: ['Family', 'Relationships', 'Possessives'],
        completed: false,
        locked: true,
        image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=150'
      },
      {
        id: 'ln-basics-1',
        title: 'Lingala Greetings & Courtesy',
        description: 'Essential Lingala greetings and polite expressions',
        language: 'ln',
        languageName: 'Lingala',
        difficulty: 'Beginner',
        duration: 12,
        xp: 40,
        topics: ['Greetings', 'Courtesy', 'Basic conversation'],
        completed: req.user?.progress?.completedLessons?.includes('ln-basics-1') || false,
        locked: false,
        image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=150'
      },
      {
        id: 'am-basics-1',
        title: 'Amharic Basics & Fidel Script',
        description: 'Introduction to Amharic language and beautiful Fidel script',
        language: 'am',
        languageName: 'Amharic',
        difficulty: 'Intermediate',
        duration: 25,
        xp: 80,
        topics: ['Fidel script', 'Greetings', 'Basic phrases'],
        completed: req.user?.progress?.completedLessons?.includes('am-basics-1') || false,
        locked: false,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150'
      }
    ];
    
    let filteredLessons = allLessons;
    
    // Apply filters
    if (language) {
      filteredLessons = filteredLessons.filter(lesson => lesson.language === language);
    }
    
    if (level) {
      filteredLessons = filteredLessons.filter(lesson => 
        lesson.difficulty.toLowerCase() === level.toLowerCase()
      );
    }
    
    res.json({
      success: true,
      data: {
        lessons: filteredLessons,
        total: filteredLessons.length,
        filters: { language, level, category }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Lessons Fetch Failed',
      message: error.message
    });
  }
});

// GET /api/lessons/:id - Get specific lesson content
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Determine language from lesson ID
    let language;
    if (id.startsWith('sw-')) language = 'swahili';
    else if (id.startsWith('ln-')) language = 'lingala';  
    else if (id.startsWith('am-')) language = 'amharic';
    else {
      return res.status(400).json({
        success: false,
        error: 'Invalid Lesson ID',
        message: 'Lesson ID must start with sw-, ln-, or am-'
      });
    }
    
    // Load content and generate lesson
    const content = await loadLessonContent(language, id);
    const lessonData = generateLessonFromContent(content, id);
    
    // Add user progress if authenticated
    if (req.user) {
      lessonData.userProgress = {
        completed: req.user.progress?.completedLessons?.includes(id) || false,
        attempts: 1, // Placeholder
        bestScore: 85, // Placeholder
        timeSpent: 0
      };
    }
    
    res.json({
      success: true,
      data: lessonData
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'Lesson Not Found',
      message: error.message
    });
  }
});

// POST /api/lessons/:id/complete - Mark lesson as completed
router.post('/:id/complete', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { score, timeSpent, mistakesCount } = req.body;
    
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Score',
        message: 'Score must be a number between 0 and 100'
      });
    }
    
    // Calculate XP based on score and time
    const baseXP = 50;
    const scoreBonus = Math.floor(score / 10) * 5;
    const timeBonus = timeSpent < 300 ? 10 : 0; // Bonus for completing under 5 minutes
    const totalXP = baseXP + scoreBonus + timeBonus;
    
    // In production, update user progress in database
    // For now, return success with calculated rewards
    
    res.json({
      success: true,
      message: 'Lesson completed successfully!',
      data: {
        lessonId: id,
        score,
        timeSpent,
        mistakesCount: mistakesCount || 0,
        xpEarned: totalXP,
        bonuses: {
          score: scoreBonus,
          time: timeBonus
        },
        achievements: score === 100 ? ['perfect-lesson'] : []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Lesson Completion Failed',
      message: error.message
    });
  }
});

// GET /api/lessons/language/:langCode - Get lessons for specific language
router.get('/language/:langCode', validateLanguageCode, optionalAuth, async (req, res) => {
  try {
    const { langCode } = req.params;
    const { level } = req.query;
    
    // Filter lessons by language
    const languageLessons = await router.stack[0].route.methods.get[0]({ 
      query: { language: langCode, level },
      user: req.user 
    });
    
    res.json({
      success: true,
      data: {
        language: langCode,
        lessons: languageLessons.data.lessons,
        total: languageLessons.data.lessons.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Language Lessons Fetch Failed',
      message: error.message
    });
  }
});

// GET /api/lessons/categories - Get lesson categories
router.get('/categories', (req, res) => {
  try {
    const categories = [
      {
        id: 'basics',
        name: 'Basics',
        description: 'Essential words and phrases for daily communication',
        lessons: 12,
        difficulty: 'Beginner'
      },
      {
        id: 'family',
        name: 'Family & Relationships',
        description: 'Talk about family members and personal relationships',
        lessons: 8,
        difficulty: 'Beginner'
      },
      {
        id: 'culture',
        name: 'Culture & Traditions',
        description: 'Learn about African cultures and traditions',
        lessons: 15,
        difficulty: 'Intermediate'
      },
      {
        id: 'business',
        name: 'Business & Work',
        description: 'Professional communication and workplace vocabulary',
        lessons: 10,
        difficulty: 'Intermediate'
      },
      {
        id: 'advanced',
        name: 'Advanced Topics',
        description: 'Complex grammar, literature, and advanced conversation',
        lessons: 20,
        difficulty: 'Advanced'
      }
    ];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Categories Fetch Failed',
      message: error.message
    });
  }
});

module.exports = router;
