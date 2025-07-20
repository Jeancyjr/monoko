# Monoko Development Quickstart

Get up and running with Monoko in under 10 minutes! 🚀

## Prerequisites ✅

- **Node.js** (v16+): [Download here](https://nodejs.org/)
- **Git**: [Download here](https://git-scm.com/)
- **MongoDB** (local or cloud): [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or [local install](https://www.mongodb.com/try/download/community)
- **Code Editor**: VS Code recommended with React Native extensions

## Quick Setup

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/yourusername/monoko.git
cd monoko

# Install all dependencies (backend + frontend)
npm run install:all

# This runs:
# - npm install (root)
# - cd backend && npm install
# - cd frontend && npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit with your settings
nano .env  # or use your preferred editor
```

**Minimum required settings:**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/monoko
JWT_SECRET=your-secret-key-change-this
```

### 3. Start Development
```bash
# Start both backend and frontend
npm run dev

# This will:
# ✅ Start API server on http://localhost:3000
# ✅ Start React Native Metro bundler
# ✅ Open Expo development tools
```

### 4. Test the API
```bash
# Check if backend is running
curl http://localhost:3000

# Expected response:
{
  "message": "🇦🇫 Welcome to Monoko API - Speak the Heart of Africa!",
  "version": "1.0.0",
  "languages": ["Swahili", "Lingala", "Amharic"]
}
```

### 5. Run the Mobile App

**Option A: Expo Go (Recommended for beginners)**
1. Install Expo Go app on your phone
2. Scan the QR code from your terminal
3. App loads automatically!

**Option B: iOS Simulator**
```bash
cd frontend
npm run ios
```

**Option C: Android Emulator**
```bash
cd frontend
npm run android
```

## First Steps 🎯

### Explore the API Endpoints
```bash
# Get available languages
curl http://localhost:3000/api/languages

# Get Swahili phrases
curl http://localhost:3000/api/languages/sw/phrases

# Get native speakers for live sessions
curl http://localhost:3000/api/live-sessions/speakers
```

### Navigate the Mobile App
1. **Welcome Screen**: Language selection and onboarding
2. **Home Screen**: Dashboard with progress and quick actions
3. **Lessons Screen**: Browse available Swahili/Lingala/Amharic lessons
4. **Snap & Learn**: AI-powered camera feature
5. **Live Sessions**: Connect with native speakers
6. **Games**: Interactive learning games
7. **Progress**: Track learning journey

### Test Key Features
- 📱 **Language Selection**: Switch between Swahili, Lingala, Amharic
- 📊 **Progress Tracking**: Complete lessons, earn XP, maintain streaks
- 📸 **Snap & Learn**: Take photos to learn vocabulary (mock AI response)
- 🎮 **Games**: Explore game interfaces
- 👥 **Live Sessions**: Browse native speakers and book sessions

## Project Structure Overview

```
monoko/
├── 📱 frontend/              # React Native mobile app
│   ├── src/screens/         # App screens (Welcome, Home, Lessons, etc.)
│   ├── src/store/           # Redux state management
│   └── src/theme/           # African-inspired design system
├── 🔧 backend/              # Node.js/Express API
│   ├── routes/              # API endpoints (/languages, /auth, etc.)
│   └── server.js            # Main server file
├── 📚 content/              # Learning content
│   └── languages/           # Language-specific vocabulary/lessons
└── 📖 docs/                 # Documentation
```

## Common Development Tasks

### Add a New API Endpoint
```bash
# Create new route file
touch backend/routes/newFeature.js

# Add route to server.js
# app.use('/api/new-feature', require('./routes/newFeature'));
```

### Add a New Screen
```bash
# Create screen component
touch frontend/src/screens/NewScreen.js

# Add to navigation in App.js
```

### Add New Language Content
```bash
# Create language content file
touch content/languages/yoruba/basic-vocabulary.json

# Follow the structure in swahili/basic-vocabulary.json
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### API Testing with Postman
Import our Postman collection: `docs/Monoko.postman_collection.json`

## Debugging Tips 🐛

### Backend Issues
- Check MongoDB connection
- Verify environment variables
- Check server logs in terminal

### Frontend Issues
- Clear Metro cache: `npx react-native start --reset-cache`
- Reload app: Shake device → "Reload"
- Check React Native debugger

### Common Fixes
```bash
# Clear all caches
npm run clean

# Reinstall dependencies
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all

# Reset React Native cache
cd frontend && npx react-native start --reset-cache
```

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/amazing-new-feature

# Make changes
# Test locally
# Commit with descriptive messages
git commit -m "Add Snap & Learn AI feature for object recognition"
```

### 2. Pull Request
- Push branch to GitHub
- Create Pull Request with description
- Link to related issues
- Add screenshots for UI changes

### 3. Code Review
- Address reviewer feedback
- Keep PRs focused and reasonably sized
- Ensure all tests pass

## Key Files to Know

| File | Purpose |
|------|---------|
| `backend/server.js` | Main API server |
| `backend/routes/languages.js` | Languages API with sample data |
| `frontend/App.js` | Main mobile app component |
| `frontend/src/screens/HomeScreen.js` | App dashboard |
| `frontend/src/screens/SnapLearnScreen.js` | AI camera feature |
| `frontend/src/theme/index.js` | African-inspired design system |
| `content/languages/swahili/basic-vocabulary.json` | Sample learning content |

## Next Steps 🎯

### For New Contributors
1. **Explore the codebase**: Understand the structure
2. **Check issues**: Look for "good first issue" labels
3. **Join our community**: Discord, GitHub Discussions
4. **Read CONTRIBUTING.md**: Understand our development process

### For Language Experts
1. **Review content accuracy**: Check vocabulary and cultural notes
2. **Add new content**: Contribute lessons and phrases
3. **Record audio**: Add pronunciation guides
4. **Cultural insights**: Enhance cultural context

### For Developers
1. **Implement missing features**: Games, advanced AI, payments
2. **Improve UI/UX**: Make the app more intuitive
3. **Add tests**: Increase code coverage
4. **Performance**: Optimize for offline usage

## Getting Help 💬

- **Documentation**: Check `docs/` folder
- **API Reference**: `docs/API.md`
- **Discord**: Join our developer chat
- **GitHub Issues**: Report bugs or ask questions
- **Email**: dev-support@monoko.app

## Deployment (When Ready)

### Backend
```bash
# Build and deploy to production
npm run build
npm run deploy:backend
```

### Mobile App
```bash
# Build for app stores
cd frontend
npm run build:ios      # iOS App Store
npm run build:android  # Google Play Store
```

---

**🎉 You're all set!** Start exploring, building, and contributing to Monoko. Remember: every line of code helps connect people across Africa through language.

**Karibu (Welcome)!** - The Monoko Team
