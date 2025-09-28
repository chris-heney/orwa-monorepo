import React, { createContext, useContext, useMemo } from 'react'
import { useStore } from 'react-admin'

interface AssetContextValue {
  selectedBucket: string
  setSelectedBucket: (bucket: string) => void
  currentPath: string
  setCurrentPath: (path: string) => void
  // Convenience helpers
  pathSegments: string[]
  viewMode: string
  setViewMode: (mode: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarWidth: number
  setSidebarWidth: (w: number) => void
}

const AssetContext = createContext<AssetContextValue | undefined>(undefined)

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedBucket, setSelectedBucket] = useStore<string>('asset.selectedBucket', '')
  const [currentPath, setCurrentPath] = useStore<string>('asset.currentPath', '')
  const [viewMode, setViewMode] = useStore<string>('asset.viewMode', 'list')
  const [sidebarOpen, setSidebarOpen] = useStore<boolean>('asset.sidebarOpen', true)
  const [sidebarWidth, setSidebarWidth] = useStore<number>('asset.sidebarWidth', 280)

  const pathSegments = useMemo(() => {
    const trimmed = currentPath.replace(/^\/+/, '').replace(/\/+$/, '')
    if (!trimmed) return []
    return trimmed.split('/')
  }, [currentPath])

  const value: AssetContextValue = {
    selectedBucket,
    setSelectedBucket,
    currentPath,
    setCurrentPath,
    pathSegments,
    viewMode,
    setViewMode,
    sidebarOpen,
    setSidebarOpen,
    sidebarWidth,
    setSidebarWidth,
  }

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
}

export const useAssetProvider = (): AssetContextValue => {
  const ctx = useContext(AssetContext)
  if (!ctx) throw new Error('useAssetProvider must be used within AssetProvider')
  return ctx
}
