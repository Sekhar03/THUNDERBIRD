'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Play,
  Pause
} from 'lucide-react';

interface ScenarioModeProps {
  systemMode: string;
  lastUpdateTime: string;
  onScenarioChange?: (scenario: string, data: any) => void;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'completed' | 'pending';
  duration: number;
}

const ScenarioMode: React.FC<ScenarioModeProps> = ({ systemMode, lastUpdateTime, onScenarioChange }) => {
  const [currentScenario, setCurrentScenario] = useState<string>('Normal Operations');
  const [scenarioTime, setScenarioTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingScenario, setPlayingScenario] = useState<string | null>(null);
  const [individualScenarioTime, setIndividualScenarioTime] = useState<number>(0);

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
    if (systemMode === 'scenario' && isPlaying && !playingScenario) {
      const interval = setInterval(() => {
        setScenarioTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (!isPlaying && !playingScenario) {
      setScenarioTime(0);
    }
  }, [systemMode, isPlaying, playingScenario]);

  // Handle individual scenario playback - runs continuously until manually stopped
  useEffect(() => {
    if (playingScenario) {
      const interval = setInterval(() => {
        setIndividualScenarioTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [playingScenario]);

  // Generate scenario-specific data based on active scenario (individual play)
  useEffect(() => {
    if (playingScenario && onScenarioChange) {
      const interval = setInterval(() => {
        const scenarioData = generateScenarioData(playingScenario, individualScenarioTime);
        const scenario = scenarios.find(s => s.id === playingScenario);
        onScenarioChange(scenario?.name || playingScenario, scenarioData);
      }, 1000);
      return () => clearInterval(interval);
    } else if (!playingScenario && !isPlaying && onScenarioChange) {
      // Reset to normal when no scenario is playing
      onScenarioChange('Normal Operations', null);
    }
  }, [playingScenario, individualScenarioTime, isPlaying, onScenarioChange]);

  // Generate scenario-specific data for Play All mode
  useEffect(() => {
    if (isPlaying && !playingScenario && onScenarioChange) {
      const interval = setInterval(() => {
        // Find which scenario is currently active based on scenarioTime
        let totalTime = 0;
        let activeScenario = scenarios[0];
        
        for (const scenario of scenarios) {
          totalTime += scenario.duration;
          if (scenarioTime < totalTime) {
            activeScenario = scenario;
            break;
          }
        }
        
        // Generate data for the active scenario
        const scenarioData = generateScenarioData(activeScenario.id, scenarioTime);
        onScenarioChange(activeScenario.name, scenarioData);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, playingScenario, scenarioTime, onScenarioChange]);

  // Generate scenario-specific metrics with dramatic fluctuations
  const generateScenarioData = (scenarioId: string, time: number) => {
    const sharpVariance = Math.sin(time * 0.5) * 15; // Increased frequency and amplitude
    const spike = Math.random() > 0.7 ? (Math.random() - 0.5) * 40 : 0; // Random sharp spikes
    
    switch (scenarioId) {
      case 'normal':
        return {
          performance: 90 + Math.sin(time * 0.2) * 8 + Math.random() * 10 - 5,
          security: 95 + Math.cos(time * 0.15) * 5 + Math.random() * 6 - 3,
          network: 88 + sharpVariance * 0.5 + Math.random() * 12 - 6,
          threats: 2 + Math.random() * 5,
          keyGeneration: 95 + Math.random() * 10 - 5,
          bandwidth: 85 + Math.sin(time * 0.3) * 10 + Math.random() * 15 - 7
        };
      
      case 'hacker_attempt':
        // Erratic with sudden drops and spikes
        const attackWave = Math.sin(time * 0.6) * 30 + spike;
        return {
          performance: 60 + attackWave + Math.random() * 25 - 12,
          security: 40 + Math.cos(time * 0.8) * 35 + Math.random() * 30 - 15 + spike,
          network: 65 + Math.sin(time * 0.5) * 20 + Math.random() * 20 - 10,
          threats: 80 + Math.sin(time * 0.7) * 20 + Math.random() * 15,
          keyGeneration: 50 + Math.random() * 40 - 20,
          bandwidth: 60 + attackWave * 0.7 + Math.random() * 25 - 12
        };
      
      case 'authentication':
        return {
          performance: 85 + Math.sin(time * 0.25) * 10 + Math.random() * 12 - 6,
          security: 98 + Math.cos(time * 0.2) * 3 + Math.random() * 4 - 2,
          network: 90 + sharpVariance * 0.4 + Math.random() * 10 - 5,
          threats: 3 + Math.random() * 7 - 2,
          keyGeneration: 100 + Math.random() * 5 - 2.5,
          bandwidth: 88 + Math.sin(time * 0.3) * 8 + Math.random() * 14 - 7
        };
      
      case 'satellite_failure':
        // Sudden connection drops
        const connectionDrop = Math.sin(time * 0.8) * 35 + (Math.random() > 0.6 ? -25 : 0);
        return {
          performance: 45 + connectionDrop + Math.random() * 30 - 15,
          security: 80 + Math.sin(time * 0.3) * 15 + Math.random() * 20 - 10,
          network: 25 + connectionDrop * 1.2 + Math.random() * 25 - 12,
          threats: 8 + Math.random() * 15 - 5,
          keyGeneration: 60 + Math.random() * 30 - 15,
          bandwidth: 30 + connectionDrop + Math.random() * 30 - 15
        };
      
      case 'quantum_breach':
        // Critical fluctuations with extreme drops
        const breachIntensity = Math.sin(time * 0.9) * 40 + spike * 1.5;
        return {
          performance: 35 + breachIntensity + Math.random() * 35 - 17,
          security: 15 + Math.sin(time * 1.2) * 30 + Math.random() * 40 - 20,
          network: 70 + Math.sin(time * 0.5) * 20 + Math.random() * 25 - 12,
          threats: 95 + Math.sin(time * 0.6) * 10 + Math.random() * 8 - 4,
          keyGeneration: 20 + Math.random() * 50 - 25,
          bandwidth: 65 + breachIntensity * 0.6 + Math.random() * 30 - 15
        };
      
      case 'network_overload':
        // Bandwidth spikes and drops
        const overloadSpike = Math.sin(time * 0.7) * 35 + (Math.random() > 0.65 ? spike : 0);
        return {
          performance: 50 + overloadSpike + Math.random() * 30 - 15,
          security: 85 + Math.sin(time * 0.4) * 12 + Math.random() * 18 - 9,
          network: 20 + overloadSpike * 0.8 + Math.random() * 30 - 15,
          threats: 12 + Math.random() * 20 - 8,
          keyGeneration: 75 + Math.random() * 25 - 12,
          bandwidth: 15 + overloadSpike * 1.2 + Math.random() * 35 - 17
        };
      
      default:
        return {
          performance: 90 + sharpVariance * 0.5,
          security: 95 + sharpVariance * 0.3,
          network: 88 + sharpVariance * 0.4,
          threats: 2 + Math.random() * 5,
          keyGeneration: 95 + Math.random() * 10 - 5,
          bandwidth: 85 + sharpVariance * 0.6
        };
    }
  };

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

  const togglePlayAll = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setScenarioTime(0);
      setPlayingScenario(null);
    } else {
      setIsPlaying(true);
      setPlayingScenario(null);
      setScenarioTime(0);
    }
  };

  const playIndividualScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      if (playingScenario === scenarioId) {
        // Stop if already playing
        setPlayingScenario(null);
        setIndividualScenarioTime(0);
      } else {
        // Start playing this scenario
        setPlayingScenario(scenarioId);
        setIndividualScenarioTime(0);
        setIsPlaying(false);
        setCurrentScenario(scenario.name);
      }
    }
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

            {/* Play All Button */}
            <div className="flex justify-center mb-6">
              <Button
                onClick={togglePlayAll}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center ${
                  isPlaying
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                    <span className="hidden sm:inline">Stop All Scenarios</span>
                    <span className="inline sm:hidden">Stop All</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                    <span className="hidden sm:inline">Play All Scenarios</span>
                    <span className="inline sm:hidden">Play All</span>
                  </>
                )}
              </Button>
            </div>

            {/* Scenario Progress */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-purple-200">Scenario Progress</h4>
              <div className="space-y-2.5">
                {scenarios.map((scenario) => (
                  <div 
                    key={scenario.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-purple-900/20 rounded-xl border border-purple-500/20"
                  >
                    {/* Left Section: Icon, Name, Description */}
                    <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-0.5">
                        {scenario.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-100 leading-tight break-words">{scenario.name}</p>
                        <p className="text-xs text-gray-400 leading-relaxed break-words mt-0.5 line-clamp-2">{scenario.description}</p>
                      </div>
                    </div>

                    {/* Right Section: Play Button, Status, Duration */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => playIndividualScenario(scenario.id)}
                        disabled={isPlaying}
                        className={`p-1.5 sm:p-2 rounded-lg transition-all flex-shrink-0 ${
                          playingScenario === scenario.id
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                        } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={`Play ${scenario.name}`}
                      >
                        {playingScenario === scenario.id ? (
                          <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        ) : (
                          <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                      <Badge 
                        variant="outline" 
                        className={`text-xs rounded-full px-2 sm:px-3 py-0.5 sm:py-1 whitespace-nowrap ${
                          (isPlaying && getScenarioStatus(scenario) === 'active') || playingScenario === scenario.id
                            ? 'border-green-500/50 text-green-400 bg-green-500/10' 
                            : getScenarioStatus(scenario) === 'completed'
                            ? 'border-blue-500/50 text-blue-400 bg-blue-500/10'
                            : 'border-gray-500/50 text-gray-400 bg-gray-500/10'
                        }`}
                      >
                        {playingScenario === scenario.id ? 'playing' : getScenarioStatus(scenario)}
                      </Badge>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {playingScenario === scenario.id ? formatTime(individualScenarioTime) : 'Ready'}
                      </span>
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