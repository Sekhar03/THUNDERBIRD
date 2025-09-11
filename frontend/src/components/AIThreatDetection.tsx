'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  AlertTriangle, 
  Shield, 
  Eye, 
  EyeOff,
  Activity,
  Zap,
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';

interface AIThreatDetectionProps {
  systemData: unknown;
}

interface Threat {
  id: string;
  type: 'quantum_attack' | 'network_breach' | 'satellite_hijack' | 'data_leak' | 'ddos';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timestamp: Date;
  description: string;
  status: 'detected' | 'analyzing' | 'mitigated' | 'resolved';
  location: string;
  source: string;
}

interface Anomaly {
  id: string;
  metric: string;
  value: number;
  expected: number;
  deviation: number;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

const AIThreatDetection: React.FC<AIThreatDetectionProps> = ({ systemData: _systemData }) => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [aiStatus] = useState<'active' | 'learning' | 'updating'>('active');
  const [detectionMode, setDetectionMode] = useState<'auto' | 'manual' | 'enhanced'>('auto');
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Generate mock threats and anomalies
  useEffect(() => {
    const generateThreats = () => {
      const threatTypes: Threat['type'][] = ['quantum_attack', 'network_breach', 'satellite_hijack', 'data_leak', 'ddos'];
      const severities: Threat['severity'][] = ['low', 'medium', 'high', 'critical'];
      const locations = ['Satellite-001', 'Ground Station Alpha', 'Quantum Network', 'Blockchain Node', 'Data Center'];
      const sources = ['Unknown', 'Suspicious IP', 'Quantum Interference', 'Malware Signature', 'Anomalous Behavior'];

      const newThreats: Threat[] = [];
      for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
        newThreats.push({
          id: `threat-${Date.now()}-${i}`,
          type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          confidence: Math.random() * 100,
          timestamp: new Date(),
          description: `Detected ${threatTypes[Math.floor(Math.random() * threatTypes.length)].replace('_', ' ')} activity`,
          status: 'detected',
          location: locations[Math.floor(Math.random() * locations.length)],
          source: sources[Math.floor(Math.random() * sources.length)]
        });
      }
      setThreats(prev => [...newThreats, ...prev.slice(0, 10)]);
    };

    const generateAnomalies = () => {
      const metrics = ['Quantum Key Rate', 'Network Latency', 'Satellite Signal', 'Blockchain Transactions', 'System Load'];
      const newAnomalies: Anomaly[] = [];
      
      for (let i = 0; i < Math.floor(Math.random() * 2); i++) {
        const metric = metrics[Math.floor(Math.random() * metrics.length)];
        const expected = Math.random() * 100;
        const value = expected + (Math.random() - 0.5) * 50;
        const deviation = Math.abs(value - expected) / expected * 100;
        
        newAnomalies.push({
          id: `anomaly-${Date.now()}-${i}`,
          metric,
          value,
          expected,
          deviation,
          timestamp: new Date(),
          severity: deviation > 30 ? 'high' : deviation > 15 ? 'medium' : 'low'
        });
      }
      setAnomalies(prev => [...newAnomalies, ...prev.slice(0, 8)]);
    };

    if (isMonitoring) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) generateThreats();
        if (Math.random() > 0.5) generateAnomalies();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getThreatColor = (severity: Threat['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'low': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
    }
  };

  const getAnomalyColor = (severity: Anomaly['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'medium': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      case 'low': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
    }
  };

  const getThreatIcon = (type: Threat['type']) => {
    switch (type) {
      case 'quantum_attack': return <Zap className="h-4 w-4" />;
      case 'network_breach': return <Eye className="h-4 w-4" />;
      case 'satellite_hijack': return <Target className="h-4 w-4" />;
      case 'data_leak': return <AlertCircle className="h-4 w-4" />;
      case 'ddos': return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: Threat['status']) => {
    switch (status) {
      case 'detected': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'analyzing': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'mitigated': return <Shield className="h-4 w-4 text-green-400" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Status Dashboard */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md border border-purple-500/20 rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-purple-300">AI Threat Detection</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  aiStatus === 'active' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                  aiStatus === 'learning' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' :
                  'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                }`}
              >
                {aiStatus}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
                className="flex items-center space-x-1"
              >
                {isMonitoring ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{isMonitoring ? 'Stop' : 'Start'}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Detection Mode Selector */}
          <div className="flex items-center space-x-2">
            {(['auto', 'manual', 'enhanced'] as const).map((mode) => (
              <Button
                key={mode}
                variant={detectionMode === mode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDetectionMode(mode)}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>

          {/* AI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-black/20 rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Threats Detected</p>
                  <p className="text-xl font-bold text-purple-400">{threats.length}</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-purple-400" />
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-3 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Anomalies Found</p>
                  <p className="text-xl font-bold text-blue-400">{anomalies.length}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-3 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Accuracy</p>
                  <p className="text-xl font-bold text-green-400">98.5%</p>
                </div>
                <Target className="h-6 w-6 text-green-400" />
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-3 border border-orange-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Response Time</p>
                  <p className="text-xl font-bold text-orange-400">0.2s</p>
                </div>
                <Zap className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Threats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-md border border-red-500/20 rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-red-300">Active Threats</CardTitle>
              </div>
              <Badge variant="destructive" className="text-xs">
                {threats.filter(t => t.status === 'detected' || t.status === 'analyzing').length}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {threats.slice(0, 5).map((threat) => (
                <div
                  key={threat.id}
                  className="p-3 rounded-lg border bg-black/20 hover:bg-black/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getThreatIcon(threat.type)}
                      <span className="text-sm font-medium text-gray-200">
                        {threat.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getThreatColor(threat.severity)}`}
                    >
                      {threat.severity}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-2">{threat.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(threat.status)}
                      <span className="capitalize">{threat.status}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>{threat.confidence.toFixed(1)}% confidence</span>
                      <span>{threat.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Anomaly Detection */}
        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-md border border-blue-500/20 rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-blue-300">Anomaly Detection</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs bg-blue-500/20 border-blue-500/30 text-blue-400">
                {anomalies.length}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {anomalies.slice(0, 5).map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="p-3 rounded-lg border bg-black/20 hover:bg-black/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-200">{anomaly.metric}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getAnomalyColor(anomaly.severity)}`}
                    >
                      {anomaly.severity}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Current:</span>
                      <span className="text-gray-200">{anomaly.value.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Expected:</span>
                      <span className="text-gray-200">{anomaly.expected.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Deviation:</span>
                      <span className={`${anomaly.deviation > 30 ? 'text-red-400' : anomaly.deviation > 15 ? 'text-orange-400' : 'text-blue-400'}`}>
                        {anomaly.deviation.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {anomaly.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Learning Status */}
      <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-md border border-green-500/20 rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg font-semibold text-green-300">AI Learning Status</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Pattern Recognition</span>
                <span className="text-sm font-medium text-green-400">95%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Threat Classification</span>
                <span className="text-sm font-medium text-blue-400">92%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Response Optimization</span>
                <span className="text-sm font-medium text-purple-400">88%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIThreatDetection; 