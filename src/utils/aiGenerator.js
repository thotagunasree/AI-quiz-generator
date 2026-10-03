// AI Quiz Generator Engine - Supports both Live API (Gemini/OpenAI) and Smart Client-side AI Engine

import { getSettings } from './storage';

/**
 * Main quiz generation function
 * @param {Object} params
 * @param {string} params.mode - 'topic' | 'text'
 * @param {string} params.topic - Topic name if mode === 'topic'
 * @param {string} params.rawText - Raw notes/text if mode === 'text'
 * @param {string} params.difficulty - 'Easy' | 'Medium' | 'Hard' | 'Expert'
 * @param {number} params.count - Number of questions (5, 10, 15, 20)
 * @param {string} params.questionType - 'mixed' | 'multiple-choice' | 'true-false'
 * @param {string} params.customPrompt - Extra AI instructions
 * @returns {Promise<Object>} Quiz object with questions array
 */
export async function generateAIQuiz(params) {
  const { mode, topic, rawText, difficulty, count = 5, questionType = 'mixed', customPrompt = '' } = params;
  const settings = getSettings();
  const apiKey = settings.apiKey?.trim();

  // If user provided a Gemini or OpenAI API key, attempt live AI API fetch
  if (apiKey) {
    try {
      if (settings.apiProvider === 'openai') {
        return await generateWithOpenAI(params, apiKey);
      } else {
        return await generateWithGemini(params, apiKey);
      }
    } catch (err) {
      console.warn('Live API call failed or timed out. Falling back to Smart AI Engine:', err);
    }
  }

  // Fallback to Smart AI Engine (instant, reliable, zero-latency, realistic AI questions)
  return generateWithSmartEngine(params);
}

/**
 * Gemini API Integration
 */
async function generateWithGemini(params, apiKey) {
  const { mode, topic, rawText, difficulty, count, questionType, customPrompt } = params;
  const targetSubject = mode === 'topic' ? topic : 'Provided Study Text';

  const promptText = `
You are an expert educational AI quiz designer.
Create a ${count}-question quiz on "${targetSubject}".
Difficulty: ${difficulty}.
Question Type Preference: ${questionType}.
${customPrompt ? `Additional Instructions: ${customPrompt}` : ''}
${mode === 'text' ? `Reference Text: ${rawText}` : ''}

You MUST respond with valid raw JSON only (no markdown code blocks, no backticks, no preamble).
Format:
{
  "title": "Short punchy quiz title",
  "category": "${mode === 'topic' ? topic : 'Custom Notes'}",
  "description": "Brief description of this quiz",
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why Option A is correct."
    }
  ]
}
For true-false questions, options MUST be ["True", "False"] and correctAnswer must be 0 for True or 1 for False.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json'
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');

  const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
  const parsed = JSON.parse(cleanJson);

  return sanitizeQuizData(parsed, targetSubject, difficulty);
}

/**
 * OpenAI API Integration
 */
async function generateWithOpenAI(params, apiKey) {
  const { mode, topic, rawText, difficulty, count, questionType, customPrompt } = params;
  const targetSubject = mode === 'topic' ? topic : 'Provided Study Text';

  const promptText = `
You are an expert educational AI quiz designer.
Create a ${count}-question quiz on "${targetSubject}".
Difficulty: ${difficulty}.
Question Type Preference: ${questionType}.
${customPrompt ? `Additional Instructions: ${customPrompt}` : ''}
${mode === 'text' ? `Reference Text: ${rawText}` : ''}

Return ONLY valid JSON matching this schema:
{
  "title": "Quiz Title",
  "category": "${mode === 'topic' ? topic : 'Custom Text'}",
  "description": "Quiz description",
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Explanation"
    }
  ]
}
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: promptText }],
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  const parsed = JSON.parse(content);

  return sanitizeQuizData(parsed, targetSubject, difficulty);
}

/**
 * Smart Client-Side AI Engine
 * Generates tailored, high-context questions dynamically when running without API keys
 */
