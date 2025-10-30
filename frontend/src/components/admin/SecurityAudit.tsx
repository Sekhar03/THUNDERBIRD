'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Shield,
  AlertTriangle,
  Eye,
  Download,
  Filter,
  Calendar,
  User,
  Lock,
  Unlock,
  Key,
  Database,
  Activity,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const SecurityAudit: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 600000),
      user: 'john.admin@thunderbird.com',
      action: 'Key Generation',
      resource: 'QK-2024-005-X1Y2',
      ipAddress: '192.168.1.100',
      status: 'success',
      details: 'Generated new quantum key for satellite-003',
      severity: 'medium'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1200000),
      user: 'sarah.ops@thunderbird.com',
      action: 'Data Transfer',
      resource: 'TRF-2024-015',
      ipAddress: '192.168.1.101',
      status: 'success',
      details: 'Initiated encrypted data transfer to ground station',
      severity: 'high'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1800000),
      user: 'unknown@external.com',
      action: 'Login Attempt',
      resource: 'Auth System',
      ipAddress: '45.123.45.67',
      status: 'failed',
      details: 'Failed login attempt - invalid credentials',
      severity: 'critical'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 2400000),
      user: 'mike.op@thunderbird.com',
      action: 'Key Revocation',
      resource: 'QK-2023-098-D5A2',
      ipAddress: '192.168.1.102',
      status: 'warning',
      details: 'Revoked expired quantum key',
      severity: 'low'
    },
  ]);

  const [securityAlerts, setSecurityAlerts] = useState([
    { id: '1', type: 'Unauthorized Access Attempt', count: 3, severity: 'critical', lastOccurrence: new Date(Date.now() - 3600000) },
    { id: '2', type: 'Unusual Data Transfer Pattern', count: 1, severity: 'high', lastOccurrence: new Date(Date.now() - 7200000) },
    { id: '3', type: 'Key Usage Anomaly', count: 2, severity: 'medium', lastOccurrence: new Date(Date.now() - 10800000) },
  ]);

  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [filterSeverity, setFilterSeverity] = useState<'all' | AuditLog['severity']>('all');

  // Mock activity data
  const activityData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    logins: Math.floor(Math.random() * 20 + 5),
    transfers: Math.floor(Math.random() * 15 + 3),
    keyOps: Math.floor(Math.random() * 10 + 2),
    failures: Math.floor(Math.random() * 3)
  }));

  const filteredLogs = filterSeverity === 'all' 
    ? auditLogs 
    : auditLogs.filter(log => log.severity === filterSeverity);

  const getSeverityColor = (severity: AuditLog['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'low': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
    }
  };

  const getStatusColor = (status: AuditLog['status']) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'failed': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Key')) return <Key className="h-4 w-4" />;
    if (action.includes('Transfer')) return <Database className="h-4 w-4" />;
    if (action.includes('Login')) return <User className="h-4 w-4" />;
    if (action.includes('Lock') || action.includes('Unlock')) return <Lock className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const stats = {
    totalLogs: auditLogs.length,
    criticalAlerts: securityAlerts.filter(a => a.severity === 'critical').length,
    failedAttempts: auditLogs.filter(l => l.status === 'failed').length,
    activeMonitoring: true
  };

  // Export logs as CSV
  const handleExportLogs = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Resource', 'IP Address', 'Status', 'Severity', 'Details'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.user,
        log.action,
        log.resource,
        log.ipAddress,
        log.status,
        log.severity,
        `"${log.details.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `security-audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate comprehensive security report
  const handleGenerateReport = () => {
    const report = {
      reportGenerated: new Date().toISOString(),
      timeRange: timeRange,
      summary: {
        totalAuditLogs: stats.totalLogs,
        criticalAlerts: stats.criticalAlerts,
        failedAttempts: stats.failedAttempts,
        successfulOperations: auditLogs.filter(l => l.status === 'success').length,
        warningOperations: auditLogs.filter(l => l.status === 'warning').length
      },
      securityAlerts: securityAlerts.map(alert => ({
        type: alert.type,
        severity: alert.severity,
        occurrences: alert.count,
        lastOccurrence: alert.lastOccurrence.toISOString()
      })),
      auditLogs: filteredLogs.map(log => ({
        timestamp: log.timestamp.toISOString(),
        user: log.user,
        action: log.action,
        resource: log.resource,
        ipAddress: log.ipAddress,
        status: log.status,
        severity: log.severity,
        details: log.details
      })),
      activityStatistics: {
        totalLogins: activityData.reduce((sum, d) => sum + d.logins, 0),
        totalTransfers: activityData.reduce((sum, d) => sum + d.transfers, 0),
        totalKeyOperations: activityData.reduce((sum, d) => sum + d.keyOps, 0),
        totalFailures: activityData.reduce((sum, d) => sum + d.failures, 0)
      },
      recommendations: [
        stats.criticalAlerts > 0 ? 'Immediate action required: Critical security alerts detected' : 'No critical alerts',
        stats.failedAttempts > 5 ? 'High number of failed attempts - review access controls' : 'Failed attempts within normal range',
        'Regular security audits recommended',
        'Enable multi-factor authentication for all users',
        'Review and update IP whitelist regularly'
      ]
    };

    const reportText = `
╔════════════════════════════════════════════════════════════════╗
║           THUNDERBIRD SECURITY AUDIT REPORT                    ║
║           Generated: ${new Date().toLocaleString()}                   ║
╚════════════════════════════════════════════════════════════════╝

📊 EXECUTIVE SUMMARY
${'─'.repeat(64)}
Time Range: ${timeRange}
Total Audit Logs: ${report.summary.totalAuditLogs}
Critical Alerts: ${report.summary.criticalAlerts}
Failed Attempts: ${report.summary.failedAttempts}
Successful Operations: ${report.summary.successfulOperations}
Warning Operations: ${report.summary.warningOperations}

🚨 ACTIVE SECURITY ALERTS
${'─'.repeat(64)}
${report.securityAlerts.map((alert, i) => `
${i + 1}. ${alert.type}
   Severity: ${alert.severity.toUpperCase()}
   Occurrences: ${alert.occurrences}
   Last Occurrence: ${new Date(alert.lastOccurrence).toLocaleString()}`).join('\n')}

📈 ACTIVITY STATISTICS
${'─'.repeat(64)}
Total Logins: ${report.activityStatistics.totalLogins}
Total Transfers: ${report.activityStatistics.totalTransfers}
Total Key Operations: ${report.activityStatistics.totalKeyOperations}
Total Failures: ${report.activityStatistics.totalFailures}

📋 RECENT AUDIT LOGS (Last ${filteredLogs.length} entries)
${'─'.repeat(64)}
${report.auditLogs.map((log, i) => `
${i + 1}. [${new Date(log.timestamp).toLocaleString()}]
   User: ${log.user}
   Action: ${log.action}
   Resource: ${log.resource}
   IP: ${log.ipAddress}
   Status: ${log.status.toUpperCase()}
   Severity: ${log.severity.toUpperCase()}
   Details: ${log.details}`).join('\n')}

💡 SECURITY RECOMMENDATIONS
${'─'.repeat(64)}
${report.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

${'═'.repeat(64)}
Report generated by Thunderbird Quantum Security System
For internal use only - Confidential
${'═'.repeat(64)}
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `security-report-${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Also download JSON version
    const jsonBlob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json;charset=utf-8;' });
    const jsonLink = document.createElement('a');
    const jsonUrl = URL.createObjectURL(jsonBlob);
    jsonLink.setAttribute('href', jsonUrl);
    jsonLink.setAttribute('download', `security-report-${new Date().toISOString().split('T')[0]}.json`);
    jsonLink.style.visibility = 'hidden';
    document.body.appendChild(jsonLink);
    setTimeout(() => {
      jsonLink.click();
      document.body.removeChild(jsonLink);
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border border-red-500/30 rounded-3xl">
        <CardHeader className="border-b border-red-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-full blur-xl opacity-40 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-orange-600 p-3 rounded-full shadow-glow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold gradient-text-quantum">
                  Security & Audit System
                </CardTitle>
                <p className="text-sm text-gray-300 mt-1">
                  Real-time monitoring, audit logs, and compliance tracking
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
                onClick={handleExportLogs}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Logs
              </Button>
              <Button 
                variant="outline" 
                className="glass-card border-red-500/30"
                onClick={handleGenerateReport}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border border-blue-500/30 rounded-2xl hover:shadow-glow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-5 w-5 text-blue-400" />
              <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-400 text-xs">
                24h
              </Badge>
            </div>
            <p className="text-2xl font-bold text-blue-400">{stats.totalLogs}</p>
            <p className="text-xs text-gray-400 mt-1">Audit Logs</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-red-500/30 rounded-2xl hover:shadow-glow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
              <Badge variant="outline" className="bg-red-500/20 border-red-500/30 text-red-400 text-xs">
                Critical
              </Badge>
            </div>
            <p className="text-2xl font-bold text-red-400">{stats.criticalAlerts}</p>
            <p className="text-xs text-gray-400 mt-1">Security Alerts</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-orange-500/30 rounded-2xl hover:shadow-glow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="h-5 w-5 text-orange-400" />
              <Badge variant="outline" className="bg-orange-500/20 border-orange-500/30 text-orange-400 text-xs">
                Failed
              </Badge>
            </div>
            <p className="text-2xl font-bold text-orange-400">{stats.failedAttempts}</p>
            <p className="text-xs text-gray-400 mt-1">Failed Attempts</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-green-500/30 rounded-2xl hover:shadow-glow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-5 w-5 text-green-400" />
              <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-400 text-xs">
                Active
              </Badge>
            </div>
            <p className="text-2xl font-bold text-green-400">ON</p>
            <p className="text-xs text-gray-400 mt-1">Live Monitoring</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card className="glass-card border border-red-500/30 rounded-2xl">
        <CardHeader className="border-b border-red-500/30">
          <CardTitle className="text-xl font-bold text-red-300 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {securityAlerts.map((alert) => (
              <div
                key={alert.id}
                className="glass-card border border-red-500/30 rounded-xl p-4 hover:shadow-glow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-5 w-5 ${
                      alert.severity === 'critical' ? 'text-red-400 animate-pulse' :
                      alert.severity === 'high' ? 'text-orange-400' :
                      'text-yellow-400'
                    }`} />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{alert.type}</h4>
                      <p className="text-xs text-gray-400">
                        Last occurred: {alert.lastOccurrence.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`${getSeverityColor(alert.severity as AuditLog['severity'])} text-xs capitalize`}>
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline" className="bg-red-500/20 border-red-500/30 text-red-400 text-xs">
                      {alert.count} times
                    </Badge>
                    <Button size="sm" className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30">
                      Investigate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Chart */}
      <Card className="glass-card border border-purple-500/30 rounded-2xl">
        <CardHeader className="border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-purple-300 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Security Activity (24h)
            </CardTitle>
            <div className="flex gap-2">
              {(['24h', '7d', '30d'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={`text-xs ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                      : 'border-purple-500/30'
                  }`}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="logins" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Logins" />
              <Area type="monotone" dataKey="transfers" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} name="Transfers" />
              <Area type="monotone" dataKey="keyOps" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Key Ops" />
              <Area type="monotone" dataKey="failures" stroke="#EF4444" fill="#EF4444" fillOpacity={0.8} name="Failures" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card className="glass-card border border-blue-500/30 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-blue-500/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-blue-300 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Audit Logs
            </CardTitle>
            <div className="flex gap-2">
              <Filter className="h-4 w-4 text-blue-400 mt-2" />
              {(['all', 'low', 'medium', 'high', 'critical'] as const).map((sev) => (
                <Button
                  key={sev}
                  variant={filterSeverity === sev ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterSeverity(sev)}
                  className={`capitalize text-xs ${
                    filterSeverity === sev
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                      : 'border-blue-500/30'
                  }`}
                >
                  {sev}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-b border-blue-500/30">
                <TableHead className="text-blue-300 font-bold">Timestamp</TableHead>
                <TableHead className="text-blue-300 font-bold">User</TableHead>
                <TableHead className="text-blue-300 font-bold">Action</TableHead>
                <TableHead className="text-blue-300 font-bold">Resource</TableHead>
                <TableHead className="text-blue-300 font-bold">IP Address</TableHead>
                <TableHead className="text-blue-300 font-bold">Status</TableHead>
                <TableHead className="text-blue-300 font-bold">Severity</TableHead>
                <TableHead className="text-blue-300 font-bold">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow
                  key={log.id}
                  className="border-b border-blue-500/20 hover:bg-white/5 transition-all"
                >
                  <TableCell className="text-xs text-gray-300 font-mono">
                    {log.timestamp.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-gray-300">{log.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="text-xs text-white">{log.action}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-gray-300 font-mono">{log.resource}</TableCell>
                  <TableCell className="text-xs text-gray-300 font-mono">{log.ipAddress}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(log.status)} text-xs capitalize`}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getSeverityColor(log.severity)} text-xs capitalize`}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-300 max-w-xs truncate">{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default SecurityAudit;
