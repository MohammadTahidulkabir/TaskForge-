import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Search, 
  Plus, 
  SlidersHorizontal, 
  LayoutList, 
  Kanban, 
  ChevronDown, 
  ChevronRight, 
  MoreVertical,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../types';

export const TasksPage: React.FC = () => {
  const { 
    tasks, 
    searchQuery, 
    setSearchQuery,
    toggleTaskStatus, 
    toggleSubtask, 
    setIsTaskModalOpen, 
    setEditingTask,
    deleteTask,
    updateTask
  } = useTaskContext();

  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'duration' | 'title'>('dueDate');
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set());

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sortBy === 'priority') {
      const pWeights: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0);
    }
    if (sortBy === 'duration') {
      return (b.estimatedMinutes || 0) - (a.estimatedMinutes || 0);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const toggleExpand = (id: string) => {
    const next = new Set(expandedTaskIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedTaskIds(next);
  };

  const priorityColors: Record<TaskPriority, string> = {
    urgent: 'text-rose-400',
    high: 'text-amber-400',
    medium: 'text-blue-400',
    low: 'text-slate-400',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Task Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize university deadlines, research papers, and software sprints
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented control for List vs Board */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutList className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'board'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter & Sorting Controls Bar (Zero-Pill styling) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-slate-800 py-3">
        {/* Category Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Domains' },
            { id: 'coding', label: 'Coding' },
            { id: 'university', label: 'University' },
            { id: 'research', label: 'Research' },
            { id: 'personal', label: 'Personal' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as any)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Priority & Status Filters */}
        <div className="flex items-center gap-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
          >
            <option value="dueDate">Sort by Deadline</option>
            <option value="priority">Sort by Priority</option>
            <option value="duration">Sort by Duration</option>
            <option value="title">Sort Alphabetically</option>
          </select>
        </div>
      </div>

      {/* Task Views */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="space-y-2">
          {sortedTasks.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-dashed border-slate-800 p-8">
              <AlertCircle className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <h3 className="text-sm font-semibold text-slate-300">No matching tasks found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Try adjusting your search criteria or create a new task.
              </p>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Add New Task
              </button>
            </div>
          ) : (
            sortedTasks.map((task) => {
              const isCompleted = task.status === 'completed';
              const isExpanded = expandedTaskIds.has(task.id);
              const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

              return (
                <div
                  key={task.id}
                  className={`rounded-lg border transition-colors ${
                    isCompleted
                      ? 'border-slate-800/40 bg-slate-950/30 opacity-70'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 p-3.5">
                    {/* Status check */}
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="text-slate-500 hover:text-blue-400 transition-colors shrink-0"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>

                    {/* Expand Subtasks toggle */}
                    {task.subtasks.length > 0 ? (
                      <button
                        onClick={() => toggleExpand(task.id)}
                        className="text-slate-400 hover:text-slate-200 p-0.5"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                      </button>
                    ) : (
                      <div className="w-4.5" />
                    )}

                    {/* Main title & details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => {
                            setEditingTask(task);
                            setIsTaskModalOpen(true);
                          }}
                          className={`text-xs font-semibold cursor-pointer truncate ${
                            isCompleted ? 'line-through text-slate-400' : 'text-slate-100 hover:text-blue-400'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      {/* Zero-pill metadata line */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="capitalize">{task.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className={priorityColors[task.priority]}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          Due {task.dueDate} {task.dueTime}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{task.estimatedMinutes}m</span>
                        {task.subtasks.length > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums text-slate-400">
                              {completedSubtasks}/{task.subtasks.length} subtasks
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setIsTaskModalOpen(true);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        title="Edit Task"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Subtasks details */}
                  {isExpanded && task.subtasks.length > 0 && (
                    <div className="border-t border-slate-800/80 bg-slate-950/60 px-9 py-2.5 space-y-1.5">
                      {task.subtasks.map((st) => (
                        <label
                          key={st.id}
                          className="flex items-center gap-2 text-xs cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={st.completed}
                            onChange={() => toggleSubtask(task.id, st.id)}
                            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                          />
                          <span className={st.completed ? 'line-through text-slate-400' : 'text-slate-300'}>
                            {st.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map((colStatus) => {
            const colTasks = sortedTasks.filter((t) => t.status === colStatus);
            const titles: Record<TaskStatus, string> = {
              todo: 'To Do',
              in_progress: 'In Progress',
              completed: 'Completed',
            };

            return (
              <div
                key={colStatus}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{titles[colStatus]}</span>
                    <span className="font-mono text-xs tabular-nums text-slate-400">
                      ({colTasks.length})
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-2.5 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <p className="text-[11px] text-slate-600 py-6 text-center">No tasks in this lane</p>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setEditingTask(task);
                          setIsTaskModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-800 bg-slate-950 p-3 hover:border-slate-700 cursor-pointer transition-colors space-y-2"
                      >
                        <h4 className="text-xs font-semibold text-slate-200 line-clamp-2">
                          {task.title}
                        </h4>

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span className="capitalize">{task.category}</span>
                          <span className={priorityColors[task.priority]}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-400 font-mono">
                          <span>{task.dueDate}</span>
                          <span>{task.estimatedMinutes}m</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
