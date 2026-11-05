import React from 'react';
import { useUser } from '../context/UserContext';
import { SectionId } from '../types';

export const MobileNav: React.FC = () => {
  const { activeSection, setActiveSection } = useUser();

  const navItems: Array<{ id: SectionId; label: string; icon: string }> = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'notes', label: 'Notes', icon: '📚' },
    { id: 'programs', label: 'Programs', icon: '💻' },
    { id: 'quiz', label: 'Quiz', icon: '❓' },
    { id: 'interview', label: 'Interview', icon: '🎤' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#11192e]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center justify-center min-w-[48px] py-1 px-1 rounded-lg transition-transform active:scale-95 ${
                isActive ? 'text-sky-600 dark:text-amber-400 font-bold' : 'text-slate-500 dark:text-slate-400 font-normal'
              }`}
            >
              <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'opacity-80'}`}>{item.icon}</span>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-amber-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
