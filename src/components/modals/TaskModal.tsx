import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Trash2, Clock, Calendar, CheckSquare } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { Task, TaskCategory, TaskPriority, TaskStatus, Subtask } from '../../types';
import { geminiService } from '../../services/geminiService';
import { getRelativeDateString } from '../../utils/sampleData';

export const TaskModal: React.FC = () => {
  const { 
    isTaskModalOpen, 
    setIsTaskModalOpen, 
    editingTask, 
    addTask, 
    updateTask, 
    deleteTask 
  } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('coding');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState(getRelativeDateString(0));
  const [dueTime, setDueTime] = useState('17:00');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [actualMinutes, setActualMinutes] = useState<number | undefined>(undefined);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false);
  const [subtaskAiTip, setSubtaskAiTip] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
      setDueDate(editingTask.dueDate);
      setDueTime(editingTask.dueTime || '17:00');
      setEstimatedMinutes(editingTask.estimatedMinutes || 45);
      setActualMinutes(editingTask.actualMinutes);
      setSubtasks(editingTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('coding');
      setPriority('medium');
      setStatus('todo');
      setDueDate(getRelativeDateString(0));
      setDueTime('17:00');
      setEstimatedMinutes(60);
      setActualMinutes(undefined);
      setSubtasks([]);
      setSubtaskAiTip(null);
    }
    setShowDeleteConfirm(false);
  }, [editingTask, isTaskModalOpen]);

  if (!isTaskModalOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st)));
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleAIBreakdown = async () => {
    if (!title.trim()) return;
    setIsGeneratingSubtasks(true);
    setSubtaskAiTip(null);
    try {
      const result = await geminiService.breakdownTask(title, description, category, estimatedMinutes);
      if (result.subtasks && result.subtasks.length > 0) {
        const generated: Subtask[] = result.subtasks.map((st, i) => ({
          id: `ai-st-${Date.now()}-${i}`,
          title: st.title,
          completed: false,
        }));
        setSubtasks((prev) => [...prev, ...generated]);
      }
      if (result.tips) {
        setSubtaskAiTip(result.tips);
      }
    } catch (err) {
      console.error('Failed to decompose subtasks:', err);
    } finally {
      setIsGeneratingSubtasks(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        priority,
        status,
        dueDate,
        dueTime: dueTime || undefined,
        estimatedMinutes: Number(estimatedMinutes) || 30,
        actualMinutes: actualMinutes ? Number(actualMinutes) : undefined,
        subtasks,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        priority,
        status,
        dueDate,
        dueTime: dueTime || undefined,
        estimatedMinutes: Number(estimatedMinutes) || 30,
        actualMinutes: actualMinutes ? Number(actualMinutes) : undefined,
        subtasks,
      });
    }

    setIsTaskModalOpen(false);
  };

  const handleDelete = () => {
    if (editingTask) {
      deleteTask(editingTask.id);
      setIsTaskModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-blue-500" />
            <h2 className="text-base font-semibold text-white">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <button
            onClick={() => setIsTaskModalOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement LRU Cache & Virtual Memory Simulation"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description & Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key specifications, references, or benchmark targets..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Category, Priority, Status Grids */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Domain Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="coding">Coding / Dev</option>
                <option value="university">University Course</option>
                <option value="research">Research & Papers</option>
                <option value="personal">Personal / Life</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Date, Time, Duration Grids */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-slate-300 mb-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                <span>Due Date</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-slate-300 mb-1">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>Target Time</span>
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-slate-300 mb-1">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>Estimated (Mins)</span>
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(parseInt(e.target.value, 10) || 30)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 font-mono tabular-nums focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300">
                Actionable Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
              </label>
              <button
                type="button"
                onClick={handleAIBreakdown}
                disabled={isGeneratingSubtasks || !title.trim()}
                className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 disabled:opacity-50 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isGeneratingSubtasks ? 'Analyzing...' : 'Gemini Subtask Breakdown'}</span>
              </button>
            </div>

            {subtaskAiTip && (
              <div className="mb-2 p-2 rounded-lg bg-violet-950/20 border border-violet-800/40 text-[11px] text-violet-300">
                💡 {subtaskAiTip}
              </div>
            )}

            {/* Subtask items */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto mb-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs"
                >
                  <label className="flex items-center gap-2 flex-1 cursor-pointer min-w-0">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(st.id)}
                      className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                    />
                    <span className={`truncate ${st.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {st.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="text-slate-500 hover:text-rose-400 p-0.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add subtask input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add subtask and hit enter..."
                className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Delete confirmation dialog if requested */}
          {showDeleteConfirm && (
            <div className="rounded-lg border border-rose-900/60 bg-rose-950/30 p-3 text-xs text-rose-200">
              <p className="font-semibold mb-2">Are you sure you want to delete this task?</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded bg-rose-600 px-3 py-1 font-semibold text-white hover:bg-rose-500"
                >
                  Yes, Delete Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded border border-slate-700 px-3 py-1 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            {editingTask ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Task</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
              >
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
