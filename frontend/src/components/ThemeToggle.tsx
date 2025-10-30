'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sun, 
  Moon, 
  Download, 
  FileText, 
  Settings
} from 'lucide-react';

interface ThemeToggleProps {
  onExport?: (format: 'pdf' | 'csv' | 'json') => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ onExport }) => {
  const [isDark, setIsDark] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // In a real app, you'd update the global theme state
    document.documentElement.classList.toggle('light');
  };

  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    if (onExport) {
      onExport(format);
    }
    setShowExportMenu(false);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Enhanced Theme Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="flex items-center gap-2 glass-card border-white/20 hover:border-white/30 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-glow-sm"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-yellow-400 animate-float" aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4 text-blue-400" aria-hidden="true" />
        )}
        <span className="hidden sm:inline font-medium">{isDark ? 'Light' : 'Dark'}</span>
      </Button>

      {/* Enhanced Export Menu */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="flex items-center gap-2 glass-card border-white/20 hover:border-white/30 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-glow-sm"
          aria-label="Export options"
          aria-expanded={showExportMenu}
          aria-haspopup="true"
        >
          <Download className="h-4 w-4 text-blue-400" aria-hidden="true" />
          <span className="hidden sm:inline font-medium">Export</span>
        </Button>

        {showExportMenu && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowExportMenu(false)}
              aria-hidden="true"
            />
            
            {/* Menu */}
            <div 
              className="absolute right-0 mt-3 w-52 glass-card border border-white/20 rounded-2xl shadow-glow-lg z-50 animate-slide-in"
              role="menu"
              aria-label="Export format options"
            >
              <div className="p-2 space-y-1">
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-200 hover:bg-white/15 rounded-xl transition-all duration-200 hover:scale-[1.02] group"
                  role="menuitem"
                >
                  <FileText className="h-4 w-4 text-red-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="group-hover:text-white transition-colors">Export as PDF</span>
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-200 hover:bg-white/15 rounded-xl transition-all duration-200 hover:scale-[1.02] group"
                  role="menuitem"
                >
                  <FileText className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="group-hover:text-white transition-colors">Export as CSV</span>
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-200 hover:bg-white/15 rounded-xl transition-all duration-200 hover:scale-[1.02] group"
                  role="menuitem"
                >
                  <FileText className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="group-hover:text-white transition-colors">Export as JSON</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced Settings */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 glass-card border-white/20 hover:border-white/30 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-glow-sm"
        aria-label="Open settings"
      >
        <Settings className="h-4 w-4 text-gray-400 hover:text-gray-200 hover:rotate-90 transition-all duration-500" aria-hidden="true" />
        <span className="hidden sm:inline font-medium">Settings</span>
      </Button>
    </div>
  );
};

export default ThemeToggle;