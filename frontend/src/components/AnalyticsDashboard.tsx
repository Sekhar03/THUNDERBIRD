'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ExportManager from './ExportManager';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie,
  Cell,
  LabelList,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Shield, 
  Wifi, 
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AlertTriangle
} from 'lucide-react';

interface SystemDataMinimal {
  satellites?: Array<{ status?: string }>;
  quantumKeyPool?: number;
  activeChannels?: number;
}

interface ScenarioData {
  performance: number;
  security: number;
  network: number;
  threats: number;
  keyGeneration: number;
  bandwidth: number;
}

interface AnalyticsDashboardProps {
  systemData: SystemDataMinimal;
  scenarioData?: ScenarioData | null;
  currentScenario?: string;
}

interface ChartData {
  name: string;
  value: number;
  timestamp: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ systemData, scenarioData, currentScenario }) => {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar' | 'pie'>('line');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [performanceData, setPerformanceData] = useState<ChartData[]>([]);
  const [securityData, setSecurityData] = useState<ChartData[]>([]);
  const [scenarioHistory, setScenarioHistory] = useState<Array<{name: string, data: ScenarioData}>>([]);

  // Generate mock data for charts based on scenario or real-time data
  useEffect(() => {
    const generateData = (baseValue: number, variance: number, count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        name: `${i + 1}`,
        value: baseValue + Math.random() * variance - variance / 2,
        timestamp: new Date(Date.now() - (count - i) * 60000).toLocaleTimeString()
      }));
    };

    if (!scenarioData) {
      // Default real-time data - only set once
      setPerformanceData(generateData(85, 20, 60));
      setSecurityData(generateData(95, 10, 60));
    }
  }, []);

  // Continuously update graphs every second when scenario is active
  useEffect(() => {
    if (scenarioData) {
      // Set up interval to update graphs every second
      const interval = setInterval(() => {
        // Use scenario-specific data with dramatic variance for sharp changes
        const sharpVariance = Math.random() * 20 - 10; // -10 to +10 range
        const spike = Math.random() > 0.8 ? (Math.random() - 0.5) * 30 : 0; // Random spikes
        
        const newPerfValue = scenarioData.performance + sharpVariance + spike;
        const newSecValue = scenarioData.security + sharpVariance * 0.8 + spike * 0.7;
        
        setPerformanceData(prev => {
          const updated = [...prev.slice(-59), {
            name: `${prev.length + 1}`,
            value: Math.max(0, Math.min(100, newPerfValue)),
            timestamp: new Date().toLocaleTimeString()
          }];
          return updated;
        });
        
        setSecurityData(prev => {
          const updated = [...prev.slice(-59), {
            name: `${prev.length + 1}`,
            value: Math.max(0, Math.min(100, newSecValue)),
            timestamp: new Date().toLocaleTimeString()
          }];
          return updated;
        });
      }, 1000); // Update every 1 second

      return () => clearInterval(interval);
    }
  }, [scenarioData]);

  // Track scenario history for comparison
  useEffect(() => {
    if (scenarioData && currentScenario) {
      setScenarioHistory(prev => {
        const exists = prev.find(s => s.name === currentScenario);
        if (!exists) {
          return [...prev, { name: currentScenario, data: scenarioData }];
        }
        return prev.map(s => 
          s.name === currentScenario ? { name: currentScenario, data: scenarioData } : s
        );
      });
    }
  }, [scenarioData, currentScenario]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Get scenario-specific chart configuration
  const getScenarioChartConfig = () => {
    if (!currentScenario) return { color: '#3B82F6', strokeWidth: 3, pattern: 'monotone' };
    
    switch (currentScenario) {
      case 'Normal Operations':
        return { color: '#10B981', strokeWidth: 2, pattern: 'monotone', fill: '#10B981' };
      case 'Hacker Attempt':
        return { color: '#EF4444', strokeWidth: 4, pattern: 'basis', fill: '#EF4444' };
      case 'Quantum Authentication':
        return { color: '#3B82F6', strokeWidth: 3, pattern: 'linear', fill: '#3B82F6' };
      case 'Satellite Failure':
        return { color: '#F59E0B', strokeWidth: 3, pattern: 'step', fill: '#F59E0B' };
      case 'Quantum Security Breach':
        return { color: '#A855F7', strokeWidth: 5, pattern: 'monotone', fill: '#A855F7' };
      case 'Network Overload':
        return { color: '#06B6D4', strokeWidth: 3, pattern: 'natural', fill: '#06B6D4' };
      default:
        return { color: '#3B82F6', strokeWidth: 3, pattern: 'monotone', fill: '#3B82F6' };
    }
  };

  const renderChart = () => {
    const data = performanceData;
    const config = getScenarioChartConfig();
    
    switch (chartType) {
      case 'line':
        return (
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }} />
                <YAxis stroke="#9CA3AF" label={{ value: 'Performance', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: `1px solid ${config.color}`,
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend />
                <Line 
                  type={config.pattern as any}
                  dataKey="value" 
                  stroke={config.color}
                  strokeWidth={config.strokeWidth}
                  dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
                >
                  {scenarioData && <LabelList dataKey="value" position="top" fill={config.color} fontSize={11} />}
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'area':
        return (
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }} />
                <YAxis stroke="#9CA3AF" label={{ value: 'Performance', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: `1px solid ${config.color}`,
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Area 
                  type={config.pattern as any}
                  dataKey="value" 
                  stroke={config.color}
                  fill={config.color}
                  fillOpacity={scenarioData ? 0.5 : 0.3}
                  strokeWidth={config.strokeWidth}
                >
                  {scenarioData && <LabelList dataKey="value" position="top" fill={config.color} fontSize={11} />}
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'bar':
        return (
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }} />
                <YAxis stroke="#9CA3AF" label={{ value: 'Performance', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: `1px solid ${config.color}`,
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="value" fill={config.color} radius={[4, 4, 0, 0]}>
                  {scenarioData && <LabelList dataKey="value" position="top" fill={config.color} fontSize={11} />}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'pie':
        return (
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {
                    const safePercent = typeof percent === 'number' ? percent : 0;
                    const safeName = typeof name === 'string' || typeof name === 'number' ? String(name) : '';
                    return `${safeName}: ${(safePercent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getSystemHealth = () => {
    // Use scenario data if available, otherwise use real system data
    if (scenarioData) {
      return scenarioData.performance;
    }
    const operational = systemData?.satellites?.filter((s: any) => s.status === 'operational').length || 0;
    const total = systemData?.satellites?.length || 0;
    return total > 0 ? (operational / total) * 100 : 0;
  };

  const getSecurityScore = () => {
    // Use scenario data if available, otherwise use real system data
    if (scenarioData) {
      return scenarioData.security;
    }
    const quantumKeys = systemData?.quantumKeyPool || 0;
    const maxKeys = 200;
    return Math.min((quantumKeys / maxKeys) * 100, 100);
  };

  const getNetworkPerformance = () => {
    // Use scenario data if available, otherwise use real system data
    if (scenarioData) {
      return scenarioData.network;
    }
    const activeChannels = systemData?.activeChannels ?? 0;
    const totalChannels = systemData?.satellites?.length ?? 0;
    return totalChannels > 0 ? (activeChannels / totalChannels) * 100 : 0;
  };

  return (
    <div className="space-y-8">
      {/* Chart Controls */}
      <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-md border border-blue-500/20 rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg flex-shrink-0">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg font-semibold text-blue-300">Real-time Analytics</CardTitle>
                {scenarioData && currentScenario && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                    Active: <span className="text-purple-400 font-semibold">{currentScenario}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {scenarioData && (
                <Badge variant="outline" className="text-xs rounded-full bg-purple-500/20 border-purple-500/50 text-purple-300 whitespace-nowrap">
                  Scenario Mode
                </Badge>
              )}
              <Badge variant="outline" className="text-xs rounded-full whitespace-nowrap">
                {timeRange}
              </Badge>
              <ExportManager 
                data={performanceData}
                fileName="analytics-dashboard"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Chart Type Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              className="flex items-center space-x-1 text-xs sm:text-sm"
            >
              <LineChartIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Line</span>
            </Button>
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
              className="flex items-center space-x-1 text-xs sm:text-sm"
            >
              <AreaChart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Area</span>
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="flex items-center space-x-1 text-xs sm:text-sm"
            >
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Bar</span>
            </Button>
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('pie')}
              className="flex items-center space-x-1 text-xs sm:text-sm"
            >
              <PieChartIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Pie</span>
            </Button>
          </div>

          {/* Time Range Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {(['1h', '6h', '24h', '7d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="text-xs sm:text-sm"
              >
                {range}
              </Button>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-black/20 rounded-lg p-4 border border-blue-500/20">
            {renderChart()}
          </div>
        </CardContent>
      </Card>

      {/* System Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-md border rounded-xl transition-all duration-300 ${
          scenarioData ? 'border-green-500/40 shadow-lg shadow-green-500/20' : 'border-green-500/20'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  System Health
                  {scenarioData && <span className="ml-2 text-xs text-purple-400">●</span>}
                </p>
                <p className="text-2xl font-bold text-green-400">{getSystemHealth().toFixed(1)}%</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getSystemHealth()}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-md border rounded-xl transition-all duration-300 ${
          scenarioData ? 'border-blue-500/40 shadow-lg shadow-blue-500/20' : 'border-blue-500/20'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Security Score
                  {scenarioData && <span className="ml-2 text-xs text-purple-400">●</span>}
                </p>
                <p className="text-2xl font-bold text-blue-400">{getSecurityScore().toFixed(1)}%</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getSecurityScore()}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md border rounded-xl transition-all duration-300 ${
          scenarioData ? 'border-purple-500/40 shadow-lg shadow-purple-500/20' : 'border-purple-500/20'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Network Performance
                  {scenarioData && <span className="ml-2 text-xs text-purple-400">●</span>}
                </p>
                <p className="text-2xl font-bold text-purple-400">{getNetworkPerformance().toFixed(1)}%</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                <Wifi className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getNetworkPerformance()}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Comparison Charts - Only show when scenario data is available */}
      {scenarioData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Multi-Metric Comparison */}
          <Card className="bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 backdrop-blur-md border border-violet-500/20 rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-violet-300">Current Scenario Metrics</CardTitle>
              </div>
              {currentScenario && (
                <p className="text-sm text-gray-400 mt-2">{currentScenario}</p>
              )}
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { name: 'Performance', value: scenarioData.performance, fill: '#3B82F6' },
                  { name: 'Security', value: scenarioData.security, fill: '#10B981' },
                  { name: 'Network', value: scenarioData.network, fill: '#8B5CF6' },
                  { name: 'Bandwidth', value: scenarioData.bandwidth, fill: '#F59E0B' },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {[
                      { name: 'Performance', value: scenarioData.performance, fill: '#3B82F6' },
                      { name: 'Security', value: scenarioData.security, fill: '#10B981' },
                      { name: 'Network', value: scenarioData.network, fill: '#8B5CF6' },
                      { name: 'Bandwidth', value: scenarioData.bandwidth, fill: '#F59E0B' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList dataKey="value" position="top" fill="#9CA3AF" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Threat & Key Generation */}
          <Card className="bg-gradient-to-br from-rose-900/30 to-red-900/30 backdrop-blur-md border border-rose-500/20 rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-rose-500 to-red-500 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-rose-300">Threat & Key Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={[
                  { name: 'Threats', value: scenarioData.threats, fill: '#EF4444' },
                  { name: 'Key Gen', value: scenarioData.keyGeneration, fill: '#3B82F6' },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Threat Level</p>
                  <p className="text-2xl font-bold text-red-400">{scenarioData.threats}%</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Key Generation</p>
                  <p className="text-2xl font-bold text-blue-400">{scenarioData.keyGeneration}/s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-md border border-orange-500/20 rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-orange-300">Performance Trends</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: `1px solid ${getScenarioChartConfig().color}`,
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line 
                  type={getScenarioChartConfig().pattern as any}
                  dataKey="value" 
                  stroke={scenarioData ? getScenarioChartConfig().color : '#F97316'}
                  strokeWidth={scenarioData ? getScenarioChartConfig().strokeWidth : 2}
                  dot={{ fill: scenarioData ? getScenarioChartConfig().color : '#F97316', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Security Metrics */}
        <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-md border border-indigo-500/20 rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-indigo-300">Security Metrics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={securityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: `1px solid ${getScenarioChartConfig().color}`,
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Area 
                  type={getScenarioChartConfig().pattern as any}
                  dataKey="value" 
                  stroke={scenarioData ? getScenarioChartConfig().color : '#6366F1'}
                  fill={scenarioData ? getScenarioChartConfig().color : '#6366F1'}
                  fillOpacity={scenarioData ? 0.5 : 0.3}
                  strokeWidth={scenarioData ? getScenarioChartConfig().strokeWidth : 2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Scenario Comparison - Always visible for scenario mode */}
      {scenarioData && (
        <Card className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 backdrop-blur-md border border-cyan-500/20 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-cyan-300">All Scenarios Comparison</CardTitle>
            </div>
            <p className="text-sm text-gray-400 mt-2">Compare metrics across different scenarios</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={[
                {
                  name: 'Normal',
                  performance: 95,
                  security: 98,
                  network: 92,
                  threats: 0,
                },
                {
                  name: 'Hacker',
                  performance: 65,
                  security: 45,
                  network: 70,
                  threats: 95,
                },
                {
                  name: 'Auth',
                  performance: 88,
                  security: 100,
                  network: 90,
                  threats: 5,
                },
                {
                  name: 'Satellite',
                  performance: 50,
                  security: 85,
                  network: 30,
                  threats: 10,
                },
                {
                  name: 'Breach',
                  performance: 40,
                  security: 20,
                  network: 75,
                  threats: 100,
                },
                {
                  name: 'Overload',
                  performance: 55,
                  security: 90,
                  network: 25,
                  threats: 15,
                },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  tick={{ fontSize: 12 }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend />
                <Bar dataKey="performance" fill="#3B82F6" name="Performance" />
                <Bar dataKey="security" fill="#10B981" name="Security" />
                <Bar dataKey="network" fill="#8B5CF6" name="Network" />
                <Bar dataKey="threats" fill="#EF4444" name="Threats" />
              </BarChart>
            </ResponsiveContainer>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">Avg Performance</p>
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-xl font-bold text-blue-400 mt-1">65.5%</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">Avg Security</p>
                  <Shield className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-xl font-bold text-green-400 mt-1">73.0%</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">Avg Network</p>
                  <Wifi className="h-4 w-4 text-purple-400" />
                </div>
                <p className="text-xl font-bold text-purple-400 mt-1">63.7%</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">Avg Threats</p>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </div>
                <p className="text-xl font-bold text-red-400 mt-1">37.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard; 