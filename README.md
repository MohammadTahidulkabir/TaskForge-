# TaskForge AI — Smart Daily Task Manager & Planner

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Powered by Gemini](https://img.shields.io/badge/AI-Google%20Gemini%203.8%20Flash-8B5CF6.svg)](https://ai.google.dev/)
[![Stack: React + TypeScript + Tailwind](https://img.shields.io/badge/Stack-React%2019%20%7C%20TS%20%7C%20Tailwind%204-3B82F6.svg)](https://react.dev)

> **Plan smarter. Work consistently. Achieve more.**

TaskForge AI is an intelligent daily task management workspace and developer portfolio dashboard engineered for computer science students, software engineers, and researchers. It bridges the gap between raw to-do lists and disciplined deep-work execution through automated Gemini AI schedule planning, subtask decomposition, mathematical velocity tracking, and an exportable developer journal.

---

## Key Features

### 1. Daily Engineering Cockpit
- **Unified Overview**: Today's time-blocked commitments, overdue warning queue, and instant task progress counters.
- **Cognitive Budgeting**: Tracks estimated focus time against user-defined daily capacity limits.
- **AI Standup Brief**: Generates daily executive summaries with key wins and recommended next focus areas.

### 2. High-Performance Task Management
- **List & Kanban Views**: Seamless toggle between dense tabular list views and multi-lane Kanban workflow boards.
- **Domain Categories**: Filter effortlessly across *University Coursework*, *AI/ML Research*, *Software Engineering*, and *Personal*.
- **Subtask Decomposer**: Hierarchical breakdown checklists with real-time completion progress tracking.
- **Zero-Pill Metadata**: Built strictly following high-density SaaS design standards with typographic hierarchy and `tabular-nums` formatting.

### 3. Gemini-Powered Intelligent Planning
- **Daily Schedule Synthesis**: Analyzes pending deadlines and work hours to produce conflict-free, prioritized time blocks.
- **Approval Diff Review**: Interactive preview of AI recommendations and warnings before committing changes to active schedules.
- **Natural Language Quick Capture**: Type queries like *"Submit Operating Systems virtual memory report by Friday 5pm, urgent"* to auto-extract categories, deadlines, and steps.
- **Complex Task Decomposition**: Automatically breaks multi-hour projects into 15–30 minute actionable milestones.

### 4. Mathematical Productivity Analytics
- **16-Week Consistency Matrix**: Pure SVG activity calendar heatmap (GitHub style) computed from real completion timestamps.
- **14-Day Velocity Curve**: Quantitative comparison of tasks created versus tasks closed.
- **Domain Distribution**: Execution rates and logged focus hours broken down by project category.
- **Streak Engine**: Real-time consecutive streak tracking and longest-streak records.

### 5. Developer Journal & Milestone Logger
- **Markdown Documentation**: Log daily architectural findings, lessons learned, and algorithmic discoveries.
- **Repository Linking**: Attach GitHub pull requests and project links directly to daily logs.
- **One-Click Export**: Export daily or multi-day entries as clean Markdown files (`.md`) ready for portfolio submission.

### 6. Local Persistence & Portability
- **Instant Offline Operation**: Zero login walls or configuration required to start managing tasks.
- **State Export/Import**: Full JSON workspace export and restore functionality.

---

## Technical Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React 19 Client SPA                             │
│  ├─ TaskContext & Custom Hooks (Reactive State, LocalStorage Sync)     │
│  ├─ UI Shell: Collapsible Sidebar, Contextual Breadcrumbs, Modals      │
│  ├─ Views: Dashboard, Tasks (List/Kanban), AI Planner, Analytics, Dev   │
│  └─ Pure SVG Visualizations (16-Week Heatmap, 14-Day Velocity Curves)  │
└─────────────────────────────────────┬──────────────────────────────────┘
                                      │ HTTP /api/gemini/*
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Express Full-Stack Backend Proxy                    │
│  ├─ POST /api/gemini/plan-schedule   -> Schedule time-blocking engine  │
│  ├─ POST /api/gemini/breakdown-task  -> Subtask decomposition API      │
│  ├─ POST /api/gemini/natural-parse   -> Natural language task parser   │
│  └─ POST /api/gemini/daily-summary   -> Executive standup generation   │
└─────────────────────────────────────┬──────────────────────────────────┘
                                      │ @google/genai SDK
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Google Gemini 3.8 Flash Engine                     │
│  (Strict Type Schemas, Isolated Server Credentials, Instant Execution) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/alexchen-cse/taskforge-ai.git
   cd taskforge-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key (optional for local heuristic testing, recommended for production AI):
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Scripts

- `npm run dev`: Starts the Express server with Vite middleware on port 3000
- `npm run build`: Compiles production frontend bundle
- `npm run lint`: Verifies strict TypeScript compilation without errors

---

## License

This project is licensed under the [MIT License](LICENSE).
