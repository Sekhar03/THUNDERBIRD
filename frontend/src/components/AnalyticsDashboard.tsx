'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  LineChart as LineChartIcon
} from 'lucide-react';

interface SystemDataMinimal {
  satellites?: Array<{ status?: string }>;
  quantumKeyPool?: number;
  activeChannels?: number;
}

interface AnalyticsDashboardProps {
  systemData: SystemDataMinimal;
}

interface ChartData {
  name: string;
  value: number;
  timestamp: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ systemData }) => {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar' | 'pie'>('line');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [performanceData, setPerformanceData] = useState<ChartData[]>([]);
  const [securityData, setSecurityData] = useState<ChartData[]>([]);
  // const [networkData, setNetworkData] = useState<ChartData[]>([]);

  // Generate mock data for charts
  useEffect(() => {
    const generateData = (baseValue: number, variance: number, count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        name: `${i + 1}`,
        value: baseValue + Math.random() * variance - variance / 2,
        timestamp: new Date(Date.now() - (count - i) * 60000).toLocaleTimeString()
      }));
    };

    setPerformanceData(generateData(85, 20, 60));
    setSecurityData(generateData(95, 10, 60));
    // setNetworkData(generateData(78, 25, 60));
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const renderChart = () => {
    const data = performanceData;
    
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
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                >
                  {/* Data labels */}
                  <LabelList dataKey="value" position="top" fill="#9CA3AF" fontSize={11} />
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
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                >
                  <LabelList dataKey="value" position="top" fill="#9CA3AF" fontSize={11} />
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
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="value" position="top" fill="#9CA3AF" fontSize={11} />
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
    const operational = systemData?.satellites?.filter((s: any) => s.status === 'operational').length || 0;
    const total = systemData?.satellites?.length || 0;
    return total > 0 ? (operational / total) * 100 : 0;
  };

  const getSecurityScore = () => {
    const quantumKeys = systemData?.quantumKeyPool || 0;
    const maxKeys = 200;
    return Math.min((quantumKeys / maxKeys) * 100, 100);
  };

  const getNetworkPerformance = () => {
    const activeChannels = systemData?.activeChannels ?? 0;
    const totalChannels = systemData?.satellites?.length ?? 0;
    return totalChannels > 0 ? (activeChannels / totalChannels) * 100 : 0;
  };

  return (
    <div className="space-y-8">
      {/* Chart Controls */}
      <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-md border border-blue-500/20 rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-blue-300">Real-time Analytics</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs sm:text-sm rounded-full">
                {timeRange}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-3">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              className="flex items-center space-x-1"
            >
              <LineChartIcon className="h-4 w-4" />
              <span>Line</span>
            </Button>
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
              className="flex items-center space-x-1"
            >
              <AreaChart className="h-4 w-4" />
              <span>Area</span>
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="flex items-center space-x-1"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Bar</span>
            </Button>
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('pie')}
              className="flex items-center space-x-1"
            >
              <PieChartIcon className="h-4 w-4" />
              <span>Pie</span>
            </Button>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            {(['1h', '6h', '24h', '7d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
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
        <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-md border border-green-500/20 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">System Health</p>
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

        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-md border border-blue-500/20 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Security Score</p>
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

        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md border border-purple-500/20 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Network Performance</p>
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
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#F97316" 
                  strokeWidth={2}
                  dot={{ fill: '#F97316', strokeWidth: 2, r: 3 }}
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
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366F1" 
                  fill="#6366F1" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 