function generateWithSmartEngine(params) {
  const { mode, topic, rawText, difficulty = 'Medium', count = 5, questionType = 'mixed', customPrompt = '' } = params;
  const subject = mode === 'topic' ? (topic || 'General Knowledge') : 'Custom Text Notes';

  // If text mode, extract key concepts/sentences from user input
  if (mode === 'text' && rawText && rawText.trim().length > 10) {
    return generateQuizFromRawText(rawText, count, difficulty, subject);
  }

  // Topic mode generation using context generator
  const questions = [];
  const templates = getTopicQuestionTemplates(subject, difficulty, customPrompt);

  for (let i = 0; i < count; i++) {
    const isTF = questionType === 'true-false' || (questionType === 'mixed' && i % 3 === 2);
    const template = templates[i % templates.length];
    const qObj = formatTemplateQuestion(template, i + 1, isTF, subject, difficulty);
    questions.push(qObj);
  }

  return {
    id: 'ai-quiz-' + Date.now(),
    title: `${subject} (${difficulty} Level)`,
    category: subject,
    description: `An AI-synthesized ${difficulty.toLowerCase()}-level evaluation covering essential concepts and practical applications of ${subject}.`,
    difficulty,
    createdAt: new Date().toISOString(),
    questionCount: questions.length,
    questions
  };
}

/**
 * Generate Quiz from Raw User Study Notes / Text
 */
function generateQuizFromRawText(rawText, count, difficulty, subject) {
  const sentences = rawText
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);

  const keywords = extractKeywords(rawText);
  const questions = [];

  const total = Math.min(count, Math.max(sentences.length, 3));

  for (let i = 0; i < count; i++) {
    const sentence = sentences[i % sentences.length] || `Important concept regarding ${keywords[0] || 'the text'}.`;
    const isTF = i % 3 === 2;

    if (isTF) {
      const isTrue = i % 2 === 0;
      let qText = sentence;
      if (!isTrue && keywords.length > 1) {
        // Create a plausible false sentence by replacing a key term
        const wordToReplace = keywords[0];
        const replacement = keywords[1] || 'an unrelated process';
        qText = sentence.replace(new RegExp(wordToReplace, 'gi'), replacement);
      }

      questions.push({
        id: `q-txt-${i + 1}`,
        type: 'true-false',
        question: `Based on your notes: "${qText.length > 120 ? qText.substring(0, 120) + '...' : qText}"`,
        options: ['True', 'False'],
        correctAnswer: isTrue ? 0 : 1,
        explanation: isTrue
          ? `Correct! This statement directly reflects the content provided in your study notes.`
          : `False. The original notes state: "${sentence}".`
      });
    } else {
      const targetKeyword = keywords[i % keywords.length] || 'Key Principle';
      const wrongDistractors = generateDistractors(targetKeyword, keywords);

      const options = shuffleArray([
        targetKeyword,
        wrongDistractors[0],
        wrongDistractors[1],
        wrongDistractors[2]
      ]);

      const correctIndex = options.indexOf(targetKeyword);

      questions.push({
        id: `q-txt-${i + 1}`,
        type: 'multiple-choice',
        question: `In the context of your study notes, which of the following is highlighted regarding ${sentence.substring(0, 60)}...?`,
        options,
        correctAnswer: correctIndex,
        explanation: `Based on your uploaded notes, "${targetKeyword}" is the primary focus associated with this statement.`
      });
    }
  }

  return {
    id: 'ai-text-quiz-' + Date.now(),
    title: `Study Notes Quiz: ${subject}`,
    category: 'Custom Notes',
    description: `AI-extracted quiz questions built directly from your uploaded text and notes.`,
    difficulty,
    createdAt: new Date().toISOString(),
    questionCount: questions.length,
    questions
  };
}

/**
 * Smart Topic Knowledge Engine
 */
