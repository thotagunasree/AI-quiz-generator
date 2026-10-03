import React, { useState, useEffect } from 'react';
import './App.css';
import SignIn from './components/SignIn';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import Dashboard from './components/Dashboard';
import QuizGeneratorForm from './components/QuizGeneratorForm';
import PresetLibrary from './components/PresetLibrary';
import QuizPlayer from './components/QuizPlayer';
import QuizResults from './components/QuizResults';
import FlashcardMode from './components/FlashcardMode';
import SavedQuizzesModal from './components/SavedQuizzesModal';
import SettingsModal from './components/SettingsModal';
import StatsModal from './components/StatsModal';
import { generateAIQuiz } from './utils/aiGenerator';
import { getSettings, getStats } from './utils/storage';
import { soundManager } from './utils/soundEffects';

export default function App() {
  // ── Auth State ──────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('aiq_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  // ── Navigation ───────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'create' | 'presets' | 'saved' | 'results'
  const [viewMode, setViewMode] = useState('nav');          // 'nav' | 'playing' | 'results' | 'flashcards'

  // ── Quiz State ───────────────────────────────────────────────
  const [activeQuiz, setActiveQuiz]   = useState(null);
  const [resultData, setResultData]   = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // ── Modal State ──────────────────────────────────────────────
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen,    setIsStatsOpen]    = useState(false);

  // ── Settings / Stats ─────────────────────────────────────────
  const [settings, setSettings] = useState(getSettings());
  const [stats,    setStats]    = useState(getStats());
  const [muted,    setMuted]    = useState(!settings.soundEnabled);

  useEffect(() => {
    soundManager.setMuted(!settings.soundEnabled);
  }, []);

  // ── Auth Handlers ────────────────────────────────────────────
  const handleSignIn = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    soundManager.playClick();
    localStorage.removeItem('aiq_user');
    setUser(null);
    setActiveTab('dashboard');
    setViewMode('nav');
    setActiveQuiz(null);
    setResultData(null);
  };

  // ── Settings Handler ─────────────────────────────────────────
  const handleSettingsUpdated = (newSettings) => {
    setSettings(newSettings);
    setMuted(!newSettings.soundEnabled);
  };

  // ── Quiz Generation ──────────────────────────────────────────
  const handleGenerateQuiz = async (params) => {
    setIsGenerating(true);
    try {
      const quiz = await generateAIQuiz(params);
      setActiveQuiz(quiz);
      setViewMode('playing');
    } catch (err) {
      console.error('Quiz generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Start a Quiz (preset or saved) ───────────────────────────
  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setViewMode('playing');
  };

  // ── Start Flashcards ─────────────────────────────────────────
  const handleStartFlashcards = (quiz) => {
    setActiveQuiz(quiz);
    setViewMode('flashcards');
  };

  // ── Quiz Complete ────────────────────────────────────────────
  const handleQuizComplete = (result) => {
    setResultData(result);
    setStats(getStats());
    setViewMode('results');
  };

  // ── Exit Back to Nav ─────────────────────────────────────────
  const handleExitToNav = () => {
    setViewMode('nav');
    setActiveQuiz(null);
    setResultData(null);
  };

  // ── Navigate from Dashboard Quick Actions ────────────────────
  const handleDashboardNav = (quiz, tab) => {
    if (quiz && typeof quiz === 'object' && quiz.questions) {
      handleStartQuiz(quiz);
    } else if (tab) {
      setActiveTab(tab);
      setViewMode('nav');
    }
  };

  // ── Tab Change (from Sidebar) ─────────────────────────────────
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setViewMode('nav');
  };

  // ── If Not Signed In → Show Sign-In Page ────────────────────
  if (!user) {
    return (
      <>
        <SignIn onSignIn={handleSignIn} />
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSettingsUpdated={handleSettingsUpdated}
        />
      </>
    );
  }

  // ── Authenticated Dashboard Layout ───────────────────────────
  return (
    <div className="app-shell">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        muted={muted}
        setMuted={setMuted}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        stats={stats}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="app-main">
        {/* Top Header */}
        <DashboardHeader
          user={user}
          muted={muted}
          setMuted={setMuted}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          onLogout={handleLogout}
          stats={stats}
        />

        {/* Page Content */}
        <main className="app-content">
          {/* ── Quiz Playing Mode ── */}
          {viewMode === 'playing' && activeQuiz && (
            <QuizPlayer
              quiz={activeQuiz}
              onComplete={handleQuizComplete}
              onExit={handleExitToNav}
            />
          )}

          {/* ── Quiz Results Mode ── */}
          {viewMode === 'results' && resultData && (
            <QuizResults
              resultData={resultData}
              onRetake={() => setViewMode('playing')}
              onStudyFlashcards={() => setViewMode('flashcards')}
              onNavigateSaved={() => {
                setActiveTab('saved');
                setViewMode('nav');
              }}
            />
          )}

          {/* ── Flashcard Mode ── */}
          {viewMode === 'flashcards' && activeQuiz && (
            <FlashcardMode
              quiz={activeQuiz}
              onExit={handleExitToNav}
            />
          )}

          {/* ── Navigation Tabs ── */}
          {viewMode === 'nav' && (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  user={user}
                  stats={stats}
                  onCreateQuiz={() => setActiveTab('create')}
                  onPlayQuiz={(quiz) => {
                    if (quiz && quiz.questions) handleStartQuiz(quiz);
                  }}
                  onNavigateTab={handleTabChange}
                />
              )}

              {activeTab === 'create' && (
                <QuizGeneratorForm
                  onGenerate={handleGenerateQuiz}
                  isGenerating={isGenerating}
                />
              )}

              {activeTab === 'presets' && (
                <PresetLibrary
                  onSelectQuiz={handleStartQuiz}
                />
              )}

              {activeTab === 'saved' && (
                <SavedQuizzesModal
                  onPlayQuiz={handleStartQuiz}
                  onStudyFlashcards={handleStartFlashcards}
                />
              )}

              {activeTab === 'results' && (
                <SavedQuizzesModal
                  onPlayQuiz={handleStartQuiz}
                  onStudyFlashcards={handleStartFlashcards}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsUpdated={handleSettingsUpdated}
      />
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />
    </div>
  );
}
