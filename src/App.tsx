/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { TasksPage } from './pages/TasksPage';
import { AIPlannerPage } from './pages/AIPlannerPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { JournalPage } from './pages/JournalPage';
import { SettingsPage } from './pages/SettingsPage';
import { TaskModal } from './components/modals/TaskModal';
import { NaturalLanguageTaskModal } from './components/modals/NaturalLanguageTaskModal';

const AppContent: React.FC = () => {
  const { activeTab } = useTaskContext();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'tasks' && <TasksPage />}
          {activeTab === 'planner' && <AIPlannerPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'journal' && <JournalPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <TaskModal />
      <NaturalLanguageTaskModal />
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}
