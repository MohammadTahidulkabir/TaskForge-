import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Clock, 
  Palette, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

export const SettingsPage: React.FC = () => {
  const { preferences, updatePreferences, exportDataJSON, importDataJSON, resetToSampleData } = useTaskContext();

  const [savedNotice, setSavedNotice] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJSON(content);
      if (success) {
        setImportError(null);
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2500);
      } else {
        setImportError('Invalid TaskForge JSON backup file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Workspace Settings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure personal schedule defaults, portfolio branding, and data backups
        </p>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-3 text-xs text-emerald-300">
          <Check className="h-4 w-4" />
          <span>Preferences updated and saved to local storage.</span>
        </div>
      )}

      {/* Profile & Branding */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Developer Profile</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
              <input
                type="text"
                value={preferences.userName}
                onChange={(e) => updatePreferences({ userName: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Role / University</label>
              <input
                type="text"
                value={preferences.userRole}
                onChange={(e) => updatePreferences({ userRole: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">GitHub Username</label>
            <input
              type="text"
              value={preferences.githubUsername || ''}
              onChange={(e) => updatePreferences({ githubUsername: e.target.value })}
              placeholder="e.g. alexchen-cse"
              className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>
        </form>
      </div>

      {/* Focus & Schedule Constraints */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Clock className="h-4 w-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Scheduling & Focus Constraints</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Work Start</label>
            <select
              value={preferences.workStartHour}
              onChange={(e) => updatePreferences({ workStartHour: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 font-mono"
            >
              {[7, 8, 9, 10, 11].map((h) => (
                <option key={h} value={h}>{h}:00 AM</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Work End</label>
            <select
              value={preferences.workEndHour}
              onChange={(e) => updatePreferences({ workEndHour: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 font-mono"
            >
              {[16, 17, 18, 19, 20, 21, 22].map((h) => (
                <option key={h} value={h}>{h > 12 ? h - 12 : h}:00 PM</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-300">Daily Cognitive Focus Budget</span>
            <span className="font-mono text-blue-400 tabular-nums">
              {Math.round(preferences.dailyCapacityMinutes / 60)} hours ({preferences.dailyCapacityMinutes} mins)
            </span>
          </div>
          <input
            type="range"
            min="120"
            max="600"
            step="30"
            value={preferences.dailyCapacityMinutes}
            onChange={(e) => updatePreferences({ dailyCapacityMinutes: Number(e.target.value) })}
            className="w-full accent-blue-500"
          />
        </div>
      </div>

      {/* AI Architecture Overview */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white">AI Engine Architecture</h3>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <ShieldCheck className="h-3.5 w-3.5" /> Server-Side Secure
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          TaskForge AI utilizes Google's official <span className="font-mono text-violet-300">gemini-3.8-flash</span> model via server-side endpoints (<code className="text-slate-400">/api/gemini/*</code>). All API credentials remain isolated on the server. Responses are validated against strict JSON schemas before mutating UI state.
        </p>
      </div>

      {/* Data Persistence, Export & Backup */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Database className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Data Management & Persistence</h3>
        </div>

        <p className="text-xs text-slate-400">
          Your workspace state persists instantly in browser local storage and can be backed up as portable JSON files at any time.
        </p>

        {importError && (
          <p className="text-xs text-rose-400">{importError}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={exportDataJSON}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-blue-400" />
            <span>Export JSON Backup</span>
          </button>

          <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-700 cursor-pointer transition-colors">
            <Upload className="h-3.5 w-3.5 text-emerald-400" />
            <span>Restore from JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (window.confirm('Reset workspace to initial sample portfolio tasks?')) {
                resetToSampleData();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:border-rose-900/40 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
