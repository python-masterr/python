import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { SectionId } from '../types';
import { Sparkles, Sun, Moon, Flame, Trophy, Download, LogOut } from 'lucide-react';
import { InstallAppModal } from './InstallAppModal';

export const Header: React.FC = () => {
  const { activeSection, setActiveSection, stats, theme, toggleTheme, currentUser, logout } = useUser();
  const [showInstallModal, setShowInstallModal] = useState(false);

  const navLinks: Array<{ id: SectionId; label: string; icon: string }> = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'notes', label: 'Notes', icon: '📚' },
    { id: 'programs', label: 'Programs', icon: '💻' },
    { id: 'quiz', label: 'Quiz', icon: '❓' },
    { id: 'interview', label: 'Interview', icon: '🎤' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0b1329]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => setActiveSection('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-slate-900 border border-slate-700/80">
            <img
              src="/app-icon.png"
              alt="Python Master App Icon"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
              Python Master
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-sky-600 dark:text-amber-300 bg-sky-50 dark:bg-slate-800/80 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Streak & XP indicators */}
          <div className="hidden sm:flex items-center gap-3 px-3 py-1 bg-slate-100 dark:bg-slate-800/70 rounded-lg text-xs font-semibold">
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span className="tabular-nums">{stats.streak}d</span>
            </div>
            <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
            <div className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
              <Trophy className="w-3.5 h-3.5 text-sky-500" />
              <span className="tabular-nums">{stats.points} XP</span>
            </div>
          </div>

          {/* Install App button */}
          <button
            onClick={() => setShowInstallModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap shrink-0"
            title="Install Python Master App on your device"
          >
            <Download className="w-3.5 h-3.5 text-sky-500 dark:text-[#FFD43B]" />
            <span className="hidden lg:inline">Install App</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Code Lab shortcut button */}
          <button
            onClick={() => setActiveSection('programs')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-[#FFD43B] hover:bg-[#ffe066] active:scale-98 rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Code Lab</span>
          </button>

          {/* User Sign Out */}
          {currentUser && (
            <button
              onClick={logout}
              title={`Sign out (${currentUser.email})`}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* PWA Install Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </header>
  );
};
