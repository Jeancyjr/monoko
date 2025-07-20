const request = require('supertest');
const app = require('../server');
const { users, refreshTokens } = require('../middleware/auth');

describe('Authentication API', () => {
  // Clear test data before each test
  beforeEach(() => {
    // Clear users except demo users for testing
    const testUserEmails = ['test@monoko.app', 'testuser@example.com'];
    testUserEmails.forEach(email => {
      if (users.has(email)) {
        users.delete(email);
      }
    });
    refreshTokens.clear();
  });

  describe('POST /api/auth/register', () => {
    const validUser = {
      name: 'Test User',
      email: 'test@monoko.app',
      password: 'TestPassword123!',
      selectedLanguage: 'sw'
    };

    test('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe(validUser.email);
      expect(response.body.data.user.selectedLanguage).toBe(validUser.selectedLanguage);
    });

    test('should reject registration with invalid email', async () => {
      const invalidUser = { ...validUser, email: 'invalid-email' };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
    });

    test('should reject registration with weak password', async () => {
      const invalidUser = { ...validUser, password: '123456' };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
    });

    test('should reject registration with invalid language', async () => {
      const invalidUser = { ...validUser, selectedLanguage: 'invalid' };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
    });

    test('should reject registration with duplicate email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(validUser);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Registration Failed');
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'TestPassword123!',
      selectedLanguage: 'sw'
    };

    beforeEach(async () => {
      // Register a test user
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    test('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Login Failed');
    });

    test('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Login Failed');
    });

    test('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email
          // Missing password
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('GET /api/auth/me', () => {
    let accessToken;
    const testUser = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'TestPassword123!',
      selectedLanguage: 'sw'
    };

    beforeEach(async () => {
      // Register and login to get token
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

    test('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    test('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authentication Required');
    });

    test('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authentication Failed');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken;
    const testUser = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'TestPassword123!',
      selectedLanguage: 'sw'
    };

    beforeEach(async () => {
      // Register and login to get refresh token
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      refreshToken = loginResponse.body.data.refreshToken;
    });

    test('should refresh token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    test('should reject refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Token Refresh Failed');
    });

    test('should reject refresh without token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Missing Token');
    });
  });

  describe('POST /api/auth/logout', () => {
    let refreshToken;
    const testUser = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'TestPassword123!',
      selectedLanguage: 'sw'
    };

    beforeEach(async () => {
      // Register and login to get refresh token
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      refreshToken = loginResponse.body.data.refreshToken;
    });

    test('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');
    });

    test('should handle logout without refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');
    });

    test('should invalidate refresh token after logout', async () => {
      // Logout
      await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken });

      // Try to use refresh token after logout
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
