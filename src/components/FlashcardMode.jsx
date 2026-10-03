import React, { useState } from 'react';
import { Layers, RotateCcw, ArrowLeft, ArrowRight, CheckCircle2, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export default function FlashcardMode({ quiz, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState([]); // Question indices marked as known

  const questions = quiz.questions;
  const currentQuestion = questions[currentIndex];
  const total = questions.length;

  const handleFlip = () => {
    soundManager.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    soundManager.playClick();
    setIsFlipped(false);
    if (currentIndex < total - 1) {
      setCurrentIndex(c => c + 1);
    }
  };

  const handlePrev = () => {
    soundManager.playClick();
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
    }
  };

  const toggleMastered = () => {
    soundManager.playClick();
    if (mastered.includes(currentIndex)) {
      setMastered(mastered.filter(i => i !== currentIndex));
    } else {
      setMastered([...mastered, currentIndex]);
    }
  };

  const isCurrentMastered = mastered.includes(currentIndex);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => { soundManager.playClick(); onExit(); }}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Back to Quiz</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Card {currentIndex + 1} of {total}
          </span>
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          {mastered.length} / {total} Mastered
        </span>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="w-full h-96 perspective-1000 cursor-pointer select-none mb-8"
      >
        <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}>
          {/* CARD FRONT (Question) */}
          <div className="absolute inset-0 w-full h-full glass-card p-8 flex flex-col justify-between backface-hidden border border-indigo-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                Question Card
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                Click to flip
              </span>
            </div>

            <div className="my-auto text-center px-4">
              <h3 className="text-xl md:text-2xl font-bold font-heading text-white leading-relaxed mb-4">
                {currentQuestion.question}
              </h3>
            </div>

            <div className="flex items-center justify-center text-xs text-slate-400 font-semibold gap-1.5">
              <span>Tap anywhere to reveal answer & explanation</span>
            </div>
          </div>

          {/* CARD BACK (Answer & Explanation) */}
          <div className="absolute inset-0 w-full h-full glass-card p-8 flex flex-col justify-between backface-hidden rotate-y-180 border border-emerald-500/40 bg-[#0c1424]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                Answer & Explanation
              </span>
              <span className="text-xs text-slate-400">Click to flip back</span>
            </div>

            <div className="my-auto space-y-4 px-2">
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200">
                <span className="text-xs font-bold uppercase tracking-wider block mb-1">Correct Answer:</span>
                <span className="text-lg font-bold">
                  {currentQuestion.options[currentQuestion.correctAnswer]}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 text-xs leading-relaxed">
                <span className="font-bold text-indigo-300 block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Explanation:
                </span>
                {currentQuestion.explanation}
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 font-medium">
              Card flipped successfully
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Mastered Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="btn-secondary px-5 py-3 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Card</span>
        </button>

        <button
          onClick={toggleMastered}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold border transition-all ${
            isCurrentMastered
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${isCurrentMastered ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span>{isCurrentMastered ? 'Mastered!' : 'Mark as Mastered'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === total - 1}
          className="btn-secondary px-5 py-3 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span>Next Card</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
