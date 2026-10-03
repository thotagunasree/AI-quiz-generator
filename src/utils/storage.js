// Storage utility for local persistence

const STORAGE_KEYS = {
  SAVED_QUIZZES: 'ai_quiz_gen_saved_quizzes',
  QUIZ_HISTORY: 'ai_quiz_gen_history',
  USER_STATS: 'ai_quiz_gen_stats',
  SETTINGS: 'ai_quiz_gen_settings',
  BOOKMARKS: 'ai_quiz_gen_bookmarks'
};

const DEFAULT_SETTINGS = {
  apiKey: '',
  apiProvider: 'gemini', // 'gemini' | 'openai'
  soundEnabled: true,
  timerDefaultSec: 30,
  theme: 'dark'
};

const DEFAULT_STATS = {
  totalQuizzesTaken: 0,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  streakDays: 1,
  lastPlayedDate: null,
  highestScorePct: 0
};

export const getSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (newSettings) => {
  try {
    const current = getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving settings:', e);
  }
};

export const getSavedQuizzes = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_QUIZZES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveQuizToStorage = (quiz) => {
  try {
    const existing = getSavedQuizzes();
    const index = existing.findIndex(q => q.id === quiz.id);
    let updated;
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...quiz, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...quiz, createdAt: new Date().toISOString() }, ...existing];
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_QUIZZES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving quiz:', e);
    return [];
  }
};

export const deleteSavedQuiz = (quizId) => {
  try {
    const existing = getSavedQuizzes();
    const updated = existing.filter(q => q.id !== quizId);
    localStorage.setItem(STORAGE_KEYS.SAVED_QUIZZES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const getQuizHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const recordQuizResult = (result) => {
  try {
    const history = getQuizHistory();
    const updatedHistory = [result, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(updatedHistory));

    // Update aggregate stats
    const stats = getStats();
    const totalQuestions = result.questionsCount || 0;
    const correctAnswers = result.correctCount || 0;
    const scorePct = Math.round((correctAnswers / (totalQuestions || 1)) * 100);

    const today = new Date().toDateString();
    let streak = stats.streakDays || 1;

    if (stats.lastPlayedDate) {
      const lastDate = new Date(stats.lastPlayedDate);
      const diffTime = Math.abs(new Date(today) - new Date(lastDate.toDateString()));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak += 1;
      } else if (diffDays > 1) {
        streak = 1;
      }
    }

    const updatedStats = {
      totalQuizzesTaken: stats.totalQuizzesTaken + 1,
      totalQuestionsAnswered: stats.totalQuestionsAnswered + totalQuestions,
      totalCorrectAnswers: stats.totalCorrectAnswers + correctAnswers,
      streakDays: streak,
      lastPlayedDate: new Date().toISOString(),
      highestScorePct: Math.max(stats.highestScorePct || 0, scorePct)
    };

    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updatedStats));
    return { history: updatedHistory, stats: updatedStats };
  } catch (e) {
    console.error('Error recording result:', e);
  }
};

export const getStats = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : DEFAULT_STATS;
  } catch (e) {
    return DEFAULT_STATS;
  }
};

export const getBookmarks = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const toggleBookmarkQuestion = (question, quizTitle) => {
  try {
    const bookmarks = getBookmarks();
    const exists = bookmarks.some(b => b.id === question.id);
    let updated;
    if (exists) {
      updated = bookmarks.filter(b => b.id !== question.id);
    } else {
      updated = [{ ...question, quizTitle, savedAt: new Date().toISOString() }, ...bookmarks];
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};
