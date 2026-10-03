import React from 'react';
import {
  Brain, Sparkles, BarChart2, Volume2, VolumeX, Settings, User, LogOut
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export default function DashboardHeader({
  user,
  muted,
  setMuted,
  onOpenSettings,
  onOpenStats,
  onLogout,
  stats,
}) {
  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    soundManager.setMuted(next);
    if (!next) soundManager.playClick();
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="dash-header">
      <div className="dash-header-inner">
        {/* Left: Logo (shown on mobile since sidebar is hidden) */}
        <div className="dash-header-brand">
          <div className="dash-header-logo">
            <Brain size={18} />
          </div>
          <span className="dash-header-app-name">AI Quiz Generator</span>
        </div>

        {/* Right: Controls */}
        <div className="dash-header-right">
          {/* Streak Badge */}
          <button
            onClick={() => { soundManager.playClick(); onOpenStats(); }}
            className="dash-streak-badge"
            title="View Stats"
            id="header-stats-btn"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>{stats?.streakDays || 1}d Streak</span>
          </button>

          {/* Stats */}
          <button
            onClick={() => { soundManager.playClick(); onOpenStats(); }}
            className="dash-icon-btn"
            title="Analytics & Stats"
            id="header-analytics-btn"
          >
            <BarChart2 size={16} />
          </button>

          {/* Mute */}
          <button
            onClick={toggleSound}
            className="dash-icon-btn"
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
            id="header-mute-btn"
          >
            {muted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} className="text-indigo-400" />}
          </button>

          {/* Settings */}
          <button
            onClick={() => { soundManager.playClick(); onOpenSettings(); }}
            className="dash-icon-btn"
            title="Settings"
            id="header-settings-btn"
          >
            <Settings size={16} />
          </button>

          {/* User Avatar */}
          <div className="dash-user-pill" title={user?.username}>
            <div className="dash-avatar">{initials}</div>
            <span className="dash-user-name">{user?.username || 'User'}</span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="dash-logout-btn"
            title="Logout"
            id="header-logout-btn"
          >
            <LogOut size={15} />
            <span className="dash-logout-text">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
