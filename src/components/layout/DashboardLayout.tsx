'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
      <motion.div
        className="flex-1 flex flex-col min-w-0 h-screen"
        animate={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? sidebarWidth : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{ marginLeft: 0 }}
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
      </motion.div>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
