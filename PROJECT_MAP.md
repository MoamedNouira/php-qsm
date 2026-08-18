# PROJECT_MAP.md — PHP Senior Quiz

Last updated: 2026-08-18

## [TECH_STACK]

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| Framework | React | 18.3.1 | Stable |
| Language | TypeScript | 5.5.3 | Stable |
| Bundler | Vite | 5.4.2 | Stable |
| Styling | Tailwind CSS | 3.4.1 | Stable |
| Icons | lucide-react | 0.446.0 | Stable |
| Backend | Supabase (PostgreSQL) | @supabase/supabase-js 2.57.4 | Stable |
| Deploy | GitHub Pages (CI/CD) | actions/deploy-pages@v4 | Active |

## [SYSTEM_FLOW]

```
App mount → useQuestions() fetch
  ├─ Supabase available? → query `questions` table
  └─ Supabase unavailable? → fallbackQuestions (12 questions, synced categories)
→ ConfigScreen → user selects category → useQuizReducer START action
→ QuizView loop: answer → instant feedback → next → ... → last question
→ buildResult() computes score + seniority band + timeSpentSec
→ ResultScreen → optionally ReviewScreen for errors
```

### State Machine (useQuizReducer)
```
config → (START) → quiz
quiz → (NEXT on last) → result
quiz → (QUIT) → config
result → (REVIEW) → review
result → (RESTART → START) → quiz
result → (HOME) → config
review → (BACK) → result
review → (HOME) → config
```

### Timer Lifecycle
- `startTimer()` called when dispatching START action
- `stopTimer()` called on: quiz completion (NEXT on last), QUIT, HOME, RESTART
- `elapsedSec` stored in QuizState, passed to ProgressHeader and buildResult

### Logging Points
| Event | Level | Context |
|-------|-------|---------|
| questions_loaded | info | count, source (supabase/fallback) |
| questions_fetch_failed | error | message |
| quiz_started | info | category, questionCount |
| quiz_completed | info | total, correct, incorrect, skipped, percentage, elapsedSec |
| uncaught_react_error | error | message, stack |

## [ARCHITECTURE]

```
src/
├── main.tsx                    # React entry + ErrorBoundary + logger.start()
├── App.tsx                     # Thin orchestrator: fetchState + useQuizReducer
├── types.ts                    # Question, AnswerRecord, QuizResult, Phase, SeniorityBand
├── index.css                   # Tailwind directives + token colors + component classes
├── vite-env.d.ts               # Vite client types
├── components/
│   ├── ConfigScreen.tsx        # Category selection grid (186 lines)
│   ├── QuestionView.tsx        # Question display + answer reveal (143 lines)
│   ├── ResultScreen.tsx        # Score donut + seniority + stats (183 lines)
│   ├── ReviewScreen.tsx        # Error review accordion (144 lines)
│   ├── ProgressHeader.tsx      # Sticky top bar + timer display (60 lines)
│   ├── StateScreen.tsx         # Loading spinner / Error state (46 lines)
│   ├── CodeBlock.tsx           # Syntax-highlighted code block + copy (57 lines)
│   ├── OptionButton.tsx        # Answer option with state styling (70 lines)
│   └── ErrorBoundary.tsx       # Catches React errors, logs, shows fallback UI
├── hooks/
│   ├── useQuestions.ts         # Fetch from Supabase or fallback + logging
│   └── useQuizReducer.ts      # Quiz state machine (useReducer) + timer + logging
└── lib/
    ├── supabase.ts             # Conditional client init (11 lines)
    ├── quiz.ts                 # computeSeniority, formatTime, buildResult (35 lines)
    ├── highlight.ts            # Custom PHP/SQL/HTML tokenizer (201 lines)
    ├── logger.ts               # Async buffered logger (info/warn/error)
    └── fallbackQuestions.ts    # 12 offline questions (synced categories)
```

### Key Design Decisions
- **useReducer** over multiple useState — single source of truth for quiz state
- **No routing library** — phase state machine handles navigation
- **Custom syntax highlighter** — zero-dependency, tuned for PHP/SQL/HTML quiz snippets
- **Supabase conditional init** — graceful fallback to local data when env vars missing
- **Async logger** — buffered flush every 5s, errors flush immediately, zero perf impact
- **ErrorBoundary** — catches React render errors, logs, shows recovery UI

## [ORPHANS & PENDING]

_All items resolved._
