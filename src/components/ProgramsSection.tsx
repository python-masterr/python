import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { pythonPrograms } from '../data/programsData';
import { ProgramItem } from '../types';
import { MonacoPythonEditor, ExecutionEngine } from './MonacoPythonEditor';
import { Terminal } from './Terminal';
import { executePythonCode, ExecutionResult } from '../utils/pythonInterpreter';
import { pyodideWorkerManager } from '../utils/pyodideWorkerRunner';
import { InstallAppModal } from './InstallAppModal';
import {
  Terminal as TerminalIcon,
  Search,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Download,
  PlusCircle,
  FileCode2,
  Cpu,
  Server
} from 'lucide-react';

const customSnippetProgram: ProgramItem = {
  id: 'custom-playground',
  title: '✨ Custom Python Playground',
  category: 'Fundamentals',
  difficulty: 'Beginner',
  timeComplexity: 'O(1)',
  spaceComplexity: 'O(1)',
  description: 'Write, edit, and experiment with your own custom Python 3 snippets in Monaco Editor with Pyodide WebAssembly Web Worker execution.',
  code: `# Write or paste any Python snippet here!
import math

def calculate_stats(numbers):
    total = sum(numbers)
    count = len(numbers)
    mean = total / count
    variance = sum((x - mean) ** 2 for x in numbers) / count
    std_dev = math.sqrt(variance)
    return {
        "count": count,
        "sum": total,
        "mean": round(mean, 2),
        "std_dev": round(std_dev, 2)
    }

data = [12, 45, 67, 89, 34, 23, 78, 90, 56, 43]
print("🐍 Pyodide Web Worker Computing Stats:")
results = calculate_stats(data)

for k, v in results.items():
    print(f"  • {k.replace('_', ' ').title()}: {v}")
`,
  explanation: 'This custom scratchpad executes your Python code directly inside the browser using Pyodide WebAssembly in an isolated background Web Worker thread, or switches to native Linux backend execution.',
};

