# TaskForge AI — Smart Daily Productivity Manager & Planner

TaskForge AI is an intelligent daily task management workspace and developer portfolio dashboard engineered for computer science students, researchers, and software engineers. It unifies high-performance task organization, automated Gemini-driven schedule planning and subtask generation, real mathematical productivity analytics, and a Markdown developer journal with full local persistence and export capabilities.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been confirmed through user clarification:
> - **Product Scope**: Building **TaskForge AI**, a smart productivity and planning platform tailored for engineering portfolios and daily academic/coding workloads.
> - **Data Persistence Strategy**: High-fidelity local persistence (`localStorage` + JSON state backup/restore + exportable Markdown logs) with pre-populated realistic university and research demo tasks, designed for zero-friction exploration and offline reliability.
> - **AI Integration Focus**: Prioritizing **Gemini-powered intelligent schedule planning and subtask breakdown** alongside natural language task extraction, productivity diagnostics, and schedule replanning via secure server-side API endpoints (`/api/gemini/*`).

- **Confirmed Decision 1**: Built as a client-first productivity dashboard with rich local storage and server-side Gemini 3.8 Flash orchestration.
- **Confirmed Decision 2**: Dark mode default with deep navy/slate surface tokens, high-density data typography, and zero "AI slop" or pill badge clutter.
- **Confirmed Decision 3**: Real analytics calculated exclusively from user tasks and logs (zero fabricated metrics or fake scorecards).

---

## 1. Overview & Core Concept

- **What It Does**: TaskForge AI helps users capture, prioritize, and conquer complex daily task queues across academic courses, research projects, open-source development, and personal life. Users can draft tasks via structured forms or natural language, request Gemini AI to synthesize realistic time-blocked daily schedules with subtasks, analyze genuine completion metrics and consistency streaks, and record development milestones in a developer journal.
- **Target Audience / Persona**: Computer Science & Engineering students, software developers, AI/ML researchers, and independent builders who need a focused, distraction-free cockpit to manage competing deadlines and project tasks.
- **Key Value**: Eliminates planning paralysis by transforming chaotic to-do lists into executable, time-blocked daily roadmaps with actionable subtasks and measurable velocity tracking.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Quick Capture & Natural Language Ingestion**:
   - The user opens the app to their Today Dashboard. They can click `+ New Task` or type an unformatted natural language prompt (e.g. *"Review neural network loss functions by Thursday 4pm and write unit tests for the data loader"*).
   - Gemini parses deadlines, priority (Urgent/High/Medium/Low), estimated duration, and category into a ready-to-confirm task card.
2. **AI Daily Schedule Generator & Subtask Decomposition**:
   - From the **AI Planner** tab, the user reviews unfinished tasks and clicks **Generate Daily Schedule**.
   - Gemini analyzes estimated durations, deadlines, and working hours (e.g. 9:00 AM – 6:00 PM), yielding conflict-free time slots and breakdown steps for large multi-hour tasks.
   - The user reviews changes with an interactive approval diff before committing them to their active day.
3. **Task Execution & Board / List Management**:
   - The user filters by category (*University*, *Research*, *Coding*, *Personal*) or views tasks in a Kanban Board (*Todo*, *In Progress*, *Completed*).
   - Checking off subtasks updates task completion progress bars in real-time with smooth micro-interactions.
4. **Developer Journal & Contribution Tracking**:
   - Developers write daily markdown logs, track completed milestones, link GitHub pull requests or repositories, and export their journal as clean Markdown for portfolio inclusion.
5. **Productivity Analytics & Heatmap**:
   - A live 16-week activity heatmap, velocity charts (completed vs. created), category distribution, and streak counters derived strictly from timestamped task completions.

