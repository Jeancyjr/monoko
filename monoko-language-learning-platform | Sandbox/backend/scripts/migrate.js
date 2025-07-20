#!/usr/bin/env node

/**
 * Database Migration Script for Monoko
 * Handles schema migrations, data transformations, and version upgrades
 */

const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/monoko';
const MIGRATION_COLLECTION = 'migrations';

// Migration tracking schema
const migrationSchema = new mongoose.Schema({
  version: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  executedAt: { type: Date, default: Date.now },
  duration: { type: Number }, // in milliseconds
  checksum: { type: String }
});

const Migration = mongoose.model('Migration', migrationSchema);

// Available migrations
const migrations = [
  {
    version: '1.0.0',
    name: 'Initial database setup',
    checksum: 'a1b2c3d4e5f6',
    up: async () => {
      console.log('🔧 Creating initial indexes...');
      
      // Users collection indexes
      const usersCollection = mongoose.connection.collection('users');
      await usersCollection.createIndexes([
        { key: { email: 1 }, unique: true, name: 'email_unique' },
        { key: { createdAt: 1 }, name: 'created_at_idx' },
        { key: { selectedLanguage: 1 }, name: 'language_idx' },
        { key: { 'progress.level': 1 }, name: 'level_idx' }
      ]);
      
      // Lessons collection indexes
      const lessonsCollection = mongoose.connection.collection('lessons');
      await lessonsCollection.createIndexes([
        { key: { language: 1, difficulty: 1 }, name: 'language_difficulty_idx' },
        { key: { category: 1 }, name: 'category_idx' },
        { key: { featured: 1, createdAt: -1 }, name: 'featured_recent_idx' }
      ]);
      
      // User progress indexes
      const progressCollection = mongoose.connection.collection('user_progress');
      await progressCollection.createIndexes([
        { key: { userId: 1, lessonId: 1 }, unique: true, name: 'user_lesson_unique' },
        { key: { userId: 1, completedAt: -1 }, name: 'user_completed_idx' },
        { key: { language: 1, score: -1 }, name: 'language_score_idx' }
      ]);
      
      // Sessions collection indexes (for authentication)
      const sessionsCollection = mongoose.connection.collection('sessions');
      await sessionsCollection.createIndexes([
        { key: { userId: 1 }, name: 'user_sessions_idx' },
        { key: { expiresAt: 1 }, expireAfterSeconds: 0, name: 'expire_sessions' }
      ]);
      
      console.log('✅ Initial indexes created successfully');
    },
    down: async () => {
      console.log('🔧 Dropping initial indexes...');
      
      const collections = ['users', 'lessons', 'user_progress', 'sessions'];
      for (const collectionName of collections) {
        const collection = mongoose.connection.collection(collectionName);
        try {
          await collection.dropIndexes();
          console.log(`✅ Dropped indexes for ${collectionName}`);
        } catch (error) {
          console.log(`⚠️  No indexes to drop for ${collectionName}`);
        }
      }
    }
  },
  
  {
    version: '1.1.0',
    name: 'Add user preferences and achievements',
    checksum: 'b2c3d4e5f6a1',
    up: async () => {
      console.log('🔧 Adding user preferences and achievements...');
      
      const usersCollection = mongoose.connection.collection('users');
      
      // Add default preferences to existing users
      await usersCollection.updateMany(
        { preferences: { $exists: false } },
        {
          $set: {
            preferences: {
              dailyGoal: 10,
              notifications: true,
              offlineMode: false,
              audioEnabled: true,
              darkMode: false
            },
            achievements: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      );
      
      // Create achievements collection
      const achievementsCollection = mongoose.connection.collection('achievements');
      const defaultAchievements = [
        {
          id: 'first-lesson',
          title: 'First Steps',
          description: 'Complete your first lesson',
          icon: 'star',
          xpReward: 25,
          category: 'learning',
          rarity: 'common'
        },
        {
          id: 'week-warrior',
          title: 'Week Warrior',
          description: 'Maintain a 7-day learning streak',
          icon: 'local-fire-department',
          xpReward: 100,
          category: 'consistency',
          rarity: 'uncommon'
        },
        {
          id: 'vocabulary-master',
          title: 'Vocabulary Master',
          description: 'Learn 100 new words',
          icon: 'psychology',
          xpReward: 200,
          category: 'vocabulary',
          rarity: 'rare'
        },
        {
          id: 'conversation-starter',
          title: 'Conversation Starter',
          description: 'Complete your first live session',
          icon: 'video-call',
          xpReward: 150,
          category: 'speaking',
          rarity: 'uncommon'
        },
        {
          id: 'cultural-explorer',
          title: 'Cultural Explorer',
          description: 'Read 20 cultural notes',
          icon: 'explore',
          xpReward: 50,
          category: 'culture',
          rarity: 'common'
        }
      ];
      
      await achievementsCollection.insertMany(defaultAchievements);
      
      // Add indexes for achievements
      await achievementsCollection.createIndexes([
        { key: { category: 1 }, name: 'achievement_category_idx' },
        { key: { rarity: 1 }, name: 'achievement_rarity_idx' }
      ]);
      
      console.log('✅ User preferences and achievements added successfully');
    },
    down: async () => {
      console.log('🔧 Removing user preferences and achievements...');
      
      const usersCollection = mongoose.connection.collection('users');
      await usersCollection.updateMany(
        {},
        {
          $unset: {
            preferences: "",
            achievements: "",
            createdAt: "",
            updatedAt: ""
          }
        }
      );
      
      await mongoose.connection.collection('achievements').drop();
      console.log('✅ User preferences and achievements removed');
    }
  },
  
  {
    version: '1.2.0',
    name: 'Add lesson analytics and user engagement tracking',
    checksum: 'c3d4e5f6a1b2',
    up: async () => {
      console.log('🔧 Adding lesson analytics and engagement tracking...');
      
      // Create analytics collection
      const analyticsCollection = mongoose.connection.collection('lesson_analytics');
      await analyticsCollection.createIndexes([
        { key: { lessonId: 1, date: 1 }, name: 'lesson_date_idx' },
        { key: { userId: 1, timestamp: -1 }, name: 'user_engagement_idx' },
        { key: { language: 1, eventType: 1 }, name: 'language_event_idx' }
      ]);
      
      // Create user engagement collection
      const engagementCollection = mongoose.connection.collection('user_engagement');
      await engagementCollection.createIndexes([
        { key: { userId: 1, date: 1 }, unique: true, name: 'user_daily_unique' },
        { key: { date: 1 }, name: 'engagement_date_idx' },
        { key: { language: 1, date: 1 }, name: 'language_engagement_idx' }
      ]);
      
      // Add analytics fields to lessons
      const lessonsCollection = mongoose.connection.collection('lessons');
      await lessonsCollection.updateMany(
        { analytics: { $exists: false } },
        {
          $set: {
            analytics: {
              totalCompletions: 0,
              averageScore: 0,
              averageTimeSpent: 0,
              completionRate: 0,
              difficulty: 'calculated'
            },
            updatedAt: new Date()
          }
        }
      );
      
      console.log('✅ Analytics and engagement tracking added successfully');
    },
    down: async () => {
      console.log('🔧 Removing analytics and engagement tracking...');
      
      await mongoose.connection.collection('lesson_analytics').drop();
      await mongoose.connection.collection('user_engagement').drop();
      
      const lessonsCollection = mongoose.connection.collection('lessons');
      await lessonsCollection.updateMany(
        {},
        {
          $unset: {
            analytics: "",
            updatedAt: ""
          }
        }
      );
      
      console.log('✅ Analytics and engagement tracking removed');
    }
  }
];

// Utility functions
const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

const getAppliedMigrations = async () => {
  try {
    const applied = await Migration.find().sort({ version: 1 });
    return applied.map(m => m.version);
  } catch (error) {
    console.log('ℹ️  No migrations collection found, starting fresh');
    return [];
  }
};

const recordMigration = async (migration, duration) => {
  await Migration.create({
    version: migration.version,
    name: migration.name,
    executedAt: new Date(),
    duration,
    checksum: migration.checksum
  });
};

const removeMigrationRecord = async (version) => {
  await Migration.deleteOne({ version });
};

// Main migration functions
const runMigrations = async (targetVersion = null) => {
  console.log('🚀 Starting database migrations...\n');
  
  await connectDatabase();
  
  const appliedMigrations = await getAppliedMigrations();
  console.log('📋 Applied migrations:', appliedMigrations.join(', ') || 'None');
  
  const migrationsToRun = migrations.filter(migration => {
    const shouldRun = !appliedMigrations.includes(migration.version);
    const withinTarget = !targetVersion || migration.version <= targetVersion;
    return shouldRun && withinTarget;
  });
  
  if (migrationsToRun.length === 0) {
    console.log('✅ Database is up to date! No migrations needed.\n');
    return;
  }
  
  console.log(`📦 Running ${migrationsToRun.length} migrations:\n`);
  
  for (const migration of migrationsToRun) {
    console.log(`⏳ Running migration ${migration.version}: ${migration.name}`);
    
    const startTime = Date.now();
    try {
      await migration.up();
      const duration = Date.now() - startTime;
      
      await recordMigration(migration, duration);
      
      console.log(`✅ Migration ${migration.version} completed in ${duration}ms\n`);
    } catch (error) {
      console.error(`❌ Migration ${migration.version} failed:`, error.message);
      console.error('🛑 Migration process stopped\n');
      throw error;
    }
  }
  
  console.log('🎉 All migrations completed successfully!\n');
};

const rollbackMigrations = async (targetVersion) => {
  console.log(`⏪ Rolling back to version ${targetVersion}...\n`);
  
  await connectDatabase();
  
  const appliedMigrations = await getAppliedMigrations();
  const migrationsToRollback = migrations
    .filter(m => appliedMigrations.includes(m.version) && m.version > targetVersion)
    .reverse(); // Rollback in reverse order
  
  if (migrationsToRollback.length === 0) {
    console.log('✅ No rollback needed.\n');
    return;
  }
  
  console.log(`📦 Rolling back ${migrationsToRollback.length} migrations:\n`);
  
  for (const migration of migrationsToRollback) {
    console.log(`⏳ Rolling back migration ${migration.version}: ${migration.name}`);
    
    try {
      await migration.down();
      await removeMigrationRecord(migration.version);
      
      console.log(`✅ Migration ${migration.version} rolled back\n`);
    } catch (error) {
      console.error(`❌ Rollback of migration ${migration.version} failed:`, error.message);
      throw error;
    }
  }
  
  console.log('🎉 Rollback completed successfully!\n');
};

const listMigrations = async () => {
  await connectDatabase();
  
  const appliedMigrations = await getAppliedMigrations();
  
  console.log('\n📋 Migration Status:\n');
  console.log('Version'.padEnd(10) + 'Status'.padEnd(12) + 'Name');
  console.log('─'.repeat(50));
  
  for (const migration of migrations) {
    const status = appliedMigrations.includes(migration.version) ? '✅ Applied' : '⏳ Pending';
    console.log(
      migration.version.padEnd(10) + 
      status.padEnd(12) + 
      migration.name
    );
  }
  console.log();
};

// Command line interface
const main = async () => {
  const command = process.argv[2];
  const argument = process.argv[3];
  
  try {
    switch (command) {
      case 'up':
        await runMigrations(argument);
        break;
      case 'down':
        if (!argument) {
          console.error('❌ Rollback target version required');
          process.exit(1);
        }
        await rollbackMigrations(argument);
        break;
      case 'status':
        await listMigrations();
        break;
      case 'reset':
        console.log('⚠️  Resetting database - this will drop all data!');
        if (process.env.NODE_ENV === 'production') {
          console.error('❌ Reset not allowed in production');
          process.exit(1);
        }
        await mongoose.connection.dropDatabase();
        console.log('✅ Database reset complete');
        break;
      default:
        console.log('📖 Monoko Database Migration Tool\n');
        console.log('Usage:');
        console.log('  npm run migrate up [version]    - Run migrations up to version');
        console.log('  npm run migrate down <version>  - Rollback to version');
        console.log('  npm run migrate status          - Show migration status');
        console.log('  npm run migrate reset           - Reset database (dev only)\n');
        break;
    }
  } catch (error) {
    console.error('\n💥 Migration failed:', error.message);
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
  runMigrations,
  rollbackMigrations,
  migrations
};
