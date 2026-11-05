import React, { createContext, useContext, useState, useEffect } from 'react';
import { SectionId, UserStats } from '../types';
import { triggerConfetti } from '../utils/confetti';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'xp' | 'achievement' | 'info';
}

interface UserContextType {
  stats: UserStats;
  activeSection: SectionId;
  setActiveSection: (sec: SectionId) => void;
  selectedProgramId: string | null;
  setSelectedProgramId: (id: string | null) => void;
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  earnPoints: (amount: number, reason?: string) => void;
  completeDailyChallenge: () => void;
  markNoteCompleted: (noteId: string) => void;
  recordQuizResult: (isCorrect: boolean) => void;
  markProgramSolved: (programId: string) => void;
  toggleInterviewMastered: (questionId: string) => void;
  toggleInterviewBookmark: (questionId: string) => void;
  toasts: ToastMessage[];
  setDailyGoalTarget: (target: number) => void;
  claimDailyGoalBonus: () => void;
  dailyGoalCompletedCount: number;
  removeToast: (id: string) => void;
  resetProgress: () => void;
  isAuthenticated: boolean;
  currentUser: { email: string; name: string; avatar: string; provider?: string } | null;
  login: (user: { email: string; name: string; avatar: string; provider?: string }, token: string) => void;
  logout: () => void;
  levelInfo: {
    level: number;
    title: string;
    currentLevelXp: number;
    nextLevelXp: number;
    progressPercent: number;
    rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master';
  };
}

const STORAGE_KEY = 'python_master_user_state_v2';
const THEME_KEY = 'python_master_theme_v1';

