import React from 'react';
import { Search, Sparkles, Plus, Moon, Sun } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    searchQuery, 
    setSearchQuery, 
    setIsTaskModalOpen, 
    setEditingTask,
    setIsNaturalLanguageModalOpen,
    preferences,
    updatePreferences
  } = useTaskContext();

  const tabTitles: Record<string, string> = {
    dashboard: 'Daily Overview',
    tasks: 'Task Management',
    planner: 'AI Schedule Planner',
    analytics: 'Productivity Analytics',
    journal: 'Developer Journal',
    settings: 'Workspace Settings',
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const toggleTheme = () => {
    updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="flex h-16 items-center justify-between gap-6 border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur-md shrink-0">
      {/* Zone 1: Breadcrumb & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-base font-semibold tracking-tight text-white whitespace-nowrap">
          {tabTitles[activeTab] || 'Workspace'}
        </h1>
        <span className="text-slate-600" aria-hidden="true">/</span>
        <span className="text-xs text-slate-400 font-mono tabular-nums whitespace-nowrap">
          {today}
        </span>
      </div>

      {/* Zone 2: Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, descriptions, or categories..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950/60 pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
          title={`Switch to ${preferences.theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {preferences.theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          onClick={() => setIsNaturalLanguageModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span>AI Capture</span>
        </button>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
};
