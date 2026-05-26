import { Sidebar } from '@/components/layout/Sidebar'
import { RightPanel } from '@/components/layout/RightPanel'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B1020]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {children}
      </main>
      <RightPanel />
    </div>
  )
}
