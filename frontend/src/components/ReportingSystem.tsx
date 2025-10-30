'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Settings,
  Send,
  Eye,
  Trash2,
  Copy,
  Share2,
  FileSpreadsheet,
  FileJson,
  Printer,
  Mail
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'system' | 'satellite' | 'security' | 'performance' | 'custom';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  schedule: 'manual' | 'daily' | 'weekly' | 'monthly';
  lastGenerated: Date;
  status: 'completed' | 'generating' | 'scheduled' | 'failed';
  size: string;
}

const ReportingSystem: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Daily System Health Report',
      type: 'system',
      format: 'pdf',
      schedule: 'daily',
      lastGenerated: new Date(Date.now() - 3600000),
      status: 'completed',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Weekly Satellite Performance',
      type: 'satellite',
      format: 'excel',
      schedule: 'weekly',
      lastGenerated: new Date(Date.now() - 86400000),
      status: 'completed',
      size: '5.1 MB'
    },
    {
      id: '3',
      name: 'Security Audit Log',
      type: 'security',
      format: 'csv',
      schedule: 'monthly',
      lastGenerated: new Date(Date.now() - 172800000),
      status: 'completed',
      size: '1.8 MB'
    },
    {
      id: '4',
      name: 'Real-time Analytics Snapshot',
      type: 'performance',
      format: 'json',
      schedule: 'manual',
      lastGenerated: new Date(Date.now() - 7200000),
      status: 'generating',
      size: '-'
    },
  ]);

  const [selectedType, setSelectedType] = useState<'all' | Report['type']>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredReports = selectedType === 'all' 
    ? reports 
    : reports.filter(r => r.type === selectedType);

  const getTypeColor = (type: Report['type']) => {
    switch (type) {
      case 'system': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      case 'satellite': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'security': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'performance': return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
      case 'custom': return 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'generating': return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-blue-400" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  const getFormatIcon = (format: Report['format']) => {
    switch (format) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-400" />;
      case 'excel': return <FileSpreadsheet className="h-4 w-4 text-green-400" />;
      case 'csv': return <FileText className="h-4 w-4 text-blue-400" />;
      case 'json': return <FileJson className="h-4 w-4 text-purple-400" />;
    }
  };

  const handleDownload = (report: Report) => {
    console.log('Downloading report:', report.name);
    // Implement actual download logic
  };

  const handleDelete = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  const handleGenerateNow = (reportId: string) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'generating' as const } : r
    ));

    // Simulate generation
    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, status: 'completed' as const, lastGenerated: new Date() } : r
      ));
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Main Reporting Card */}
      <Card className="glass-card border border-cyan-500/30 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-purple-900/40 border-b border-cyan-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 rounded-full blur-xl opacity-40 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-3 rounded-full shadow-glow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white animate-float" aria-hidden="true" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold gradient-text-quantum">
                  Advanced Reporting & Export
                </CardTitle>
                <p className="text-sm text-gray-300 mt-1">
                  Automated reports • Custom exports • {reports.length} reports configured
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateModal(true)}
                className="glass-card border-cyan-500/30 hover:bg-cyan-500/20"
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="glass-card border-cyan-500/30"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(['all', 'system', 'satellite', 'security', 'performance', 'custom'] as const).map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type)}
                className={`capitalize text-xs ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-sm'
                    : 'border-cyan-500/30'
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="glass-card border border-green-500/30 rounded-2xl p-4 hover:shadow-glow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-400 text-xs">
                  Today
                </Badge>
              </div>
              <p className="text-2xl font-bold text-green-400">12</p>
              <p className="text-xs text-gray-400 mt-1">Reports Generated</p>
            </div>

            <div className="glass-card border border-blue-500/30 rounded-2xl p-4 hover:shadow-glow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-400 text-xs">
                  Scheduled
                </Badge>
              </div>
              <p className="text-2xl font-bold text-blue-400">8</p>
              <p className="text-xs text-gray-400 mt-1">Upcoming Reports</p>
            </div>

            <div className="glass-card border border-purple-500/30 rounded-2xl p-4 hover:shadow-glow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <Download className="h-5 w-5 text-purple-400" />
                <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-400 text-xs">
                  Total
                </Badge>
              </div>
              <p className="text-2xl font-bold text-purple-400">245</p>
              <p className="text-xs text-gray-400 mt-1">Downloads This Month</p>
            </div>

            <div className="glass-card border border-cyan-500/30 rounded-2xl p-4 hover:shadow-glow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                <Badge variant="outline" className="bg-cyan-500/20 border-cyan-500/30 text-cyan-400 text-xs">
                  Storage
                </Badge>
              </div>
              <p className="text-2xl font-bold text-cyan-400">2.4 GB</p>
              <p className="text-xs text-gray-400 mt-1">Total Size</p>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="glass-card border border-cyan-500/30 rounded-2xl p-5 hover:shadow-glow-sm transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getFormatIcon(report.format)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {report.name}
                        {getStatusIcon(report.status)}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getTypeColor(report.type)}`}>
                          {report.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-gray-500/20 border-gray-500/30 text-gray-400">
                          {report.format.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.schedule === 'manual' ? 'Manual' : `Auto ${report.schedule}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last: {report.lastGenerated.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {report.size}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {report.status === 'completed' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleDownload(report)}
                            className="text-xs bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/30"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-cyan-500/30"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-cyan-500/30"
                          >
                            <Share2 className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-cyan-500/30"
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                        </>
                      )}
                      
                      {report.status !== 'generating' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateNow(report.id)}
                          className="text-xs border-blue-500/30"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Generate Now
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(report.id)}
                        className="text-xs border-red-500/30 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Progress bar for generating reports */}
                    {report.status === 'generating' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span>Generating report...</span>
                          <span>45%</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card className="glass-card border border-purple-500/30 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 border-b border-purple-500/30 p-6">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-400" />
            Quick Export Templates
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'System Snapshot', icon: FileText, format: 'PDF', color: 'red' },
              { name: 'Satellite Data', icon: FileSpreadsheet, format: 'Excel', color: 'green' },
              { name: 'Analytics Export', icon: FileJson, format: 'JSON', color: 'purple' },
              { name: 'Audit Logs', icon: FileText, format: 'CSV', color: 'blue' },
              { name: 'Performance Metrics', icon: FileSpreadsheet, format: 'Excel', color: 'green' },
              { name: 'Custom Query', icon: FileJson, format: 'JSON', color: 'purple' },
            ].map((template, index) => (
              <Button
                key={index}
                variant="outline"
                className="glass-card border-purple-500/30 h-auto p-4 flex-col items-start hover:shadow-glow-sm transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <template.icon className={`h-5 w-5 text-${template.color}-400`} />
                  <span className="font-semibold text-white">{template.name}</span>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <Badge variant="outline" className={`text-xs bg-${template.color}-500/20 border-${template.color}-500/30 text-${template.color}-400`}>
                    {template.format}
                  </Badge>
                  <Download className="h-4 w-4 ml-auto text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingSystem;