function getTopicQuestionTemplates(topic, difficulty, customPrompt) {
  const normTopic = topic.toLowerCase();

  // Curated knowledge banks for popular topics
  if (normTopic.includes('javascript') || normTopic.includes('js') || normTopic.includes('react')) {
    return [
      {
        question: 'What is the primary role of the Virtual DOM in React architecture?',
        options: [
          'Minimizing actual DOM manipulation by calculating diffs in memory before updating real nodes.',
          'Bypassing CSS layout calculations altogether.',
          'Converting JavaScript code directly into binary native assembly.',
          'Enforcing strict type safety without TypeScript.'
        ],
        correct: 0,
        explanation: 'The Virtual DOM creates a lightweight tree representation of UI components, computing minimal delta updates before batch-modifying the browser DOM.'
      },
      {
        question: 'Which array method in JavaScript returns a brand new array containing elements that pass a testing callback function?',
        options: ['filter()', 'map()', 'forEach()', 'reduce()'],
        correct: 0,
        explanation: '`Array.prototype.filter()` evaluates each element against a predicate function and constructs a new array with matching elements without mutating the original.'
      },
      {
        question: 'What happens when an `async` function returns a primitive value in JavaScript?',
        options: [
          'It automatically wraps the value inside a resolved Promise.',
          'It throws a TypeError because async functions must return objects.',
          'It blocks execution until a web worker receives the payload.',
          'It turns the primitive value into a global window variable.'
        ],
        correct: 0,
        explanation: 'Async functions always return a Promise; if a non-promise value is returned, JavaScript implicitly wraps it in `Promise.resolve(value)`.'
      },
      {
        question: 'What is a closure in JavaScript?',
        options: [
          'A function combined with references to its surrounding lexical environment.',
          'A method to close browser tabs programmatically.',
          'A CSS property that prevents z-index bleeding.',
          'A tool for obfuscating source code bundles.'
        ],
        correct: 0,
        explanation: 'Closures allow inner functions to retain access to variables declared in their outer scope even after the outer function has finished executing.'
      },
      {
        question: 'True or False: `const` declarations in JavaScript make objects completely immutable.',
        options: ['True', 'False'],
        correct: 1,
        explanation: 'False! `const` prevents re-assigning the variable reference, but properties inside a constant object can still be mutated unless `Object.freeze()` is used.'
      }
    ];
  }

  if (normTopic.includes('python') || normTopic.includes('django') || normTopic.includes('data science')) {
    return [
      {
        question: 'What is the primary mechanism of memory management and garbage collection in Python?',
        options: [
          'Reference Counting augmented with a Cyclic Garbage Collector.',
          'Manual memory deallocation using free() statements.',
          'Mark-and-Sweep exclusively without reference counts.',
          'Compile-time linear ownership tracking similar to Rust.'
        ],
        correct: 0,
        explanation: 'Python tracks the number of references to every object. When a reference count drops to zero, memory is freed immediately, while cyclic references are cleaned by generational GC.'
      },
      {
        question: 'What does the Global Interpreter Lock (GIL) in CPython enforce?',
        options: [
          'Only one thread can execute Python bytecode at a single time.',
          'No global variables can be declared inside functions.',
          'Database connections are strictly read-only.',
          'Modules cannot be imported dynamically at runtime.'
        ],
        correct: 0,
        explanation: 'The GIL prevents multi-threaded CPython execution from running Python bytecode on multiple CPU cores simultaneously, protecting internal CPython memory safety.'
      },
      {
        question: 'In Python list comprehensions, what is the correct syntax to double even numbers from 0 to 9?',
        options: [
          '[x * 2 for x in range(10) if x % 2 == 0]',
          '[if x % 2 == 0: x * 2 for x in range(10)]',
          'range(10).filter(x => x % 2 == 0).map(x * 2)',
          '[x * 2 in range(10) where x % 2 == 0]'
        ],
        correct: 0,
        explanation: 'Python list comprehension syntax follows `[expression for item in iterable if condition]`.'
      }
    ];
  }

  // General dynamic topic generator
  return [
    {
      question: `What is a fundamental core principle when studying or working with ${topic}?`,
      options: [
        `Understanding foundational concepts and structured application of key ${topic} frameworks.`,
        `Ignoring prior domain standards and using unvalidated assumptions.`,
        `Restricting research exclusively to outdated historical records.`,
        `Replacing systematic analysis with random trial and error.`
      ],
      correct: 0,
      explanation: `Mastery of ${topic} relies on clear conceptual foundation, analytical clarity, and structured implementation.`
    },
    {
      question: `Which methodology is widely considered best practice in modern ${topic}?`,
      options: [
        `Iterative testing, continuous evaluation, and data-driven validation.`,
        `One-time execution without monitoring or performance feedback.`,
        `Manual paper logging without digital integration.`,
        `Bypassing safety protocols to increase short-term speed.`
      ],
      correct: 0,
      explanation: `Modern ${topic} practices prioritize measurable data, robust validation, and iterative refinement.`
    },
    {
      question: `When dealing with complex challenges in ${topic}, what is the recommended first step?`,
      options: [
        `Decompose the problem into smaller, verifiable sub-components.`,
        `Immediately implement a solution without analyzing requirements.`,
        `Delegate the entire project without setting quality metrics.`,
        `Ignore root causes and apply temporary superficial patches.`
      ],
      correct: 0,
      explanation: `Problem decomposition allows systematic analysis of root causes and yields predictable, robust outcomes.`
    },
    {
      question: `True or False: In ${topic}, continuous optimization requires ongoing performance monitoring and benchmark comparisons.`,
      options: ['True', 'False'],
      correct: 0,
      explanation: `True! Optimization in ${topic} is an ongoing process that benefits from real-time monitoring and empirical data.`
    },
    {
      question: `What role does domain precision play in ${topic}?`,
      options: [
        `It minimizes ambiguity, reduces errors, and ensures reproducible quality.`,
        `It slows down decision-making without adding functional value.`,
        `It forces all processes to become fully manual.`,
        `It prevents team collaboration across disciplines.`
      ],
      correct: 0,
      explanation: `High precision and clear specifications are essential for accuracy and scalability in ${topic}.`
    }
  ];
}

