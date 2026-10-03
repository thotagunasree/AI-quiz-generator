import React from 'react';
import { BarChart2, Flame, Award, HelpCircle, CheckCircle2, X, Target, Trophy } from 'lucide-react';
import { getStats } from '../utils/storage';

export default function StatsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const stats = getStats();
  const accuracyPct = stats.totalQuestionsAnswered > 0
    ? Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card w-full max-w-lg p-6 relative overflow-hidden border border-white/20">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">Learning Dashboard</h3>
              <p className="text-xs text-slate-400">Aggregate Performance Metrics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold font-heading text-white">{stats.streakDays || 1} Days</span>
              <span className="text-xs text-slate-400 block font-medium">Daily Streak</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold font-heading text-white">{stats.highestScorePct || 0}%</span>
              <span className="text-xs text-slate-400 block font-medium">Best Score</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold font-heading text-white">{accuracyPct}%</span>
              <span className="text-xs text-slate-400 block font-medium">Overall Accuracy</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold font-heading text-white">{stats.totalQuizzesTaken || 0}</span>
              <span className="text-xs text-slate-400 block font-medium">Quizzes Completed</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs leading-relaxed text-center font-medium">
          Keep practicing daily to build memory retention and earn top achievement ranks!
        </div>
      </div>
    </div>
  );
}
