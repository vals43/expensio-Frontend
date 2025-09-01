import React from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
export function ThemeToggle() {
  const {
    theme,
    toggleTheme
  } = useTheme();
  return <button onClick={toggleTheme} className={`p-2 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} aria-label="Toggle theme">
      {theme === 'dark' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
    </button>;
}