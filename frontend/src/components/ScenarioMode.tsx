'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Shield, 
  Satellite, 
  Wifi, 
  Zap,
  Clock,
  Activity,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface ScenarioModeProps {
  systemMode: string;
  lastUpdateTime: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'completed' | 'pending';
  duration: number;
}

const ScenarioMode: React.FC<ScenarioModeProps> = ({ systemMode, lastUpdateTime }) => {
  const [currentScenario, setCurrentScenario] = useState<string>('Normal Operations');
  const [scenarioTime, setScenarioTime] = useState<number>(0);

  // Update current scenario based on time
  useEffect(() => {
    if (systemMode === 'scenario' && scenarioTime > 0) {
      let totalTime = 0;
      for (const scenario of scenarios) {
        totalTime += scenario.duration;
        if (scenarioTime < totalTime) {
          setCurrentScenario(scenario.name);
          break;
        }
      }
    } else {
      setCurrentScenario('Normal Operations');
    }
  }, [scenarioTime, systemMode]);

  const scenarios: Scenario[] = [
    {
      id: 'normal',
      name: 'Normal Operations',
      description: 'All systems operating at optimal performance',
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      status: 'active',
      duration: 20
    },
    {
      id: 'hacker_attempt',
      name: 'Hacker Attempt',
      description: 'Simulating unauthorized access and threat mitigation',
      icon: <AlertTriangle className="h-5 w-5 text-red-400" />,
      status: 'pending',
      duration: 15
    },
    {
      id: 'authentication',
      name: 'Quantum Authentication',
      description: 'Performing quantum key regeneration and authentication',
      icon: <Shield className="h-5 w-5 text-blue-400" />,
      status: 'pending',
      duration: 10
    },
    {
      id: 'satellite_failure',
      name: 'Satellite Failure',
      description: 'Simulating satellite connection issues and recovery',
      icon: <Satellite className="h-5 w-5 text-orange-400" />,
      status: 'pending',
      duration: 25
    },
    {
      id: 'quantum_breach',
      name: 'Quantum Security Breach',
      description: 'Simulating quantum key compromise and regeneration',
      icon: <AlertCircle className="h-5 w-5 text-purple-400" />,
      status: 'pending',
      duration: 22
    },
    {
      id: 'network_overload',
      name: 'Network Overload',
      description: 'Simulating high traffic and load balancing',
      icon: <Wifi className="h-5 w-5 text-cyan-400" />,
      status: 'pending',
      duration: 20
    }
  ];

  useEffect(() => {
    if (systemMode === 'scenario') {
      const interval = setInterval(() => {
        setScenarioTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setScenarioTime(0);
    }
  }, [systemMode]);

  const getScenarioStatus = (scenario: Scenario) => {
    if (systemMode !== 'scenario') return 'pending';
    
    // Simple logic to show active scenario based on time
    if (systemMode === 'scenario' && scenarioTime > 0) {
      const scenarioIndex = scenarios.findIndex(s => s.id === scenario.id);
      const totalTime = scenarios.slice(0, scenarioIndex).reduce((sum, s) => sum + s.duration, 0);
      const nextTotalTime = totalTime + scenario.duration;
      
      if (scenarioTime >= totalTime && scenarioTime < nextTotalTime) {
        return 'active';
      } else if (scenarioTime >= nextTotalTime) {
        return 'completed';
      }
    }
    
    return 'pending';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/25 to-pink-900/25 backdrop-blur-md border border-purple-500/20 rounded-2xl shadow-lg">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg sm:text-xl font-semibold text-purple-200 leading-tight">Scenario Mode</CardTitle>
          </div>
          <Badge 
            variant="default" 
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full"
          >
            {systemMode === 'scenario' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 sm:space-y-6">
        {systemMode === 'scenario' ? (
          <>
            {/* Current Scenario Info */}
            <div className="bg-purple-900/20 rounded-xl border border-purple-500/20 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base sm:text-lg font-semibold text-purple-200 leading-tight">Current Scenario</h3>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300 font-mono">{formatTime(scenarioTime)}</span>
                </div>
              </div>
              <p className="text-sm text-gray-200 break-words leading-relaxed">{currentScenario}</p>
            </div>

            {/* Scenario Progress */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-purple-200">Scenario Progress</h4>
              <div className="space-y-2.5">
                {scenarios.map((scenario) => (
                  <div 
                    key={scenario.id}
                    className="flex items-center justify-between p-3 sm:p-4 bg-purple-900/20 rounded-xl border border-purple-500/20"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      {scenario.icon}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-100 leading-tight break-words">{scenario.name}</p>
                        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed break-words">{scenario.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Badge 
                        variant="outline" 
                        className={`text-xs sm:text-sm rounded-full px-3 py-1 ${
                          getScenarioStatus(scenario) === 'active' 
                            ? 'border-green-500/50 text-green-400 bg-green-500/10' 
                            : getScenarioStatus(scenario) === 'completed'
                            ? 'border-blue-500/50 text-blue-400 bg-blue-500/10'
                            : 'border-gray-500/50 text-gray-400 bg-gray-500/10'
                        }`}
                      >
                        {getScenarioStatus(scenario)}
                      </Badge>
                      <span className="text-xs sm:text-sm text-gray-400">{scenario.duration}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-purple-900/20 rounded-xl border border-purple-500/20 p-3 text-center">
                <Activity className="h-5 w-5 text-purple-400 mx-auto mb-1.5" />
                <p className="text-xs sm:text-sm text-gray-300 leading-tight">Active</p>
                <p className="text-xs sm:text-sm font-mono text-purple-400">Real-time</p>
              </div>
              <div className="bg-purple-900/20 rounded-xl border border-purple-500/20 p-3 text-center">
                <TrendingUp className="h-5 w-5 text-green-400 mx-auto mb-1.5" />
                <p className="text-xs sm:text-sm text-gray-300 leading-tight">Performance</p>
                <p className="text-xs sm:text-sm font-mono text-green-400">Optimal</p>
              </div>
              <div className="bg-purple-900/20 rounded-xl border border-purple-500/20 p-3 text-center">
                <Shield className="h-5 w-5 text-blue-400 mx-auto mb-1.5" />
                <p className="text-xs sm:text-sm text-gray-300 leading-tight">Security</p>
                <p className="text-xs sm:text-sm font-mono text-blue-400">Secure</p>
              </div>
              <div className="bg-purple-900/20 rounded-xl border border-purple-500/20 p-3 text-center">
                <Wifi className="h-5 w-5 text-cyan-400 mx-auto mb-1.5" />
                <p className="text-xs sm:text-sm text-gray-300 leading-tight">Network</p>
                <p className="text-xs sm:text-sm font-mono text-cyan-400">Stable</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full w-fit mx-auto mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-purple-300 mb-2">Scenario Mode Inactive</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Switch to scenario mode to run automated system tests and simulations
            </p>
          </div>
        )}

        {/* Last Update */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 pt-3 border-t border-purple-500/20">
          <span className="leading-tight">Last Update</span>
          <span className="font-mono leading-tight">{new Date(lastUpdateTime).toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioMode; 