const defaultStats: UserStats = {
  points: 0,
  streak: 0,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  completedNotes: [],
  solvedPrograms: [],
  quizStats: {
    totalAttempted: 0,
    correctCount: 0,
    highestStreak: 0,
  },
  masteredInterviews: [],
  bookmarkedInterviews: [],
  unlockedAchievements: [],
  dailyChallengeCompletedDate: '',
  dailyGoalTarget: 3,
  notesCompletedDates: {},
  dailyGoalClaimedDate: '',
  userName: 'Python Novice',
  avatarSeed: 'snake',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultStats, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return defaultStats;
  });

  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    return 'dark';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; avatar: string; provider?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('python_master_auth_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const isAuthenticated = !!currentUser;

  const login = (user: { email: string; name: string; avatar: string; provider?: string }, token: string) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('python_master_auth_v1', JSON.stringify(user));
      localStorage.setItem('python_master_token_v1', token);
    } catch {
      // ignore
    }
    setStats((prev) => ({
      ...prev,
      userName: user.name || user.email.split('@')[0],
    }));
    addToast('Welcome to Python Master', `Signed in as ${user.name || user.email}`, 'info');
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('python_master_auth_v1');
      localStorage.removeItem('python_master_token_v1');
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } catch {
      // ignore
    }
    addToast('Signed Out', 'You have been logged out of your session.', 'info');
  };

  // Sync theme with DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Persist stats
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  const addToast = (title: string, message: string, type: 'xp' | 'achievement' | 'info' = 'xp') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, title, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const earnPoints = (amount: number, reason?: string) => {
    setStats((prev) => {
      const newPoints = prev.points + amount;
      const newUnlocked = [...prev.unlockedAchievements];

      if (newPoints >= 500 && !newUnlocked.includes('pythonista')) {
        newUnlocked.push('pythonista');
        addToast('Achievement Unlocked! 🏆', 'Pythonista: Surpassed 500 XP!', 'achievement');
        triggerConfetti();
      }

      if (newPoints >= 1000 && !newUnlocked.includes('python_master')) {
        newUnlocked.push('python_master');
        addToast('Legendary Achievement! 👑', 'Python Master: Reached 1,000 XP!', 'achievement');
        triggerConfetti();
      }

      return {
        ...prev,
        points: newPoints,
        unlockedAchievements: newUnlocked,
      };
    });

    addToast(`+${amount} XP Earned!`, reason || 'Keep on coding!', 'xp');
  };

  const completeDailyChallenge = () => {
    const today = new Date().toISOString().slice(0, 10);
    if (stats.dailyChallengeCompletedDate === today) {
      addToast('Already Completed', "You've already claimed today's challenge bonus!", 'info');
      return;
    }

    setStats((prev) => ({
      ...prev,
      dailyChallengeCompletedDate: today,
    }));
    earnPoints(20, 'Daily Challenge Completed!');
    triggerConfetti();
  };

  const markNoteCompleted = (noteId: string) => {
    if (stats.completedNotes.includes(noteId)) {
      addToast('Note Reviewed', 'You have already completed this note.', 'info');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    setStats((prev) => {
      const updatedNotes = [...prev.completedNotes, noteId];
      const updatedDates = { ...(prev.notesCompletedDates || {}), [noteId]: today };
      const updatedUnlocked = [...prev.unlockedAchievements];

      if (updatedNotes.length >= 3 && !updatedUnlocked.includes('python_beginner')) {
        updatedUnlocked.push('python_beginner');
        addToast('Achievement Unlocked! 🐍', 'Python Beginner badge earned!', 'achievement');
      }

      if (noteId === 'oop' && !updatedUnlocked.includes('oop_architect')) {
        updatedUnlocked.push('oop_architect');
        addToast('Achievement Unlocked! 🏛️', 'OOP Architect badge earned!', 'achievement');
      }

      return {
        ...prev,
        completedNotes: updatedNotes,
        notesCompletedDates: updatedDates,
        unlockedAchievements: updatedUnlocked,
      };
    });

    earnPoints(20, 'Note completed');
    triggerConfetti();
  };

  const setDailyGoalTarget = (target: number) => {
    setStats((prev) => ({
      ...prev,
      dailyGoalTarget: Math.max(1, target),
    }));
    addToast('Daily Target Updated', `Goal set to ${target} ${target === 1 ? 'lesson' : 'lessons'} today!`, 'info');
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const dailyGoalCompletedCount = Object.values(stats.notesCompletedDates || {}).filter(
    (d) => d === todayStr
  ).length;

  const claimDailyGoalBonus = () => {
    if (stats.dailyGoalClaimedDate === todayStr) {
      addToast('Bonus Already Claimed', 'You already claimed your daily target bonus today!', 'info');
      return;
    }
    const target = stats.dailyGoalTarget || 3;
    if (dailyGoalCompletedCount < target) {
      addToast('Target Not Reached', `Complete ${target - dailyGoalCompletedCount} more lessons to unlock your bonus!`, 'info');
      return;
    }

    setStats((prev) => ({
      ...prev,
      dailyGoalClaimedDate: todayStr,
    }));
    earnPoints(30, 'Daily Goal Achieved! Bonus Unlocked! 🎉');
    triggerConfetti();
  };

  const recordQuizResult = (isCorrect: boolean) => {
    setStats((prev) => {
      const totalAttempted = prev.quizStats.totalAttempted + 1;
      const correctCount = prev.quizStats.correctCount + (isCorrect ? 1 : 0);
      const currentStreak = isCorrect ? prev.quizStats.highestStreak + 1 : 0;
      const highestStreak = Math.max(prev.quizStats.highestStreak, currentStreak);

      const updatedUnlocked = [...prev.unlockedAchievements];
      if (isCorrect && !updatedUnlocked.includes('first_quiz')) {
        updatedUnlocked.push('first_quiz');
        addToast('Achievement Unlocked! 🎯', 'First Quiz badge earned!', 'achievement');
      }

      if (currentStreak >= 5 && !updatedUnlocked.includes('quiz_master')) {
        updatedUnlocked.push('quiz_master');
        addToast('Achievement Unlocked! ⭐', 'Flawless Mind: 5-in-a-row correct!', 'achievement');
      }

      return {
        ...prev,
        quizStats: {
          totalAttempted,
          correctCount,
          highestStreak,
        },
        unlockedAchievements: updatedUnlocked,
      };
    });
  };

  const markProgramSolved = (programId: string) => {
    setStats((prev) => {
      const isNew = !prev.solvedPrograms.includes(programId);
      const updatedPrograms = isNew ? [...prev.solvedPrograms, programId] : prev.solvedPrograms;
      const updatedUnlocked = [...prev.unlockedAchievements];

      if (!updatedUnlocked.includes('first_run')) {
        updatedUnlocked.push('first_run');
        addToast('Achievement Unlocked! 🚀', 'Code Pilot badge earned!', 'achievement');
      }

      if (updatedPrograms.length >= 5 && !updatedUnlocked.includes('algo_solver')) {
        updatedUnlocked.push('algo_solver');
        addToast('Achievement Unlocked! ⚡', 'Algorithm Apprentice badge earned!', 'achievement');
      }

      return {
        ...prev,
        solvedPrograms: updatedPrograms,
        unlockedAchievements: updatedUnlocked,
      };
    });

    earnPoints(15, 'Program Executed');
  };

  const toggleInterviewMastered = (questionId: string) => {
    setStats((prev) => {
      const exists = prev.masteredInterviews.includes(questionId);
      const updated = exists
        ? prev.masteredInterviews.filter((id) => id !== questionId)
        : [...prev.masteredInterviews, questionId];

      const updatedUnlocked = [...prev.unlockedAchievements];
      if (updated.length >= 5 && !updatedUnlocked.includes('interview_ready')) {
        updatedUnlocked.push('interview_ready');
        addToast('Achievement Unlocked! 💼', 'Interview Ready badge earned!', 'achievement');
      }

      return {
        ...prev,
        masteredInterviews: updated,
        unlockedAchievements: updatedUnlocked,
      };
    });

    if (!stats.masteredInterviews.includes(questionId)) {
      earnPoints(10, 'Interview Question Mastered');
    }
  };

  const toggleInterviewBookmark = (questionId: string) => {
    setStats((prev) => {
      const exists = prev.bookmarkedInterviews.includes(questionId);
      return {
        ...prev,
        bookmarkedInterviews: exists
          ? prev.bookmarkedInterviews.filter((id) => id !== questionId)
          : [...prev.bookmarkedInterviews, questionId],
      };
    });
  };

  const resetProgress = () => {
    setStats(defaultStats);
    addToast('Progress Reset', 'Your learning data has been restored to defaults.', 'info');
  };

  // Compute Level info starting at Level 0
  const computeLevelInfo = () => {
    const pts = stats.points;
    if (pts < 50) {
      return {
        level: 0,
        title: 'Python Novice',
        currentLevelXp: pts,
        nextLevelXp: 50,
        progressPercent: Math.min(100, Math.round((pts / 50) * 100)),
        rank: 'Bronze' as const,
      };
    } else if (pts < 150) {
      return {
        level: 1,
        title: 'Python Beginner',
        currentLevelXp: pts - 50,
        nextLevelXp: 100,
        progressPercent: Math.min(100, Math.round(((pts - 50) / 100) * 100)),
        rank: 'Bronze' as const,
      };
    } else if (pts < 300) {
      return {
        level: 2,
        title: 'Python Apprentice',
        currentLevelXp: pts - 150,
        nextLevelXp: 150,
        progressPercent: Math.min(100, Math.round(((pts - 150) / 150) * 100)),
        rank: 'Bronze' as const,
      };
    } else if (pts < 600) {
      return {
        level: 3,
        title: 'Python Learner',
        currentLevelXp: pts - 300,
        nextLevelXp: 300,
        progressPercent: Math.min(100, Math.round(((pts - 300) / 300) * 100)),
        rank: 'Silver' as const,
      };
    } else if (pts < 1200) {
      return {
        level: 4,
        title: 'Junior Pythonista',
        currentLevelXp: pts - 600,
        nextLevelXp: 600,
        progressPercent: Math.min(100, Math.round(((pts - 600) / 600) * 100)),
        rank: 'Gold' as const,
      };
    } else if (pts < 2500) {
      return {
        level: 5,
        title: 'Code Craftsman',
        currentLevelXp: pts - 1200,
        nextLevelXp: 1300,
        progressPercent: Math.min(100, Math.round(((pts - 1200) / 1300) * 100)),
        rank: 'Platinum' as const,
      };
    } else {
      return {
        level: 6,
        title: 'Python Master',
        currentLevelXp: pts - 2500,
        nextLevelXp: 2000,
        progressPercent: 100,
        rank: 'Master' as const,
      };
    }
  };

  const levelInfo = computeLevelInfo();

  return (
    <UserContext.Provider
      value={{
        stats,
        activeSection,
        setActiveSection,
        selectedProgramId,
        setSelectedProgramId,
        selectedNoteId,
        setSelectedNoteId,
        theme,
        toggleTheme,
        earnPoints,
        completeDailyChallenge,
        markNoteCompleted,
        recordQuizResult,
        markProgramSolved,
        toggleInterviewMastered,
        toggleInterviewBookmark,
        toasts,
        setDailyGoalTarget,
        claimDailyGoalBonus,
        dailyGoalCompletedCount,
        removeToast,
        resetProgress,
        isAuthenticated,
        currentUser,
        login,
        logout,
        levelInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
