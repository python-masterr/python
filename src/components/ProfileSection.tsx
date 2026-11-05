import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { achievementsList } from '../data/achievementsData';
import { Trophy, Award, Flame, BookOpen, Terminal, CheckCircle2, RotateCcw, Share2, Sparkles, User, ShieldCheck, Download, LogOut } from 'lucide-react';
import { InstallAppModal } from './InstallAppModal';

export const ProfileSection: React.FC = () => {
  const { stats, levelInfo, resetProgress, logout, currentUser } = useUser();
  const [showCertificate, setShowCertificate] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const quizAccuracy =
    stats.quizStats.totalAttempted > 0
      ? Math.round((stats.quizStats.correctCount / stats.quizStats.totalAttempted) * 100)
      : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md border-2 border-[#FFD43B] bg-slate-900 flex items-center justify-center shrink-0">
                <img
                  src="/app-icon.png"
                  alt="Python Master App Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[10px] shadow-sm">
                Lvl {levelInfo.level}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {stats.userName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFD43B]/20 text-[#3776AB] dark:text-[#FFD43B] border border-[#FFD43B]/40">
                  {levelInfo.rank} Rank
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {currentUser?.email || 'Logged In User'} · Active Coding Cadence
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{stats.streak} Day Streak</span>
                </span>
                <span>·</span>
                <span className="font-bold text-[#3776AB] dark:text-[#FFD43B]">
                  {stats.points} XP Earned
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setShowInstallModal(true)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-sky-500 dark:text-[#FFD43B]" />
              <span>Install App</span>
            </button>

            <button
              onClick={() => setShowCertificate(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-[#FFD43B] hover:bg-[#ffe066] active:scale-95 transition-all shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>View Certificate</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Sign out of your account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <BookOpen className="w-3.5 h-3.5 text-sky-500" />
              <span>Completed Notes</span>
            </div>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
              {stats.completedNotes.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">14 curriculum topics</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span>Programs Solved</span>
            </div>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
              {stats.solvedPrograms.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Executable sandboxes</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quiz Score</span>
            </div>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
              {quizAccuracy}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {stats.quizStats.correctCount}/{stats.quizStats.totalAttempted} answered
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Interview Readiness</span>
            </div>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
              {stats.masteredInterviews.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Technical Q&amp;As mastered</div>
          </div>
        </div>
      </div>

      {/* Trophy Room Achievements Showcase */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Trophy Room</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Earn badges by completing challenges, streaks, and curriculum milestones.
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {stats.unlockedAchievements.length} / {achievementsList.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {achievementsList.map((badge) => {
            const isUnlocked = stats.unlockedAchievements.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'border-emerald-300 dark:border-emerald-800/70 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 opacity-60'
                }`}
              >
                <div className="text-3xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0">
                  {badge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {badge.title}
                    </h3>
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                      +{badge.xpReward} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {badge.description}
                  </p>
                  <div className="mt-2 text-[10px] text-slate-400 font-medium">
                    {isUnlocked ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span>Requirement: {badge.requiredMetric}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone / Reset */}
      <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/30 dark:bg-rose-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
            Reset Learning Progress
          </h3>
          <p className="text-xs text-rose-700/80 dark:text-rose-300/70 mt-0.5">
            Clear your local streak, points, and solved programs back to factory defaults.
          </p>
        </div>

        {showResetConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetProgress();
                setShowResetConfirm(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all shadow-xs"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100/50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        )}
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full p-8 rounded-3xl bg-[#0f172a] text-white border-4 border-[#FFD43B] shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block p-3 rounded-2xl bg-gradient-to-tr from-[#3776AB] to-[#FFD43B] text-4xl shadow-md">
                🐍
              </div>
              <h2 className="text-xs uppercase tracking-widest text-[#FFD43B] font-extrabold">
                Certificate of Technical Competency
              </h2>
              <p className="text-2xl sm:text-3xl font-black text-slate-100">
                Python Master Graduate
              </p>
            </div>

            <div className="text-center space-y-3 py-4 border-y border-slate-700/80">
              <p className="text-xs text-slate-400">This credential certifies that</p>
              <h3 className="text-2xl font-bold text-[#FFD43B] tracking-wide">
                {stats.userName}
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                has demonstrated foundational mastery in Python language specifications, algorithmic data structures, object-oriented software design, and syntax problem-solving.
              </p>
            </div>

            <div className="grid grid-cols-3 text-center gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">TOTAL POINTS</span>
                <span className="text-base font-bold text-[#FFD43B]">{stats.points} XP</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CURRENT RANK</span>
                <span className="text-base font-bold text-slate-200">{levelInfo.rank}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ISSUE DATE</span>
                <span className="text-base font-bold text-slate-200">{new Date().toISOString().slice(0, 10)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-[#FFD43B] hover:bg-[#ffe066] active:scale-95 transition-all shadow-md"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Install App Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};
