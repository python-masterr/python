import React from 'react';
import { useUser } from '../context/UserContext';
import { achievementsList } from '../data/achievementsData';
import { pythonNotes } from '../data/notesData';
import { Flame, Trophy, Sparkles, BookOpen, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';
import { DailyGoals } from './DailyGoals';
import { HomeCompiler } from './HomeCompiler';

export const HomeSection: React.FC = () => {
  const { stats, setActiveSection, setSelectedNoteId, setSelectedProgramId, completeDailyChallenge, levelInfo } = useUser();

  const isChallengeDone = stats.dailyChallengeCompletedDate === new Date().toISOString().slice(0, 10);

  // Find next unfinished note
  const nextNote = pythonNotes.find((n) => !stats.completedNotes.includes(n.id)) || pythonNotes[0];

  const handleContinueLearning = () => {
    setSelectedNoteId(nextNote.id);
    setActiveSection('notes');
  };

  const handleOpenProgram = (programId: string) => {
    setSelectedProgramId(programId);
    setActiveSection('programs');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Text Content */}
          <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
              <span>Welcome Back, {stats.userName}</span>
              <span className="text-slate-400">·</span>
              <span className="text-amber-500 dark:text-amber-300 font-bold">{levelInfo.rank} Rank</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
              Level {levelInfo.level}: {levelInfo.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Sharpen your Python craftsmanship through hands-on code execution, algorithmic problem sets, and interview prep.
            </p>

            {/* Streak & XP Metric Strip */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Streak</span>
                </div>
                <div className="mt-1 text-xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                  {stats.streak} <span className="text-xs font-medium text-slate-500">Days</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Trophy className="w-4 h-4 text-sky-500" />
                  <span>Total XP</span>
                </div>
                <div className="mt-1 text-xl font-extrabold text-[#3776AB] dark:text-[#FFD43B] tabular-nums">
                  {stats.points} <span className="text-xs font-medium text-slate-500">XP</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <span>Notes Done</span>
                </div>
                <div className="mt-1 text-xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                  {stats.completedNotes.length} <span className="text-xs font-medium text-slate-500">/ 14</span>
                </div>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Next Rank: Level {levelInfo.level + 1}</span>
                <span className="tabular-nums font-semibold text-slate-700 dark:text-slate-200">
                  {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP ({levelInfo.progressPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#3776AB] to-[#FFD43B] rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Banner Graphic */}
          <div className="lg:col-span-5 h-64 lg:h-full min-h-[220px] relative overflow-hidden bg-gradient-to-br from-slate-900 to-[#131d35] flex items-center justify-center p-4">
            <img
              src="/src/assets/images/python_master_banner_1793889355056.jpg"
              alt="Python Master Educational Illustration"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl shadow-inner opacity-90 hover:opacity-100 transition-opacity"
              onError={(e) => {
                // Fallback container in case image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none lg:rounded-r-2xl" />
            <div className="absolute bottom-4 left-6 right-6 text-white text-xs pointer-events-none drop-shadow">
              <span className="font-bold text-amber-300">🐍 Python 3.12 Engine</span>
              <p className="text-[11px] text-slate-200">Execute code directly in browser sandbox</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Daily Goals & Daily Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Daily Goals Component */}
        <DailyGoals />

        {/* Daily Challenge Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">Daily Challenge</h2>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                +20 XP
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Complete the <span className="font-semibold text-[#3776AB] dark:text-[#FFD43B]">Variables &amp; Dynamic Typing</span> lesson and review memory references in Python.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 font-mono">
              x = 100; y = 200; x, y = y, x  # Swapping values
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {isChallengeDone ? '✅ Completed today' : 'Expires in 16 hours'}
            </span>
            <button
              onClick={completeDailyChallenge}
              disabled={isChallengeDone}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isChallengeDone
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#FFD43B] hover:bg-[#ffe066] text-slate-900 active:scale-95'
              }`}
            >
              {isChallengeDone ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Claimed +20 XP</span>
                </>
              ) : (
                <>
                  <span>Complete +20 XP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Interactive Python Compiler */}
      <HomeCompiler />

      {/* Next Lesson Jump Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-sky-600 dark:text-sky-400">Recommended Next Lesson</span>
            <span>·</span>
            <span>{nextNote.readTime} read</span>
            <span>·</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">{nextNote.difficulty}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            {nextNote.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {nextNote.summary}
          </p>
        </div>

        <button
          onClick={handleContinueLearning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 active:scale-95 transition-all shadow-xs shrink-0"
        >
          <span>Resume Curriculum (+20 XP)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Featured Programs Spotlight */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Terminal className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Featured Code Programs</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Executable Python projects with live output console</p>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('programs')}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>View All (20+)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 'calculator', name: 'Calculator', icon: '🧮', desc: 'Arithmetic operations with division error guards' },
            { id: 'fibonacci', name: 'Fibonacci Series', icon: '🌀', desc: 'Recursive & iterative sequence generation' },
            { id: 'student-management', name: 'Student Management', icon: '🎓', desc: 'GPA analysis and honor roll generator' },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenProgram(item.id)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-amber-400 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-sky-500 dark:group-hover:text-amber-400 flex items-center gap-0.5">
                  <span>Run</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Trophy className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Achievements &amp; Badges</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unlocked {stats.unlockedAchievements.length} of {achievementsList.length} milestones
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('profile')}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>View Trophy Room</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {achievementsList.slice(0, 5).map((badge) => {
            const isUnlocked = stats.unlockedAchievements.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                  isUnlocked
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 opacity-60'
                }`}
              >
                <div className="text-2xl mb-1.5 filter drop-shadow-sm">{badge.icon}</div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{badge.title}</h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{badge.description}</p>
                <span className={`mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isUnlocked ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {isUnlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
