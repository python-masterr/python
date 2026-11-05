import React from 'react';
import { Terminal as TerminalIcon, Clock, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface TerminalProps {
  output: string[];
  error?: string;
  executionTimeMs?: number;
  onClear: () => void;
  isRunning?: boolean;
  engineLabel?: string;
}

export const Terminal: React.FC<TerminalProps> = ({
  output,
  error,
  executionTimeMs,
  onClear,
  isRunning = false,
  engineLabel = 'Pyodide Worker',
}) => {
  return (
    <div className="rounded-xl border border-slate-700/80 bg-[#090d19] overflow-hidden shadow-lg flex flex-col font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <TerminalIcon className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold text-slate-200">Terminal Output</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
            {engineLabel}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          {executionTimeMs !== undefined && !isRunning && (
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{executionTimeMs} ms</span>
            </div>
          )}

          {error ? (
            <div className="flex items-center gap-1 text-rose-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Failed</span>
            </div>
          ) : output.length > 0 && !isRunning ? (
            <div className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Success</span>
            </div>
          ) : null}

          <button
            onClick={onClear}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Clear Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Content Screen */}
      <div className="p-4 min-h-[140px] max-h-[320px] overflow-auto text-slate-200 space-y-1 selection:bg-sky-500/30">
        {isRunning ? (
          <div className="flex items-center gap-2 text-amber-400 animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
            <span>Executing Python program...</span>
          </div>
        ) : output.length === 0 && !error ? (
          <div className="text-slate-500 italic">
            Click &quot;Run Code&quot; to execute and see standard output here.
          </div>
        ) : (
          <>
            {output.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap leading-relaxed text-slate-100 flex items-start gap-2">
                <span className="text-slate-600 select-none text-[11px] min-w-[1.5rem]">{idx + 1}</span>
                <span className="flex-1">{line}</span>
              </div>
            ))}

            {error && (
              <div className="mt-3 p-2.5 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300 whitespace-pre-wrap leading-relaxed font-mono">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
