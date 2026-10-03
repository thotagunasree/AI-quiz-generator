import React from 'react';
import { Sparkles, Brain, Volume2, VolumeX, Settings, BarChart2, Bookmark, Library, PlusCircle, Layers } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  muted, 
  setMuted, 
  onOpenSettings, 
  onOpenStats,
  stats 
}) {
  const toggleSound = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    soundManager.setMuted(newMuted);
    if (!newMuted) soundManager.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090d16]/80 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => { soundManager.playClick(); setActiveTab('create'); }} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight font-heading flex items-center gap-1.5">
              <span>QuizMind</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-sans font-semibold">
                AI
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">Smart AI Quiz & Study Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => { soundManager.playClick(); setActiveTab('create'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create AI Quiz</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('presets'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'presets'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Presets</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('saved'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>My Quizzes</span>
          </button>
        </nav>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Streak Badge */}
          <div 
            onClick={onOpenStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition-all select-none"
            title="Daily Learning Streak"
          >
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>{stats?.streakDays || 1}d Streak</span>
          </div>

          {/* Stats Button */}
          <button
            onClick={() => { soundManager.playClick(); onOpenStats(); }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="View Analytics & Stats"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Mute Sound Button */}
          <button
            onClick={toggleSound}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => { soundManager.playClick(); onOpenSettings(); }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="AI Settings & API Keys"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Bar Nav */}
      <div className="flex md:hidden items-center justify-around mt-3 pt-2.5 border-t border-white/5 text-xs font-semibold text-slate-400">
        <button
          onClick={() => { soundManager.playClick(); setActiveTab('create'); }}
          className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'create' ? 'text-indigo-400 font-bold' : ''}`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create</span>
        </button>
        <button
          onClick={() => { soundManager.playClick(); setActiveTab('presets'); }}
          className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'presets' ? 'text-indigo-400 font-bold' : ''}`}
        >
          <Library className="w-4 h-4" />
          <span>Presets</span>
        </button>
        <button
          onClick={() => { soundManager.playClick(); setActiveTab('saved'); }}
          className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'saved' ? 'text-indigo-400 font-bold' : ''}`}
        >
          <Layers className="w-4 h-4" />
          <span>My Quizzes</span>
        </button>
      </div>
    </header>
  );
}
