const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'monoko-default-secret-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || '30d';

// In-memory user storage (replace with MongoDB in production)
const users = new Map();
const refreshTokens = new Set();

// Sample users for development
const sampleUsers = [
  {
    id: 'user-001',
    name: 'Demo User',
    email: 'demo@monoko.app',
    password: '$2a$10$8K1p/a8QFGwCWV7VvJ7ZYeF4o4LZRzCZKn7XZtDFLV5EKhN0w6Nk2', // password: 'Monoko123!'
    selectedLanguage: 'sw',
    streak: 5,
    totalXP: 1250,
    level: 3,
    joinedDate: '2024-01-01T00:00:00.000Z',
    preferences: {
      dailyGoal: 20,
      notifications: true,
      offlineMode: true,
      audioEnabled: true,
      darkMode: false
    },
    progress: {
      completedLessons: ['sw-basics-1'],
      currentLesson: 'sw-basics-2',
      achievements: ['first-lesson', 'week-warrior'],
      weeklyStats: {
        lessonsCompleted: 3,
        timeSpent: 180,
        xpEarned: 150
      }
    }
  },
  {
    id: 'user-002',
    name: 'Sarah Kimani',
    email: 'sarah@example.com',
    password: '$2a$10$8K1p/a8QFGwCWV7VvJ7ZYeF4o4LZRzCZKn7XZtDFLV5EKhN0w6Nk2',
    selectedLanguage: 'sw',
    streak: 12,
    totalXP: 2400,
    level: 5,
    joinedDate: '2023-12-01T00:00:00.000Z'
  }
];

// Initialize sample users
sampleUsers.forEach(user => {
  users.set(user.email, user);
});

// Generate JWT token
const generateToken = (userId, type = 'access') => {
  const payload = { userId, type };
  const expiresIn = type === 'refresh' ? REFRESH_TOKEN_EXPIRE : JWT_EXPIRE;
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Generate token pair (access + refresh)
const generateTokenPair = (userId) => {
  const accessToken = generateToken(userId, 'access');
  const refreshToken = generateToken(userId, 'refresh');
  
  // Store refresh token
  refreshTokens.add(refreshToken);
  
  return { accessToken, refreshToken };
};

// Verify JWT token
const verifyToken = (token, type = 'access') => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.type !== type) {
      throw new Error(`Invalid token type. Expected ${type}, got ${decoded.type}`);
    }
    
    return decoded;
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Required',
        message: 'No authorization header provided'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Required',
        message: 'No token provided'
      });
    }

    const decoded = verifyToken(token, 'access');
    
    // Find user
    const user = [...users.values()].find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Failed',
        message: 'User not found'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Authentication Failed',
      message: error.message
    });
  }
};

// Optional authentication (for public endpoints that can work with/without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (token) {
        const decoded = verifyToken(token, 'access');
        const user = [...users.values()].find(u => u.id === decoded.userId);
        if (user) {
          req.user = user;
        }
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Register new user
const registerUser = async (userData) => {
  const { name, email, password, selectedLanguage } = userData;
  
  // Check if user already exists
  if (users.has(email)) {
    throw new Error('User already exists with this email');
  }
  
  // Hash password
  const hashedPassword = await hashPassword(password);
  
  // Create new user
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password: hashedPassword,
    selectedLanguage,
    streak: 0,
    totalXP: 0,
    level: 1,
    joinedDate: new Date().toISOString(),
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
    }
  };
  
  // Store user
  users.set(email, newUser);
  
  // Generate tokens
  const tokens = generateTokenPair(newUser.id);
  
  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      selectedLanguage: newUser.selectedLanguage,
      streak: newUser.streak,
      totalXP: newUser.totalXP,
      level: newUser.level
    },
    tokens
  };
};

// Login user
const loginUser = async (email, password) => {
  // Find user
  const user = users.get(email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Check password
  const isValidPassword = await comparePassword(password, user.password);
  
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }
  
  // Generate tokens
  const tokens = generateTokenPair(user.id);
  
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      selectedLanguage: user.selectedLanguage,
      streak: user.streak,
      totalXP: user.totalXP,
      level: user.level
    },
    tokens
  };
};

// Refresh token
const refreshToken = async (refreshTokenString) => {
  if (!refreshTokens.has(refreshTokenString)) {
    throw new Error('Invalid refresh token');
  }
  
  try {
    const decoded = verifyToken(refreshTokenString, 'refresh');
    
    // Find user
    const user = [...users.values()].find(u => u.id === decoded.userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Remove old refresh token
    refreshTokens.delete(refreshTokenString);
    
    // Generate new token pair
    const tokens = generateTokenPair(user.id);
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        selectedLanguage: user.selectedLanguage,
        streak: user.streak,
        totalXP: user.totalXP,
        level: user.level
      },
      tokens
    };
  } catch (error) {
    throw new Error(`Token refresh failed: ${error.message}`);
  }
};

// Logout user (invalidate refresh token)
const logoutUser = (refreshTokenString) => {
  refreshTokens.delete(refreshTokenString);
  return { message: 'Logged out successfully' };
};

// Get user by ID
const getUserById = (userId) => {
  return [...users.values()].find(user => user.id === userId);
};

// Update user data
const updateUser = (userId, updateData) => {
  const user = getUserById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Update user data
  Object.assign(user, updateData);
  users.set(user.email, user);
  
  return user;
};

// Authorization middleware for specific roles/permissions
const authorize = (permissions = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Required',
        message: 'You must be logged in to access this resource'
      });
    }

    // For now, all authenticated users have access
    // In future, implement role-based permissions
    if (permissions.length > 0) {
      // Check user permissions here
      // For demo purposes, we'll allow all authenticated users
      console.log(`Checking permissions: ${permissions.join(', ')} for user ${req.user.id}`);
    }

    next();
  };
};

// Get all users (admin only - for demo)
const getAllUsers = () => {
  return [...users.values()].map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    selectedLanguage: user.selectedLanguage,
    level: user.level,
    streak: user.streak,
    totalXP: user.totalXP,
    joinedDate: user.joinedDate
  }));
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  generateToken,
  generateTokenPair,
  verifyToken,
  hashPassword,
  comparePassword,
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getUserById,
  updateUser,
  getAllUsers,
  // Export for testing
  users,
  refreshTokens
};
