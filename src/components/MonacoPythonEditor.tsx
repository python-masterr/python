import React, { useState, useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal as TerminalIcon,
  Sparkles,
  Cpu,
  Server,
  Download,
  Code2,
  FileCode2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PyodideWorkerStatus, pyodideWorkerManager } from '../utils/pyodideWorkerRunner';
import { InstallAppModal } from './InstallAppModal';

export type ExecutionEngine = 'pyodide-worker' | 'backend-python';

interface MonacoPythonEditorProps {
  initialCode: string;
  onRun: (code: string, engine: ExecutionEngine) => void;
  isRunning?: boolean;
  title?: string;
  readOnly?: boolean;
}

export const MonacoPythonEditor: React.FC<MonacoPythonEditorProps> = ({
  initialCode,
  onRun,
  isRunning = false,
  title = 'Python Workspace',
  readOnly = false,
}) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [engine, setEngine] = useState<ExecutionEngine>('pyodide-worker');
  const [workerStatus, setWorkerStatus] = useState<PyodideWorkerStatus>('uninitialized');
  const [workerMsg, setWorkerMsg] = useState<string>('');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const editorRef = useRef<any>(null);

  // Sync initialCode changes (e.g., when clicking another program in the list)
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  // Subscribe to Pyodide Worker lifecycle
  useEffect(() => {
    // Pre-initialize Pyodide worker on mount
    pyodideWorkerManager.initWorker();

    const unsubscribe = pyodideWorkerManager.subscribe((status, msg) => {
      setWorkerStatus(status);
      setWorkerMsg(msg);
    });

    return unsubscribe;
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(initialCode);
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define Ctrl+Enter or Cmd+Enter to execute code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun(editor.getValue(), engine);
    });
  };

  const handleRun = () => {
    onRun(code, engine);
  };

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-[#0d1527] overflow-hidden shadow-xl flex flex-col transition-all">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/95 border-b border-slate-800 text-xs select-none">
        {/* Left: Program Title & File Badge */}
        <div className="flex items-center gap-2.5 font-mono">
          <div className="p-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100">{title}</span>
              <span className="text-slate-500">·</span>
              <span className="text-[11px] text-slate-400 font-semibold">main.py</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-sans">
              Monaco Code Editor
            </span>
          </div>
        </div>

        {/* Center: Engine Switcher Pill */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => setEngine('pyodide-worker')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              engine === 'pyodide-worker'
                ? 'bg-sky-600/90 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Runs locally in browser using Pyodide WebAssembly Web Worker"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-300" />
            <span>Pyodide Worker (Wasm)</span>
            {workerStatus === 'ready' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setEngine('backend-python')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              engine === 'backend-python'
                ? 'bg-amber-600/90 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Runs on the backend Linux server using native Python 3"
          >
            <Server className="w-3.5 h-3.5 text-amber-300" />
            <span>Backend Python 3</span>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Install App Quick Action */}
          <button
            type="button"
            onClick={() => setShowInstallModal(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all font-sans text-xs font-semibold"
            title="Install Python Master as a Desktop or Mobile App"
          >
            <Download className="w-3.5 h-3.5 text-[#FFD43B]" />
            <span>Install App</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {!readOnly && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-colors"
              title="Reset Code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          {/* Run Code Button */}
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning || (engine === 'pyodide-worker' && workerStatus === 'loading')}
            className="flex items-center gap-1.5 px-4 py-1.5 font-bold text-slate-900 bg-[#FFD43B] hover:bg-[#ffe066] active:scale-95 disabled:opacity-60 rounded-xl shadow-md transition-all font-sans"
          >
            {isRunning ? (
              <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-slate-900" />
            )}
            <span>
              {isRunning
                ? 'Executing...'
                : engine === 'pyodide-worker' && workerStatus === 'loading'
                ? 'Loading Wasm...'
                : 'Run Snippet'}
            </span>
          </button>
        </div>
      </div>

      {/* Pyodide Worker Status Sub-banner (visible when initializing or if error) */}
      {engine === 'pyodide-worker' && (
        <div className="px-4 py-1.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            {workerStatus === 'ready' ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pyodide WebAssembly Worker Active (Isolated Client Thread)</span>
              </span>
            ) : workerStatus === 'loading' ? (
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                <span>{workerMsg || 'Downloading & Initializing Pyodide WebAssembly...'}</span>
              </span>
            ) : workerStatus === 'error' ? (
              <span className="flex items-center gap-1.5 text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Pyodide Worker Offline: {workerMsg} (Switch to Backend Engine)</span>
              </span>
            ) : (
              <span className="text-slate-400">Pyodide Web Worker Standby</span>
            )}
          </div>

          <span className="text-slate-500 hidden sm:inline">CPython 3.12 · WebAssembly</span>
        </div>
      )}

      {/* Monaco Editor Container */}
      <div className="relative min-h-[340px] max-h-[520px] h-[380px] bg-[#0a0f1d]">
        <Editor
          height="100%"
          defaultLanguage="python"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(newVal) => setCode(newVal || '')}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full text-slate-400 font-mono text-xs gap-2">
              <span className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <span>Loading Monaco Editor...</span>
            </div>
          }
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            contextmenu: true,
            readOnly: readOnly,
            padding: { top: 14, bottom: 14 },
            bracketPairColorization: { enabled: true },
            guides: { indentation: true },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
          }}
        />
      </div>

      {/* Editor Footer Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#090e1c] border-t border-slate-800 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-slate-300">
            <Sparkles className="w-3 h-3 text-[#FFD43B]" />
            <span>
              Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded text-[10px] border border-slate-700">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded text-[10px] border border-slate-700">Enter</kbd> to run
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500">
            Engine: {engine === 'pyodide-worker' ? '⚡ Pyodide Worker (Wasm)' : '🐍 Native Linux Backend'}
          </span>
          <button
            type="button"
            onClick={() => setShowInstallModal(true)}
            className="sm:hidden text-sky-400 hover:text-sky-300 flex items-center gap-1 font-sans"
          >
            <Download className="w-3 h-3" />
            <span>Install</span>
          </button>
        </div>
      </div>

      {/* Install App Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};
