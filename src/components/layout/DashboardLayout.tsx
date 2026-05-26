'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import RightPanel from './RightPanel';
import MobileNav from './MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 64 : 240;

  return (
    <div className="flex h-screen overflow-hidden gradient-bg">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed inset-y-0 left-0 z-50 w-64 glass-sidebar">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileMenuOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main content area */}
      <div
        className="flex-1 flex flex-col min-w-0 h-screen transition-[padding-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] pl-0 md:pl-[var(--sidebar-width)]"
        style={{
          ['--sidebar-width' as any]: sidebarCollapsed ? '64px' : '240px',
        }}
      >
        {/* Header */}
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Content + Right Panel */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Main scrollable content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-28 md:pb-8">
            {children}
          </main>

          {/* Right Panel */}
          <RightPanel />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
