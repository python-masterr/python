import React from 'react';
import { useUser } from '../context/UserContext';
import { Sparkles, Trophy, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUser();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 text-white border border-slate-700/80 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="mt-0.5 p-1.5 rounded-lg bg-amber-400/20 text-amber-400 shrink-0">
            {toast.type === 'achievement' ? (
              <Trophy className="w-4 h-4 text-amber-400" />
            ) : toast.type === 'xp' ? (
              <Sparkles className="w-4 h-4 text-amber-300" />
            ) : (
              <Info className="w-4 h-4 text-sky-400" />
            )}
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <h4 className="text-xs font-bold text-amber-300 dark:text-amber-200 truncate">{toast.title}</h4>
            <p className="text-xs text-slate-300 dark:text-slate-200 mt-0.5 leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
