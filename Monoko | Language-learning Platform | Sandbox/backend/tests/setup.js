// Test setup and configuration
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Increase test timeout for integration tests
jest.setTimeout(30000);

// Global test setup
let mongod;

beforeAll(async () => {
  // Start in-memory MongoDB for testing
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = 'test-jwt-secret-key';
  process.env.JWT_EXPIRE = '1h';
  
  // Connect to in-memory database
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Clean up
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

// Clean up between test suites
afterEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Global test utilities
global.testUtils = {
  // Helper to create test user
  createTestUser: async (userData = {}) => {
    const defaultUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!',
      selectedLanguage: 'sw',
      ...userData
    };
    
    return defaultUser;
  },

  // Helper to generate random test data
  generateRandomUser: () => {
    const timestamp = Date.now();
    return {
      name: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'TestPassword123!',
      selectedLanguage: ['sw', 'ln', 'am'][Math.floor(Math.random() * 3)]
    };
  },

  // Helper to create authenticated request headers
  createAuthHeaders: (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }),

  // Helper for API response validation
  validateApiResponse: (response, expectedStatus = 200) => {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('success');
    if (expectedStatus < 400) {
      expect(response.body.success).toBe(true);
    } else {
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    }
  },

  // Mock lesson content for testing
  mockLessonContent: {
    'sw-test': {
      language: 'sw',
      languageName: 'Swahili',
      nativeName: 'Kiswahili',
      category: 'test-vocabulary',
      level: 'beginner',
      words: [
        {
          id: 'test_word_1',
          swahili: 'Jambo',
          english: 'Hello',
          pronunciation: 'JAHM-boh',
          category: 'greetings',
          examples: [],
          culturalNote: 'Test cultural note'
        },
        {
          id: 'test_word_2',
          swahili: 'Asante',
          english: 'Thank you',
          pronunciation: 'ah-SAHN-teh',
          category: 'courtesy',
          examples: [],
          culturalNote: 'Test cultural note'
        }
      ],
      totalWords: 2,
      estimatedLearningTime: '5 minutes',
      culturalBackground: {
        overview: 'Test cultural background'
      }
    }
  }
};

// Console override for cleaner test output
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  log: process.env.TEST_VERBOSE ? originalConsole.log : () => {},
  warn: process.env.TEST_VERBOSE ? originalConsole.warn : () => {},
  error: originalConsole.error, // Always show errors
};

// Mock external services for testing
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Mock file system operations for content loading
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    readFile: jest.fn((path) => {
      // Mock content files
      if (path.includes('swahili/basic-vocabulary.json')) {
        return Promise.resolve(JSON.stringify(global.testUtils.mockLessonContent['sw-test']));
      }
      if (path.includes('lingala/basic-vocabulary.json')) {
        return Promise.resolve(JSON.stringify({
          ...global.testUtils.mockLessonContent['sw-test'],
          language: 'ln',
          languageName: 'Lingala'
        }));
      }
      if (path.includes('amharic/basic-vocabulary.json')) {
        return Promise.resolve(JSON.stringify({
          ...global.testUtils.mockLessonContent['sw-test'],
          language: 'am',
          languageName: 'Amharic'
        }));
      }
      return Promise.reject(new Error('File not found'));
    }),
    writeFile: jest.fn(() => Promise.resolve()),
    unlink: jest.fn(() => Promise.resolve()),
    mkdir: jest.fn(() => Promise.resolve()),
  }
}));

// Performance monitoring for tests
const performanceMonitor = {
  start: (testName) => {
    const startTime = process.hrtime.bigint();
    return {
      end: () => {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
        if (duration > 1000 && process.env.TEST_VERBOSE) {
          console.warn(`⚠️  Slow test detected: ${testName} took ${duration.toFixed(2)}ms`);
        }
        return duration;
      }
    };
  }
};

global.performanceMonitor = performanceMonitor;

// Custom matchers
expect.extend({
  toBeValidApiResponse(received, expectedStatus = 200) {
    const pass = received.status === expectedStatus && 
                 typeof received.body === 'object' &&
                 received.body.hasOwnProperty('success');
    
    if (pass) {
      return {
        message: () => `expected ${received.status} not to be valid API response`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received.status} to be valid API response with status ${expectedStatus}`,
        pass: false,
      };
    }
  },
  
  toHaveValidJWT(received) {
    const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    const pass = typeof received === 'string' && jwtPattern.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid JWT`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid JWT token`,
        pass: false,
      };
    }
  }
});

// Test database seeding
global.seedTestData = async () => {
  const users = [
    {
      name: 'John Doe',
      email: 'john@test.com',
      selectedLanguage: 'sw',
      level: 3,
      totalXP: 1500
    },
    {
      name: 'Jane Smith',
      email: 'jane@test.com',
      selectedLanguage: 'ln',
      level: 2,
      totalXP: 800
    }
  ];
  
  // In a real implementation, this would seed the database
  return users;
};