export const ProgramsSection: React.FC = () => {
  const { stats, markProgramSolved, selectedProgramId, setSelectedProgramId } = useUser();

  const [currentProgId, setCurrentProgId] = useState<string>(
    selectedProgramId || pythonPrograms[0].id
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeEngine, setActiveEngine] = useState<ExecutionEngine>('pyodide-worker');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult>({
    output: [],
  });

  // Sync when selectedProgramId changes from outside
  useEffect(() => {
    if (selectedProgramId) {
      setCurrentProgId(selectedProgramId);
    }
  }, [selectedProgramId]);

  const allAvailablePrograms = [customSnippetProgram, ...pythonPrograms];

  const currentProgram: ProgramItem =
    allAvailablePrograms.find((p) => p.id === currentProgId) || pythonPrograms[0];

  const categories = ['All', 'Fundamentals', 'Math & Algorithms', 'Applications', 'Games & Utilities', 'OOP & Data'];

  const filteredPrograms = allAvailablePrograms.filter((prog) => {
    const matchesCat = selectedCategory === 'All' || prog.category === selectedCategory || prog.id === 'custom-playground';
    const matchesQuery =
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleSelectProgram = (id: string) => {
    setCurrentProgId(id);
    setSelectedProgramId(id);
    setExecutionResult({ output: [] });
  };

  const handleRunCode = async (codeToRun: string, engine: ExecutionEngine) => {
    setIsRunning(true);
    setActiveEngine(engine);

    try {
      let result: ExecutionResult;

      if (engine === 'pyodide-worker') {
        try {
          result = await pyodideWorkerManager.runCode(codeToRun);
        } catch (workerErr: any) {
          console.warn('Pyodide Worker encountered an error, falling back to backend:', workerErr);
          // Graceful fallback to backend engine if worker fails
          result = await executePythonCode(codeToRun);
          result.error = result.error
            ? `(Pyodide Worker unavailable: ${workerErr.message})\n${result.error}`
            : result.error;
        }
      } else {
        // Native Linux Backend execution
        result = await executePythonCode(codeToRun);
      }

      setExecutionResult(result);

      // Award XP and solve status
      if (currentProgram.id !== 'custom-playground') {
        markProgramSolved(currentProgram.id);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const isSolved = stats.solvedPrograms.includes(currentProgram.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar with Install App Option */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <TerminalIcon className="w-4 h-4" />
            <span>Monaco Python Lab</span>
            <span className="text-slate-400">·</span>
            <span className="flex items-center gap-1 text-sky-500 dark:text-sky-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>Pyodide Web Worker (Wasm)</span>
            </span>
            <span className="text-slate-400">·</span>
            <span>{stats.solvedPrograms.length} of {pythonPrograms.length} Solved</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Python Programs &amp; Monaco Sandbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Write, edit, and run Python code snippets directly in the browser with Monaco Editor and Pyodide Web Worker.
          </p>
        </div>

        {/* Action Controls: Install App + Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Prominent Install App Button */}
          <button
            onClick={() => setShowInstallModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-900 bg-[#FFD43B] hover:bg-[#ffe066] active:scale-95 rounded-xl shadow-xs transition-all shrink-0"
            title="Install Python Master as a Desktop or Mobile Progressive Web App"
          >
            <Download className="w-4 h-4" />
            <span>Install App</span>
          </button>

          {/* Search */}
          <div className="relative sm:w-60 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Programs List + Monaco IDE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-3">
          {/* Custom Scratchpad Quick CTA */}
          <button
            onClick={() => handleSelectProgram('custom-playground')}
            className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
              currentProgId === 'custom-playground'
                ? 'border-sky-500 bg-sky-500/10 text-sky-400 shadow-xs'
                : 'border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 bg-white/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-bold">
              <PlusCircle className="w-4 h-4 text-sky-500" />
              <span>+ Custom Snippet Scratchpad</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-mono">
              Pyodide
            </span>
          </button>

          {/* Categories */}
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

          {/* Program Items */}
          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredPrograms.map((prog) => {
              const isSelected = prog.id === currentProgram.id;
              const solved = stats.solvedPrograms.includes(prog.id);

              return (
                <div
                  key={prog.id}
                  onClick={() => handleSelectProgram(prog.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-sky-500/80 dark:border-amber-400/80 bg-sky-50/70 dark:bg-slate-800 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#131d35] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">
                      {prog.id === 'custom-playground' ? (
                        <FileCode2 className="w-4 h-4 text-sky-400" />
                      ) : solved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 inline-block" />
                      )}
                    </span>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {prog.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {prog.category} · {prog.difficulty}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-sky-600 dark:text-amber-400 translate-x-0.5' : 'text-slate-400'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sandbox IDE with Monaco Editor */}
        <div className="lg:col-span-8 space-y-5">
          {/* Program Overview Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-sky-600 dark:text-amber-400">{currentProgram.category}</span>
                  <span>·</span>
                  <span>{currentProgram.difficulty}</span>
                  <span>·</span>
                  <span className="font-mono text-slate-400">Time: {currentProgram.timeComplexity}</span>
                  <span>·</span>
                  <span className="font-mono text-slate-400">Space: {currentProgram.spaceComplexity}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {currentProgram.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {currentProgram.id === 'custom-playground' ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-800/30">
                    <Cpu className="w-3.5 h-3.5 text-sky-400" />
                    <span>Freeform Monaco Scratchpad</span>
                  </span>
                ) : isSolved ? (
                  <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Solved (+15 XP)</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run to solve (+15 XP)</span>
                  </span>
                )}
              </div>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentProgram.description}
            </p>
          </div>

          {/* Monaco Editor Component with Pyodide Web Worker */}
          <MonacoPythonEditor
            initialCode={currentProgram.code}
            onRun={handleRunCode}
            isRunning={isRunning}
            title={currentProgram.title}
          />

          {/* Execution Terminal */}
          <Terminal
            output={executionResult.output}
            error={executionResult.error}
            executionTimeMs={executionResult.executionTimeMs}
            onClear={() => setExecutionResult({ output: [] })}
            isRunning={isRunning}
            engineLabel={activeEngine === 'pyodide-worker' ? '⚡ Pyodide Wasm Worker' : '🐍 Linux Backend'}
          />

          {/* Explanation Footer with Worker info */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100">How it works: </span>
              <span>{currentProgram.explanation}</span>
            </div>
            <button
              onClick={() => setShowInstallModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App for Offline Python</span>
            </button>
          </div>
        </div>
      </div>

      {/* PWA Install Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};
