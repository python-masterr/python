import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { interviewQuestions } from '../data/interviewData';
import { InterviewQuestion } from '../types';
import { MessageSquare, Search, Bookmark, BookmarkCheck, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Star } from 'lucide-react';

export const InterviewSection: React.FC = () => {
  const { stats, toggleInterviewMastered, toggleInterviewBookmark } = useUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(interviewQuestions[0].id);

  const categories = [
    'All',
    'Core Python',
    'Data Structures',
    'OOP & Design',
    'Memory & GIL',
    'Advanced & Concurrency',
    'Web & Frameworks',
  ];

  const difficulties = ['All', 'Junior', 'Mid', 'Senior'];

  const filteredQuestions = interviewQuestions.filter((q) => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const matchesBookmark = !onlyBookmarked || stats.bookmarkedInterviews.includes(q.id);
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDifficulty && matchesBookmark && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>500+ Interview Prep Collection</span>
            <span className="text-slate-400">·</span>
            <span>{stats.masteredInterviews.length} Mastered</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Technical Python Interview Questions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deep dive into questions asked by top tech engineering panels.
          </p>
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] text-xs">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-semibold mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level and Bookmark toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
              onlyBookmarked
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Saved ({stats.bookmarkedInterviews.length})</span>
          </button>
        </div>
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] text-slate-500">
            <p className="text-sm font-semibold">No interview questions match your current filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setOnlyBookmarked(false);
                setSearchQuery('');
              }}
              className="mt-3 px-3 py-1.5 text-xs font-bold text-sky-600 dark:text-amber-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            const isMastered = stats.masteredInterviews.includes(q.id);
            const isBookmarked = stats.bookmarkedInterviews.includes(q.id);

            return (
              <div
                key={q.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131d35] shadow-sm'
                    : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#131d35] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {q.category}
                      </span>
                      <span>·</span>
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        {q.difficulty}
                      </span>
                      <span>·</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          q.frequency === 'Critical'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : q.frequency === 'High'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {q.frequency} Frequency
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      Q. {q.question}
                    </h3>
                  </div>

                  {/* Actions & Chevron */}
                  <div className="flex items-center gap-2 shrink-0 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleInterviewBookmark(q.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleInterviewMastered(q.id);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        isMastered
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-500' : ''}`} />
                      <span className="hidden sm:inline">{isMastered ? 'Mastered (+10 XP)' : 'Mark Mastered'}</span>
                    </button>

                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed animate-in fade-in duration-200">
                    <div className="whitespace-pre-wrap">{q.answer}</div>

                    {q.codeSnippet && (
                      <div className="rounded-xl border border-slate-700 bg-[#0d1527] p-4 font-mono text-xs text-slate-200 overflow-x-auto shadow-inner leading-relaxed">
                        <pre>{q.codeSnippet}</pre>
                      </div>
                    )}

                    <div className="p-3.5 rounded-xl bg-sky-50/70 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/60 text-xs text-sky-900 dark:text-sky-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Interviewer Tip: </span>
                        <span>{q.keyTakeaway}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
