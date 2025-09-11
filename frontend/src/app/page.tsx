// pages/index.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCwIcon, Wifi, WifiOff, Satellite, Shield, Zap, Globe, Activity } from 'lucide-react';

// Dynamically import components (no SSR for WebSocket usage)
const Dashboard = dynamic(() => import('../components/Dashboard'), { ssr: false });
const ScenarioMode = dynamic(() => import('../components/ScenarioMode'), { ssr: false });
const AnalyticsDashboard = dynamic(() => import('../components/AnalyticsDashboard'), { ssr: false });
const SatelliteVisualization = dynamic(() => import('../components/SatelliteVisualization'), { ssr: false });
const AIThreatDetection = dynamic(() => import('../components/AIThreatDetection'), { ssr: false });
const ThemeToggle = dynamic(() => import('../components/ThemeToggle'), { ssr: false });
const VoiceControl = dynamic(() => import('../components/VoiceControl'), { ssr: false });

// Type definitions
interface Position {
  x: number;
  y: number;
  z: number;
}

interface Satellite {
  id: string;
  name: string;
  orbitType: string;
  altitude: number;
  inclination: number;
  position: Position;
  lastContact: string;
  quantumKeyId: string;
  keyGeneration: string;
  status: string;
}

interface BlockchainStatus {
  blockHeight: number;
  lastBlockTime: string;
  activeValidators: number;
  transactionCount: number;
  networkStatus: string;
}

interface SystemStatus {
  satellites: Satellite[];
  blockchainData: BlockchainStatus;
  quantumKeyPool: number;
  activeChannels: number;
  systemMode: string;
  lastUpdateTime: string;
}

export default function Home() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      if (ws) ws.close();

      ws = new WebSocket('ws://localhost:8080/ws');

      ws.onopen = () => {
        console.log('Connected to ThunderBird server');
        setConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data: SystemStatus = JSON.parse(event.data);
          setStatus(data);
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error');
      };

      ws.onclose = () => {
        console.warn('Disconnected from server, attempting to reconnect...');
        setConnected(false);
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  const changeMode = async (mode: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });

      if (!response.ok) {
        throw new Error(`Failed to change mode: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Mode changed:', data);
    } catch (err) {
      console.error('Error changing mode:', err);
      setError('Failed to change mode');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%239C92AC" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></g></svg>')}")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-30"></div>
      </div>

      <Head>
        <title>ThunderBird Quantum Space Communications</title>
        <meta name="description" content="Quantum-secured space communications system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-10">
        {error && (
          <Alert variant="destructive" className="mb-4 sm:mb-6 bg-red-900/50 border-red-500/50 backdrop-blur-sm">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 sm:p-4 rounded-full">
                <Satellite className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-5 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            ThunderBird
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-light px-4">
            Quantum Space Communications
          </p>
          <div className="mt-6 flex items-center justify-center space-x-5">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-xs sm:text-sm text-gray-400">
                {connected ? 'System Online' : 'System Offline'}
              </span>
            </div>
            <ThemeToggle 
              onExport={(format) => {
                console.log(`Exporting as ${format}`);
                // Implement export functionality
              }}
            />
          </div>
        </div>

        {!connected ? (
          <Card className="max-w-sm sm:max-w-md mx-auto bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl">
            <CardContent className="py-8 sm:py-12 flex flex-col items-center space-y-4 sm:space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 rounded-full">
                  <RefreshCwIcon className="h-8 w-8 sm:h-12 sm:w-12 text-white animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Connecting to Network</h3>
                <p className="text-sm sm:text-base text-gray-400 px-4">Establishing secure quantum connection...</p>
              </div>
            </CardContent>
          </Card>
        ) : status ? (
          <>
            {/* Mode Selection */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-1.5 sm:p-2.5 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full max-w-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <Button 
                  variant={status?.systemMode === 'realtime' ? "default" : "ghost"}
                  onClick={() => changeMode('realtime')}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 flex-1 ${
                    status?.systemMode === 'realtime' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border border-white/10' 
                      : 'text-gray-200 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">Real-time Mode</span>
                </Button>
                <Button 
                  variant={status?.systemMode === 'scenario' ? "default" : "ghost"}
                  onClick={() => changeMode('scenario')}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 flex-1 ${
                    status?.systemMode === 'scenario' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg border border-white/10' 
                      : 'text-gray-200 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">Scenario Mode</span>
                </Button>
              </div>
            </div>

            {/* Advanced Dashboard Grid */}
            <div className="space-y-8 sm:space-y-10">
              {/* Main Dashboard */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                <Dashboard status={status} />
                <ScenarioMode 
                  systemMode={status.systemMode} 
                  lastUpdateTime={status.lastUpdateTime} 
                />
              </div>

              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                <AnalyticsDashboard systemData={status} />
              </div>

              {/* 3D Satellite Visualization and AI Threat Detection */}
              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 sm:gap-8">
                <SatelliteVisualization satellites={status.satellites} />
                <AIThreatDetection systemData={status} />
              </div>

              {/* Voice Control */}
              <div className="grid grid-cols-1 gap-6">
                <VoiceControl 
                  onCommand={(command) => {
                    if (command === 'realtime' || command === 'scenario') {
                      changeMode(command);
                    }
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <Card className="max-w-sm sm:max-w-md mx-auto bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl">
            <CardContent className="py-8 sm:py-12 flex flex-col items-center space-y-4 sm:space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 p-4 sm:p-6 rounded-full">
                  <Globe className="h-8 w-8 sm:h-12 sm:w-12 text-white animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Loading System Data</h3>
                <p className="text-sm sm:text-base text-gray-400 px-4">Initializing quantum protocols...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="relative z-10 mt-8 sm:mt-12 py-4 sm:py-6 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              <span className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                ThunderBird Quantum-Secured Space Communications System
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                {connected ? (
                  <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                ) : (
                  <WifiOff className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                )}
                <span className={`text-xs sm:text-sm ${connected ? 'text-green-400' : 'text-red-400'}`}>
                  {connected 
                    ? `Connected - Last Update: ${status?.lastUpdateTime ? new Date(status.lastUpdateTime).toLocaleTimeString() : 'N/A'}`
                    : 'Disconnected - Attempting to reconnect...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
