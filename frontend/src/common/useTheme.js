// useTheme.js
// Custom hook for dark/light theme toggle.
// Persists to localStorage and respects OS preference on first visit.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'vectorshift-theme';

/**
 * Reads the initial theme:
 * 1. localStorage if present
 * 2. OS prefers-color-scheme
 * 3. fallback to 'dark'
 */
const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}

  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  }

  return 'dark';
};

export const useTheme = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  // Sync the data-theme attribute on <html> and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
};
