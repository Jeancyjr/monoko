const request = require('supertest');
const app = require('../server');
const path = require('path');
const fs = require('fs').promises;

describe('Lessons API', () => {
  let accessToken;
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'TestPassword123!',
    selectedLanguage: 'sw'
  };

  beforeAll(async () => {
    // Register and login to get access token
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    accessToken = loginResponse.body.data.accessToken;
  });

  describe('GET /api/lessons', () => {
    test('should get all lessons without authentication', async () => {
      const response = await request(app)
        .get('/api/lessons');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('lessons');
      expect(Array.isArray(response.body.data.lessons)).toBe(true);
      expect(response.body.data.lessons.length).toBeGreaterThan(0);
    });

    test('should get lessons with user progress when authenticated', async () => {
      const response = await request(app)
        .get('/api/lessons')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('lessons');
      
      // Check that lessons have user-specific data
      const lesson = response.body.data.lessons[0];
      expect(lesson).toHaveProperty('completed');
      expect(typeof lesson.completed).toBe('boolean');
    });

    test('should filter lessons by language', async () => {
      const response = await request(app)
        .get('/api/lessons?language=sw');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const lessons = response.body.data.lessons;
      lessons.forEach(lesson => {
        expect(lesson.language).toBe('sw');
      });
    });

    test('should filter lessons by difficulty level', async () => {
      const response = await request(app)
        .get('/api/lessons?level=beginner');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const lessons = response.body.data.lessons;
      lessons.forEach(lesson => {
        expect(lesson.difficulty.toLowerCase()).toBe('beginner');
      });
    });

    test('should handle combined filters', async () => {
      const response = await request(app)
        .get('/api/lessons?language=sw&level=beginner');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const lessons = response.body.data.lessons;
      lessons.forEach(lesson => {
        expect(lesson.language).toBe('sw');
        expect(lesson.difficulty.toLowerCase()).toBe('beginner');
      });
    });
  });

  describe('GET /api/lessons/:id', () => {
    test('should get specific lesson content', async () => {
      const lessonId = 'sw-basics-1';
      const response = await request(app)
        .get(`/api/lessons/${lessonId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', lessonId);
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('steps');
      expect(Array.isArray(response.body.data.steps)).toBe(true);
      expect(response.body.data.steps.length).toBeGreaterThan(0);
    });

    test('should include user progress when authenticated', async () => {
      const response = await request(app)
        .get('/api/lessons/sw-basics-1')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userProgress');
      expect(response.body.data.userProgress).toHaveProperty('completed');
    });

    test('should return 400 for invalid lesson ID format', async () => {
      const response = await request(app)
        .get('/api/lessons/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid Lesson ID');
    });

    test('should return 404 for non-existent lesson', async () => {
      const response = await request(app)
        .get('/api/lessons/sw-nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Lesson Not Found');
    });

    test('should validate lesson structure for Swahili', async () => {
      const response = await request(app)
        .get('/api/lessons/sw-basics-1');

      const lesson = response.body.data;
      expect(lesson.language).toBe('sw');
      expect(lesson.languageName).toBe('Swahili');
      expect(lesson).toHaveProperty('culturalBackground');
      
      // Check step types
      const stepTypes = lesson.steps.map(step => step.type);
      expect(stepTypes).toContain('introduction');
      expect(stepTypes).toContain('vocabulary');
      expect(stepTypes).toContain('practice');
      expect(stepTypes).toContain('dialogue');
      expect(stepTypes).toContain('review');
    });

    test('should validate lesson structure for Lingala', async () => {
      const response = await request(app)
        .get('/api/lessons/ln-basics-1');

      const lesson = response.body.data;
      expect(lesson.language).toBe('ln');
      expect(lesson.languageName).toBe('Lingala');
      expect(lesson).toHaveProperty('culturalBackground');
    });

    test('should validate lesson structure for Amharic', async () => {
      const response = await request(app)
        .get('/api/lessons/am-basics-1');

      const lesson = response.body.data;
      expect(lesson.language).toBe('am');
      expect(lesson.languageName).toBe('Amharic');
      expect(lesson).toHaveProperty('scriptInfo');
      expect(lesson.scriptInfo.name).toBe('Ge\'ez Script (Fidel)');
    });
  });

  describe('POST /api/lessons/:id/complete', () => {
    const lessonId = 'sw-basics-1';
    const validCompletion = {
      score: 85,
      timeSpent: 300, // 5 minutes
      mistakesCount: 2
    };

    test('should mark lesson as completed with valid data', async () => {
      const response = await request(app)
        .post(`/api/lessons/${lessonId}/complete`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(validCompletion);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('lessonId', lessonId);
      expect(response.body.data).toHaveProperty('xpEarned');
      expect(response.body.data).toHaveProperty('bonuses');
      expect(response.body.data.score).toBe(validCompletion.score);
    });

    test('should calculate XP correctly based on score', async () => {
      const highScoreCompletion = { ...validCompletion, score: 100 };
      const response = await request(app)
        .post(`/api/lessons/${lessonId}/complete`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(highScoreCompletion);

      expect(response.status).toBe(200);
      const xpEarned = response.body.data.xpEarned;
      const scoreBonus = response.body.data.bonuses.score;
      
      // Score of 100 should give maximum score bonus
      expect(scoreBonus).toBe(50); // Math.floor(100 / 10) * 5
      expect(xpEarned).toBeGreaterThan(50); // Base XP + bonuses
    });

    test('should give time bonus for quick completion', async () => {
      const quickCompletion = { ...validCompletion, timeSpent: 250 }; // Under 5 minutes
      const response = await request(app)
        .post(`/api/lessons/${lessonId}/complete`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(quickCompletion);

      expect(response.status).toBe(200);
      expect(response.body.data.bonuses.time).toBe(10);
    });

    test('should award achievement for perfect score', async () => {
      const perfectCompletion = { ...validCompletion, score: 100 };
      const response = await request(app)
        .post(`/api/lessons/${lessonId}/complete`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(perfectCompletion);

      expect(response.status).toBe(200);
      expect(response.body.data.achievements).toContain('perfect-lesson');
    });

    test('should reject completion without authentication', async () => {
      const response = await request(app)
        .post(`/api/lessons/${lessonId}/complete`)
        .send(validCompletion);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should reject invalid score values', async () => {
      const invalidScores = [-10, 150, 'not-a-number'];
      
      for (const score of invalidScores) {
        const response = await request(app)
          .post(`/api/lessons/${lessonId}/complete`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ ...validCompletion, score });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Invalid Score');
      }
    });
  });

  describe('GET /api/lessons/categories', () => {
    test('should get lesson categories', async () => {
      const response = await request(app)
        .get('/api/lessons/categories');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Check category structure
      const category = response.body.data[0];
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('description');
      expect(category).toHaveProperty('lessons');
      expect(category).toHaveProperty('difficulty');
    });

    test('should include expected categories', async () => {
      const response = await request(app)
        .get('/api/lessons/categories');

      const categoryIds = response.body.data.map(cat => cat.id);
      expect(categoryIds).toContain('basics');
      expect(categoryIds).toContain('family');
      expect(categoryIds).toContain('culture');
      expect(categoryIds).toContain('business');
    });
  });
});

// Test content loading functionality
describe('Lesson Content Loading', () => {
  test('should load Swahili content correctly', async () => {
    const response = await request(app)
      .get('/api/lessons/sw-basics-1');

    expect(response.status).toBe(200);
    const lesson = response.body.data;
    
    // Check vocabulary step exists and has proper structure
    const vocabStep = lesson.steps.find(step => step.type === 'vocabulary');
    expect(vocabStep).toBeTruthy();
    expect(vocabStep.words).toBeTruthy();
    expect(vocabStep.words.length).toBeGreaterThan(0);
    
    const word = vocabStep.words[0];
    expect(word).toHaveProperty('native');
    expect(word).toHaveProperty('english');
    expect(word).toHaveProperty('pronunciation');
  });

  test('should generate practice questions from vocabulary', async () => {
    const response = await request(app)
      .get('/api/lessons/sw-basics-1');

    const lesson = response.body.data;
    const practiceSteps = lesson.steps.filter(step => step.type === 'practice');
    
    expect(practiceSteps.length).toBeGreaterThan(0);
    
    const practiceStep = practiceSteps[0];
    expect(practiceStep).toHaveProperty('question');
    expect(practiceStep).toHaveProperty('options');
    expect(practiceStep).toHaveProperty('correct');
    expect(practiceStep.options.length).toBe(4);
    expect(practiceStep.correct).toBeGreaterThanOrEqual(0);
    expect(practiceStep.correct).toBeLessThan(4);
  });
});
