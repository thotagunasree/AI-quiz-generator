import React, { useState, useEffect, useRef } from 'react';
import { Clock, HelpCircle, Sparkles, Star, Zap, CheckCircle2, XCircle, ArrowRight, Lightbulb, Scissors, AlertCircle, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { toggleBookmarkQuestion, getBookmarks } from '../utils/storage';

export default function QuizPlayer({ quiz, onComplete, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]); // Array of { questionId, selected, isCorrect, timeSpent }
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Lifelines state for current question
  const [used5050, setUsed5050] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const timerRef = useRef(null);
  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;

  // Check if current question is bookmarked
  useEffect(() => {
    const bks = getBookmarks();
    setBookmarked(bks.some(b => b.id === currentQuestion.id));
  }, [currentIndex, currentQuestion]);

  // Reset timer on new question
  useEffect(() => {
    setTimer(30);
    setIsAnswered(false);
    setSelectedOption(null);
    setUsed5050(false);
    setDisabledOptions([]);
    setShowHint(false);
    setIsTimerActive(true);
  }, [currentIndex]);

  // Timer Countdown Effect
  useEffect(() => {
    if (!isTimerActive || isAnswered) return;

    if (timer <= 0) {
      // Time expired for this question
      handleOptionSelect(-1, true); // -1 indicates timeout
      return;
    }

    if (timer <= 5) {
      soundManager.playTick();
    }

    timerRef.current = setTimeout(() => {
      setTimer(t => t - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timer, isTimerActive, isAnswered]);

  // Handle Option Selection
  const handleOptionSelect = (optionIndex, isTimeout = false) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setIsTimerActive(false);
    setSelectedOption(optionIndex);

    const isCorrect = optionIndex === currentQuestion.correctAnswer;

    if (isTimeout) {
      soundManager.playWrong();
    } else if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    const answerRecord = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      options: currentQuestion.options,
      selected: optionIndex,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      explanation: currentQuestion.explanation,
      timeSpent: 30 - timer
    };

    setUserAnswers(prev => [...prev, answerRecord]);
  };

  // Handle Lifeline 50:50
  const handleUse5050 = () => {
    if (used5050 || isAnswered || currentQuestion.options.length < 4) return;
    soundManager.playClick();
    setUsed5050(true);

    const correct = currentQuestion.correctAnswer;
    const wrongIndices = currentQuestion.options
      .map((_, idx) => idx)
      .filter(idx => idx !== correct);

    // Shuffle and pick 2 wrong indices to disable
    const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
    setDisabledOptions([shuffled[0], shuffled[1]]);
  };

  // Toggle Bookmark
  const handleBookmark = () => {
    soundManager.playClick();
    toggleBookmarkQuestion(currentQuestion, quiz.title);
    setBookmarked(!bookmarked);
  };

  // Advance to Next Question or Finish
  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      // Complete Quiz
      const correctCount = userAnswers.filter(a => a.isCorrect).length;
      onComplete({
        quiz,
        userAnswers,
        correctCount,
        questionsCount: totalQuestions,
        completedAt: new Date().toISOString()
      });
    }
  };

  const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Top Bar: Progress & Exit */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => { soundManager.playClick(); onExit(); }}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Exit Quiz</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        {/* Bookmark Star */}
        <button
          onClick={handleBookmark}
          className={`p-2 rounded-xl border transition-all ${
            bookmarked
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
          title={bookmarked ? 'Question Bookmarked' : 'Bookmark Question'}
        >
          <Star className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-6 border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="glass-card p-6 md:p-8 relative">
        {/* Card Header: Category & Timer */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
              {quiz.category || 'General Knowledge'}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              quiz.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              quiz.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              {quiz.difficulty}
            </span>
          </div>

          {/* Live Circular Countdown Timer */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-bold text-sm transition-all ${
            timer <= 5
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{timer}s</span>
          </div>
        </div>

        {/* Lifelines & Hint Bar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            {/* 50:50 Lifeline Button */}
            {currentQuestion.options.length >= 4 && (
              <button
                onClick={handleUse5050}
                disabled={used5050 || isAnswered}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  used5050
                    ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                    : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30'
                }`}
                title="Remove 2 incorrect options"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>50:50</span>
              </button>
            )}

            {/* AI Hint Button */}
            <button
              onClick={() => { soundManager.playClick(); setShowHint(!showHint); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                showHint
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>AI Hint</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Choose the best answer
          </div>
        </div>

        {/* AI Hint Collapsible Banner */}
        {showHint && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">AI Contextual Hint:</span>
              <p>Consider the fundamental definition and underlying mechanics associated with "{currentQuestion.question.substring(0, 40)}...". Pay close attention to subtle terms!</p>
            </div>
          </div>
        )}

        {/* Question Text */}
        <h3 className="text-xl md:text-2xl font-bold font-heading text-white mb-6 leading-snug">
          {currentQuestion.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3.5 mb-6">
          {currentQuestion.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isDisabled = disabledOptions.includes(idx);
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctAnswer;

            let cardStyle = 'option-card';
            if (isAnswered) {
              if (isCorrect) cardStyle += ' correct';
              else if (isSelected && !isCorrect) cardStyle += ' incorrect';
            } else if (isSelected) {
              cardStyle += ' selected';
            }

            if (isDisabled) {
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-slate-600 text-sm opacity-40 flex items-center gap-3 cursor-not-allowed select-none"
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs">
                    {letter}
                  </span>
                  <span className="line-through">{option} (Removed 50:50)</span>
                </div>
              );
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleOptionSelect(idx)}
                className={cardStyle}
              >
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isAnswered && isCorrect ? 'bg-emerald-500 text-slate-950' :
                  isAnswered && isSelected && !isCorrect ? 'bg-rose-500 text-white' :
                  'bg-white/10 text-slate-200'
                }`}>
                  {letter}
                </span>

                <span className="flex-1 font-medium text-slate-200 leading-normal">
                  {option}
                </span>

                {/* Feedback Icons */}
                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Post-Answer Explanation Banner */}
        {isAnswered && (
          <div className={`p-5 rounded-2xl border mb-6 animate-fadeIn ${
            selectedOption === currentQuestion.correctAnswer
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200'
              : 'bg-slate-900/90 border-indigo-500/30 text-slate-300'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm mb-2 text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Explanation:</span>
            </div>
            <p className="text-sm leading-relaxed font-normal">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Action Footer */}
        {isAnswered && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="btn-primary px-8 py-3.5 text-sm font-bold shadow-lg shadow-indigo-600/30"
            >
              <span>{currentIndex < totalQuestions - 1 ? 'Next Question' : 'View Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
