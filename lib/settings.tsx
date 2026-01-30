'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AppSettings, TextSize, Theme, ChunkLength, SpeakerColorMode, CaptionMode, DisplayMode } from './types'

const defaultSettings: AppSettings = {
  textSize: 'medium',
  theme: 'light',
  chunkLength: 'medium',
  speakerColorMode: 'colorful',
  showHistory: true,
  captionMode: 'social',
  displayMode: 'personal',
  groupFeedbackEnabled: false,
}

interface SettingsContextType {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load settings from localStorage
    const saved = localStorage.getItem('caption-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (e) {
        console.error('Failed to load settings', e)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    // Save settings to localStorage
    localStorage.setItem('caption-settings', JSON.stringify(settings))
    
    // Apply theme
    const root = document.documentElement
    root.classList.remove('light', 'dark', 'high-contrast')
    
    if (settings.theme === 'high-contrast') {
      root.classList.add('high-contrast', 'dark')
      root.style.colorScheme = 'dark'
    } else if (settings.theme === 'dark') {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.add('light')
      root.style.colorScheme = 'light'
    }
  }, [settings, mounted])

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  // During SSR or if context is undefined, return default settings
  if (context === undefined) {
    if (typeof window === 'undefined') {
      // SSR: return default settings
      return {
        settings: defaultSettings,
        updateSettings: () => {},
      }
    }
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
