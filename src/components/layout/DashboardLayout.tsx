'use client';

import FloatingDock from './FloatingDock';
import FloatingHeader from './FloatingHeader';
import RightPanel from './RightPanel';
import MobileNav from './MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden flex">
      {/* Slow-moving elegant ambient gradient background */}
      <div className="ambient-bg" />

      {/* Floating Left Navigation dock */}
      <FloatingDock />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-24 pt-4 pb-20 md:pb-4 transition-all duration-300">
        
        {/* Floating Top Header bar */}
        <FloatingHeader />

        {/* Dynamic Workspace Container */}
        <div className="flex-1 flex overflow-hidden min-h-0 mt-4">
          
          {/* Breathing scrollable main workspace content */}
          <main className="flex-1 overflow-y-auto scroller px-4 md:px-6 pb-12">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>

          {/* Right Info Panel */}
          <RightPanel />
        </div>
      </div>

      {/* Bottom Dock Nav on Mobile */}
      <MobileNav />
    </div>
  );
}
