import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Sparkles, 
  BarChart3, 
  BookOpen, 
  Settings, 
  Plus, 
  Zap,
  ChevronLeft,
  ChevronRight,
  FolderGit2
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { getRelativeDateString } from '../../utils/sampleData';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    tasks, 
    setIsTaskModalOpen, 
    setEditingTask,
    setIsNaturalLanguageModalOpen,
    preferences
  } = useTaskContext();
  const [collapsed, setCollapsed] = useState(false);

  const todayStr = getRelativeDateString(0);
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const pendingCount = todayTasks.filter((t) => t.status !== 'completed').length;
  const overdueCount = tasks.filter((t) => t.dueDate < todayStr && t.status !== 'completed').length;

  interface NavItem {
    id: 'dashboard' | 'tasks' | 'planner' | 'analytics' | 'journal' | 'settings';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number | null;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, count: pendingCount > 0 ? pendingCount : null },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, count: tasks.filter(t => t.status !== 'completed').length },
    { id: 'planner', label: 'AI Planner', icon: Sparkles, badge: 'Gemini' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'journal', label: 'Dev Journal', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`relative flex flex-col border-r border-slate-800 bg-slate-900/90 backdrop-blur-md transition-all duration-200 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Zap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold tracking-tight text-white truncate">TaskForge AI</span>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide truncate">Engineering Workspace</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="p-3 space-y-2">
        <button
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          className={`flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors ${
            collapsed ? 'px-0' : ''
          }`}
          title="Create New Task"
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span>New Task</span>}
        </button>

        <button
          onClick={() => setIsNaturalLanguageModalOpen(true)}
          className={`flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700/80 bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-colors ${
            collapsed ? 'px-0' : ''
          }`}
          title="AI Natural Language Task Ingestion"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-400 shrink-0" />
          {!collapsed && <span>AI Quick Capture</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.count !== null && item.count !== undefined && (
                    <span className="font-mono text-xs tabular-nums text-slate-400">
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className="text-[10px] font-mono tracking-wider text-violet-400">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Overdue alert indicator if overdue > 0 */}
      {!collapsed && overdueCount > 0 && (
        <div className="mx-3 mb-3 p-3 rounded-lg border border-rose-900/40 bg-rose-950/20 text-rose-300 text-xs">
          <div className="flex items-center justify-between font-semibold">
            <span>Overdue Tasks</span>
            <span className="font-mono tabular-nums">{overdueCount}</span>
          </div>
          <p className="mt-1 text-[11px] text-rose-400/80">Requires immediate attention or re-planning.</p>
        </div>
      )}

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700">
            {preferences.userName.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'TF'}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-200 truncate">{preferences.userName}</span>
              <span className="text-[11px] text-slate-400 truncate">{preferences.userRole}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
