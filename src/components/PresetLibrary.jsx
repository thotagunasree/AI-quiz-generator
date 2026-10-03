import React, { useState } from 'react';
import { PRESET_QUIZZES } from '../data/presetQuizzes';
import { Code2, Cpu, Sparkles, Landmark, Play, Search, Filter, HelpCircle, Flame } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

const ICON_MAP = {
  Code2,
  Cpu,
  Sparkles,
  Landmark
};

export default function PresetLibrary({ onSelectQuiz }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(PRESET_QUIZZES.map(q => q.category))];

  const filteredQuizzes = PRESET_QUIZZES.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || quiz.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
          <Flame className="w-3.5 h-3.5 fill-purple-400" />
          <span>Curated AI Quizzes</span>
        </div>
        <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight mb-2">
          Preset Knowledge Challenges
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Explore ready-to-play quizzes curated across computer science, artificial intelligence, astrophysics, and world history.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search preset quizzes..."
            className="glass-input pl-10 py-2.5 text-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { soundManager.playClick(); setSelectedCategory(cat); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuizzes.map((quiz) => {
          const IconComp = ICON_MAP[quiz.icon] || Sparkles;

          return (
            <div
              key={quiz.id}
              onClick={() => { soundManager.playClick(); onSelectQuiz(quiz); }}
              className="glass-card-interactive p-6 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Gradient Accent Pill */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${quiz.color} opacity-10 blur-2xl group-hover:opacity-25 transition-opacity`} />

              <div>
                {/* Category & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/10 text-indigo-300">
                    {quiz.category}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    quiz.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    quiz.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>

                {/* Header with Icon */}
                <div className="flex items-start gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${quiz.color} p-0.5 shrink-0 shadow-lg`}>
                    <div className="w-full h-full bg-[#0e1424] rounded-[14px] flex items-center justify-center">
                      <IconComp className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-heading text-white group-hover:text-indigo-300 transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {quiz.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  {quiz.questionCount} Questions
                </span>

                <button className="flex items-center gap-2 text-xs font-bold text-indigo-300 group-hover:text-white bg-indigo-500/10 group-hover:bg-indigo-600 px-3.5 py-2 rounded-xl transition-all border border-indigo-500/20 group-hover:border-indigo-600">
                  <span>Start Quiz</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
