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
    <div className="flex items-center space-x-2">
      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="flex items-center space-x-1 bg-black/20 backdrop-blur-sm border-white/10"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
      </Button>

      {/* Export Menu */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="flex items-center space-x-1 bg-black/20 backdrop-blur-sm border-white/10"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>

        {showExportMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-50">
            <div className="p-2 space-y-1">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 rounded-md transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Export as PDF</span>
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 rounded-md transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Export as CSV</span>
              </button>
              <button
                onClick={() => handleExport('json')}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 rounded-md transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Export as JSON</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-1 bg-black/20 backdrop-blur-sm border-white/10"
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">Settings</span>
      </Button>
    </div>
  );
};

export default ThemeToggle; 