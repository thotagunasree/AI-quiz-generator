import React, { useState } from 'react';
import { Settings, Key, Volume2, VolumeX, Save, X, Sparkles, Cpu, Check } from 'lucide-react';
import { getSettings, saveSettings } from '../utils/storage';
import { soundManager } from '../utils/soundEffects';

export default function SettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  const [settings, setLocalSettings] = useState(getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    soundManager.playClick();
    const updated = saveSettings(settings);
    soundManager.setMuted(!settings.soundEnabled);
    setSavedSuccess(true);
    if (onSettingsUpdated) onSettingsUpdated(updated);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card w-full max-w-lg p-6 relative overflow-hidden border border-white/20">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">AI Engine Settings</h3>
              <p className="text-xs text-slate-400">Configure API Keys and Preferences</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* API Provider Toggle */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              AI Provider
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setLocalSettings({ ...settings, apiProvider: 'gemini' })}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  settings.apiProvider === 'gemini'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google Gemini</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalSettings({ ...settings, apiProvider: 'openai' })}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  settings.apiProvider === 'openai'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>OpenAI GPT</span>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>{settings.apiProvider === 'gemini' ? 'Gemini API Key' : 'OpenAI API Key'}</span>
              <span className="text-[11px] font-normal text-indigo-400">Optional (Client Smart Engine runs if empty)</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={settings.apiKey || ''}
                onChange={(e) => setLocalSettings({ ...settings, apiKey: e.target.value })}
                placeholder={`Paste your ${settings.apiProvider === 'gemini' ? 'AIza...' : 'sk-...'} key`}
                className="glass-input text-xs pl-10"
              />
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/10">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-indigo-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-rose-400" />
              )}
              <div>
                <span className="text-sm font-semibold text-white block">Sound Effects</span>
                <span className="text-xs text-slate-400">Web Audio API chimes and buzzers</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLocalSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                settings.soundEnabled ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-2.5 px-4 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary py-2.5 px-6 text-xs font-bold"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
