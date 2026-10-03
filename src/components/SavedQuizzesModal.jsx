import React, { useState, useEffect } from 'react';
import { getSavedQuizzes, deleteSavedQuiz } from '../utils/storage';
import { Layers, Play, Trash2, Calendar, HelpCircle, Layers3, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export default function SavedQuizzesModal({ onPlayQuiz, onStudyFlashcards }) {
  const [savedQuizzes, setSavedQuizzes] = useState([]);

  useEffect(() => {
    setSavedQuizzes(getSavedQuizzes());
  }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    soundManager.playClick();
    const updated = deleteSavedQuiz(id);
    setSavedQuizzes(updated);
  };

  if (savedQuizzes.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 text-indigo-400">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-white mb-2">No Saved Quizzes Yet</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
          Generate an AI quiz or complete a preset quiz, then click "Save Quiz" on the results screen to build your personal study library.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Layers3 className="w-3.5 h-3.5" />
          <span>Personal Quiz Vault</span>
        </div>
        <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight mb-2">
          My Saved AI Quizzes
        </h2>
        <p className="text-slate-400 text-sm">
          Access your saved quiz history, retake quizzes, or study with 3D flashcards anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="glass-card p-6 flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                  {quiz.category || 'AI Generated'}
                </span>
                <button
                  onClick={(e) => handleDelete(quiz.id, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Quiz"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-bold font-heading text-white mb-2">
                {quiz.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {quiz.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  {quiz.questionCount || quiz.questions?.length} Questions
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  {new Date(quiz.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
              <button
                onClick={() => { soundManager.playClick(); onPlayQuiz(quiz); }}
                className="flex-1 btn-primary py-2.5 text-xs font-bold"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Quiz</span>
              </button>

              <button
                onClick={() => { soundManager.playClick(); onStudyFlashcards(quiz); }}
                className="btn-secondary py-2.5 px-4 text-xs font-bold"
              >
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Flashcards</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
