import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, RotateCcw, Save, Layers, CheckCircle2, XCircle, ChevronDown, ChevronUp, Download, Sparkles, Brain, Clock } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { saveQuizToStorage, recordQuizResult } from '../utils/storage';

export default function QuizResults({ resultData, onRetake, onStudyFlashcards, onNavigateSaved }) {
  const { quiz, userAnswers, correctCount, questionsCount, completedAt } = resultData;
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const scorePct = Math.round((correctCount / (questionsCount || 1)) * 100);

  // Trigger sound & confetti on mount
  useEffect(() => {
    recordQuizResult(resultData);

    if (scorePct >= 70) {
      soundManager.playVictory();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      soundManager.playCorrect();
    }
  }, []);

  // Determine Badge & Grade Title
  const getGradeInfo = () => {
    if (scorePct === 100) return { title: 'Quiz Mastermind 🏆', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', desc: 'Flawless performance! You showed complete command of this topic.' };
    if (scorePct >= 80) return { title: 'Expert Scholar 🌟', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', desc: 'Outstanding knowledge! You mastered the vast majority of concepts.' };
    if (scorePct >= 60) return { title: 'Competent Scholar 🎓', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', desc: 'Solid effort! Review a few tricky points to reach perfection.' };
    return { title: 'Promising Apprentice 🌱', badge: 'bg-slate-800 text-slate-300 border-slate-700', desc: 'Great practice run! Use the flashcards mode to reinforce key ideas.' };
  };

  const gradeInfo = getGradeInfo();

  // Save Quiz Handler
  const handleSaveQuiz = () => {
    soundManager.playClick();
    saveQuizToStorage(quiz);
    setIsSaved(true);
  };

  // Export JSON Report Handler
  const handleExportJSON = () => {
    soundManager.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resultData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quiz_report_${quiz.title.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Score Hero Banner */}
      <div className="glass-card p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Grade Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold mb-4 shadow">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>{gradeInfo.title}</span>
        </div>

        <h2 className="text-3xl font-extrabold font-heading text-white mb-2">
          Quiz Completed!
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
          {gradeInfo.desc}
        </p>

        {/* Score Circle & Stats Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 my-6">
          {/* Big Percentage */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={389}
                strokeDashoffset={389 - (389 * scorePct) / 100}
                strokeLinecap="round"
                className="text-indigo-500 transition-all duration-1000"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold font-heading text-white">{scorePct}%</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Score</span>
            </div>
          </div>

          {/* Stat Details */}
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 w-36">
              <span className="text-xs text-slate-400 font-medium block">Correct</span>
              <span className="text-xl font-bold text-emerald-400">{correctCount} / {questionsCount}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 w-36">
              <span className="text-xs text-slate-400 font-medium block">Accuracy</span>
              <span className="text-xl font-bold text-indigo-300">{scorePct}%</span>
            </div>
          </div>
        </div>

        {/* Actions Button Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => { soundManager.playClick(); onRetake(); }}
            className="btn-primary text-xs font-bold py-3 px-5 shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); onStudyFlashcards(); }}
            className="btn-secondary text-xs font-bold py-3 px-5"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Flashcards Mode</span>
          </button>

          <button
            onClick={handleSaveQuiz}
            disabled={isSaved}
            className={`btn-secondary text-xs font-bold py-3 px-5 ${isSaved ? 'text-emerald-400 border-emerald-500/40' : ''}`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Saved to My Quizzes' : 'Save Quiz'}</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
            title="Export Report as JSON"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        </div>
      </div>

      {/* AI Performance Insights Card */}
      <div className="glass-card p-6 border border-indigo-500/20">
        <div className="flex items-center gap-2 font-bold font-heading text-lg text-white mb-3">
          <Brain className="w-5 h-5 text-indigo-400" />
          <span>AI Performance Review</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {scorePct >= 80 ? (
            `Superb command of ${quiz.title}! You demonstrated high conceptual clarity. For future study, consider exploring expert edge cases.`
          ) : (
            `Good effort on ${quiz.title}. We recommend reviewing questions where distractors caused minor confusion. Try the 3D Flashcard study mode to strengthen retention.`
          )}
        </p>
      </div>

      {/* Detailed Question Review List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
          <span>Question-by-Question Analysis</span>
          <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            {questionsCount} Questions
          </span>
        </h3>

        <div className="space-y-3">
          {userAnswers.map((ans, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={idx}
                className="glass-card p-5 transition-all overflow-hidden"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => { soundManager.playClick(); setExpandedIndex(isExpanded ? null : idx); }}
                  className="flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    {ans.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-slate-400 block mb-1">
                        Q{idx + 1}: {ans.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                      <h4 className="text-sm font-semibold text-white leading-normal">
                        {ans.question}
                      </h4>
                    </div>
                  </div>

                  <button className="p-1 rounded-lg text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Accordion Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className={`p-3 rounded-xl border ${
                        ans.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}>
                        <span className="font-bold block mb-0.5 text-[11px] uppercase tracking-wider">Your Answer:</span>
                        <span>{ans.selected === -1 ? 'Time Expired (No Answer)' : ans.options[ans.selected]}</span>
                      </div>

                      {!ans.isCorrect && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                          <span className="font-bold block mb-0.5 text-[11px] uppercase tracking-wider">Correct Answer:</span>
                          <span>{ans.options[ans.correctAnswer]}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 leading-relaxed">
                      <span className="font-bold text-indigo-300 block mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        Explanation:
                      </span>
                      {ans.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
