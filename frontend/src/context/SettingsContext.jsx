import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const DEFAULT_SETTINGS = {
  aiSettings: {
    transcriptModel: 'whisper-base',
    summaryModel: 'bart-large-cnn',
    keywordExtraction: 'keybert',
    summaryLength: 'medium',
  },
  processingSettings: {
    autoTranscript: true,
    autoSummary: true,
    autoKeyMoments: true,
    autoKeywords: true,
  },
  exportSettings: {
    defaultFormat: 'pdf',
    includeTimestamp: true,
    includeKeywords: true,
    includeSpeakerLabels: false,
  },
  dashboardSettings: {
    showAnalyticsCards: true,
    showWatchTime: true,
    showAiStatistics: true,
    showNotes: true,
  },
  appearance: {
    theme: 'light',
    primaryColor: 'blue',
    fontSize: 'medium',
  },
  notifications: {
    emailNotifications: true,
    summaryReady: true,
    processingComplete: true,
    weeklyReport: false,
  },
};

const SETTINGS_KEY = 'clipmind_settings';

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          aiSettings: { ...DEFAULT_SETTINGS.aiSettings, ...parsed.aiSettings },
          processingSettings: { ...DEFAULT_SETTINGS.processingSettings, ...parsed.processingSettings },
          exportSettings: { ...DEFAULT_SETTINGS.exportSettings, ...parsed.exportSettings },
          dashboardSettings: { ...DEFAULT_SETTINGS.dashboardSettings, ...parsed.dashboardSettings },
          appearance: { ...DEFAULT_SETTINGS.appearance, ...parsed.appearance },
          notifications: { ...DEFAULT_SETTINGS.notifications, ...parsed.notifications },
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Persist to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Apply the Appearance preference to the document so Tailwind's `dark:`
  // variants and the shared dark theme styles take effect immediately.
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const useDarkTheme = settings.appearance.theme === 'dark'
        || (settings.appearance.theme === 'system' && mediaQuery.matches);
      root.classList.toggle('dark', useDarkTheme);
      root.style.colorScheme = useDarkTheme ? 'dark' : 'light';
    };

    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [settings.appearance.theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.primaryColor = settings.appearance.primaryColor;
    root.style.fontSize = ({ small: '14px', medium: '16px', large: '18px' })[settings.appearance.fontSize] || '16px';
  }, [settings.appearance.primaryColor, settings.appearance.fontSize]);

  const updateSetting = useCallback((category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  }, []);

  const updateCategory = useCallback((category, values) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...values,
      },
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(SETTINGS_KEY);
  }, []);

  const value = {
    settings,
    updateSetting,
    updateCategory,
    resetSettings,
    DEFAULT_SETTINGS,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
