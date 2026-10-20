import { Task, JournalEntry, UserPreferences } from '../types';

// Helper to calculate relative ISO dates
export function getRelativeDateString(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
}

export const defaultPreferences: UserPreferences = {
  userName: 'Alex Chen',
  userRole: 'CSE Student & AI/ML Engineer',
  workStartHour: 9,
  workEndHour: 18,
  dailyCapacityMinutes: 360, // 6 hours focus time
  theme: 'dark',
  autoScheduleBreaks: true,
  githubUsername: 'alexchen-cse',
};

export const sampleTasks: Task[] = [
  // Today's active tasks
  {
    id: 'task-1',
    title: 'Operating Systems: Implement LRU Cache & Virtual Page Table',
    description: 'Complete the page replacement simulation in C++ and measure cache hit rates across memory trace benchmarks.',
    category: 'university',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: getRelativeDateString(0),
    dueTime: '17:00',
    estimatedMinutes: 90,
    actualMinutes: 45,
    scheduledBlock: {
      startTime: '09:30',
      endTime: '11:00',
      reason: 'Deep cognitive capacity required for C++ pointer and memory trace debugging.',
    },
    subtasks: [
      { id: 'st-1', title: 'Implement doubly linked list for eviction order', completed: true },
      { id: 'st-2', title: 'Hash map lookups with O(1) time complexity', completed: true },
      { id: 'st-3', title: 'Run trace file valgrind leak check', completed: false },
      { id: 'st-4', title: 'Generate benchmark throughput charts', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Research: Review FlashAttention-3 & Attention Pruning Papers',
    description: 'Analyze kernel tiling strategies, FP8 tensor core math, and annotate arXiv notes for weekly lab seminar.',
    category: 'research',
    priority: 'high',
    status: 'todo',
    dueDate: getRelativeDateString(0),
    dueTime: '14:30',
    estimatedMinutes: 60,
    scheduledBlock: {
      startTime: '11:15',
      endTime: '12:15',
      reason: 'Read before lab group meeting at 14:30.',
    },
    subtasks: [
      { id: 'st-5', title: 'Download preprint PDF and annotate sections 3 & 4', completed: false },
      { id: 'st-6', title: 'Compare speedup benchmarks against standard FlashAttention-2', completed: false },
      { id: 'st-7', title: 'Draft 3 discussion questions for advisor', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'task-3',
    title: 'TaskForge AI: Build Heatmap Contribution Grid Component',
    description: 'Implement pure SVG 16-week activity calendar with streak counts and tooltip hover states.',
    category: 'coding',
    priority: 'high',
    status: 'in_progress',
    dueDate: getRelativeDateString(0),
    dueTime: '19:00',
    estimatedMinutes: 75,
    actualMinutes: 30,
    scheduledBlock: {
      startTime: '13:30',
      endTime: '14:45',
      reason: 'Key portfolio milestone for GitHub and Devpost submission.',
    },
    subtasks: [
      { id: 'st-8', title: 'Compute day index offset math for 112 days', completed: true },
      { id: 'st-9', title: 'Map completion density to 4 Tailwind slate/blue tiers', completed: true },
      { id: 'st-10', title: 'Add interactive hover tooltip with date and count', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Algorithms: Dynamic Programming Homework 4 (Knapsack & Edit Distance)',
    description: 'Solve problem set on 2D table recurrence relations and write LaTeX proofs.',
    category: 'university',
    priority: 'medium',
    status: 'todo',
    dueDate: getRelativeDateString(1),
    dueTime: '23:59',
    estimatedMinutes: 90,
    subtasks: [
      { id: 'st-11', title: 'Prove space optimization to 1D array for 0/1 Knapsack', completed: false },
      { id: 'st-12', title: 'Write Levenshtein distance traceback algorithm', completed: false },
      { id: 'st-13', title: 'Compile Overleaf LaTeX document to PDF', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Fine-tune LoRA Adapter on Domain Question-Answering Dataset',
    description: 'Launch QLoRA training script on cloud GPU, monitor loss curve on WandB, and verify checkpoint convergence.',
    category: 'research',
    priority: 'high',
    status: 'todo',
    dueDate: getRelativeDateString(2),
    dueTime: '18:00',
    estimatedMinutes: 120,
    subtasks: [
      { id: 'st-14', title: 'Format dataset with ChatML instruction template', completed: true },
      { id: 'st-15', title: 'Set learning rate to 2e-4 with cosine decay', completed: false },
      { id: 'st-16', title: 'Evaluate ROUGE-L and BLEU scores on test split', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'task-6',
    title: 'Prepare Weekly Grocery Meal Prep & Healthy Snacks',
    description: 'Stock up on oats, berries, Greek yogurt, and protein for sustained coding sessions.',
    category: 'personal',
    priority: 'low',
    status: 'todo',
    dueDate: getRelativeDateString(1),
    dueTime: '12:00',
    estimatedMinutes: 45,
    subtasks: [
      { id: 'st-17', title: 'Check pantry essentials', completed: true },
      { id: 'st-18', title: 'Supermarket trip', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },

  // Completed Today
  {
    id: 'task-7',
    title: 'Morning 5km Tempo Run & Hydration Check',
    description: 'Keeps mental clarity high before heavy algorithmic work.',
    category: 'personal',
    priority: 'medium',
    status: 'completed',
    dueDate: getRelativeDateString(0),
    dueTime: '08:00',
    estimatedMinutes: 35,
    actualMinutes: 32,
    scheduledBlock: {
      startTime: '07:30',
      endTime: '08:05',
      reason: 'Morning physical priming.',
    },
    subtasks: [
      { id: 'st-19', title: 'Warm-up stretch and dynamic mobility', completed: true },
      { id: 'st-20', title: '5km run at 5:10/km pace', completed: true },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: 'task-8',
    title: 'Code Review PR #14: Optimize Batch Normalization Layer',
    description: 'Reviewed teammate pull request for custom CUDA kernel bindings.',
    category: 'coding',
    priority: 'high',
    status: 'completed',
    dueDate: getRelativeDateString(0),
    dueTime: '10:00',
    estimatedMinutes: 40,
    actualMinutes: 35,
    scheduledBlock: {
      startTime: '08:45',
      endTime: '09:25',
      reason: 'Unblocks peer engineer on pipeline.',
    },
    subtasks: [
      { id: 'st-21', title: 'Inspect memory bounds checking', completed: true },
      { id: 'st-22', title: 'Approve and merge pull request', completed: true },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date().toISOString(),
  },

  // Overdue Task (demonstrates warning indicators)
  {
    id: 'task-9',
    title: 'Submit CSE Department Graduate Fellowship Application',
    description: 'Upload transcripts, curriculum vitae, and statement of research interests.',
    category: 'university',
    priority: 'urgent',
    status: 'todo',
    dueDate: getRelativeDateString(-1), // Yesterday
    dueTime: '23:59',
    estimatedMinutes: 60,
    subtasks: [
      { id: 'st-23', title: 'Final proofread of research statement', completed: true },
      { id: 'st-24', title: 'Attach letter of recommendation confirmations', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

// Generate realistic past completed tasks for the 16-week contribution calendar
export function generatePastHistoryTasks(): Task[] {
  const history: Task[] = [];
  const categories: Task['category'][] = ['coding', 'university', 'research', 'personal'];
  const titles = [
    'Implement Dijkstra shortest path with binary heap',
    'Benchmark SQLite vs PostgreSQL latency under load',
    'Read Attention Is All You Need (Vaswani et al.)',
    'Write unit tests for authentication middleware',
    'Computer Graphics: Ray Marching signed distance fields',
    'Database Systems: B-Tree index split and rebalance',
    'Dockerize fullstack microservices with Compose',
    'Fix memory leak in WebSockets connection pool',
    'Calculus III: Vector fields and Stokes theorem exercises',
    'Set up CI/CD pipeline on GitHub Actions',
    'Research: Clean and tokenize Common Crawl subset',
    'Discrete Math: Combinatorics and pigeonhole proofs',
    'Build portfolio landing page with Tailwind CSS',
    'Implement Trie data structure for prefix search',
    'Distributed Systems: Raft consensus leader election simulation',
  ];

  // Populate days over the past 90 days with varying intensities (0 to 4 tasks per day)
  for (let i = 1; i <= 90; i++) {
    // skip some days randomly for realistic habit patterns (e.g. weekends have lower or higher counts)
    const dayOfWeek = (new Date().getDay() - (i % 7) + 7) % 7;
    const taskCount = dayOfWeek === 0 || dayOfWeek === 6 ? (i % 3 === 0 ? 1 : 0) : ((i * 7 + 3) % 4) + 1;

    for (let t = 0; t < taskCount; t++) {
      const pastDate = getRelativeDateString(-i);
      const category = categories[(i + t) % categories.length];
      const title = titles[(i * 3 + t) % titles.length];

      history.push({
        id: `hist-${i}-${t}`,
        title: title,
        category,
        priority: t === 0 ? 'high' : 'medium',
        status: 'completed',
        dueDate: pastDate,
        estimatedMinutes: 45 + (t * 15),
        actualMinutes: 40 + (t * 20),
        subtasks: [
          { id: `hist-st-${i}-${t}-1`, title: 'Core implementation', completed: true },
          { id: `hist-st-${i}-${t}-2`, title: 'Verification', completed: true },
        ],
        createdAt: new Date(Date.now() - 86400000 * (i + 1)).toISOString(),
        completedAt: new Date(new Date(pastDate).getTime() + (10 + t * 2) * 3600000).toISOString(),
      });
    }
  }

  return history;
}

export const sampleJournalEntries: JournalEntry[] = [
  {
    id: 'journal-1',
    date: getRelativeDateString(0),
    title: 'Operating Systems LRU Cache & TaskForge Heatmap Component',
    content: `## Daily Engineering Log
Today was centered on systems-level memory management and frontend data visualization.

### Milestones Completed
- Finished the C++ doubly-linked list structure for tracking page access recency in the LRU simulator.
- Implemented zero-dependency SVG calendar heatmap for TaskForge AI, matching GitHub's contribution aesthetic with full dark mode contrast.
- Measured 1.4x speedup on memory trace processing after switching hash table allocator.

### Lessons Learned
- When simulating memory traces, micro-optimizing node allocations makes a bigger difference than algorithmic changes.
- In SVG grids, computing date offsets from the start of the week prevents jagged column misalignments.

### Next Steps for Tomorrow
- Run Valgrind leak tests for the OS lab report.
- Wire up Gemini daily schedule planning approval diff modal.`,
    repoUrl: 'https://github.com/alexchen-cse/taskforge-ai',
    milestones: [
      'Implemented C++ LRU page replacement algorithm',
      'Designed pure SVG contribution calendar heatmap',
      'Reviewed FlashAttention-3 preprint notes',
    ],
    hoursLogged: 6.5,
    tags: ['C++', 'Operating Systems', 'React', 'TypeScript'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'journal-2',
    date: getRelativeDateString(-1),
    title: 'LoRA Quantization Benchmarks & Express Server Setup',
    content: `## Daily Engineering Log
Explored parameter-efficient fine-tuning (PEFT) on GPU cluster and built backend proxy for AI Studio models.

### Key Milestones
- Configured 4-bit NormalFloat (NF4) quantization for Llama-3-8B weights.
- Reduced VRAM usage from 16GB down to 5.4GB, allowing batch size 4 on a single workstation GPU.
- Scaffolded server-side Gemini 3.8 Flash routes with strict responseSchema validation.

### Blockers Resolved
- Solved CORS preflight latency by mounting Express server with unified Vite middleware.`,
    repoUrl: 'https://github.com/alexchen-cse/lora-finetuning-benchmark',
    milestones: [
      'Configured 4-bit NF4 quantized LoRA pipeline',
      'Created server-side Gemini API proxy',
      'Logged training metrics to Weights & Biases',
    ],
    hoursLogged: 7.0,
    tags: ['PyTorch', 'PEFT', 'Express', 'Gemini'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'journal-3',
    date: getRelativeDateString(-2),
    title: 'Dynamic Programming Space Optimization & LaTeX Documentation',
    content: `## Daily Engineering Log
Worked through advanced dynamic programming recurrences for Algorithms course.

### Highlights
- Proven space compression for bounded 0/1 knapsack using reverse iteration on the 1D state array.
- Wrote clean LaTeX proofs in Overleaf for submission.`,
    repoUrl: 'https://github.com/alexchen-cse/algorithms-problem-sets',
    milestones: [
      'Proved O(W) space reduction for 0/1 knapsack',
      'Documented recurrence equations in LaTeX',
    ],
    hoursLogged: 4.5,
    tags: ['Algorithms', 'LaTeX', 'Math'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];
