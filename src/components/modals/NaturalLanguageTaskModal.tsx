import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { geminiService } from '../../services/geminiService';
import { TaskCategory, TaskPriority } from '../../types';

export const NaturalLanguageTaskModal: React.FC = () => {
  const { isNaturalLanguageModalOpen, setIsNaturalLanguageModalOpen, addTask } = useTaskContext();
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<{
    title: string;
    description?: string;
    category: TaskCategory;
    priority: TaskPriority;
    dueDate: string;
    dueTime?: string;
    estimatedMinutes: number;
    subtasks: string[];
    isFallback?: boolean;
  } | null>(null);

  if (!isNaturalLanguageModalOpen) return null;

  const examplePrompts = [
    'Submit Computer Architecture Lab 3 report by Thursday 5pm, urgent priority, 2 hours',
    'Review arXiv preprint on sparse attention mechanisms tomorrow morning, 60 minutes',
    'Write integration tests for PostgreSQL connection pool before Friday midnight',
  ];

  const handleParse = async (textToParse?: string) => {
    const text = textToParse || inputPrompt;
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await geminiService.naturalParse(text);
      setParsedPreview(result);
    } catch (err: any) {
      setError(err.message || 'Could not parse task with AI');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAdd = () => {
    if (!parsedPreview) return;
    addTask({
      title: parsedPreview.title,
      description: parsedPreview.description,
      category: parsedPreview.category || 'coding',
      priority: parsedPreview.priority || 'medium',
      status: 'todo',
      dueDate: parsedPreview.dueDate,
      dueTime: parsedPreview.dueTime || undefined,
      estimatedMinutes: parsedPreview.estimatedMinutes || 45,
      subtasks: (parsedPreview.subtasks || []).map((title: string, i: number) => ({
        id: `st-nlp-${Date.now()}-${i}`,
        title,
        completed: false,
      })),
    });

    setParsedPreview(null);
    setInputPrompt('');
    setIsNaturalLanguageModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <h2 className="text-base font-semibold text-white">AI Quick Task Capture</h2>
          </div>
          <button
            onClick={() => {
              setIsNaturalLanguageModalOpen(false);
              setParsedPreview(null);
            }}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-400">
            Describe what you need to get done in everyday language. Gemini will deduce the category, priority, target deadline, and breakdown sub-steps.
          </p>

          <div>
            <textarea
              rows={3}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="e.g. Finish training the ResNet model for research paper by this Wednesday at 6pm, high priority, about 90 mins"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Example prompt quick clicks */}
          {!parsedPreview && (
            <div>
              <span className="text-[11px] font-medium text-slate-400 block mb-1.5">Try an example:</span>
              <div className="space-y-1">
                {examplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputPrompt(p);
                      handleParse(p);
                    }}
                    className="block w-full text-left truncate rounded-md border border-slate-800/80 bg-slate-950/40 px-2.5 py-1.5 text-[11px] text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-900/40 bg-rose-950/20 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Result Preview */}
          {parsedPreview && (
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  AI Extracted Task
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {parsedPreview.estimatedMinutes} mins
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">{parsedPreview.title}</h4>
                {parsedPreview.description && (
                  <p className="text-xs text-slate-400 mt-0.5">{parsedPreview.description}</p>
                )}
              </div>

              {/* Zero-pill metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="capitalize">{parsedPreview.category}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{parsedPreview.priority} Priority</span>
                <span aria-hidden="true">·</span>
                <span>Due {parsedPreview.dueDate} {parsedPreview.dueTime}</span>
              </div>

              {parsedPreview.subtasks && parsedPreview.subtasks.length > 0 && (
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">Generated Subtasks:</span>
                  <ul className="space-y-1">
                    {parsedPreview.subtasks.map((st, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsNaturalLanguageModalOpen(false);
                setParsedPreview(null);
              }}
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            {parsedPreview ? (
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Confirm & Add Task</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={loading || !inputPrompt.trim()}
                onClick={() => handleParse()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50 shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{loading ? 'Analyzing with Gemini...' : 'Parse & Extract'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