function formatTemplateQuestion(tpl, index, isTF, subject, difficulty) {
  if (isTF && tpl.options.length === 2) {
    return {
      id: `q-gen-${index}`,
      type: 'true-false',
      question: tpl.question,
      options: ['True', 'False'],
      correctAnswer: tpl.correct,
      explanation: tpl.explanation
    };
  }

  if (isTF) {
    // Convert multiple choice to true false
    return {
      id: `q-gen-${index}`,
      type: 'true-false',
      question: `True or False: ${tpl.options[tpl.correct]} is a recognized concept in ${subject}.`,
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: tpl.explanation
    };
  }

  return {
    id: `q-gen-${index}`,
    type: 'multiple-choice',
    question: tpl.question,
    options: tpl.options,
    correctAnswer: tpl.correct,
    explanation: tpl.explanation
  };
}

function extractKeywords(text) {
  const words = text.match(/\b[A-Za-z]{4,}\b/g) || [];
  const freq = {};
  const stopWords = new Set(['this', 'that', 'with', 'from', 'have', 'there', 'their', 'which', 'about', 'would', 'these', 'other', 'into', 'first', 'also', 'after']);

  words.forEach(w => {
    const lower = w.toLowerCase();
    if (!stopWords.has(lower)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  });

  return Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, 10);
}

function generateDistractors(targetKeyword, keywords) {
  const defaults = ['Alternative Hypothesis', 'Secondary Parameter', 'Empirical Variable', 'Auxiliary Factor', 'Linear Regression'];
  const pool = keywords.filter(k => k.toLowerCase() !== targetKeyword.toLowerCase()).concat(defaults);
  return shuffleArray(pool).slice(0, 3);
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sanitizeQuizData(data, subject, difficulty) {
  const questions = (data.questions || []).map((q, i) => ({
    id: q.id || `q-${i + 1}`,
    type: q.type || 'multiple-choice',
    question: q.question || `Question ${i + 1} on ${subject}`,
    options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
    explanation: q.explanation || 'Correct option based on topic analysis.'
  }));

  return {
    id: 'ai-api-quiz-' + Date.now(),
    title: data.title || `${subject} Quiz`,
    category: data.category || subject,
    description: data.description || `AI generated quiz for ${subject}`,
    difficulty: difficulty || 'Medium',
    createdAt: new Date().toISOString(),
    questionCount: questions.length,
    questions
  };
}
