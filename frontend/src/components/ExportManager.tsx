'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  Image as ImageIcon,
  Calendar,
  Clock,
  CheckCircle,
  Loader2,
  Settings,
  Filter,
  X,
  ChevronDown,
  Database,
  FileBarChart
} from 'lucide-react';

interface ExportManagerProps {
  data?: any;
  graphRef?: React.RefObject<HTMLDivElement>;
  fileName?: string;
}

type ExportFormat = 'csv' | 'excel' | 'json' | 'pdf' | 'png' | 'svg';
type TimeRange = 'last-hour' | 'last-day' | 'last-week' | 'last-month' | 'custom';

interface ExportHistory {
  id: string;
  format: ExportFormat;
  fileName: string;
  timestamp: Date;
  size: string;
  timeRange: string;
}

const ExportManager: React.FC<ExportManagerProps> = ({ 
  data,
  graphRef,
  fileName = 'thunderbird-export' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [timeRange, setTimeRange] = useState<TimeRange>('last-day');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);
  const [includeGraphs, setIncludeGraphs] = useState(true);
  const [includeData, setIncludeData] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const exportFormats = [
    { 
      id: 'csv' as ExportFormat, 
      name: 'CSV', 
      icon: FileSpreadsheet, 
      description: 'Comma-separated values',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    { 
      id: 'excel' as ExportFormat, 
      name: 'Excel', 
      icon: FileSpreadsheet, 
      description: 'Microsoft Excel format',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    },
    { 
      id: 'json' as ExportFormat, 
      name: 'JSON', 
      icon: FileJson, 
      description: 'JavaScript Object Notation',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    },
    { 
      id: 'pdf' as ExportFormat, 
      name: 'PDF', 
      icon: FileText, 
      description: 'Portable Document Format',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    { 
      id: 'png' as ExportFormat, 
      name: 'PNG', 
      icon: ImageIcon, 
      description: 'Image format',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    { 
      id: 'svg' as ExportFormat, 
      name: 'SVG', 
      icon: ImageIcon, 
      description: 'Vector graphics',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
  ];

  const timeRanges = [
    { id: 'last-hour' as TimeRange, label: 'Last Hour', duration: '1h' },
    { id: 'last-day' as TimeRange, label: 'Last 24 Hours', duration: '24h' },
    { id: 'last-week' as TimeRange, label: 'Last 7 Days', duration: '7d' },
    { id: 'last-month' as TimeRange, label: 'Last 30 Days', duration: '30d' },
    { id: 'custom' as TimeRange, label: 'Custom Range', duration: 'custom' },
  ];

  const getTimeRangeData = () => {
    const now = new Date();
    let startDate = new Date();
    let endDate = now;

    switch (timeRange) {
      case 'last-hour':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'last-day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'last-week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last-month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        startDate = customStartDate ? new Date(customStartDate) : startDate;
        endDate = customEndDate ? new Date(customEndDate) : endDate;
        break;
    }

    return { startDate, endDate };
  };

  const generateMockData = () => {
    const { startDate, endDate } = getTimeRangeData();
    const points = 100;
    const interval = (endDate.getTime() - startDate.getTime()) / points;
    
    return Array.from({ length: points }, (_, i) => ({
      timestamp: new Date(startDate.getTime() + i * interval).toISOString(),
      performance: 85 + Math.random() * 15,
      security: 90 + Math.random() * 10,
      network: 75 + Math.random() * 25,
      satellites: Math.floor(5 + Math.random() * 3),
      quantumKeys: Math.floor(100 + Math.random() * 50),
      threats: Math.floor(Math.random() * 5),
    }));
  };

  const exportToCSV = (data: any[]) => {
    if (!data || data.length === 0) {
      alert('No data available to export');
      return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        // Handle null/undefined values
        if (value === null || value === undefined) return '';
        // Format numbers to 2 decimal places
        if (typeof value === 'number') return value.toFixed(2);
        return value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadBlob(blob, `${fileName}.csv`);
  };

  const exportToJSON = (data: any[]) => {
    if (!data || data.length === 0) {
      alert('No data available to export');
      return;
    }
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    downloadBlob(blob, `${fileName}.json`);
  };

  const exportToExcel = (data: any[]) => {
    if (!data || data.length === 0) {
      alert('No data available to export');
      return;
    }
    // Simplified Excel export (would use library like xlsx in production)
    const headers = Object.keys(data[0]);
    const excelContent = [
      headers.join('\t'),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'number') return value.toFixed(2);
        return value;
      }).join('\t'))
    ].join('\n');

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    downloadBlob(blob, `${fileName}.xls`);
  };

  const exportToPDF = async () => {
    // Mock PDF export - would use jsPDF in production
    const mockPDF = `ThunderBird Export Report
Generated: ${new Date().toLocaleString()}
Time Range: ${timeRange}

Data Summary:
- Total Records: ${generateMockData().length}
- Export Format: PDF
- Includes Graphs: ${includeGraphs ? 'Yes' : 'No'}
- Includes Data: ${includeData ? 'Yes' : 'No'}
`;
    const blob = new Blob([mockPDF], { type: 'application/pdf' });
    downloadBlob(blob, `${fileName}.pdf`);
  };

  const exportToPNG = async () => {
    if (!graphRef?.current) {
      alert('No graph available to export');
      return;
    }

    // Mock PNG export - would use html2canvas in production
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.fillText('ThunderBird Analytics', 50, 50);
      ctx.font = '16px Arial';
      ctx.fillText(`Exported: ${new Date().toLocaleString()}`, 50, 80);
    }

    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${fileName}.png`);
    });
  };

  const exportToSVG = () => {
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="600" fill="#0f172a"/>
  <text x="50" y="50" fill="white" font-size="24">ThunderBird Analytics</text>
  <text x="50" y="80" fill="white" font-size="16">Exported: ${new Date().toLocaleString()}</text>
</svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    downloadBlob(blob, `${fileName}.svg`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Add to history
    const newExport: ExportHistory = {
      id: `export-${Date.now()}`,
      format: selectedFormat,
      fileName: filename,
      timestamp: new Date(),
      size: `${(blob.size / 1024).toFixed(2)} KB`,
      timeRange: timeRange === 'custom' 
        ? `${customStartDate} to ${customEndDate}` 
        : timeRanges.find(r => r.id === timeRange)?.label || timeRange
    };
    setExportHistory(prev => [newExport, ...prev].slice(0, 10));
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Use provided data or generate mock data
      let exportData = data && data.length > 0 ? data : generateMockData();
      
      // Ensure all data has valid timestamps
      exportData = exportData.map((item: any, index: number) => ({
        ...item,
        timestamp: item.timestamp || new Date(Date.now() - (exportData.length - index) * 60000).toISOString()
      }));

      switch (selectedFormat) {
        case 'csv':
          exportToCSV(exportData);
          break;
        case 'excel':
          exportToExcel(exportData);
          break;
        case 'json':
          exportToJSON(exportData);
          break;
        case 'pdf':
          await exportToPDF();
          break;
        case 'png':
          await exportToPNG();
          break;
        case 'svg':
          exportToSVG();
          break;
      }

      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  const selectedFormatInfo = exportFormats.find(f => f.id === selectedFormat);

  return (
    <>
      {/* Export Button Trigger */}
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-glow-md transition-all duration-300 whitespace-nowrap"
      >
        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        <span className="text-xs sm:text-sm">Export</span>
      </Button>

      {/* Export Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998] animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-4xl px-4 animate-slide-in"
            style={{ isolation: 'isolate' }}
          >
            <Card className="glass-card border border-blue-500/30 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="bg-gradient-to-r from-blue-900/40 via-cyan-900/40 to-blue-900/40 border-b border-blue-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-40 animate-pulse-glow"></div>
                      <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-full shadow-glow-sm">
                        <Download className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white">
                        Export Manager
                      </CardTitle>
                      <p className="text-sm text-gray-300 mt-1">
                        Export graphs and data with time-based filtering
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHistory(!showHistory)}
                      className="text-blue-400 hover:bg-blue-500/20"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      History
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {!showHistory ? (
                  <>
                    {/* Export Format Selection */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <FileBarChart className="h-4 w-4 text-blue-400" />
                        Select Export Format
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {exportFormats.map((format) => (
                          <button
                            key={format.id}
                            onClick={() => setSelectedFormat(format.id)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              selectedFormat === format.id
                                ? `${format.borderColor} ${format.bgColor} scale-105 shadow-lg`
                                : 'border-gray-500/20 bg-gray-500/5 hover:bg-gray-500/10 hover:border-gray-500/30'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <format.icon className={`h-6 w-6 ${selectedFormat === format.id ? format.color : 'text-gray-400'}`} />
                              <span className={`font-semibold ${selectedFormat === format.id ? 'text-white' : 'text-gray-300'}`}>
                                {format.name}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">{format.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Range Selection */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        Select Time Range
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        {timeRanges.map((range) => (
                          <Button
                            key={range.id}
                            variant={timeRange === range.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTimeRange(range.id)}
                            className={`${
                              timeRange === range.id
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-glow-sm'
                                : 'border-blue-500/30 text-gray-300 hover:bg-blue-500/10'
                            }`}
                          >
                            <span className="text-xs">{range.label}</span>
                          </Button>
                        ))}
                      </div>

                      {/* Custom Date Range */}
                      {timeRange === 'custom' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                          <div>
                            <label className="text-xs text-gray-400 mb-2 block">Start Date & Time</label>
                            <input
                              type="datetime-local"
                              value={customStartDate}
                              onChange={(e) => setCustomStartDate(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-500/30 rounded-lg text-white text-sm focus:border-blue-500/50 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-2 block">End Date & Time</label>
                            <input
                              type="datetime-local"
                              value={customEndDate}
                              onChange={(e) => setCustomEndDate(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-500/30 rounded-lg text-white text-sm focus:border-blue-500/50 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Export Options */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Settings className="h-4 w-4 text-blue-400" />
                        Export Options
                      </h3>
                      <div className="space-y-3 p-4 bg-gray-500/5 border border-gray-500/20 rounded-xl">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={includeGraphs}
                            onChange={(e) => setIncludeGraphs(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-500/30 bg-gray-900/50 text-blue-500 focus:ring-blue-500/50"
                          />
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                            Include Graphs & Visualizations
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={includeData}
                            onChange={(e) => setIncludeData(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-500/30 bg-gray-900/50 text-blue-500 focus:ring-blue-500/50"
                          />
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                            Include Raw Data Tables
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Export Summary */}
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl">
                      <h3 className="text-sm font-semibold text-blue-300 mb-3">Export Summary</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Format:</p>
                          <p className="text-white font-semibold">{selectedFormatInfo?.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Time Range:</p>
                          <p className="text-white font-semibold">
                            {timeRange === 'custom' ? 'Custom' : timeRanges.find(r => r.id === timeRange)?.label}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Estimated Size:</p>
                          <p className="text-white font-semibold">
                            {selectedFormat === 'png' || selectedFormat === 'svg' ? '~500 KB' : '~150 KB'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Data Points:</p>
                          <p className="text-white font-semibold">~{generateMockData().length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Export Button */}
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="border-gray-500/30 text-gray-300 hover:bg-gray-500/10"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleExport}
                        disabled={isExporting || (!includeGraphs && !includeData)}
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-glow-sm px-8"
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Export Now
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Export History */
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-400" />
                      Recent Exports
                    </h3>
                    {exportHistory.length === 0 ? (
                      <div className="text-center py-12">
                        <Database className="h-16 w-16 mx-auto mb-3 text-gray-500 opacity-50" />
                        <p className="text-gray-400">No export history yet</p>
                        <p className="text-xs text-gray-500 mt-1">Your exports will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {exportHistory.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 bg-gray-500/5 border border-gray-500/20 rounded-xl hover:bg-gray-500/10 transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                {exportFormats.find(f => f.id === item.format)?.icon && 
                                  React.createElement(exportFormats.find(f => f.id === item.format)!.icon, {
                                    className: `h-5 w-5 ${exportFormats.find(f => f.id === item.format)!.color}`
                                  })
                                }
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-white">{item.fileName}</p>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                    <span>{item.timeRange}</span>
                                    <span>•</span>
                                    <span>{item.size}</span>
                                    <span>•</span>
                                    <span>{item.timestamp.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default ExportManager;
