import React from 'react';
import { X, Sparkles, Check, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { AIScheduleResponse } from '../../types';

interface ScheduleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  planResult: AIScheduleResponse | null;
}

export const ScheduleReviewModal: React.FC<ScheduleReviewModalProps> = ({
  isOpen,
  onClose,
  planResult,
}) => {
  const { applyAISchedule } = useTaskContext();

  if (!isOpen || !planResult) return null;

  const handleApply = () => {
    applyAISchedule(planResult.schedule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <h2 className="text-base font-semibold text-white">Review AI Daily Schedule</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Warnings */}
          {planResult.warnings && planResult.warnings.length > 0 && (
            <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <AlertTriangle className="h-4 w-4" />
                <span>Schedule Conflicts & Overload Warnings</span>
              </div>
              <ul className="text-xs text-amber-400/90 list-disc list-inside space-y-0.5">
                {planResult.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Strategic Recommendations */}
          {planResult.recommendations && planResult.recommendations.length > 0 && (
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Strategic Recommendations
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {planResult.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">›</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Proposed Timeline Blocks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Proposed Time Blocks ({planResult.schedule.length} Tasks)
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {planResult.schedule.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 rounded-lg border border-slate-800/80 bg-slate-950 px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-800 font-mono text-xs font-semibold text-slate-300">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                      {item.reason && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.reason}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs text-blue-400 tabular-nums">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    <span>{item.startTime} – {item.endTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Apply Schedule to Today</span>
          </button>
        </div>
      </div>
    </div>
  );
};
