import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarCollapsed: boolean
  rightPanelOpen: boolean
  activeTab: string
  toggleSidebar: () => void
  toggleRightPanel: () => void
  setActiveTab: (tab: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      rightPanelOpen: true,
      activeTab: 'overview',
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    { name: 'hyperweather-ui' }
  )
)
