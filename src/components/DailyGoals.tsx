import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import {
  Target,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Sparkles,
  BookOpen,
  Flame,
  Plus,
  Minus,
  Check
} from 'lucide-react';

export const DailyGoals: React.FC = () => {
  const {
    stats,
    setDailyGoalTarget,
    claimDailyGoalBonus,
    dailyGoalCompletedCount,
    setActiveSection,
    setSelectedNoteId,
  } = useUser();

  const target = stats.dailyGoalTarget || 3;
  const progressPercent = Math.min(100, Math.round((dailyGoalCompletedCount / target) * 100));
  const isGoalReached = dailyGoalCompletedCount >= target;
  const todayStr = new Date().toISOString().slice(0, 10);
  const isBonusClaimed = stats.dailyGoalClaimedDate === todayStr;

  const targetPresets = [1, 2, 3, 5];

  // SVG circular geometry
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~314.159
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleStartNextLesson = () => {
    setActiveSection('notes');
  };

  const handleAdjustTarget = (delta: number) => {
    const newTarget = Math.max(1, Math.min(10, target + delta));
    setDailyGoalTarget(newTarget);
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs flex flex-col justify-between relative overflow-hidden">
      {/* Background glow when goal is completed */}
      {isGoalReached && (
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
      )}

      <div>
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-500/20">
              <Target className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>Daily Learning Goals</span>
                {isGoalReached && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                    Target Met 🎉
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Set and track your daily lesson targets
              </p>
            </div>
          </div>

          {/* Quick Target Options & Stepper */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-semibold px-1 hidden sm:inline">Target:</span>
            {targetPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => setDailyGoalTarget(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  target === preset
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-amber-300 shadow-xs scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title={`Set daily target to ${preset} ${preset === 1 ? 'lesson' : 'lessons'}`}
              >
                {preset}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />

            {/* Decrement / Increment buttons */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => handleAdjustTarget(-1)}
                disabled={target <= 1}
                className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-40 transition-colors"
                title="Decrease daily target"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleAdjustTarget(1)}
                disabled={target >= 10}
                className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-40 transition-colors"
                title="Increase daily target"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Circular Progress & Tracking Panel */}
        <div className="mt-5 p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center gap-6">
          {/* Percentage-Based Circular Progress Bar */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 130 130"
            >
              <defs>
                {/* Dynamic Gradient for the progress circle */}
                <linearGradient id="goalRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  {isGoalReached ? (
                    <>
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </>
                  ) : (
                    <>
                      <stop offset="0%" stopColor="#3776ab" />
                      <stop offset="50%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#ffd43b" />
                    </>
                  )}
                </linearGradient>
              </defs>

              {/* Background Inactive Circle Track */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-slate-200 dark:text-slate-700/60"
              />

              {/* Foreground Animated Progress Circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke="url(#goalRingGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Inner Content inside Circular Bar */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums leading-none tracking-tight">
                {progressPercent}%
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                {dailyGoalCompletedCount}/{target}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                Lessons
              </span>
            </div>
          </div>

          {/* Right Metrics & Lesson Checkpoints */}
          <div className="flex-1 space-y-3 w-full">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-500" />
                <span>Today's Milestone</span>
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                {target} {target === 1 ? 'lesson' : 'lessons'} / day
              </span>
            </div>

            {/* Lesson Step Checkpoints */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {Array.from({ length: target }).map((_, i) => {
                const isFinished = i < dailyGoalCompletedCount;
                return (
                  <div
                    key={i}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      isFinished
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold">
                      {isFinished ? <Check className="w-3.5 h-3.5 mx-auto" /> : `#${i + 1}`}
                    </span>
                    <span className="text-[9px] font-semibold truncate max-w-full">
                      {isFinished ? 'Done' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Motivational message */}
            <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 pt-1">
              {isGoalReached ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Goal crushed for today! Claim your bonus below.</span>
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>
                    Complete <strong className="text-slate-800 dark:text-slate-200">{target - dailyGoalCompletedCount}</strong> more {target - dailyGoalCompletedCount === 1 ? 'lesson' : 'lessons'} today to unlock the +30 XP bonus.
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400">
          Resets daily at midnight
        </span>

        {isGoalReached ? (
          <button
            onClick={claimDailyGoalBonus}
            disabled={isBonusClaimed}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isBonusClaimed
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-[#FFD43B] hover:bg-[#ffe066] text-slate-900 active:scale-95'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{isBonusClaimed ? 'Bonus Claimed (+30 XP)' : 'Claim +30 XP Bonus'}</span>
          </button>
        ) : (
          <button
            onClick={handleStartNextLesson}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 active:scale-95 transition-all shadow-sm"
          >
            <span>Start Next Lesson</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
