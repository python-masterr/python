import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { CodeEditor } from './CodeEditor';
import { Terminal } from './Terminal';
import { executePythonCode, ExecutionResult } from '../utils/pythonInterpreter';
import { Terminal as TerminalIcon, Sparkles, Play, RotateCcw, ArrowRight } from 'lucide-react';

const compilerSnippets: Record<string, { title: string; code: string; desc: string }> = {
  welcome: {
    title: 'Python Quickstart',
    desc: 'Variables, math, lists, and f-strings',
    code: `# Interactive Python Compiler
languages = ["Python", "Rust", "Go", "TypeScript"]
active_user = "Python Master"
skills_count = len(languages)

print(f"🐍 Hello, {active_user}!")
print("Compiled languages overview:")
for i, lang in enumerate(languages, 1):
    print(f"  {i}. {lang} (length: {len(lang)})")

# Math operations
radius = 4
area = 3.14159 * (radius ** 2)
print(f"\\nCalculated Circle Area (r={radius}): {round(area, 2)}")`,
  },
  primes: {
    title: 'Prime Numbers',
    desc: 'Prime sieve algorithm up to 30',
    code: `# Prime numbers sieve
def find_primes(limit):
    primes = []
    for num in range(2, limit + 1):
        is_p = True
        for i in range(2, int(num ** 0.5) + 1):
            if num % i == 0:
                is_p = False
                break
        if is_p:
            primes.append(num)
    return primes

result = find_primes(30)
print(f"Primes up to 30: {result}")
print(f"Count: {len(result)}")`,
  },
  fib: {
    title: 'Fibonacci Stream',
    desc: 'Dynamic iterative series generator',
    code: `# Fibonacci Sequence in Python
def get_fib(n):
    fib = [0, 1]
    while len(fib) < n:
        fib.append(fib[-1] + fib[-2])
    return fib

sequence = get_fib(10)
print(f"Fibonacci (first 10): {sequence}")
print(f"Sum of sequence: {sum(sequence)}")`,
  },
  scratchpad: {
    title: 'Blank Scratchpad',
    desc: 'Write custom Python code here',
    code: `# Write your custom Python code here
name = "World"
print(f"Hello, {name}!")

# Try loops, arithmetic, functions, or lists:
numbers = [1, 2, 3, 4, 5]
squares = [x * x for x in numbers]
print(f"Squares: {squares}")`,
  },
};

export const HomeCompiler: React.FC = () => {
  const { earnPoints, setActiveSection } = useUser();
  const [selectedSnippetKey, setSelectedSnippetKey] = useState<string>('welcome');
  const [code, setCode] = useState<string>(compilerSnippets.welcome.code);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult>({
    output: [
      '🐍 Python 3.12 Sandbox Ready.',
      'Click "Run Code" or press Ctrl+Enter to compile and run.',
    ],
    executionTimeMs: 0,
  });

  const handleSnippetChange = (key: string) => {
    setSelectedSnippetKey(key);
    setCode(compilerSnippets[key].code);
    setExecutionResult({ output: [] });
  };

  const handleRun = async (codeToRun: string) => {
    setIsRunning(true);
    const result = await executePythonCode(codeToRun);
    setExecutionResult(result);
    setIsRunning(false);

    // Give a small reward for running code in the compiler
    earnPoints(5, 'Compiler executed');
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d35] shadow-xs space-y-4">
      {/* Title & snippet selector bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <TerminalIcon className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Interactive Python Compiler</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFD43B]/20 text-[#3776AB] dark:text-[#FFD43B]">
                Python 3.12
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Run and test Python scripts directly on your dashboard
            </p>
          </div>
        </div>

        {/* Snippet Picker Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          {Object.entries(compilerSnippets).map(([key, snippet]) => (
            <button
              key={key}
              onClick={() => handleSnippetChange(key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedSnippetKey === key
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-amber-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {snippet.title}
            </button>
          ))}
        </div>
      </div>

      {/* Compiler Grid: Code Editor + Terminal Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Editor (7 cols) */}
        <div className="lg:col-span-7">
          <CodeEditor
            initialCode={code}
            onRun={handleRun}
            isRunning={isRunning}
            title={compilerSnippets[selectedSnippetKey].title}
          />
        </div>

        {/* Terminal (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <Terminal
            output={executionResult.output}
            error={executionResult.error}
            executionTimeMs={executionResult.executionTimeMs}
            onClear={() => setExecutionResult({ output: [] })}
            isRunning={isRunning}
          />

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="text-[11px]">
              Want full project templates?
            </span>
            <button
              onClick={() => setActiveSection('programs')}
              className="text-xs font-bold text-sky-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Explore 12+ Programs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
