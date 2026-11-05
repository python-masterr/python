import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { pythonNotes } from '../data/notesData';
import { NoteTopic } from '../types';
import { executePythonCode, ExecutionResult } from '../utils/pythonInterpreter';
import { BookOpen, CheckCircle2, Play, Terminal as TerminalIcon, ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';

export const NotesSection: React.FC = () => {
  const { stats, markNoteCompleted, selectedNoteId, setSelectedNoteId, setActiveSection, setSelectedProgramId } = useUser();

  const [currentNoteId, setCurrentNoteId] = useState<string>(
    selectedNoteId || pythonNotes[0].id
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [runningNoteCode, setRunningNoteCode] = useState(false);
  const [noteExecutionResult, setNoteExecutionResult] = useState<ExecutionResult | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const currentNote: NoteTopic =
    pythonNotes.find((n) => n.id === currentNoteId) || pythonNotes[0];

  const isCompleted = stats.completedNotes.includes(currentNote.id);

  // Filter notes
  const categories = ['All', 'Basics', 'Control Flow', 'Data Structures', 'OOP', 'Advanced', 'Web & APIs'];

  const filteredNotes = pythonNotes.filter((note) => {
    const matchesCat = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesQuery =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleSelectNote = (id: string) => {
    setCurrentNoteId(id);
    setSelectedNoteId(id);
    setNoteExecutionResult(null);
    setSelectedQuizOption(null);
    setQuizAnswered(false);
  };

  const handleRunCode = async () => {
    setRunningNoteCode(true);
    const result = await executePythonCode(currentNote.codeExample);
    setNoteExecutionResult(result);
    setRunningNoteCode(false);
  };

  const handleQuizSelect = (idx: number) => {
    if (quizAnswered) return;
    setSelectedQuizOption(idx);
    setQuizAnswered(true);
  };

  // Nav helpers
  const currentIndex = pythonNotes.findIndex((n) => n.id === currentNote.id);
  const prevNote = currentIndex > 0 ? pythonNotes[currentIndex - 1] : null;
  const nextNote = currentIndex < pythonNotes.length - 1 ? pythonNotes[currentIndex + 1] : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Interactive Curriculum</span>
            <span className="text-slate-400">·</span>
            <span>{stats.completedNotes.length} of {pythonNotes.length} Completed</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Python Concept Notes &amp; Tutorials
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Detailed guides with embedded executable code blocks and comprehension checks.
          </p>
        </div>

        {/* Search input */}
        <div className="sm:w-64">
          <input
            type="text"
            placeholder="Search topics (e.g. loops, OOP)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Main 2-column layout: Sidebar List + Reader Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topics Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Topics List */}
          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = note.id === currentNote.id;
              const completed = stats.completedNotes.includes(note.id);

              return (
                <div
                  key={note.id}
                  onClick={() => handleSelectNote(note.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-sky-500/80 dark:border-amber-400/80 bg-sky-50/70 dark:bg-slate-800 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#131d35] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base">
                      {completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 inline-block" />
                      )}
                    </span>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {note.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {note.category} · {note.readTime}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-sky-600 dark:text-amber-400 translate-x-0.5' : 'text-slate-400'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Note Reader Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs">
            {/* Note Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                  {currentNote.category}
                </span>
                <span>·</span>
                <span>{currentNote.readTime}</span>
                <span>·</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">{currentNote.difficulty}</span>
              </div>

              <button
                onClick={() => markNoteCompleted(currentNote.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shadow-xs ${
                  isCompleted
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-[#FFD43B] hover:bg-[#ffe066] text-slate-900 active:scale-95'
                }`}
              >
                {isCompleted ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Completed (+20 XP)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mark as Complete (+20 XP)</span>
                  </>
                )}
              </button>
            </div>

            {/* Note Title & Summary */}
            <div className="mt-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                {currentNote.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {currentNote.summary}
              </p>
            </div>

            {/* Main Content Paragraphs */}
            <div className="mt-6 space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentNote.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Key Takeaways */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
                Key Takeaways
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {currentNote.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Code Example */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-sky-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Interactive Python Sandbox Example
                  </span>
                </div>
                <button
                  onClick={handleRunCode}
                  disabled={runningNoteCode}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-900 bg-[#FFD43B] hover:bg-[#ffe066] active:scale-95 disabled:opacity-60 rounded-lg shadow-xs transition-all"
                >
                  <Play className="w-3 h-3 fill-slate-900" />
                  <span>{runningNoteCode ? 'Running...' : 'Run Example'}</span>
                </button>
              </div>

              {/* Code display */}
              <div className="rounded-xl border border-slate-700 bg-[#0d1527] p-4 font-mono text-xs text-slate-200 overflow-x-auto shadow-inner leading-relaxed">
                <pre>{currentNote.codeExample}</pre>
              </div>

              {/* Live Output if executed */}
              {noteExecutionResult && (
                <div className="mt-3 p-3.5 rounded-xl border border-slate-700 bg-[#090d19] font-mono text-xs text-slate-200 space-y-1">
                  <div className="text-[11px] text-slate-400 font-bold mb-1 flex items-center justify-between">
                    <span>Standard Output ({noteExecutionResult.executionTimeMs} ms):</span>
                    <span className="text-emerald-400">Execution Complete</span>
                  </div>
                  {noteExecutionResult.output.map((line, idx) => (
                    <div key={idx} className="text-emerald-300 whitespace-pre-wrap">
                      &gt; {line}
                    </div>
                  ))}
                  {noteExecutionResult.error && (
                    <div className="text-rose-400 whitespace-pre-wrap">{noteExecutionResult.error}</div>
                  )}
                </div>
              )}
            </div>

            {/* Mini-Quiz Checkpoint */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Knowledge Check</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {currentNote.miniQuiz.question}
              </h4>

              <div className="mt-3 space-y-2">
                {currentNote.miniQuiz.options.map((option, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === currentNote.miniQuiz.correctIndex;

                  let style = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700';
                  if (quizAnswered) {
                    if (isCorrect) {
                      style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizSelect(idx)}
                      disabled={quizAnswered}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${style}`}
                    >
                      <span>{option}</span>
                      {quizAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {quizAnswered && (
                <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Explanation: </span>
                  {currentNote.miniQuiz.explanation}
                </div>
              )}
            </div>

            {/* Bottom Lesson Pagination */}
            <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {prevNote ? (
                <button
                  onClick={() => handleSelectNote(prevNote.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-amber-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous: {prevNote.title}</span>
                </button>
              ) : <div />}

              {nextNote && (
                <button
                  onClick={() => handleSelectNote(nextNote.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-amber-400"
                >
                  <span>Next: {nextNote.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
