# Monoko API Documentation

## Overview

The Monoko API provides endpoints for African language learning, including lessons, progress tracking, AI-powered features, and live tutoring sessions.

**Base URL:** `http://localhost:3000/api` (development)  
**Production URL:** `https://api.monoko.app`

## Authentication

Most endpoints require authentication via JWT tokens.

```bash
Authorization: Bearer <your-jwt-token>
```

## Languages API

### Get All Languages
```http
GET /api/languages
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sw",
      "name": "Swahili",
      "nativeName": "Kiswahili",
      "flag": "🇰🇪",
      "countries": ["Kenya", "Tanzania", "Uganda", "Congo DRC"],
      "speakers": 200000000,
      "difficulty": "Beginner",
      "description": "Swahili is a Bantu language...",
      "lessonCount": 25
    }
  ]
}
```

### Get Language Details
```http
GET /api/languages/{languageId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sw",
    "name": "Swahili",
    "features": ["Phonetic spelling", "Regular grammar patterns"],
    "lessons": [
      {
        "id": "sw-basics-1",
        "title": "Greetings and Introductions",
        "difficulty": "Beginner",
        "duration": 10
      }
    ]
  }
}
```

### Get Common Phrases
```http
GET /api/languages/{languageId}/phrases
```

**Response:**
```json
{
  "success": true,
  "data": {
    "languageId": "sw",
    "phrases": [
      {
        "english": "Hello",
        "translation": "Jambo",
        "pronunciation": "JAHM-boh"
      }
    ]
  }
}
```

## Authentication API

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "selectedLanguage": "sw"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "token": "jwt-token-here",
    "user": {
      "id": "user-123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

## User Management API

### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com",
    "selectedLanguage": "sw",
    "streak": 5,
    "totalXP": 1250,
    "level": 3,
    "joinedDate": "2024-01-01"
  }
}
```

### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "selectedLanguage": "ln",
  "preferences": {
    "dailyGoal": 20,
    "notifications": true
  }
}
```

## Live Sessions API

### Get Available Speakers
```http
GET /api/live-sessions/speakers?language=sw&availability=morning&maxRate=20
```

**Query Parameters:**
- `language` (optional): Filter by language (sw, ln, am)
- `availability` (optional): Filter by time slot (morning, afternoon, evening)
- `maxRate` (optional): Maximum hourly rate in USD

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "speaker-001",
      "name": "Amara Kimani",
      "languages": ["sw"],
      "country": "Kenya",
      "city": "Nairobi",
      "rating": 4.8,
      "sessionsCompleted": 156,
      "hourlyRate": 15,
      "bio": "Native Swahili speaker with 3 years...",
      "avatar": "https://...",
      "specialties": ["Business Swahili", "Cultural Context"]
    }
  ]
}
```

### Book a Session
```http
POST /api/live-sessions/book
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "speakerId": "speaker-001",
  "date": "2024-01-15",
  "time": "14:00",
  "duration": 60,
  "topics": ["Conversation practice", "Grammar help"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session-123",
    "speakerId": "speaker-001",
    "date": "2024-01-15",
    "time": "14:00",
    "duration": 60,
    "status": "confirmed",
    "meetingUrl": "https://meet.monoko.app/session/session-123"
  }
}
```

## Snap & Learn AI API

### Analyze Image
```http
POST /api/snap-learn/analyze
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `image`: Image file (JPEG, PNG)
- `language`: Target language (sw, ln, am)

**Response:**
```json
{
  "success": true,
  "data": {
    "object": "mti",
    "translation": "tree",
    "pronunciation": "MM-tee",
    "confidence": 0.92,
    "examples": [
      "Mti huu ni mkubwa - This tree is big"
    ],
    "culturalNote": "Trees hold special significance...",
    "relatedWords": ["mzizi (roots)", "majani (leaves)"]
  }
}
```

## Progress Tracking API

### Get User Progress
```http
GET /api/progress
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "currentLevel": 3,
    "totalXP": 1250,
    "streak": 5,
    "completedLessons": ["sw-basics-1", "sw-basics-2"],
    "achievements": [
      {
        "id": "first-lesson",
        "title": "First Steps",
        "unlockedAt": "2024-01-01T10:00:00Z"
      }
    ],
    "weeklyStats": {
      "lessonsCompleted": 5,
      "timeSpent": 180,
      "xpEarned": 250
    }
  }
}
```

### Record Lesson Completion
```http
POST /api/progress/lesson-complete
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "lessonId": "sw-basics-1",
  "score": 85,
  "timeSpent": 12,
  "mistakesCount": 2
}
```

## Games API

### Get Game Leaderboard
```http
GET /api/games/leaderboard?game=word-match&period=week
```

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user-123",
        "name": "John D.",
        "score": 1250,
        "avatar": "https://..."
      }
    ],
    "userRank": 15,
    "userScore": 980
  }
}
```

### Submit Game Score
```http
POST /api/games/submit-score
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "gameId": "word-match-blitz",
  "score": 1250,
  "duration": 120,
  "wordsCorrect": 25,
  "wordsIncorrect": 3
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human readable error message",
  "code": 400
}
```

### Common Error Codes

| Code | Type | Description |
|------|------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Internal server error |

## Rate Limiting

API requests are rate limited:
- **Authenticated users**: 1000 requests per hour
- **Unauthenticated**: 100 requests per hour
- **Snap & Learn AI**: 50 requests per hour per user

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Lesson Completion
Triggered when a user completes a lesson.

```json
{
  "event": "lesson.completed",
  "userId": "user-123",
  "data": {
    "lessonId": "sw-basics-1",
    "score": 85,
    "xpEarned": 50,
    "completedAt": "2024-01-15T14:30:00Z"
  }
}
```

### Achievement Unlocked
Triggered when a user unlocks an achievement.

```json
{
  "event": "achievement.unlocked",
  "userId": "user-123",
  "data": {
    "achievementId": "week-warrior",
    "title": "Week Warrior",
    "unlockedAt": "2024-01-15T14:30:00Z"
  }
}
```

## SDK and Libraries

### JavaScript/Node.js
```bash
npm install @monoko/api-client
```

```javascript
import { MonokoClient } from '@monoko/api-client';

const client = new MonokoClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.monoko.app'
});

// Get languages
const languages = await client.languages.getAll();

// Analyze image
const result = await client.snapLearn.analyzeImage(imageFile, 'sw');
```

### React Native
```bash
npm install @monoko/react-native-sdk
```

```javascript
import { useMonoko } from '@monoko/react-native-sdk';

function MyComponent() {
  const { user, progress, updateProgress } = useMonoko();
  
  return (
    <View>
      <Text>Level: {progress.level}</Text>
      <Text>XP: {progress.totalXP}</Text>
    </View>
  );
}
```

## Support

- **Documentation**: https://docs.monoko.app
- **API Status**: https://status.monoko.app
- **Support Email**: api-support@monoko.app
- **Discord**: https://discord.gg/monoko-dev

---

**Version**: 1.0.0  
**Last Updated**: January 2024
