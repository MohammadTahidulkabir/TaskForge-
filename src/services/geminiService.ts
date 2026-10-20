import { Task, AIScheduleResponse, AISubtaskResponse, AIDailySummaryResponse } from '../types';

export const geminiService = {
  async naturalParse(input: string) {
    const res = await fetch('/api/gemini/natural-parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to parse task with AI');
    }

    return res.json();
  },

  async breakdownTask(title: string, description?: string, category?: string, estimatedMinutes?: number): Promise<AISubtaskResponse> {
    const res = await fetch('/api/gemini/breakdown-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, category, estimatedMinutes }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate subtasks');
    }

    return res.json();
  },

  async planSchedule(
    tasks: Task[],
    workStartHour: number,
    workEndHour: number,
    dailyCapacityMinutes: number,
    date?: string
  ): Promise<AIScheduleResponse> {
    const res = await fetch('/api/gemini/plan-schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks, workStartHour, workEndHour, dailyCapacityMinutes, date }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate schedule');
    }

    return res.json();
  },

  async getDailySummary(
    completedCount: number,
    pendingCount: number,
    overdueCount: number,
    topCategories: string[],
    journalNotes?: string
  ): Promise<AIDailySummaryResponse> {
    const res = await fetch('/api/gemini/daily-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completedCount, pendingCount, overdueCount, topCategories, journalNotes }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate daily summary');
    }

    return res.json();
  },
};
