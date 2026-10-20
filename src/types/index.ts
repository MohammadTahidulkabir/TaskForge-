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
  dueDate: string;          // YYYY-MM-DD
  dueTime?: string;         // HH:mm (24-hour)
  estimatedMinutes: number; // e.g. 45
  actualMinutes?: number;
  subtasks: Subtask[];
  scheduledBlock?: {
    startTime: string;      // HH:mm
    endTime: string;        // HH:mm
    reason?: string;
  };
  createdAt: string;        // ISO timestamp
  completedAt?: string;     // ISO timestamp
}

export interface JournalEntry {
  id: string;
  date: string;             // YYYY-MM-DD
  title: string;
  content: string;          // Markdown
  repoUrl?: string;
  milestones: string[];
  hoursLogged: number;
  tags?: string[];
  createdAt: string;
}

export interface UserPreferences {
  userName: string;
  userRole: string;
  workStartHour: number;    // e.g. 9
  workEndHour: number;      // e.g. 18
  dailyCapacityMinutes: number; // e.g. 360
  theme: 'dark' | 'light';
  autoScheduleBreaks: boolean;
  githubUsername?: string;
}

export interface AIScheduleResponse {
  schedule: Array<{
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    reason: string;
  }>;
  recommendations: string[];
  warnings: string[];
  isFallback?: boolean;
}

export interface AISubtaskResponse {
  subtasks: Array<{
    title: string;
    estimatedMinutes: number;
  }>;
  tips: string;
  isFallback?: boolean;
}

export interface AIDailySummaryResponse {
  summary: string;
  keyWins: string[];
  tomorrowAdvice: string;
  isFallback?: boolean;
}
