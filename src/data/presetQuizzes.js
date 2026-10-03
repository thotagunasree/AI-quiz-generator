export const PRESET_QUIZZES = [
  {
    id: 'preset-web-dev',
    title: 'Modern Web Development & React 19',
    category: 'Technology',
    description: 'Test your knowledge on React Server Components, hooks, state management, and modern browser APIs.',
    difficulty: 'Medium',
    questionCount: 5,
    icon: 'Code2',
    color: 'from-blue-500 to-cyan-400',
    questions: [
      {
        id: 'q-wd-1',
        type: 'multiple-choice',
        question: 'In React 19, what primary advantage do React Server Components (RSC) offer over traditional client components?',
        options: [
          'They allow direct access to server-side resources like databases without increasing client bundle size.',
          'They re-render synchronously on every user scroll event.',
          'They force all CSS styles to be compiled into inline Javascript objects.',
          'They replace the need for HTML and output WebAssembly directly.'
        ],
        correctAnswer: 0,
        explanation: 'React Server Components execute exclusively on the server, allowing direct access to databases, filesystems, and microservices while sending zero JavaScript bytes for those components to the browser bundle.'
      },
      {
        id: 'q-wd-2',
        type: 'multiple-choice',
        question: 'What is the purpose of the `use` hook introduced in React 19?',
        options: [
          'To replace useEffect for fetching data conditionally inside loops or standard JavaScript expressions.',
          'To initialize Redux store slices automatically.',
          'To compile JSX templates into SVG vector graphics.',
          'To restrict a component from rendering on mobile devices.'
        ],
        correctAnswer: 0,
        explanation: 'The `use` hook allows reading resources like Promises or Context conditionally and even inside loops/if statements, simplifying async data handling alongside React Suspense.'
      },
      {
        id: 'q-wd-3',
        type: 'true-false',
        question: 'True or False: The HTTP/3 protocol relies on TCP as its underlying transport layer protocol.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False! HTTP/3 is built on QUIC, which uses UDP (User Datagram Protocol) to eliminate head-of-line blocking and speed up connection setup.'
      },
      {
        id: 'q-wd-4',
        type: 'multiple-choice',
        question: 'Which CSS layout module introduces container queries (`@container`), enabling components to style themselves based on their parent container size rather than viewport size?',
        options: [
          'Container Query Specification (CSS Containment Module Level 3)',
          'CSS Flexbox Layout Module Level 1',
          'CSS Grid Positioning Engine v2',
          'Viewport Relative Media Rules'
        ],
        correctAnswer: 0,
        explanation: 'CSS Container Queries allow elements to evaluate parent container dimensions, making truly modular reusable UI components independent of viewport size.'
      },
      {
        id: 'q-wd-5',
        type: 'multiple-choice',
        question: 'In JavaScript event loop architecture, which of the following is executed inside the Microtask queue rather than the Macrotask queue?',
        options: [
          'Promise callbacks (`.then()`, `async/await` resumptions) and `queueMicrotask`',
          '`setTimeout()` callback timers',
          '`setInterval()` polling intervals',
          'DOM click event dispatchers'
        ],
        correctAnswer: 0,
        explanation: 'Microtasks (Promises, process.nextTick, queueMicrotask) are processed immediately after the current script executes and before rendering or standard Macrotasks (setTimeout, setInterval).'
      }
    ]
  },
  {
    id: 'preset-ai-ml',
    title: 'AI, Machine Learning & LLM Foundations',
    category: 'Artificial Intelligence',
    description: 'Master transformers, self-attention mechanisms, prompt engineering, and neural network concepts.',
    difficulty: 'Hard',
    questionCount: 5,
    icon: 'Cpu',
    color: 'from-purple-500 to-indigo-500',
    questions: [
      {
        id: 'q-ai-1',
        type: 'multiple-choice',
        question: 'What core architectural breakthrough introduced in the 2017 paper "Attention Is All You Need" enabled modern Transformers?',
        options: [
          'Self-Attention Mechanism with Scaled Dot-Product Attention',
          'Convolutional Feature Pooling Layers',
          'Recurrent Hidden Gated Units (GRU)',
          'Genetic Random Forest Ensembles'
        ],
        correctAnswer: 0,
        explanation: 'Self-Attention allows models to dynamically weigh the importance of all input tokens simultaneously in parallel, overcoming RNN sequential bottlenecks.'
      },
      {
        id: 'q-ai-2',
        type: 'multiple-choice',
        question: 'What is Retrieval-Augmented Generation (RAG) primarily used for in LLM applications?',
        options: [
          'Grounding model outputs in external authoritative data sources to reduce hallucinations.',
          'Increasing the size of neural weights during training phase.',
          'Converting audio waveforms into text embeddings.',
          'Speeding up GPU clock speeds using software drivers.'
        ],
        correctAnswer: 0,
        explanation: 'RAG retrieves contextually relevant document chunks from a vector database and includes them in the prompt, giving the model up-to-date and factual information.'
      },
      {
        id: 'q-ai-3',
        type: 'true-false',
        question: 'True or False: Temperature settings in LLM inference control the randomness of token selection, where higher values (e.g. 0.9) yield more deterministic outputs.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False! Higher temperature values (e.g. 0.9) increase output creativity and variance, whereas lower values (e.g. 0.1) yield deterministic, focused results.'
      },
      {
        id: 'q-ai-4',
        type: 'multiple-choice',
        question: 'Which loss function is commonly used for training classification models like Logistic Regression and Neural Classifiers?',
        options: [
          'Cross-Entropy Loss (Log Loss)',
          'Mean Squared Error (MSE)',
          'Cosine Distance Loss',
          'Manhattan L1 Norm'
        ],
        correctAnswer: 0,
        explanation: 'Cross-Entropy Loss measures the performance of a classification model whose output is a probability value between 0 and 1.'
      },
      {
        id: 'q-ai-5',
        type: 'multiple-choice',
        question: 'What role does Quantization (e.g. 4-bit or 8-bit GGUF/AWQ) play in LLM deployment?',
        options: [
          'It reduces model weight precision, drastically lowering memory (VRAM) footprint and inference hardware costs.',
          'It increases model precision from float32 to float64 for space navigation.',
          'It encrypts weights to prevent prompt injection.',
          'It translates model code into raw C++ source code automatically.'
        ],
        correctAnswer: 0,
        explanation: 'Quantization compresses 16-bit floating point weights into 8-bit or 4-bit integers with minimal accuracy loss, allowing large models to run on consumer hardware.'
      }
    ]
  },
  {
    id: 'preset-space-physics',
    title: 'Quantum Physics & Deep Astrophysics',
    category: 'Science',
    description: 'Explore wave-particle duality, black hole thermodynamics, quantum entanglement, and relativity.',
    difficulty: 'Hard',
    questionCount: 5,
    icon: 'Sparkles',
    color: 'from-amber-500 to-rose-500',
    questions: [
      {
        id: 'q-sp-1',
        type: 'multiple-choice',
        question: 'What boundary around a black hole marks the threshold beyond which nothing, not even light, can escape?',
        options: [
          'Event Horizon',
          'Ergosphere',
          'Schwarzschild Radius Limit',
          'Accretion Disk Boundary'
        ],
        correctAnswer: 0,
        explanation: 'The Event Horizon is the ultimate point of no return around a singularity where escape velocity equals or exceeds the speed of light.'
      },
      {
        id: 'q-sp-2',
        type: 'multiple-choice',
        question: 'Which physics principle states that it is impossible to simultaneously determine both the exact position and exact momentum of a subatomic particle with absolute precision?',
        options: [
          'Heisenberg Uncertainty Principle',
          'Pauli Exclusion Principle',
          'Schrödinger Wave Equation',
          'Lorentz Invariance Theory'
        ],
        correctAnswer: 0,
        explanation: 'Heisenberg’s Uncertainty Principle (Δx · Δp ≥ ℏ/2) fundamental limits our ability to measure conjugate physical variables simultaneously.'
      },
      {
        id: 'q-sp-3',
        type: 'true-false',
        question: 'True or False: Quantum Entanglement allows information to travel faster than the speed of light, enabling superluminal communication.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False! Although state collapse is instantaneous across entangled pairs, no controllable information can be transmitted faster than light (No-Communication Theorem).'
      },
      {
        id: 'q-sp-4',
        type: 'multiple-choice',
        question: 'What theoretical radiation, proposed by Stephen Hawking, causes black holes to slowly lose mass and eventually evaporate over cosmic timescales?',
        options: [
          'Hawking Radiation',
          'Synchrotron Emission',
          'Cosmic Microwave Background (CMB)',
          'Cherenkov Radiation'
        ],
        correctAnswer: 0,
        explanation: 'Hawking radiation arises from quantum vacuum fluctuations near event horizons, creating particle-antiparticle pairs where one falls in and the other escapes.'
      },
      {
        id: 'q-sp-5',
        type: 'multiple-choice',
        question: 'What element is formed as the final fusion product in massive stars before core collapse triggers a Type II Supernova?',
        options: [
          'Iron (Fe)',
          'Gold (Au)',
          'Uranium (U)',
          'Carbon (C)'
        ],
        correctAnswer: 0,
        explanation: 'Nuclear fusion of iron consumes energy rather than releasing it, depriving the star of thermal pressure to balance gravitational collapse.'
      }
    ]
  },
  {
    id: 'preset-history',
    title: 'World History & Pivotal Empires',
    category: 'History',
    description: 'Travel through ancient civilizations, medieval strategy, the Industrial Revolution, and global milestones.',
    difficulty: 'Medium',
    questionCount: 5,
    icon: 'Landmark',
    color: 'from-emerald-500 to-teal-400',
    questions: [
      {
        id: 'q-hi-1',
        type: 'multiple-choice',
        question: 'Which ancient legal code, carved into a basalt stele in 1750 BCE, popularized the doctrine of "An eye for an eye"?',
        options: [
          'Code of Hammurabi',
          'Edicts of Ashoka',
          'Twelve Tables of Rome',
          'Magna Carta'
        ],
        correctAnswer: 0,
        explanation: 'Babylonian King Hammurabi instituted one of the oldest deciphered law codes, containing 282 regulations detailing justice and retribution.'
      },
      {
        id: 'q-hi-2',
        type: 'multiple-choice',
        question: 'Which battle in 1066 CE dramatically reshaped English monarchical rule and language following William the Conquerorial victory?',
        options: [
          'Battle of Hastings',
          'Battle of Agincourt',
          'Battle of Bannockburn',
          'Battle of Waterloo'
        ],
        correctAnswer: 0,
        explanation: 'The Norman victory at the Battle of Hastings introduced Anglo-Norman French into England, deeply influencing modern English vocabulary.'
      },
      {
        id: 'q-hi-3',
        type: 'true-false',
        question: 'True or False: The Great Library of Alexandria was destroyed in a single catastrophic fire ordered by Julius Caesar.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False! The decline of the Library of Alexandria occurred gradually over centuries due to fires, budget cuts, civil unrest, and shifting geopolitical power.'
      },
      {
        id: 'q-hi-4',
        type: 'multiple-choice',
        question: 'Which trading route network connected China, Central Asia, Europe, and the Mediterranean for over a millennium?',
        options: [
          'The Silk Road',
          'The Amber Road',
          'The Incense Route',
          'The Trans-Saharan Trade Trail'
        ],
        correctAnswer: 0,
        explanation: 'The Silk Road facilitated not only economic trade (silk, spices, porcelain) but also cultural, religious, and technological exchange.'
      },
      {
        id: 'q-hi-5',
        type: 'multiple-choice',
        question: 'Who developed the printing press with movable metal type in Mainz, Germany around 1440, igniting the Information Revolution?',
        options: [
          'Johannes Gutenberg',
          'Leonardo da Vinci',
          'Desiderius Erasmus',
          'Galileo Galilei'
        ],
        correctAnswer: 0,
        explanation: 'Gutenberg’s movable metal type printing press mass-produced texts, democratizing literacy and accelerating the Renaissance and Scientific Revolution.'
      }
    ]
  }
];
