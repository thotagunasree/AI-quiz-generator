import React from 'react';
import {
  PlusCircle, BookOpen, CheckCircle2, Trophy, Clock, Play,
  HelpCircle, Calendar, BarChart2, Flame, Layers
} from 'lucide-react';
import { getSavedQuizzes, getQuizHistory, getStats } from '../utils/storage';
import { soundManager } from '../utils/soundEffects';

function StatCard({ icon: Icon, label, value, colorClass, bgClass }) {
  return (
    <div className={`stat-card ${bgClass || ''}`}>
      <div className={`stat-card-icon ${colorClass}`}>
        <Icon size={22} />
      </div>
      <div className="stat-card-info">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
    </div>
  );
}

export default function Dashboard({ user, onCreateQuiz, onPlayQuiz, onNavigateTab, stats }) {
  const savedQuizzes = getSavedQuizzes();
  const history = getQuizHistory();
  const currentStats = stats || getStats();

  const quizzesCreated = savedQuizzes.length;
  const quizzesCompleted = currentStats.totalQuizzesTaken || 0;
  const avgScore = currentStats.totalQuestionsAnswered > 0
    ? Math.round((currentStats.totalCorrectAnswers / currentStats.totalQuestionsAnswered) * 100)
    : 0;
  const streak = currentStats.streakDays || 1;

  const recentQuizzes = history.slice(0, 5);

  return (
    <div className="dashboard-home">
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-text">
          <h2 className="dashboard-greeting">
            Welcome back, <span className="dashboard-username">{user?.username || 'Learner'}</span>! 👋
          </h2>
          <p className="dashboard-subtext">Ready to create your next quiz?</p>
        </div>
        <button
          id="dashboard-create-quiz-btn"
          className="dashboard-create-btn"
          onClick={() => { soundManager.playClick(); onCreateQuiz(); }}
        >
          <PlusCircle size={19} />
          <span>+ Create New Quiz</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="dashboard-stats-grid">
        <StatCard
          icon={BookOpen}
          label="Quizzes Created"
          value={quizzesCreated}
          colorClass="stat-icon-indigo"
        />
        <StatCard
          icon={CheckCircle2}
          label="Quizzes Completed"
          value={quizzesCompleted}
          colorClass="stat-icon-emerald"
        />
        <StatCard
          icon={Trophy}
          label="Average Score"
          value={`${avgScore}%`}
          colorClass="stat-icon-amber"
        />
        <StatCard
          icon={Flame}
          label="Day Streak"
          value={`${streak} Days`}
          colorClass="stat-icon-rose"
        />
      </div>

      {/* Recent Quizzes */}
      <div className="dashboard-recent">
        <div className="dashboard-section-header">
          <h3 className="dashboard-section-title">
            <Clock size={18} />
            Recent Quizzes
          </h3>
        </div>

        {recentQuizzes.length === 0 ? (
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon">
              <Layers size={36} />
            </div>
            <h4>No quizzes yet</h4>
            <p>Create your first quiz to get started.</p>
            <button
              id="dashboard-empty-create-btn"
              className="dashboard-create-btn dashboard-create-btn-sm"
              onClick={() => { soundManager.playClick(); onCreateQuiz(); }}
            >
              <PlusCircle size={16} />
              <span>Create Your First Quiz</span>
            </button>
          </div>
        ) : (
          <div className="recent-quizzes-list">
            {recentQuizzes.map((item, idx) => {
              const quiz = item.quiz || {};
              const scorePct = item.questionsCount
                ? Math.round((item.correctCount / item.questionsCount) * 100)
                : 0;
              const date = item.completedAt
                ? new Date(item.completedAt).toLocaleDateString()
                : '—';

              return (
                <div key={idx} className="recent-quiz-card">
                  <div className="recent-quiz-info">
                    <div className="recent-quiz-title">{quiz.title || 'Untitled Quiz'}</div>
                    <div className="recent-quiz-meta">
                      <span className="recent-meta-chip">
                        <HelpCircle size={12} />
                        {item.questionsCount || 0} Questions
                      </span>
                      <span className="recent-meta-chip">
                        <Calendar size={12} />
                        {date}
                      </span>
                      {quiz.difficulty && (
                        <span className={`recent-diff-chip diff-${(quiz.difficulty || '').toLowerCase()}`}>
                          {quiz.difficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="recent-quiz-score">
                    <span className={`score-badge ${scorePct >= 70 ? 'score-good' : scorePct >= 40 ? 'score-mid' : 'score-low'}`}>
                      {scorePct}%
                    </span>
                  </div>

                  {quiz.questions && (
                    <button
                      className="recent-view-btn"
                      onClick={() => { soundManager.playClick(); onPlayQuiz(quiz); }}
                      title="View / Retake Quiz"
                    >
                      <Play size={14} />
                      <span>Retake</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Action Cards */}
      <div className="dashboard-quick-actions">
        <h3 className="dashboard-section-title">
          <BarChart2 size={18} />
          Quick Actions
        </h3>
        <div className="quick-action-grid">
          {[
            {
              icon: '🎯',
              title: 'Create AI Quiz',
              desc: 'Generate a new quiz from any topic using AI',
              action: () => { soundManager.playClick(); onCreateQuiz(); },
              id: 'quick-create-quiz',
              primary: true,
            },
            {
              icon: '📚',
              title: 'Preset Library',
              desc: 'Browse ready-made quiz sets across subjects',
              action: () => { soundManager.playClick(); onNavigateTab && onNavigateTab('presets'); },
              id: 'quick-presets',
            },
            {
              icon: '💾',
              title: 'My Saved Quizzes',
              desc: 'Revisit and retake your saved quizzes',
              action: () => { soundManager.playClick(); onNavigateTab && onNavigateTab('saved'); },
              id: 'quick-saved',
            },
          ].map(q => (
            <button
              key={q.id}
              id={q.id}
              className={`quick-action-card ${q.primary ? 'quick-action-primary' : ''}`}
              onClick={q.action}
            >
              <span className="quick-action-emoji">{q.icon}</span>
              <span className="quick-action-title">{q.title}</span>
              <span className="quick-action-desc">{q.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
