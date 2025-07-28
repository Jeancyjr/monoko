import { configureStore, createSlice } from '@reduxjs/toolkit';

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    isAuthenticated: false,
    selectedLanguage: null,
    streak: 0,
    totalXP: 0,
    onboardingComplete: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.profile = action.payload;
      state.isAuthenticated = true;
    },
    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    updateStreak: (state, action) => {
      state.streak = action.payload;
    },
    addXP: (state, action) => {
      state.totalXP += action.payload;
    },
    setOnboardingComplete: (state, action) => {
      state.onboardingComplete = action.payload;
    },
    logout: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
      state.selectedLanguage = null;
      state.onboardingComplete = false;
    },
  },
});

// Progress slice
const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    completedLessons: [],
    currentLevel: 1,
    achievements: [],
    weeklyGoal: 5, // lessons per week
    dailyGoalMet: false,
  },
  reducers: {
    completeLesson: (state, action) => {
      const lessonId = action.payload;
      if (!state.completedLessons.includes(lessonId)) {
        state.completedLessons.push(lessonId);
      }
    },
    setDailyGoalMet: (state, action) => {
      state.dailyGoalMet = action.payload;
    },
    addAchievement: (state, action) => {
      state.achievements.push(action.payload);
    },
    updateLevel: (state, action) => {
      state.currentLevel = action.payload;
    },
  },
});

// Lessons slice
const lessonsSlice = createSlice({
  name: 'lessons',
  initialState: {
    availableLessons: [],
    currentLesson: null,
    favorites: [],
    downloadedContent: [],
  },
  reducers: {
    setLessons: (state, action) => {
      state.availableLessons = action.payload;
    },
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
    },
    toggleFavorite: (state, action) => {
      const lessonId = action.payload;
      if (state.favorites.includes(lessonId)) {
        state.favorites = state.favorites.filter(id => id !== lessonId);
      } else {
        state.favorites.push(lessonId);
      }
    },
  },
});

const snapLearnSlice = createSlice({
  name: 'snapLearn',
  initialState: {
    wordBank: [],
    recentScans: [],
    scanHistory: [],
  },
  reducers: {
    addScannedWord: (state, action) => {
      state.recentScans.unshift(action.payload);
      state.scanHistory.push(action.payload);
      if (state.recentScans.length > 10) {
        state.recentScans.pop();
      }
    },
    addToWordBank: (state, action) => {
      const word = action.payload;
      if (!state.wordBank.find(w => w.object === word.object)) {
        state.wordBank.push(word);
      }
    },
    clearRecentScans: (state) => {
      state.recentScans = [];
    },
  },
});

// Export actions
export const { setUser, setSelectedLanguage, updateStreak, addXP, setOnboardingComplete, logout } = userSlice.actions;
export const { completeLesson, setDailyGoalMet, addAchievement, updateLevel } = progressSlice.actions;
export const { setLessons, setCurrentLesson, toggleFavorite } = lessonsSlice.actions;
export const { addScannedWord, addToWordBank, clearRecentScans } = snapLearnSlice.actions;

// Configure store
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    progress: progressSlice.reducer,
    lessons: lessonsSlice.reducer,
    snapLearn: snapLearnSlice.reducer,
  },
});
