import React, { useState } from 'react';
import {
  Brain, Sparkles, LayoutDashboard, PlusCircle, Library,
  Layers, BarChart2, Settings, LogOut, Menu, X,
  Volume2, VolumeX, ChevronRight, User
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'create',    label: 'Create Quiz', icon: PlusCircle },
  { id: 'presets',   label: 'My Quizzes', icon: Library },
  { id: 'saved',     label: 'Saved Quizzes', icon: Layers },
  { id: 'results',   label: 'Results', icon: BarChart2 },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  muted,
  setMuted,
  onOpenSettings,
  onOpenStats,
  stats,
  user,
  onLogout,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    soundManager.setMuted(next);
    if (!next) soundManager.playClick();
  };

  const handleNav = (id) => {
    soundManager.playClick();
    setActiveTab(id);
    setMobileOpen(false);
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U';

  const SidebarContent = () => (
    <div className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Brain size={22} />
        </div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-app-name">AI Quiz</span>
            <span className="sidebar-ai-badge">AI</span>
          </div>
        )}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* User Profile Mini */}
      {!collapsed && (
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.username || 'User'}</span>
            <span className="sidebar-user-email">{user?.email || ''}</span>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="sidebar-avatar sidebar-avatar-centered" title={user?.username}>
          {initials}
        </div>
      )}

      {/* Nav Items */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleNav(id)}
            className={`sidebar-nav-item ${activeTab === id ? 'sidebar-nav-item-active' : ''}`}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="sidebar-nav-icon" />
            {!collapsed && <span className="sidebar-nav-label">{label}</span>}
            {!collapsed && activeTab === id && <div className="sidebar-nav-indicator" />}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="sidebar-bottom">
        <button
          onClick={() => { soundManager.playClick(); onOpenSettings(); setMobileOpen(false); }}
          className="sidebar-action-btn"
          title="Settings"
        >
          <Settings size={17} />
          {!collapsed && <span>Settings</span>}
        </button>

        <button
          onClick={toggleSound}
          className="sidebar-action-btn"
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted
            ? <VolumeX size={17} className="text-rose-400" />
            : <Volume2 size={17} className="text-indigo-400" />}
          {!collapsed && <span>{muted ? 'Sound Off' : 'Sound On'}</span>}
        </button>

        <button
          onClick={onLogout}
          className="sidebar-action-btn sidebar-logout-btn"
          title="Logout"
        >
          <LogOut size={17} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="sidebar-desktop-wrapper">
        <SidebarContent />
      </div>

      {/* Mobile Hamburger Button */}
      <button
        id="sidebar-mobile-hamburger"
        className="sidebar-hamburger"
        onClick={() => setMobileOpen(o => !o)}
        aria-label="Toggle navigation menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="sidebar-mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="sidebar-mobile-panel" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
