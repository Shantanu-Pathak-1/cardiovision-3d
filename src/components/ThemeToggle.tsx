import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className={`icon-button ${className}`}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'clinical light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'clinical light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
