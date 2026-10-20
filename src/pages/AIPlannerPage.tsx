import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  Sliders, 
  ListOrdered,
  Layers,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { geminiService } from '../services/geminiService';
import { AIScheduleResponse, AISubtaskResponse, Task } from '../types';
import { getRelativeDateString } from '../utils/sampleData';
import { ScheduleReviewModal } from '../components/modals/ScheduleReviewModal';

export const AIPlannerPage: React.FC = () => {
  const { 
    tasks, 
    preferences, 
    updatePreferences, 
    addSubtask, 
    applyAISchedule,
    setActiveTab 
  } = useTaskContext();

  const [planningDate, setPlanningDate] = useState(getRelativeDateString(0));
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(() => {
    // default select today's unfinished tasks
    const today = getRelativeDateString(0);
    return new Set(tasks.filter((t) => t.dueDate <= today && t.status !== 'completed').map((t) => t.id));
  });

  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [scheduleResult, setScheduleResult] = useState<AIScheduleResponse | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Subtask decomposer state
  const [decomposerTaskTitle, setDecomposerTaskTitle] = useState('');
  const [decomposerDuration, setDecomposerDuration] = useState(90);
  const [loadingDecomposer, setLoadingDecomposer] = useState(false);
  const [decomposedResult, setDecomposedResult] = useState<AISubtaskResponse | null>(null);

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');

  const handleToggleSelectTask = (id: string) => {
    const next = new Set(selectedTaskIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedTaskIds(next);
  };

  const handleSelectAll = () => {
    if (selectedTaskIds.size === pendingTasks.length) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(pendingTasks.map((t) => t.id)));
    }
  };

  const handleGenerateSchedule = async () => {
    const tasksToPlan = tasks.filter((t) => selectedTaskIds.has(t.id));
    if (tasksToPlan.length === 0) return;

    setLoadingSchedule(true);
    try {
      const res = await geminiService.planSchedule(
        tasksToPlan,
        preferences.workStartHour,
        preferences.workEndHour,
        preferences.dailyCapacityMinutes,
        planningDate
      );
      setScheduleResult(res);
      setIsReviewModalOpen(true);
    } catch (err) {
      console.error('Failed to generate schedule:', err);
    } finally {
      setLoadingSchedule(false);
    }
  };

  const handleDecompose = async () => {
    if (!decomposerTaskTitle.trim()) return;
    setLoadingDecomposer(true);
    try {
      const res = await geminiService.breakdownTask(
        decomposerTaskTitle,
        'Decomposed via AI Planner tab',
        'coding',
        decomposerDuration
      );
      setDecomposedResult(res);
    } catch (err) {
      console.error('Failed to decompose subtasks:', err);
    } finally {
      setLoadingDecomposer(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-violet-900/30 bg-gradient-to-r from-violet-950/30 via-slate-900 to-slate-900 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Gemini Intelligent Scheduler
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Daily Cognitive Schedule Architect
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Gemini analyzes pending task durations, deadlines, and your target focus hours to eliminate schedule overload and construct deep-work time blocks with built-in recovery buffers.
          </p>
        </div>

        <button
          onClick={handleGenerateSchedule}
          disabled={loadingSchedule || selectedTaskIds.size === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-500 disabled:opacity-50 transition-all shrink-0"
        >
          {loadingSchedule ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          <span>{loadingSchedule ? 'Synthesizing Schedule...' : `Plan ${selectedTaskIds.size} Tasks with AI`}</span>
        </button>
      </div>

      {/* Configuration & Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Task Queue Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Select Tasks to Include</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Check tasks you want scheduled in this planning cycle
                </p>
              </div>

              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                {selectedTaskIds.size === pendingTasks.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">
                All tasks are currently completed! Create new tasks to plan.
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {pendingTasks.map((task) => {
                  const isSelected = selectedTaskIds.has(task.id);
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggleSelectTask(task.id)}
                      className={`flex items-center justify-between gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-violet-500/40 bg-violet-950/15'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            isSelected
                              ? 'border-violet-500 bg-violet-600 text-white'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-200 truncate">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                            <span className="capitalize">{task.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className={task.priority === 'urgent' ? 'text-rose-400' : 'text-slate-400'}>
                              {task.priority}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>Due {task.dueDate}</span>
                          </div>
                        </div>
                      </div>

                      <span className="font-mono text-xs tabular-nums text-slate-400 shrink-0">
                        {task.estimatedMinutes}m
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Parameters & Constraints */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Planning Constraints
            </h3>

            {/* Target Date */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={planningDate}
                onChange={(e) => setPlanningDate(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200"
              />
            </div>

            {/* Working Hours */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Start Hour
                </label>
                <select
                  value={preferences.workStartHour}
                  onChange={(e) => updatePreferences({ workStartHour: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                >
                  {[7, 8, 9, 10, 11].map((h) => (
                    <option key={h} value={h}>{h}:00 AM</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  End Hour
                </label>
                <select
                  value={preferences.workEndHour}
                  onChange={(e) => updatePreferences({ workEndHour: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                >
                  {[16, 17, 18, 19, 20, 21, 22].map((h) => (
                    <option key={h} value={h}>{h > 12 ? h - 12 : h}:00 PM</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Daily Focus Capacity */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Daily Focus Target</span>
                <span className="font-mono text-slate-200 tabular-nums">
                  {Math.round(preferences.dailyCapacityMinutes / 60)} hours ({preferences.dailyCapacityMinutes}m)
                </span>
              </div>
              <input
                type="range"
                min="120"
                max="600"
                step="30"
                value={preferences.dailyCapacityMinutes}
                onChange={(e) => updatePreferences({ dailyCapacityMinutes: Number(e.target.value) })}
                className="w-full accent-violet-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              Selected: <span className="font-mono text-white tabular-nums">{selectedTaskIds.size}</span> tasks (
              <span className="font-mono text-white tabular-nums">
                {tasks.filter((t) => selectedTaskIds.has(t.id)).reduce((acc, t) => acc + (t.estimatedMinutes || 45), 0)}
              </span>m total workload)
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: Gemini Subtask Breakdown Decomposer Tool */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">
            Complex Task Decomposer
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Stuck on where to begin on a large project or homework problem? Let Gemini decompose it into sequential, 15-30 minute actionable steps.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={decomposerTaskTitle}
            onChange={(e) => setDecomposerTaskTitle(e.target.value)}
            placeholder="e.g. Write Devpost submission and record demonstration screencast"
            className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <select
              value={decomposerDuration}
              onChange={(e) => setDecomposerDuration(Number(e.target.value))}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 font-mono"
            >
              <option value={45}>45 mins</option>
              <option value={90}>90 mins</option>
              <option value={120}>2 hours</option>
              <option value={240}>4 hours</option>
            </select>
            <button
              onClick={handleDecompose}
              disabled={loadingDecomposer || !decomposerTaskTitle.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50 shrink-0 transition-colors"
            >
              {loadingDecomposer ? 'Decomposing...' : 'Break Down Task'}
            </button>
          </div>
        </div>

        {decomposedResult && (
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Actionable Breakdown ({decomposedResult.subtasks.length} Steps)
              </span>
              {decomposedResult.tips && (
                <span className="text-[11px] text-slate-400 italic">💡 {decomposedResult.tips}</span>
              )}
            </div>

            <div className="space-y-2">
              {decomposedResult.subtasks.map((st, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/50 px-3.5 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 text-[11px]">{i + 1}.</span>
                    <span className="text-slate-200">{st.title}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                    {st.estimatedMinutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ScheduleReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        planResult={scheduleResult}
      />
    </div>
  );
};
