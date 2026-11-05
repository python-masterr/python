export type SectionId = 'home' | 'notes' | 'programs' | 'quiz' | 'interview' | 'profile';

export interface NoteTopic {
  id: string;
  title: string;
  category: 'Basics' | 'Data Structures' | 'Control Flow' | 'OOP' | 'Advanced' | 'Web & APIs';
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  content: string[];
  keyPoints: string[];
  codeExample: string;
  expectedOutput: string;
  miniQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface ProgramItem {
  id: string;
  title: string;
  category: 'Fundamentals' | 'Math & Algorithms' | 'Applications' | 'Games & Utilities' | 'OOP & Data';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
  defaultInput?: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'Core Python' | 'Data Structures' | 'OOP & Design' | 'Memory & GIL' | 'Advanced & Concurrency' | 'Web & Frameworks';
  difficulty: 'Junior' | 'Mid' | 'Senior';
  question: string;
  answer: string;
  codeSnippet?: string;
  keyTakeaway: string;
  frequency: 'High' | 'Medium' | 'Critical';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  requiredMetric: string;
}

export interface UserStats {
  points: number;
  streak: number;
  lastActiveDate: string;
  completedNotes: string[];
  solvedPrograms: string[];
  quizStats: {
    totalAttempted: number;
    correctCount: number;
    highestStreak: number;
  };
  masteredInterviews: string[];
  bookmarkedInterviews: string[];
  unlockedAchievements: string[];
  dailyChallengeCompletedDate: string;
  dailyGoalTarget: number;
  notesCompletedDates: Record<string, string>;
  dailyGoalClaimedDate?: string;
  userName: string;
  avatarSeed: string;
}
