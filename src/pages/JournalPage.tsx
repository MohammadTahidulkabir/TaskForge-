import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Download, 
  Trash2, 
  Edit3, 
  Check, 
  FolderGit2,
  Tag
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { JournalEntry } from '../types';
import { getRelativeDateString } from '../utils/sampleData';

export const JournalPage: React.FC = () => {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useTaskContext();

  const [selectedEntryId, setSelectedEntryId] = useState<string>(
    journalEntries[0]?.id || ''
  );
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [date, setDate] = useState(getRelativeDateString(0));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [hoursLogged, setHoursLogged] = useState(5.0);
  const [milestonesInput, setMilestonesInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const selectedEntry = journalEntries.find((e) => e.id === selectedEntryId) || journalEntries[0];

  const handleStartCreate = () => {
    setIsCreating(true);
    setDate(getRelativeDateString(0));
    setTitle('');
    setContent(`## Daily Engineering Log

### Key Milestones
- 

### Lessons Learned & Architecture Notes
- 

### Next Steps for Tomorrow
- `);
    setRepoUrl('https://github.com/alexchen-cse/');
    setHoursLogged(4.5);
    setMilestonesInput('Implemented core logic\nTested edge cases');
    setTagsInput('TypeScript, React');
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const milestones = milestonesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addJournalEntry({
      date,
      title: title.trim(),
      content: content.trim(),
      repoUrl: repoUrl.trim() || undefined,
      milestones,
      hoursLogged: Number(hoursLogged) || 1,
      tags,
    });

    setIsCreating(false);
  };

  const handleExportMarkdown = (entry: JournalEntry) => {
    const md = `# ${entry.title}
**Date:** ${entry.date}
**Hours Logged:** ${entry.hoursLogged}h
${entry.repoUrl ? `**Repository:** [${entry.repoUrl}](${entry.repoUrl})\n` : ''}
${entry.tags && entry.tags.length > 0 ? `**Tags:** ${entry.tags.join(', ')}\n` : ''}

## Completed Milestones
${entry.milestones.map((m) => `- [x] ${m}`).join('\n')}

---

${entry.content}
`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dev-journal-${entry.date}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Developer Journal & Portfolio Log</h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain daily engineering documentation, lessons learned, and GitHub project milestones
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Main Grid: Sidebar of Entries + Viewer/Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of entries */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Logged Days ({journalEntries.length})</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {journalEntries.map((entry) => {
              const isSelected = selectedEntry?.id === entry.id && !isCreating;
              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    setSelectedEntryId(entry.id);
                    setIsCreating(false);
                  }}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-blue-500/50 bg-blue-950/20 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>{entry.date}</span>
                    <span>{entry.hoursLogged} hrs</span>
                  </div>
                  <h4 className="text-xs font-semibold truncate">{entry.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                    {entry.milestones.join(' · ')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Entry View or New Entry Form */}
        <div className="lg:col-span-2">
          {isCreating ? (
            /* Creation Form */
            <form onSubmit={handleSaveEntry} className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-semibold text-white">Log Today's Engineering Work</h3>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Entry Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Memory management benchmarks & SVG calendar component"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">GitHub Repo Link</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/user/repo"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hours Logged</label>
                  <input
                    type="number"
                    step="0.5"
                    value={hoursLogged}
                    onChange={(e) => setHoursLogged(parseFloat(e.target.value) || 1)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Key Milestones (one per line)
                </label>
                <textarea
                  rows={2}
                  value={milestonesInput}
                  onChange={(e) => setMilestonesInput(e.target.value)}
                  placeholder="Implemented LRU cache&#10;Added SVG chart&#10;Passing 100% unit tests"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Markdown Daily Notes & Architecture Insights
                </label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-lg border border-slate-800 px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm"
                >
                  Save Journal Entry
                </button>
              </div>
            </form>
          ) : selectedEntry ? (
            /* Selected Entry Details View */
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-1">
                    <span>{selectedEntry.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedEntry.hoursLogged} hours logged</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{selectedEntry.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {selectedEntry.repoUrl && (
                    <a
                      href={selectedEntry.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                    >
                      <FolderGit2 className="h-3.5 w-3.5 text-blue-400" />
                      <span>Repository</span>
                      <ExternalLink className="h-3 w-3 text-slate-500" />
                    </a>
                  )}

                  <button
                    onClick={() => handleExportMarkdown(selectedEntry)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                    title="Export Markdown File"
                  >
                    <Download className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Export .md</span>
                  </button>

                  <button
                    onClick={() => deleteJournalEntry(selectedEntry.id)}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-rose-400 hover:border-rose-900/40 transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Milestones list */}
              {selectedEntry.milestones && selectedEntry.milestones.length > 0 && (
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-4 space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Achieved Milestones
                  </span>
                  <ul className="space-y-1">
                    {selectedEntry.milestones.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Markdown Content rendered nicely */}
              <div className="prose prose-invert prose-xs max-w-none text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                {selectedEntry.content}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center rounded-xl border border-dashed border-slate-800">
              <BookOpen className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p className="text-xs text-slate-400 mb-3">No journal entries logged yet.</p>
              <button
                onClick={handleStartCreate}
                className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs text-white"
              >
                Log First Day
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
