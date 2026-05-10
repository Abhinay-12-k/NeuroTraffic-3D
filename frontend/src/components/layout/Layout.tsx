import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useSocketSetup } from '../../hooks/useSocket';
import { Toaster } from 'react-hot-toast';
import { AICopilotPanel } from '../ui/AICopilotPanel';

export const Layout = () => {
  useSocketSetup();

  return (
    <div className="flex bg-sprint-bg min-h-screen text-sprint-textDark overflow-hidden font-body">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          <Outlet />
        </main>
      </div>
      <AICopilotPanel />
      <Toaster position="bottom-right" />
    </div>
  );
};
