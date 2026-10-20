import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, JournalEntry, UserPreferences, TaskCategory, TaskPriority, TaskStatus } from '../types';
import { sampleTasks, generatePastHistoryTasks, sampleJournalEntries, defaultPreferences, getRelativeDateString } from '../utils/sampleData';

interface TaskContextType {
  tasks: Task[];
  journalEntries: JournalEntry[];
  preferences: UserPreferences;
  activeTab: 'dashboard' | 'tasks' | 'planner' | 'analytics' | 'journal' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'tasks' | 'planner' | 'analytics' | 'journal' | 'settings') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategoryFilter: TaskCategory | 'all';
  setActiveCategoryFilter: (cat: TaskCategory | 'all') => void;
  activePriorityFilter: TaskPriority | 'all';
  setActivePriorityFilter: (priority: TaskPriority | 'all') => void;
  activeStatusFilter: TaskStatus | 'all';
  setActiveStatusFilter: (status: TaskStatus | 'all') => void;
  
  // Task operations
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  applyAISchedule: (scheduledList: Array<{ id: string; startTime: string; endTime: string; reason?: string }>) => void;
  
  // Journal operations
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  
  // Settings & Storage
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;
  resetToSampleData: () => void;

  // UI Modals
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  isNaturalLanguageModalOpen: boolean;
  setIsNaturalLanguageModalOpen: (open: boolean) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TASKS: 'taskforge_tasks_v1',
  JOURNAL: 'taskforge_journal_v1',
  PREFS: 'taskforge_prefs_v1',
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    // Initialize with sample tasks and past history for rich analytics
    return [...sampleTasks, ...generatePastHistoryTasks()];
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.JOURNAL);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load journal from localStorage', e);
    }
    return sampleJournalEntries;
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFS);
      if (stored) {
        return { ...defaultPreferences, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load preferences from localStorage', e);
    }
    return defaultPreferences;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'planner' | 'analytics' | 'journal' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [activePriorityFilter, setActivePriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<TaskStatus | 'all'>('all');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isNaturalLanguageModalOpen, setIsNaturalLanguageModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to persist tasks', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journalEntries));
    } catch (e) {
      console.error('Failed to persist journal', e);
    }
  }, [journalEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(preferences));
      if (preferences.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to persist preferences', e);
    }
  }, [preferences]);

  // CRUD for Tasks
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      subtasks: taskData.subtasks || [],
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (updates.status === 'completed' && t.status !== 'completed' && !updated.completedAt) {
            updated.completedAt = new Date().toISOString();
          } else if (updates.status && updates.status !== 'completed') {
            updated.completedAt = undefined;
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus: TaskStatus = t.status === 'completed' ? 'todo' : 'completed';
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const addSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    const newSubtask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title: title.trim(),
      completed: false,
    };
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, newSubtask] } : t))
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          // If all subtasks are completed, mark task in_progress or completed
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, subtasks: t.subtasks.filter((st) => st.id !== subtaskId) } : t
      )
    );
  };

  const applyAISchedule = (
    scheduledList: Array<{ id: string; startTime: string; endTime: string; reason?: string }>
  ) => {
    setTasks((prev) =>
      prev.map((t) => {
        const found = scheduledList.find((s) => s.id === t.id);
        if (found) {
          return {
            ...t,
            scheduledBlock: {
              startTime: found.startTime,
              endTime: found.endTime,
              reason: found.reason,
            },
          };
        }
        return t;
      })
    );
  };

  // CRUD for Journal
  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
  };

  const updateJournalEntry = (id: string, updates: Partial<JournalEntry>) => {
    setJournalEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const exportDataJSON = () => {
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      preferences,
      tasks,
      journalEntries,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskforge-backup-${getRelativeDateString(0)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.tasks)) {
        setTasks(parsed.tasks);
      }
      if (Array.isArray(parsed.journalEntries)) {
        setJournalEntries(parsed.journalEntries);
      }
      if (parsed.preferences && typeof parsed.preferences === 'object') {
        setPreferences((prev) => ({ ...prev, ...parsed.preferences }));
      }
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  const resetToSampleData = () => {
    setTasks([...sampleTasks, ...generatePastHistoryTasks()]);
    setJournalEntries(sampleJournalEntries);
    setPreferences(defaultPreferences);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.JOURNAL);
    localStorage.removeItem(STORAGE_KEYS.PREFS);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        journalEntries,
        preferences,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        activeCategoryFilter,
        setActiveCategoryFilter,
        activePriorityFilter,
        setActivePriorityFilter,
        activeStatusFilter,
        setActiveStatusFilter,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
        applyAISchedule,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        updatePreferences,
        exportDataJSON,
        importDataJSON,
        resetToSampleData,
        isTaskModalOpen,
        setIsTaskModalOpen,
        editingTask,
        setEditingTask,
        isNaturalLanguageModalOpen,
        setIsNaturalLanguageModalOpen,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
