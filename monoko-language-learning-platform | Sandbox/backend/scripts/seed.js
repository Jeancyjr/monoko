#!/usr/bin/env node

/**
 * Database Seeding Script for Monoko
 * Populates the database with initial data, sample users, and language content
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/monoko';

// Connect to database
const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB for seeding');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

// Sample data generators
const generateSampleUsers = async () => {
  const users = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Amara Kimani',
      email: 'amara@monoko.app',
      password: await bcrypt.hash('Monoko123!', 10),
      selectedLanguage: 'sw',
      streak: 15,
      totalXP: 2500,
      level: 5,
      joinedDate: new Date('2023-10-01'),
      preferences: {
        dailyGoal: 20,
        notifications: true,
        offlineMode: true,
        audioEnabled: true,
        darkMode: false
      },
      progress: {
        completedLessons: ['sw-basics-1', 'sw-basics-2', 'sw-family-1'],
        currentLesson: 'sw-numbers-1',
        achievements: ['first-lesson', 'week-warrior', 'conversation-starter'],
        weeklyStats: {
          lessonsCompleted: 8,
          timeSpent: 480, // 8 hours
          xpEarned: 400
        }
      },
      role: 'learner',
      isVerified: true,
      createdAt: new Date('2023-10-01'),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Joseph Mbeki',
      email: 'joseph@monoko.app',
      password: await bcrypt.hash('Monoko123!', 10),
      selectedLanguage: 'ln',
      streak: 8,
      totalXP: 1200,
      level: 3,
      joinedDate: new Date('2023-11-15'),
      preferences: {
        dailyGoal: 15,
        notifications: true,
        offlineMode: false,
        audioEnabled: true,
        darkMode: true
      },
      progress: {
        completedLessons: ['ln-basics-1', 'ln-music-1'],
        currentLesson: 'ln-family-1',
        achievements: ['first-lesson', 'cultural-explorer'],
        weeklyStats: {
          lessonsCompleted: 5,
          timeSpent: 300,
          xpEarned: 250
        }
      },
      role: 'learner',
      isVerified: true,
      createdAt: new Date('2023-11-15'),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Hanan Tadesse',
      email: 'hanan@monoko.app',
      password: await bcrypt.hash('Monoko123!', 10),
      selectedLanguage: 'am',
      streak: 22,
      totalXP: 3800,
      level: 7,
      joinedDate: new Date('2023-09-10'),
      preferences: {
        dailyGoal: 25,
        notifications: true,
        offlineMode: true,
        audioEnabled: true,
        darkMode: false
      },
      progress: {
        completedLessons: ['am-basics-1', 'am-script-1', 'am-family-1', 'am-culture-1'],
        currentLesson: 'am-business-1',
        achievements: ['first-lesson', 'week-warrior', 'vocabulary-master', 'cultural-explorer'],
        weeklyStats: {
          lessonsCompleted: 12,
          timeSpent: 720,
          xpEarned: 600
        }
      },
      role: 'learner',
      isVerified: true,
      createdAt: new Date('2023-09-10'),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Demo User',
      email: 'demo@monoko.app',
      password: await bcrypt.hash('Demo123!', 10),
      selectedLanguage: 'sw',
      streak: 3,
      totalXP: 150,
      level: 1,
      joinedDate: new Date(),
      preferences: {
        dailyGoal: 10,
        notifications: true,
        offlineMode: false,
        audioEnabled: true,
        darkMode: false
      },
      progress: {
        completedLessons: [],
        currentLesson: null,
        achievements: [],
        weeklyStats: {
          lessonsCompleted: 0,
          timeSpent: 0,
          xpEarned: 0
        }
      },
      role: 'learner',
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Admin User',
      email: 'admin@monoko.app',
      password: await bcrypt.hash('Admin123!', 10),
      selectedLanguage: 'sw',
      streak: 0,
      totalXP: 0,
      level: 1,
      joinedDate: new Date(),
      preferences: {
        dailyGoal: 0,
        notifications: false,
        offlineMode: false,
        audioEnabled: true,
        darkMode: true
      },
      progress: {
        completedLessons: [],
        currentLesson: null,
        achievements: [],
        weeklyStats: {
          lessonsCompleted: 0,
          timeSpent: 0,
          xpEarned: 0
        }
      },
      role: 'admin',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  return users;
};

const generateSampleLessons = () => {
  return [
    {
      _id: new mongoose.Types.ObjectId(),
      id: 'sw-basics-1',
      title: 'Swahili Greetings & Introductions',
      description: 'Learn essential Swahili greetings and how to introduce yourself',
      language: 'sw',
      languageName: 'Swahili',
      nativeName: 'Kiswahili',
      difficulty: 'Beginner',
      category: 'basics',
      duration: 15,
      estimatedTime: '15 minutes',
      xpReward: 50,
      topics: ['Greetings', 'Introductions', 'Courtesy'],
      featured: true,
      published: true,
      analytics: {
        totalCompletions: 1247,
        averageScore: 87.5,
        averageTimeSpent: 892, // seconds
        completionRate: 0.78,
        difficulty: 'calculated'
      },
      content: {
        vocabulary: [
          {
            swahili: 'Jambo',
            english: 'Hello',
            pronunciation: 'JAHM-boh',
            category: 'greetings',
            culturalNote: 'Most common casual greeting'
          },
          {
            swahili: 'Habari yako?',
            english: 'How are you?',
            pronunciation: 'hah-BAH-ree YAH-koh',
            category: 'greetings',
            culturalNote: 'Shows genuine interest in wellbeing'
          }
        ]
      },
      createdAt: new Date('2023-09-01'),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      id: 'ln-basics-1',
      title: 'Lingala Greetings & Courtesy',
      description: 'Essential Lingala greetings and polite expressions',
      language: 'ln',
      languageName: 'Lingala',
      nativeName: 'Lingála',
      difficulty: 'Beginner',
      category: 'basics',
      duration: 12,
      estimatedTime: '12 minutes',
      xpReward: 40,
      topics: ['Greetings', 'Courtesy', 'Basic conversation'],
      featured: true,
      published: true,
      analytics: {
        totalCompletions: 856,
        averageScore: 82.3,
        averageTimeSpent: 720,
        completionRate: 0.71,
        difficulty: 'calculated'
      },
      content: {
        vocabulary: [
          {
            lingala: 'Mbote',
            english: 'Hello',
            pronunciation: 'mm-BOH-teh',
            category: 'greetings',
            culturalNote: 'Universal greeting in Lingala'
          }
        ]
      },
      createdAt: new Date('2023-09-01'),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      id: 'am-basics-1',
      title: 'Amharic Basics & Fidel Script',
      description: 'Introduction to Amharic language and beautiful Fidel script',
      language: 'am',
      languageName: 'Amharic',
      nativeName: 'አማርኛ',
      difficulty: 'Intermediate',
      category: 'basics',
      duration: 25,
      estimatedTime: '25 minutes',
      xpReward: 80,
      topics: ['Fidel script', 'Greetings', 'Basic phrases'],
      featured: true,
      published: true,
      analytics: {
        totalCompletions: 634,
        averageScore: 75.8,
        averageTimeSpent: 1450,
        completionRate: 0.65,
        difficulty: 'calculated'
      },
      content: {
        vocabulary: [
          {
            amharic: 'ሰላም',
            english: 'Hello/Peace',
            pronunciation: 'seh-LAHM',
            romanized: 'selam',
            category: 'greetings',
            culturalNote: 'Means both hello and peace'
          }
        ]
      },
      createdAt: new Date('2023-09-01'),
      updatedAt: new Date()
    }
  ];
};

const generateNativeSpeakers = () => {
  return [
    {
      _id: new mongoose.Types.ObjectId(),
      id: 'speaker-001',
      name: 'Amara Kimani',
      email: 'speaker.amara@monoko.app',
      languages: ['sw'],
      country: 'Kenya',
      city: 'Nairobi',
      timezone: 'Africa/Nairobi',
      rating: 4.8,
      sessionsCompleted: 156,
      hourlyRate: 15,
      currency: 'USD',
      bio: 'Native Swahili speaker with 3 years of teaching experience. I love sharing Kenyan culture and helping students feel confident speaking.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
      availability: ['morning', 'evening'],
      specialties: ['Business Swahili', 'Cultural Context', 'Pronunciation'],
      certifications: ['TESOL Certified', 'Swahili Literature Degree'],
      isVerified: true,
      isActive: true,
      joinedDate: new Date('2023-08-15'),
      createdAt: new Date('2023-08-15'),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      id: 'speaker-002',
      name: 'Joseph Mbeki',
      email: 'speaker.joseph@monoko.app',
      languages: ['ln'],
      country: 'Congo DRC',
      city: 'Kinshasa',
      timezone: 'Africa/Kinshasa',
      rating: 4.9,
      sessionsCompleted: 89,
      hourlyRate: 12,
      currency: 'USD',
      bio: 'Passionate about Lingala and Congolese music. I help students learn through songs and cultural stories.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      availability: ['afternoon', 'evening'],
      specialties: ['Music & Culture', 'Conversational Lingala', 'Slang & Street Language'],
      certifications: ['Music Teacher Certificate'],
      isVerified: true,
      isActive: true,
      joinedDate: new Date('2023-09-01'),
      createdAt: new Date('2023-09-01'),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      id: 'speaker-003',
      name: 'Hanan Tadesse',
      email: 'speaker.hanan@monoko.app',
      languages: ['am'],
      country: 'Ethiopia',
      city: 'Addis Ababa',
      timezone: 'Africa/Addis_Ababa',
      rating: 4.7,
      sessionsCompleted: 203,
      hourlyRate: 18,
      currency: 'USD',
      bio: 'Ethiopian teacher with expertise in Amharic script and literature. Perfect for beginners and advanced learners.',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150',
      availability: ['morning', 'afternoon'],
      specialties: ['Fidel Script', 'Literature', 'Business Amharic', 'Religious Texts'],
      certifications: ['Ethiopian Teaching License', 'Amharic Literature Masters'],
      isVerified: true,
      isActive: true,
      joinedDate: new Date('2023-07-20'),
      createdAt: new Date('2023-07-20'),
      updatedAt: new Date()
    }
  ];
};

const generateSampleProgress = (users, lessons) => {
  const progress = [];
  
  // Generate progress for each user
  users.forEach(user => {
    user.progress.completedLessons.forEach(lessonId => {
      const lesson = lessons.find(l => l.id === lessonId);
      if (lesson) {
        progress.push({
          _id: new mongoose.Types.ObjectId(),
          userId: user._id,
          lessonId: lesson._id,
          language: lesson.language,
          score: Math.floor(Math.random() * 30) + 70, // 70-100
          timeSpent: Math.floor(Math.random() * 600) + 300, // 5-15 minutes
          mistakesCount: Math.floor(Math.random() * 5),
          completedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
          attempts: Math.floor(Math.random() * 3) + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });
  });
  
  return progress;
};

const generateAnalyticsData = () => {
  const analytics = [];
  const languages = ['sw', 'ln', 'am'];
  const eventTypes = ['lesson_start', 'lesson_complete', 'game_play', 'snap_learn', 'live_session'];
  
  // Generate 30 days of analytics data
  for (let i = 0; i < 30; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    
    languages.forEach(language => {
      eventTypes.forEach(eventType => {
        const count = Math.floor(Math.random() * 100) + 10;
        analytics.push({
          _id: new mongoose.Types.ObjectId(),
          date: date.toISOString().split('T')[0], // YYYY-MM-DD format
          language,
          eventType,
          count,
          avgDuration: eventType.includes('lesson') ? Math.floor(Math.random() * 600) + 300 : null,
          avgScore: eventType === 'lesson_complete' ? Math.floor(Math.random() * 30) + 70 : null,
          createdAt: date,
          updatedAt: date
        });
      });
    });
  }
  
  return analytics;
};

// Seeding functions
const seedCollection = async (collectionName, data) => {
  const collection = mongoose.connection.collection(collectionName);
  
  try {
    // Clear existing data in development
    if (process.env.NODE_ENV !== 'production') {
      await collection.deleteMany({});
      console.log(`🧹 Cleared existing ${collectionName} data`);
    }
    
    if (data.length > 0) {
      await collection.insertMany(data);
      console.log(`✅ Seeded ${data.length} ${collectionName} documents`);
    }
  } catch (error) {
    console.error(`❌ Failed to seed ${collectionName}:`, error.message);
    throw error;
  }
};

const seedAchievements = async () => {
  const achievements = [
    {
      _id: new mongoose.Types.ObjectId(),
      id: 'first-lesson',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: 'star',
      xpReward: 25,
      category: 'learning',
      rarity: 'common',
      requirements: { lessonsCompleted: 1 },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      id: 'week-warrior',
      title: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: 'local-fire-department',
      xpReward: 100,
      category: 'consistency',
      rarity: 'uncommon',
      requirements: { streakDays: 7 },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      id: 'vocabulary-master',
      title: 'Vocabulary Master',
      description: 'Learn 100 new words',
      icon: 'psychology',
      xpReward: 200,
      category: 'vocabulary',
      rarity: 'rare',
      requirements: { wordsLearned: 100 },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      id: 'conversation-starter',
      title: 'Conversation Starter',
      description: 'Complete your first live session',
      icon: 'video-call',
      xpReward: 150,
      category: 'speaking',
      rarity: 'uncommon',
      requirements: { liveSessionsCompleted: 1 },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      id: 'cultural-explorer',
      title: 'Cultural Explorer',
      description: 'Read 20 cultural notes',
      icon: 'explore',
      xpReward: 50,
      category: 'culture',
      rarity: 'common',
      requirements: { culturalNotesRead: 20 },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId(),
      id: 'snap-master',
      title: 'Snap Master',
      description: 'Use Snap & Learn 50 times',
      icon: 'camera-alt',
      xpReward: 75,
      category: 'ai-features',
      rarity: 'uncommon',
      requirements: { snapLearnUsed: 50 },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await seedCollection('achievements', achievements);
};

// Main seeding function
const seedDatabase = async () => {
  console.log('🌱 Starting database seeding...\n');
  
  await connectDatabase();
  
  try {
    // Generate sample data
    console.log('📊 Generating sample data...');
    const users = await generateSampleUsers();
    const lessons = generateSampleLessons();
    const speakers = generateNativeSpeakers();
    const progress = generateSampleProgress(users, lessons);
    const analytics = generateAnalyticsData();
    
    // Seed collections
    console.log('\n🚀 Seeding collections...');
    await seedCollection('users', users);
    await seedCollection('lessons', lessons);
    await seedCollection('native_speakers', speakers);
    await seedCollection('user_progress', progress);
    await seedCollection('lesson_analytics', analytics);
    await seedAchievements();
    
    // Create additional sample data
    console.log('\n📈 Creating additional sample data...');
    
    // Sample game scores
    const gameScores = [];
    users.forEach(user => {
      const games = ['word-match-blitz', 'echo-me', 'memory-cards'];
      games.forEach(gameId => {
        for (let i = 0; i < 5; i++) {
          gameScores.push({
            _id: new mongoose.Types.ObjectId(),
            userId: user._id,
            gameId,
            score: Math.floor(Math.random() * 1000) + 100,
            duration: Math.floor(Math.random() * 300) + 60,
            wordsCorrect: Math.floor(Math.random() * 20) + 5,
            wordsIncorrect: Math.floor(Math.random() * 5),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000),
            updatedAt: new Date()
          });
        }
      });
    });
    
    await seedCollection('game_scores', gameScores);
    
    // Sample live sessions
    const liveSessions = [
      {
        _id: new mongoose.Types.ObjectId(),
        userId: users[0]._id,
        speakerId: speakers[0]._id,
        language: 'sw',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        duration: 60,
        status: 'scheduled',
        topics: ['Greetings', 'Family conversation'],
        hourlyRate: 15,
        totalCost: 15,
        meetingUrl: 'https://meet.monoko.app/session/session-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        userId: users[1]._id,
        speakerId: speakers[1]._id,
        language: 'ln',
        scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        duration: 60,
        status: 'completed',
        topics: ['Music culture', 'Daily conversation'],
        hourlyRate: 12,
        totalCost: 12,
        rating: 5,
        feedback: 'Excellent session! Joseph made learning Lingala fun through music.',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await seedCollection('live_sessions', liveSessions);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Seeded data summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`📚 Lessons: ${lessons.length}`);
    console.log(`🎤 Native Speakers: ${speakers.length}`);
    console.log(`📈 Progress Records: ${progress.length}`);
    console.log(`🎮 Game Scores: ${gameScores.length}`);
    console.log(`💬 Live Sessions: ${liveSessions.length}`);
    console.log(`🏆 Achievements: 6`);
    console.log(`📊 Analytics Records: ${analytics.length}`);
    
    console.log('\n🔑 Sample Login Credentials:');
    console.log('Demo User: demo@monoko.app / Demo123!');
    console.log('Admin User: admin@monoko.app / Admin123!');
    console.log('Sample Users: amara@monoko.app, joseph@monoko.app, hanan@monoko.app / Monoko123!\n');
    
  } catch (error) {
    console.error('\n💥 Database seeding failed:', error.message);
    throw error;
  }
};

// Command line interface
const main = async () => {
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'run':
      case undefined:
        await seedDatabase();
        break;
      case 'clear':
        console.log('🧹 Clearing database...');
        if (process.env.NODE_ENV === 'production') {
          console.error('❌ Clear not allowed in production');
          process.exit(1);
        }
        await connectDatabase();
        await mongoose.connection.dropDatabase();
        console.log('✅ Database cleared');
        break;
      case 'users-only':
        await connectDatabase();
        const users = await generateSampleUsers();
        await seedCollection('users', users);
        console.log('✅ Sample users seeded');
        break;
      default:
        console.log('📖 Monoko Database Seeding Tool\n');
        console.log('Usage:');
        console.log('  npm run seed run        - Run complete database seeding');
        console.log('  npm run seed clear      - Clear database (dev only)');
        console.log('  npm run seed users-only - Seed only sample users\n');
        break;
    }
  } catch (error) {
    console.error('\n💥 Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  seedDatabase,
  generateSampleUsers,
  generateSampleLessons,
  generateNativeSpeakers
};
