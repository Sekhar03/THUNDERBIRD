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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  Activity,
  Settings
} from 'lucide-react';

interface Prediction {
  id: string;
  type: 'satellite_failure' | 'traffic_spike' | 'resource_optimization' | 'security_threat';
  confidence: number;
  prediction: string;
  timeframe: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

interface PredictiveAnalyticsProps {
  satelliteData?: any;
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ satelliteData }) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [modelAccuracy, setModelAccuracy] = useState(95.8);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [trafficForecast, setTrafficForecast] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock predictions
    const mockPredictions: Prediction[] = [
      {
        id: 'pred-1',
        type: 'satellite_failure',
        confidence: 87,
        prediction: 'Satellite ThunderBird-3 may experience power system degradation',
        timeframe: '72 hours',
        impact: 'high',
        recommendation: 'Schedule maintenance window and prepare backup satellite'
      },
      {
        id: 'pred-2',
        type: 'traffic_spike',
        confidence: 92,
        prediction: 'Network traffic expected to increase by 45%',
        timeframe: '24 hours',
        impact: 'medium',
        recommendation: 'Allocate additional bandwidth and enable load balancing'
      },
      {
        id: 'pred-3',
        type: 'resource_optimization',
        confidence: 78,
        prediction: 'Quantum key pool usage can be optimized by 23%',
        timeframe: 'Immediate',
        impact: 'low',
        recommendation: 'Implement suggested key rotation schedule'
      },
      {
        id: 'pred-4',
        type: 'security_threat',
        confidence: 95,
        prediction: 'Potential DDoS attack pattern detected',
        timeframe: '6 hours',
        impact: 'critical',
        recommendation: 'Activate enhanced security protocols and alert security team'
      }
    ];

    setPredictions(mockPredictions);

    // Generate performance trend data
    const generateTrendData = () => {
      const points = selectedTimeframe === '24h' ? 24 : selectedTimeframe === '7d' ? 168 : 720;
      return Array.from({ length: points }, (_, i) => ({
        time: i,
        actual: 85 + Math.random() * 15,
        predicted: 88 + Math.random() * 12,
        confidence: 90 + Math.random() * 10
      }));
    };

    // Generate traffic forecast
    const generateTrafficForecast = () => {
      return Array.from({ length: 48 }, (_, i) => ({
        hour: i,
        current: 100 + Math.random() * 50,
        forecast: 100 + Math.random() * 70,
        upperBound: 120 + Math.random() * 80,
        lowerBound: 80 + Math.random() * 40
      }));
    };

    setPerformanceData(generateTrendData());
    setTrafficForecast(generateTrafficForecast());
  }, [selectedTimeframe]);

  const getImpactColor = (impact: Prediction['impact']) => {
    switch (impact) {
      case 'critical': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'low': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
    }
  };

  const getTypeIcon = (type: Prediction['type']) => {
    switch (type) {
      case 'satellite_failure': return <AlertTriangle className="h-5 w-5 text-orange-400" />;
      case 'traffic_spike': return <TrendingUp className="h-5 w-5 text-blue-400" />;
      case 'resource_optimization': return <Target className="h-5 w-5 text-green-400" />;
      case 'security_threat': return <AlertTriangle className="h-5 w-5 text-red-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Predictive Analytics Card */}
      <Card className="glass-card border border-purple-500/30 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 rounded-full blur-xl opacity-40 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-br from-purple-500 via-pink-600 to-purple-600 p-3 rounded-full shadow-glow-lg group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-6 w-6 text-white animate-float" aria-hidden="true" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold gradient-text-quantum">
                  Predictive Analytics & ML
                </CardTitle>
                <p className="text-sm text-gray-300 mt-1">
                  AI-powered forecasting • {predictions.length} active predictions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-400">
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                Model Active
              </Badge>
              <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-400">
                {modelAccuracy}% Accuracy
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card border border-green-500/30 rounded-2xl p-4 hover:shadow-glow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-green-400">98.2%</p>
              <p className="text-xs text-gray-400 mt-1">Prediction Accuracy</p>
            </div>

            <div className="glass-card border border-blue-500/30 rounded-2xl p-4 hover:shadow-glow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <Target className="h-5 w-5 text-blue-400" />
                <span className="text-xs text-gray-400">24h</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">45</p>
              <p className="text-xs text-gray-400 mt-1">Forecasts Generated</p>
            </div>

            <div className="glass-card border border-orange-500/30 rounded-2xl p-4 hover:shadow-glow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
                <Zap className="h-4 w-4 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-orange-400">3</p>
              <p className="text-xs text-gray-400 mt-1">High Priority Alerts</p>
            </div>

            <div className="glass-card border border-purple-500/30 rounded-2xl p-4 hover:shadow-glow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <Brain className="h-5 w-5 text-purple-400" />
                <Activity className="h-4 w-4 text-purple-400 animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-purple-400">12ms</p>
              <p className="text-xs text-gray-400 mt-1">Avg Response Time</p>
            </div>
          </div>

          {/* Performance Trend Chart */}
          <div className="glass-card border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Trend Analysis
              </h3>
              <div className="flex gap-2">
                {(['24h', '7d', '30d'] as const).map((tf) => (
                  <Button
                    key={tf}
                    variant={selectedTimeframe === tf ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`text-xs ${
                      selectedTimeframe === tf
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                        : 'border-cyan-500/30'
                    }`}
                  >
                    {tf}
                  </Button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={performanceData}>
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
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Actual Performance"
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Predicted"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic Forecast */}
          <div className="glass-card border border-blue-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              48-Hour Traffic Forecast
            </h3>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trafficForecast.slice(0, 48)}>
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
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  name="Current"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Forecast"
                />
                <Line
                  type="monotone"
                  dataKey="upperBound"
                  stroke="#EF4444"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={false}
                  name="Upper Bound"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Active Predictions */}
      <Card className="glass-card border border-purple-500/30 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-400" />
              Active Predictions & Recommendations
            </CardTitle>
            <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-400">
              {predictions.length} Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {predictions.map((pred) => (
            <div
              key={pred.id}
              className="glass-card border border-purple-500/30 rounded-2xl p-5 hover:shadow-glow-sm transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">{getTypeIcon(pred.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {pred.prediction}
                    </h4>
                    <Badge variant="outline" className={`text-xs ${getImpactColor(pred.impact)}`}>
                      {pred.impact} impact
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {pred.timeframe}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {pred.confidence}% confidence
                    </span>
                  </div>

                  <div className="bg-black/20 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-300">
                      <span className="text-blue-400 font-semibold">Recommendation: </span>
                      {pred.recommendation}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="text-xs bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30"
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-purple-500/30"
                    >
                      Implement
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-gray-500/30"
                    >
                      Dismiss
                    </Button>
                  </div>

                  {/* Confidence Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-2xs text-gray-400 mb-1">
                      <span>Confidence Level</span>
                      <span>{pred.confidence}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${pred.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