### Visual Identity & Theme
- **Aesthetic Direction**: Professional, high-density engineering cockpit. Dark-slate surfaces, hairline border separation (`border-slate-800`), refined typography, and strict zero-pill metadata discipline.
- **Color Palette & Distribution**:
  - *60% Neutral Canvas*: Slate `#090D16` and deep navy `#0F172A` background.
  - *30% Structural Surfaces*: Hairline borders `#1E293B`, subtle card surfaces `#131C31`, muted text `#94A3B8`.
  - *10% Accent Budget*: Royal electric blue `#3B82F6` for primary CTAs and active tabs, violet `#8B5CF6` for AI generation states, emerald `#10B981` for completed tasks, and amber `#F59E0B` / rose `#EF4444` for urgency levels.
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans`, crisp weights (600/700) with `text-wrap: balance`.
  - Body & UI Controls: `Plus Jakarta Sans` / `DM Sans` (13px–15px) for dense legibility.
  - Metrics, Timestamps & Analytics: `JetBrains Mono` / `tabular-nums` for rock-solid tabular alignment.
  - Metadata: Clean unboxed typography with typographic separators (`University · Due 5:00 PM · 45 mins`), strictly avoiding rounded pill capsules or colored badge sandwiches.
- **Motion & Responsive Presence**:
  - 150ms settling transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) for card hovers and tab switches.
  - Mobile bottom navigation drawer and collapsible 256px desktop sidebar.

---

## 3. Key Product Decisions & Trade-Offs

- **State Management & Local Persistence**:
  - *Approach*: Reactive unified local store (`localStorage` engine with optimistic updates, schema validation, and complete JSON export/import).
  - *Why*: Provides instant sub-millisecond responsiveness without network lag, zero authentication barriers on first visit, and 100% offline functionality. Includes pre-seeded sample data for an immediate rich portfolio demonstration.
  - *Alternatives Considered*: Direct Firebase setup without local fallback was considered, but requires network calls and external setup before the user can see any value. A hybrid architecture with ready-to-plug Firestore sync adapters is provided.
- **Server-Side Gemini Integration**:
  - *Approach*: Dedicated Express API routes (`/api/gemini/plan-schedule`, `/api/gemini/breakdown-task`, `/api/gemini/natural-parse`) using `@google/genai` and `gemini-3.8-flash` with strict JSON schema outputs.
  - *Why*: Secures API credentials on the server, eliminates browser key leakage, and provides structured type-safe JSON directly to the frontend.
  - *Alternatives Considered*: Client-side SDK calls were rejected to comply strictly with security guidelines.
- **Zero-Dependency Vector Data Visualizations**:
  - *Approach*: Bespoke, high-performance SVG chart primitives (weekly velocity curve, category donut distribution, 16-week contribution calendar heatmap) built directly with React and CSS.
  - *Why*: Eliminates bundle bloat, avoids React 19 version mismatch issues common with heavy chart libraries, and guarantees crisp dark-mode rendering.

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Browser Client (React 19)                     │
│                                                                        │
│  ┌────────────────────┐ ┌───────────────────────────────────────────┐  │
│  │ Navigation Sidebar │ │ Header: Date, Quick Search, +New Task CTA │  │
│  └─────────┬──────────┘ └─────────────────────┬─────────────────────┘  │
│            │                                  │                        │
│  ┌─────────▼──────────────────────────────────▼─────────────────────┐  │
│  │ Active View Routing:                                             │  │
│  │ ├─ Dashboard (Daily KPIs, Today's Schedule, Urgent Queue)       │  │
│  │ ├─ My Tasks (List / Kanban, Filter by Category, Quick Edit)      │  │
│  │ ├─ AI Planner (Schedule Generation, Subtask Decomposer)          │  │
│  │ ├─ Analytics (Velocity, 16-Week Heatmap, Category Ratios)        │  │
│  │ ├─ Dev Journal (Markdown Editor, GitHub Milestone Logger)       │  │
│  │ └─ Settings (Work Hours, Daily Capacity, Backup & Export)        │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│  ┌──────────────────────────────────▼───────────────────────────────┐  │
│  │ TaskForge Store (Hooks, LocalStorage Sync, Sample Seed Loader)   │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │ HTTP /api/gemini/*
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Express Full-Stack Server                       │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ POST /api/gemini/plan-schedule   -> Generate optimal timeblocks  │  │
│  │ POST /api/gemini/breakdown-task  -> Subtask step decomposition   │  │
│  │ POST /api/gemini/natural-parse   -> NLP extraction into Task     │  │
│  │ POST /api/gemini/daily-summary   -> Productivity brief           │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │ @google/genai SDK                │
│                                     ▼                                  │
│                      Google Gemini 3.8 Flash Engine                    │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Data Models
```typescript
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskCategory = 'university' | 'research' | 'coding' | 'personal' | 'other';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;          // ISO date string (YYYY-MM-DD)
  dueTime?: string;         // HH:mm (24-hour)
  estimatedMinutes: number; // e.g. 45
  actualMinutes?: number;
  subtasks: Subtask[];
  scheduledBlock?: {
    startTime: string;      // HH:mm
    endTime: string;        // HH:mm
  };
  createdAt: string;
  completedAt?: string;
}

export interface JournalEntry {
  id: string;
  date: string;             // YYYY-MM-DD
  title: string;
  content: string;          // Markdown
  repoUrl?: string;
  milestones: string[];
  hoursLogged: number;
}

export interface UserPreferences {
  workStartHour: number;    // e.g. 9 (9 AM)
  workEndHour: number;      // e.g. 18 (6 PM)
  dailyCapacityMinutes: number; // e.g. 360 (6 hours focus)
  theme: 'dark' | 'light';
  userName: string;
  userRole: string;
}
```

### Interactive Component & State Mapping
- **Input Validation**: All form submissions (new tasks, journal entries, quick edits) validate non-empty titles, valid ISO dates, and non-negative durations before state updates.
- **AI Review & Commit Flow**: AI-generated schedules and subtasks are returned into an **Approval Modal** comparing before-and-after states. Tasks are only altered when the user clicks *"Accept Plan"* or *"Add Subtasks"*.
- **Live Search & Dynamic Multi-Condition Filtering**: Real-time debounce filtering across search terms, category segments, priority toggles, and status tabs.
- **Fail-Safe Offline Mode**: If Gemini API encounters rate limits or network issues, meaningful error cards are displayed with offline manual scheduling fallbacks.
