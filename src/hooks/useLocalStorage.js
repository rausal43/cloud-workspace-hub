import { useState, useEffect } from 'react';

export function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.warn(`Failed to read key "${key}" from localStorage:`, err);
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.warn(`Failed to save key "${key}" to localStorage:`, err);
    }
  }, [key, state]);

  return [state, setState];
}
