import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal as TerminalIcon, Sparkles } from 'lucide-react';

interface CodeEditorProps {
  initialCode: string;
  onRun: (code: string) => void;
  isRunning?: boolean;
  title?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  onRun,
  isRunning = false,
  title = 'Python Workspace',
  readOnly = false,
}) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(initialCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun(code);
    }
    // Handle tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const lines = code.split('\n');

  return (
    <div className="rounded-xl border border-slate-700/80 bg-[#0d1527] overflow-hidden shadow-lg flex flex-col">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs select-none">
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <TerminalIcon className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold text-slate-200">{title}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">main.py</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {!readOnly && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded transition-colors"
              title="Reset Code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={() => onRun(code)}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 font-bold text-slate-900 bg-[#FFD43B] hover:bg-[#ffe066] active:scale-95 disabled:opacity-60 rounded shadow-xs transition-all"
          >
            {isRunning ? (
              <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-slate-900" />
            )}
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body with line numbers */}
      <div className="relative flex font-mono text-[13px] leading-relaxed min-h-[180px] max-h-[460px] overflow-auto">
        {/* Line Numbers */}
        <div className="py-3 px-3 bg-[#0a0f1d] text-slate-600 select-none text-right font-mono text-xs border-r border-slate-800/80 min-w-[3rem]">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          className="w-full h-full min-h-[180px] p-3 bg-transparent text-slate-100 font-mono resize-none focus:outline-none focus:ring-0 leading-relaxed overflow-x-auto whitespace-pre"
          placeholder="# Write Python code here..."
        />
      </div>

      {/* Quick shortcut info footer */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#090e1c] border-t border-slate-800/60 text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#FFD43B]" />
          <span>Press <kbd className="px-1 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">Enter</kbd> to execute</span>
        </span>
        <span>Python 3.12 (Sandbox Engine)</span>
      </div>
    </div>
  );
};
