import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { quizQuestions } from '../data/quizData';
import { triggerConfetti } from '../utils/confetti';
import { HelpCircle, CheckCircle2, XCircle, Flame, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

export const QuizSection: React.FC = () => {
  const { earnPoints, recordQuizResult } = useUser();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const topics = ['All', 'Fundamentals', 'Data Types', 'Lists & Mutability', 'OOP', 'Control Flow', 'Slicing'];

  const filteredQuestions = quizQuestions.filter(
    (q) => selectedTopic === 'All' || q.topic === selectedTopic
  );

  const activeQuestion = filteredQuestions[currentIndex % filteredQuestions.length];

  const handleSelectAnswer = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === activeQuestion.correctIndex;
    recordQuizResult(isCorrect);

    if (isCorrect) {
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      setSessionScore((prev) => prev + 1);

      // Base 10 XP + streak bonus (+5 XP if streak >= 3)
      const bonus = nextStreak >= 3 ? 5 : 0;
      const totalXp = 10 + bonus;

      earnPoints(totalXp, bonus > 0 ? `Correct! (+10 XP + ${bonus} Streak Bonus)` : 'Correct Answer!');

      if (nextStreak % 3 === 0) {
        triggerConfetti();
      }
    } else {
      setCurrentStreak(0);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsAnswered(false);
    setSelectedOption(null);
    setSessionScore(0);
    setCurrentStreak(0);
  };

  const isCorrect = isAnswered && selectedOption === activeQuestion.correctIndex;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Quiz Header Bar */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Python Knowledge Challenge</span>
              <span className="text-slate-400">·</span>
              <span>+10 XP per Correct Answer</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Interactive Quiz
            </h1>
          </div>

          {/* Quick Quiz Counters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs font-bold text-amber-700 dark:text-amber-300">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Streak: {currentStreak}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-xs font-bold text-sky-700 dark:text-sky-300">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>Score: {sessionScore}</span>
            </div>
          </div>
        </div>

        {/* Topic Filters */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedTopic(t);
                setCurrentIndex(0);
                setIsAnswered(false);
                setSelectedOption(null);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedTopic === t
                  ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs space-y-6">
        {/* Progress header */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800 pb-4">
          <span>
            Question {(currentIndex % filteredQuestions.length) + 1} of {filteredQuestions.length}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-slate-300">{activeQuestion.topic}</span>
            <span>·</span>
            <span className="text-amber-600 dark:text-amber-400">{activeQuestion.difficulty}</span>
          </div>
        </div>

        {/* Question Text */}
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
            {activeQuestion.question}
          </h2>

          {/* Optional Code Snippet */}
          {activeQuestion.codeSnippet && (
            <div className="mt-4 p-4 rounded-xl border border-slate-700 bg-[#0d1527] font-mono text-xs text-slate-200 overflow-x-auto shadow-inner leading-relaxed">
              <pre>{activeQuestion.codeSnippet}</pre>
            </div>
          )}
        </div>

        {/* Multiple Choice Options */}
        <div className="space-y-3">
          {activeQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isAnswerRight = idx === activeQuestion.correctIndex;

            let optionStyle =
              'border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-[#1e293b] hover:bg-slate-100 dark:hover:bg-[#334155] text-slate-800 dark:text-slate-100';

            if (isAnswered) {
              if (isAnswerRight) {
                optionStyle =
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-sm font-semibold';
              } else if (isSelected && !isAnswerRight) {
                optionStyle =
                  'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 shadow-sm';
              } else {
                optionStyle = 'opacity-50 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between group active:scale-99 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-200/80 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && isAnswerRight && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
                {isAnswered && isSelected && !isAnswerRight && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Result Bar */}
        {isAnswered && (
          <div
            className={`p-4 rounded-xl border transition-all ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-sm flex items-center gap-1.5">
                {isCorrect ? '✅ Correct! +10 XP' : '❌ Wrong Answer'}
              </span>
              {currentStreak >= 3 && isCorrect && (
                <span className="text-xs font-bold text-amber-500 dark:text-amber-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{currentStreak} Streak Bonus (+5 XP)</span>
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <span className="font-bold">Explanation: </span>
              {activeQuestion.explanation}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Session</span>
          </button>

          {isAnswered && (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-[#FFD43B] hover:bg-[#ffe066] active:scale-95 transition-all shadow-xs"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
