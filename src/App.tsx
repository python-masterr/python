/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { ToastContainer } from './components/ToastContainer';
import { HomeSection } from './components/HomeSection';
import { NotesSection } from './components/NotesSection';
import { ProgramsSection } from './components/ProgramsSection';
import { QuizSection } from './components/QuizSection';
import { InterviewSection } from './components/InterviewSection';
import { ProfileSection } from './components/ProfileSection';
import { AuthGateway } from './components/AuthGateway';

const MainContent: React.FC = () => {
  const { activeSection, isAuthenticated } = useUser();

  // Show Auth Gateway before opening app
  if (!isAuthenticated) {
    return (
      <>
        <AuthGateway />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0b1329] text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-[#FFD43B]/30 selection:text-slate-900 dark:selection:text-white">
      {/* Top Bar Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-12">
        {activeSection === 'home' && <HomeSection />}
        {activeSection === 'notes' && <NotesSection />}
        {activeSection === 'programs' && <ProgramsSection />}
        {activeSection === 'quiz' && <QuizSection />}
        {activeSection === 'interview' && <InterviewSection />}
        {activeSection === 'profile' && <ProfileSection />}
      </main>

      {/* Floating Toast Notifications */}
      <ToastContainer />

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Desktop & Tablet Quiet Footer */}
      <footer className="hidden md:block border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0c142b]/70 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🐍</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">Python Master</span>
            <span>—</span>
            <span>Interactive Python Learning &amp; Algorithmic Sandbox</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Python 3.12 Compatible</span>
            <span>·</span>
            <span>Browser-Sandboxed Execution</span>
            <span>·</span>
            <span>Open Source Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <UserProvider>
      <MainContent />
    </UserProvider>
  );
}
