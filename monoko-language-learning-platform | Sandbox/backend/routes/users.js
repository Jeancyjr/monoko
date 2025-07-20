const express = require('express');
const { authenticate, updateUser, getAllUsers } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// GET /api/users/profile - Get user profile
router.get('/profile', authenticate, (req, res) => {
  try {
    const { password, ...userProfile } = req.user;
    
    res.json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Profile Fetch Failed',
      message: error.message
    });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', authenticate, validate('updateProfile'), async (req, res) => {
  try {
    const updatedUser = updateUser(req.user.id, req.body);
    const { password, ...userProfile } = updatedUser;
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userProfile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Profile Update Failed',
      message: error.message
    });
  }
});

// GET /api/users/stats - Get user learning statistics
router.get('/stats', authenticate, (req, res) => {
  try {
    const user = req.user;
    
    // Calculate additional statistics
    const now = new Date();
    const joinDate = new Date(user.joinedDate);
    const daysSinceJoined = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24));
    
    const stats = {
      overview: {
        level: user.level,
        totalXP: user.totalXP,
        streak: user.streak,
        daysSinceJoined,
        completedLessons: user.progress?.completedLessons?.length || 0
      },
      weekly: user.progress?.weeklyStats || {
        lessonsCompleted: 0,
        timeSpent: 0,
        xpEarned: 0
      },
      achievements: user.progress?.achievements || [],
      languageProgress: {
        currentLanguage: user.selectedLanguage,
        languageLevel: Math.min(Math.floor(user.totalXP / 500) + 1, 10), // Language-specific level
        wordsLearned: user.progress?.completedLessons?.length * 8 || 0, // Estimate
        conversationLevel: user.level > 5 ? 'Intermediate' : user.level > 2 ? 'Beginner+' : 'Beginner'
      },
      goals: {
        dailyGoal: user.preferences?.dailyGoal || 10,
        weeklyGoal: (user.preferences?.dailyGoal || 10) * 7,
        dailyProgress: user.progress?.dailyProgress || 0,
        weeklyProgress: user.progress?.weeklyStats?.lessonsCompleted || 0
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Stats Fetch Failed',
      message: error.message
    });
  }
});

// POST /api/users/preferences - Update user preferences
router.post('/preferences', authenticate, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid Data',
        message: 'Preferences object is required'
      });
    }
    
    // Merge with existing preferences
    const currentPreferences = req.user.preferences || {};
    const updatedPreferences = { ...currentPreferences, ...preferences };
    
    const updatedUser = updateUser(req.user.id, { 
      preferences: updatedPreferences 
    });
    
    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: updatedUser.preferences
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Preferences Update Failed',
      message: error.message
    });
  }
});

// POST /api/users/language - Change selected language
router.post('/language', authenticate, async (req, res) => {
  try {
    const { language } = req.body;
    
    const validLanguages = ['sw', 'ln', 'am'];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Language',
        message: `Language must be one of: ${validLanguages.join(', ')}`
      });
    }
    
    const updatedUser = updateUser(req.user.id, { 
      selectedLanguage: language 
    });
    
    const languageNames = {
      sw: 'Swahili',
      ln: 'Lingala', 
      am: 'Amharic'
    };
    
    res.json({
      success: true,
      message: `Language changed to ${languageNames[language]} successfully`,
      data: {
        selectedLanguage: language,
        languageName: languageNames[language]
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Language Change Failed',
      message: error.message
    });
  }
});

// GET /api/users/leaderboard - Get learning leaderboard
router.get('/leaderboard', authenticate, (req, res) => {
  try {
    const { period = 'all', language } = req.query;
    
    let allUsers = getAllUsers();
    
    // Filter by language if specified
    if (language) {
      allUsers = allUsers.filter(user => user.selectedLanguage === language);
    }
    
    // Sort by XP (for 'all' period) or weekly XP
    const leaderboard = allUsers
      .sort((a, b) => b.totalXP - a.totalXP)
      .slice(0, 50) // Top 50
      .map((user, index) => ({
        rank: index + 1,
        id: user.id,
        name: user.name,
        level: user.level,
        totalXP: user.totalXP,
        streak: user.streak,
        selectedLanguage: user.selectedLanguage
      }));
    
    // Find current user's rank
    const userRank = leaderboard.findIndex(user => user.id === req.user.id) + 1;
    
    res.json({
      success: true,
      data: {
        leaderboard,
        userRank: userRank || null,
        period,
        language: language || 'all',
        totalUsers: allUsers.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Leaderboard Fetch Failed',
      message: error.message
    });
  }
});

// GET /api/users/achievements - Get user achievements
router.get('/achievements', authenticate, (req, res) => {
  try {
    const userAchievements = req.user.progress?.achievements || [];
    
    // Define all possible achievements
    const allAchievements = [
      {
        id: 'first-lesson',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: 'star',
        xpReward: 25,
        category: 'learning'
      },
      {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: 'local-fire-department',
        xpReward: 100,
        category: 'consistency'
      },
      {
        id: 'vocabulary-master',
        title: 'Vocabulary Master',
        description: 'Learn 100 new words',
        icon: 'psychology',
        xpReward: 200,
        category: 'vocabulary'
      },
      {
        id: 'conversation-starter',
        title: 'Conversation Starter',
        description: 'Complete your first live session',
        icon: 'video-call',
        xpReward: 150,
        category: 'speaking'
      },
      {
        id: 'game-master',
        title: 'Game Master',
        description: 'Score 100% in 5 different games',
        icon: 'games',
        xpReward: 75,
        category: 'games'
      },
      {
        id: 'cultural-explorer',
        title: 'Cultural Explorer',
        description: 'Read 20 cultural notes',
        icon: 'explore',
        xpReward: 50,
        category: 'culture'
      }
    ];
    
    const achievements = allAchievements.map(achievement => ({
      ...achievement,
      unlocked: userAchievements.includes(achievement.id),
      unlockedDate: userAchievements.includes(achievement.id) ? 
        req.user.joinedDate : null // Placeholder date
    }));
    
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalXPFromAchievements = achievements
      .filter(a => a.unlocked)
      .reduce((total, a) => total + a.xpReward, 0);
    
    res.json({
      success: true,
      data: {
        achievements,
        summary: {
          total: allAchievements.length,
          unlocked: unlockedCount,
          pending: allAchievements.length - unlockedCount,
          totalXPFromAchievements
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Achievements Fetch Failed',
      message: error.message
    });
  }
});

// DELETE /api/users/account - Delete user account
router.delete('/account', authenticate, async (req, res) => {
  try {
    const { confirmDelete } = req.body;
    
    if (!confirmDelete) {
      return res.status(400).json({
        success: false,
        error: 'Confirmation Required',
        message: 'Please confirm account deletion'
      });
    }
    
    // In production, implement proper account deletion
    // For now, just return success message
    res.json({
      success: true,
      message: 'Account deletion request received. Your account will be deleted within 24 hours.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Account Deletion Failed',
      message: error.message
    });
  }
});

module.exports = router;
