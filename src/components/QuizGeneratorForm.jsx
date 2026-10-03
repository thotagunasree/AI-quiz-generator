import React, { useState } from 'react';
import { Sparkles, FileText, Compass, Sliders, Zap, HelpCircle, AlertCircle, ArrowRight, Wand2 } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

const QUICK_TOPICS = [
  'React 19 & Frontend',
  'AI & Transformers',
  'Cybersecurity Fundamentals',
  'Quantum Physics',
  'World History Empires',
  'Python Data Science'
];

export default function QuizGeneratorForm({ onGenerate, isGenerating }) {
  const [mode, setMode] = useState('topic'); // 'topic' | 'text'
  const [topic, setTopic] = useState('');
  const [rawText, setRawText] = useState('');
  const [difficulty, setDifficulty] = useState('Medium'); // 'Easy' | 'Medium' | 'Hard' | 'Expert'
  const [count, setCount] = useState(5);
  const [questionType, setQuestionType] = useState('mixed'); // 'mixed' | 'multiple-choice' | 'true-false'
  const [customPrompt, setCustomPrompt] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'topic' && !topic.trim()) {
      setErrorMsg('Please enter a topic or select one of the quick suggestions below.');
      return;
    }

    if (mode === 'text' && (!rawText.trim() || rawText.trim().length < 20)) {
      setErrorMsg('Please paste at least 20 characters of study notes or text to generate questions.');
      return;
    }

    soundManager.playClick();
    onGenerate({
      mode,
      topic: topic.trim(),
      rawText: rawText.trim(),
      difficulty,
      count,
      questionType,
      customPrompt: customPrompt.trim()
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Next-Gen AI Quiz Creator</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-white tracking-tight mb-3">
          Transform Any Topic or Text into an <span className="gradient-text">Interactive Quiz</span>
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          Type any subject or paste your raw study notes. Our AI synthesizes high-quality questions, distractors, and explanations instantly.
        </p>
      </div>

      {/* Main Form Glass Container */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1.5 bg-slate-900/90 rounded-xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setMode('topic'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
              mode === 'topic'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Generate from Topic</span>
          </button>

          <button
            type="button"
            onClick={() => { soundManager.playClick(); setMode('text'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
              mode === 'text'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Import Notes / Raw Text</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Section */}
          {mode === 'topic' ? (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200">
                Quiz Topic or Subject
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Quantum Computing, React Hooks, World War II, Microeconomics..."
                  className="glass-input text-base pr-10"
                />
                <Wand2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 opacity-60" />
              </div>

              {/* Quick Topic Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-medium">Quick Ideas:</span>
                {QUICK_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { soundManager.playClick(); setTopic(t); setErrorMsg(''); }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-indigo-300 transition-all"
                  >
                    + {t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200 flex items-center justify-between">
                <span>Paste Study Notes, Articles, or Textbooks</span>
                <span className="text-xs text-slate-400 font-normal">Min 20 chars</span>
              </label>
              <textarea
                rows={5}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your lecture notes, textbook paragraphs, or document content here..."
                className="glass-input text-sm leading-relaxed"
              />
            </div>
          )}

          {/* Config Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* Difficulty Pill Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-white/10">
                {['Easy', 'Medium', 'Hard', 'Expert'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => { soundManager.playClick(); setDifficulty(d); }}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                      difficulty === d
                        ? d === 'Easy'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                          : d === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                          : d === 'Hard'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-white/10">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => { soundManager.playClick(); setCount(num); }}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                      count === num
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* Question Type Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Question Type
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-white/10">
                {[
                  { id: 'mixed', label: 'Mixed' },
                  { id: 'multiple-choice', label: 'MCQ' },
                  { id: 'true-false', label: 'T/F' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { soundManager.playClick(); setQuestionType(t.id); }}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                      questionType === t.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Advanced Prompting */}
          <div className="space-y-2 pt-1">
            <details className="group">
              <summary className="text-xs font-semibold text-slate-400 hover:text-indigo-400 cursor-pointer flex items-center gap-1.5 select-none">
                <Sliders className="w-3.5 h-3.5" />
                <span>Advanced AI Prompt Tuning (Optional)</span>
              </summary>
              <div className="pt-3">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Focus on real-world scenarios, include edge cases, prioritize conceptual clarity..."
                  className="glass-input text-xs"
                />
              </div>
            </details>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2.5 text-rose-300 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full btn-primary py-4 text-base tracking-wide shadow-xl shadow-indigo-600/30 group"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing AI Quiz...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span>Generate AI Quiz Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
