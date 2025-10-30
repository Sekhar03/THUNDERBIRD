'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Shield,
  Users,
  Key,
  Database,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Lock,
  Unlock,
  Eye,
  Settings,
  BarChart3,
  Cpu,
  HardDrive,
  Wifi,
  Zap
} from 'lucide-react';

interface AdminDashboardProps {
  userRole?: 'super_admin' | 'admin' | 'operator';
  onNavigate?: (tab: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userRole = 'admin', onNavigate }) => {
  const [systemStats, setSystemStats] = useState({
    totalUsers: 245,
    activeUsers: 89,
    totalKeys: 1523,
    activeTransfers: 34,
    dataTransferred: 2.4, // TB
    systemUptime: 99.98,
    pendingApprovals: 12,
    securityAlerts: 3
  });

  const [activityData, setActivityData] = useState<any[]>([]);
  const [resourceData, setResourceData] = useState<any[]>([]);

  useEffect(() => {
    // Generate activity data
    const activity = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      users: Math.floor(Math.random() * 100 + 20),
      transfers: Math.floor(Math.random() * 50 + 10),
      keys: Math.floor(Math.random() * 30 + 5)
    }));
    setActivityData(activity);

    // Generate resource usage data
    const resources = Array.from({ length: 12 }, (_, i) => ({
      time: `${i * 2}:00`,
      cpu: Math.floor(Math.random() * 40 + 30),
      memory: Math.floor(Math.random() * 30 + 50),
      storage: Math.floor(Math.random() * 20 + 40),
      network: Math.floor(Math.random() * 50 + 20)
    }));
    setResourceData(resources);
  }, []);

  const userDistribution = [
    { name: 'Admins', value: 12, color: '#8B5CF6' },
    { name: 'Operators', value: 45, color: '#3B82F6' },
    { name: 'Viewers', value: 188, color: '#10B981' }
  ];

  const transferStatus = [
    { name: 'Completed', value: 156, color: '#10B981' },
    { name: 'In Progress', value: 34, color: '#F59E0B' },
    { name: 'Pending', value: 23, color: '#6B7280' },
    { name: 'Failed', value: 7, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="glass-card border border-purple-500/30 rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 rounded-full blur-2xl opacity-40 animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-br from-purple-500 via-pink-600 to-purple-600 p-4 rounded-full shadow-glow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white animate-float" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text-quantum">Admin Control Center</h1>
              <p className="text-gray-300 mt-1">System Management & Administration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-400 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              {userRole.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-400 px-4 py-2">
              <Activity className="h-4 w-4 mr-2 animate-pulse" />
              System Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card className="glass-card border border-blue-500/30 rounded-2xl hover:shadow-glow-md transition-all group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-blue-400 group-hover:scale-110 transition-transform" />
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{systemStats.totalUsers}</p>
            <p className="text-sm text-gray-400 mt-1">Total Users</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(systemStats.activeUsers / systemStats.totalUsers) * 100}%` }}></div>
              </div>
              <span className="text-xs text-gray-400">{systemStats.activeUsers} active</span>
            </div>
          </CardContent>
        </Card>

        {/* Quantum Keys */}
        <Card className="glass-card border border-purple-500/30 rounded-2xl hover:shadow-glow-md transition-all group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Key className="h-8 w-8 text-purple-400 group-hover:rotate-12 transition-transform" />
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-purple-400">{systemStats.totalKeys}</p>
            <p className="text-sm text-gray-400 mt-1">Quantum Keys</p>
            <div className="mt-3 text-xs text-purple-300">
              <span className="font-semibold">{Math.floor(systemStats.totalKeys * 0.85)}</span> active • 
              <span className="font-semibold ml-1">{Math.floor(systemStats.totalKeys * 0.15)}</span> reserved
            </div>
          </CardContent>
        </Card>

        {/* Active Transfers */}
        <Card className="glass-card border border-cyan-500/30 rounded-2xl hover:shadow-glow-md transition-all group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Database className="h-8 w-8 text-cyan-400 group-hover:scale-110 transition-transform" />
              <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
            </div>
            <p className="text-3xl font-bold text-cyan-400">{systemStats.activeTransfers}</p>
            <p className="text-sm text-gray-400 mt-1">Active Transfers</p>
            <div className="mt-3 text-xs text-cyan-300">
              <span className="font-semibold">{systemStats.dataTransferred} TB</span> transferred today
            </div>
          </CardContent>
        </Card>

        {/* System Uptime */}
        <Card className="glass-card border border-green-500/30 rounded-2xl hover:shadow-glow-md transition-all group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Server className="h-8 w-8 text-green-400 group-hover:scale-110 transition-transform" />
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-400">{systemStats.systemUptime}%</p>
            <p className="text-sm text-gray-400 mt-1">System Uptime</p>
            <div className="mt-3 text-xs text-green-300">
              Last 30 days • Excellent
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity & Resource Monitoring */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card className="glass-card border border-blue-500/30 rounded-2xl">
          <CardHeader className="border-b border-blue-500/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-blue-300 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Activity (24h)
              </CardTitle>
              <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-400">
                Real-time
              </Badge>
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
                <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Users" />
                <Area type="monotone" dataKey="transfers" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} name="Transfers" />
                <Area type="monotone" dataKey="keys" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Keys" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resource Usage */}
        <Card className="glass-card border border-purple-500/30 rounded-2xl">
          <CardHeader className="border-b border-purple-500/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-purple-300 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Resource Usage
              </CardTitle>
              <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-400">
                Live Monitoring
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={resourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
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
                <Line type="monotone" dataKey="cpu" stroke="#EF4444" strokeWidth={2} name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#F59E0B" strokeWidth={2} name="Memory %" />
                <Line type="monotone" dataKey="storage" stroke="#3B82F6" strokeWidth={2} name="Storage %" />
                <Line type="monotone" dataKey="network" stroke="#10B981" strokeWidth={2} name="Network %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User & Transfer Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <Card className="glass-card border border-green-500/30 rounded-2xl">
          <CardHeader className="border-b border-green-500/30">
            <CardTitle className="text-xl font-bold text-green-300 flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {userDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfer Status */}
        <Card className="glass-card border border-orange-500/30 rounded-2xl">
          <CardHeader className="border-b border-orange-500/30">
            <CardTitle className="text-xl font-bold text-orange-300 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Transfer Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {transferStatus.map((status, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }}></div>
                      <span className="text-sm text-gray-300">{status.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{status.value}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: status.color,
                        width: `${(status.value / 220) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      <Card className="glass-card border border-yellow-500/30 rounded-2xl">
        <CardHeader className="border-b border-yellow-500/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-yellow-300 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Pending Actions
            </CardTitle>
            <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500/30 text-yellow-400">
              {systemStats.pendingApprovals} items
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card border border-yellow-500/30 rounded-xl p-4 hover:shadow-glow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <Lock className="h-5 w-5 text-yellow-400" />
                <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500/30 text-yellow-400 text-xs">
                  5 pending
                </Badge>
              </div>
              <p className="text-sm font-semibold text-white mb-1">Key Approvals</p>
              <p className="text-xs text-gray-400">Quantum key generation requests</p>
              <Button 
                size="sm" 
                className="w-full mt-3 bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/30"
                onClick={() => onNavigate?.('keys')}
              >
                Review
              </Button>
            </div>

            <div className="glass-card border border-blue-500/30 rounded-xl p-4 hover:shadow-glow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-blue-400" />
                <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-400 text-xs">
                  4 pending
                </Badge>
              </div>
              <p className="text-sm font-semibold text-white mb-1">User Requests</p>
              <p className="text-xs text-gray-400">Access permission changes</p>
              <Button 
                size="sm" 
                className="w-full mt-3 bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30"
                onClick={() => onNavigate?.('users')}
              >
                Review
              </Button>
            </div>

            <div className="glass-card border border-red-500/30 rounded-xl p-4 hover:shadow-glow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <Shield className="h-5 w-5 text-red-400" />
                <Badge variant="outline" className="bg-red-500/20 border-red-500/30 text-red-400 text-xs">
                  {systemStats.securityAlerts} alerts
                </Badge>
              </div>
              <p className="text-sm font-semibold text-white mb-1">Security Alerts</p>
              <p className="text-xs text-gray-400">Requires immediate attention</p>
              <Button 
                size="sm" 
                className="w-full mt-3 bg-red-500/20 hover:bg-red-500/30 border-red-500/30"
                onClick={() => onNavigate?.('security')}
              >
                Investigate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-card border border-cyan-500/30 rounded-2xl">
        <CardHeader className="border-b border-cyan-500/30">
          <CardTitle className="text-xl font-bold text-cyan-300 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              className="h-auto flex-col gap-2 p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:shadow-glow-sm"
              onClick={() => onNavigate?.('keys')}
            >
              <Key className="h-6 w-6" />
              <span className="text-sm">Manage Keys</span>
            </Button>
            <Button 
              className="h-auto flex-col gap-2 p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:shadow-glow-sm"
              onClick={() => onNavigate?.('users')}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">User Management</span>
            </Button>
            <Button 
              className="h-auto flex-col gap-2 p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 hover:shadow-glow-sm"
              onClick={() => onNavigate?.('transfers')}
            >
              <Database className="h-6 w-6" />
              <span className="text-sm">Data Transfer</span>
            </Button>
            <Button 
              className="h-auto flex-col gap-2 p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 hover:shadow-glow-sm"
              onClick={() => onNavigate?.('settings')}
            >
              <Settings className="h-6 w-6" />
              <span className="text-sm">System Config</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
