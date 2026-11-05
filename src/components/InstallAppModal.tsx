import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Monitor, Apple, CheckCircle2, X } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-700 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-slate-700 bg-slate-900 shrink-0">
            <img src="/app-icon.png" alt="Python Master" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
              <span>Install Python Master</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                PWA
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Run offline with instant loading and native desktop/mobile icon.
            </p>
          </div>
        </div>

        {/* Already installed state */}
        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold block">Python Master is Already Installed!</span>
              <span>You are running the standalone application from your device home screen.</span>
            </div>
          </div>
        ) : (
          <>
            {/* Direct 1-Click Install Button if supported */}
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-900 bg-[#FFD43B] hover:bg-[#ffe066] active:scale-98 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Install Python Master App Now</span>
              </button>
            )}

            {/* Platform Guides */}
            <div className="space-y-3 text-xs text-slate-300">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                Installation Instructions by Device:
              </h3>

              {/* Android / Chrome */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200 block">Android &amp; Chrome / Edge</span>
                  <span className="text-slate-400">
                    Tap the <strong>Install</strong> button above, or click the browser menu (⋮) and tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong>.
                  </span>
                </div>
              </div>

              {/* iOS Safari */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                isIOS
                  ? 'bg-amber-950/30 border-amber-600/60 text-amber-200'
                  : 'bg-slate-800/60 border-slate-700/60'
              }`}>
                <Apple className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200 block">iPhone &amp; iPad (Safari)</span>
                  <span className="text-slate-400">
                    1. Tap the <strong>Share</strong> icon (box with upward arrow) in the Safari bottom bar.<br />
                    2. Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.<br />
                    3. Tap <strong>Add</strong> in the top right corner.
                  </span>
                </div>
              </div>

              {/* Desktop Windows & Mac */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                <Monitor className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200 block">Windows, macOS &amp; Linux</span>
                  <span className="text-slate-400">
                    Click the <strong>Install</strong> icon in your browser URL address bar (next to the bookmark star) to create a native desktop app window.
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
