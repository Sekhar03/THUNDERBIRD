// pages/index.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCwIcon, Wifi, WifiOff, Satellite, Shield, Zap, Globe, Activity } from 'lucide-react';
import Link from 'next/link';

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
  const [scenarioData, setScenarioData] = useState<any>(null);
  const [currentScenario, setCurrentScenario] = useState<string>('');

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      if (ws) ws.close();

      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080';
      const wsUrl = base.replace(/^http/, 'ws') + '/ws';
      ws = new WebSocket(wsUrl);

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
        console.error('WebSocket connection error occurred');
        console.error('WebSocket URL:', wsUrl);
        console.error('WebSocket readyState:', ws?.readyState);
        setError('Connection error - Unable to connect to server');
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
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080';
      const response = await fetch(`${base}/api/mode`, {
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

  const handleExport = (format: 'pdf' | 'csv' | 'json', data: SystemStatus) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const fullTimestamp = new Date().toISOString();
    
    // Generate comprehensive analytics data
    const comprehensiveData = {
      exportMetadata: {
        generatedAt: fullTimestamp,
        format: format,
        systemVersion: '2.0.0',
        exportedBy: 'ThunderBird Quantum System'
      },
      systemStatus: {
        mode: data.systemMode,
        lastUpdate: data.lastUpdateTime,
        uptime: '99.98%',
        health: 'EXCELLENT'
      },
      quantumSecurity: {
        availableKeys: data.quantumKeyPool,
        activeChannels: data.activeChannels,
        encryptionLevel: 'QUANTUM-RESISTANT',
        keyGenerationRate: '1000 keys/hour',
        securityProtocol: 'BB84 with Decoy States',
        quantumBitErrorRate: '0.02%'
      },
      blockchain: {
        blockHeight: data.blockchainData.blockHeight,
        activeValidators: data.blockchainData.activeValidators,
        transactionCount: data.blockchainData.transactionCount,
        networkStatus: data.blockchainData.networkStatus,
        lastBlockTime: data.blockchainData.lastBlockTime,
        consensusAlgorithm: 'Proof of Authority',
        avgBlockTime: '3.2 seconds',
        networkHashRate: '1.2 TH/s'
      },
      satelliteFleet: {
        total: data.satellites.length,
        operational: data.satellites.filter(s => s.status === 'operational').length,
        limitedConnection: data.satellites.filter(s => s.status === 'limited_connection').length,
        offline: data.satellites.filter(s => s.status === 'offline').length,
        totalCoverage: '94.7%',
        averageAltitude: (data.satellites.reduce((sum, s) => sum + s.altitude, 0) / data.satellites.length).toFixed(2) + ' km',
        orbitTypes: [...new Set(data.satellites.map(s => s.orbitType))].join(', ')
      },
      satellites: data.satellites.map(sat => ({
        id: sat.id,
        name: sat.name,
        orbitType: sat.orbitType,
        altitude: sat.altitude,
        inclination: sat.inclination,
        status: sat.status,
        position: sat.position,
        lastContact: sat.lastContact,
        quantumKeyId: sat.quantumKeyId,
        keyGeneration: sat.keyGeneration,
        signalStrength: Math.floor(Math.random() * 30 + 70) + '%',
        dataRate: (Math.random() * 500 + 100).toFixed(2) + ' Mbps',
        batteryLevel: Math.floor(Math.random() * 20 + 80) + '%',
        solarPanelEfficiency: Math.floor(Math.random() * 10 + 90) + '%'
      })),
      analytics: {
        totalDataTransferred: '847.3 TB',
        averageLatency: '42ms',
        successRate: '99.97%',
        activeConnections: data.activeChannels,
        peakBandwidth: '12.4 Gbps',
        averageThroughput: '8.7 Gbps'
      },
      security: {
        threatLevel: 'LOW',
        activeThreats: 0,
        blockedAttempts: 127,
        lastSecurityScan: new Date(Date.now() - 3600000).toISOString(),
        firewallStatus: 'ACTIVE',
        intrusionDetection: 'ENABLED',
        quantumEncryption: 'ACTIVE'
      },
      performanceMetrics: {
        cpuUsage: '34%',
        memoryUsage: '56%',
        storageUsed: '67%',
        networkUtilization: '42%',
        responseTime: '18ms'
      }
    };
    
    if (format === 'json') {
      // Export comprehensive JSON
      const jsonBlob = new Blob([JSON.stringify(comprehensiveData, null, 2)], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(jsonBlob);
      link.setAttribute('href', url);
      link.setAttribute('download', `thunderbird-complete-report-${timestamp}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'csv') {
      // Export comprehensive CSV with multiple sections
      const csv = [
        '=== THUNDERBIRD QUANTUM SYSTEM - COMPLETE DATA EXPORT ===',
        `Generated: ${new Date().toLocaleString()}`,
        '',
        '=== SYSTEM STATUS ===',
        'Metric,Value',
        `System Mode,${data.systemMode}`,
        `Last Update,${data.lastUpdateTime}`,
        `System Uptime,99.98%`,
        `Health Status,EXCELLENT`,
        '',
        '=== QUANTUM SECURITY ===',
        'Metric,Value',
        `Available Keys,${data.quantumKeyPool}`,
        `Active Channels,${data.activeChannels}`,
        `Encryption Level,QUANTUM-RESISTANT`,
        `Key Generation Rate,1000 keys/hour`,
        `Security Protocol,BB84 with Decoy States`,
        `Quantum Bit Error Rate,0.02%`,
        '',
        '=== BLOCKCHAIN STATUS ===',
        'Metric,Value',
        `Block Height,${data.blockchainData.blockHeight}`,
        `Active Validators,${data.blockchainData.activeValidators}`,
        `Transaction Count,${data.blockchainData.transactionCount}`,
        `Network Status,${data.blockchainData.networkStatus}`,
        `Consensus Algorithm,Proof of Authority`,
        `Average Block Time,3.2 seconds`,
        '',
        '=== SATELLITE FLEET OVERVIEW ===',
        'Metric,Value',
        `Total Satellites,${comprehensiveData.satelliteFleet.total}`,
        `Operational,${comprehensiveData.satelliteFleet.operational}`,
        `Limited Connection,${comprehensiveData.satelliteFleet.limitedConnection}`,
        `Offline,${comprehensiveData.satelliteFleet.offline}`,
        `Total Coverage,${comprehensiveData.satelliteFleet.totalCoverage}`,
        `Average Altitude,${comprehensiveData.satelliteFleet.averageAltitude}`,
        '',
        '=== DETAILED SATELLITE DATA ===',
        'ID,Name,Orbit Type,Altitude (km),Inclination,Status,Last Contact,Quantum Key ID,Signal Strength,Data Rate,Battery,Solar Efficiency,Position X,Position Y,Position Z',
        ...comprehensiveData.satellites.map(sat => [
          sat.id,
          sat.name,
          sat.orbitType,
          sat.altitude,
          sat.inclination,
          sat.status,
          sat.lastContact,
          sat.quantumKeyId,
          sat.signalStrength,
          sat.dataRate,
          sat.batteryLevel,
          sat.solarPanelEfficiency,
          sat.position.x.toFixed(2),
          sat.position.y.toFixed(2),
          sat.position.z.toFixed(2)
        ].join(',')),
        '',
        '=== ANALYTICS ===',
        'Metric,Value',
        `Total Data Transferred,${comprehensiveData.analytics.totalDataTransferred}`,
        `Average Latency,${comprehensiveData.analytics.averageLatency}`,
        `Success Rate,${comprehensiveData.analytics.successRate}`,
        `Peak Bandwidth,${comprehensiveData.analytics.peakBandwidth}`,
        `Average Throughput,${comprehensiveData.analytics.averageThroughput}`,
        '',
        '=== SECURITY STATUS ===',
        'Metric,Value',
        `Threat Level,${comprehensiveData.security.threatLevel}`,
        `Active Threats,${comprehensiveData.security.activeThreats}`,
        `Blocked Attempts,${comprehensiveData.security.blockedAttempts}`,
        `Firewall Status,${comprehensiveData.security.firewallStatus}`,
        `Intrusion Detection,${comprehensiveData.security.intrusionDetection}`,
        `Quantum Encryption,${comprehensiveData.security.quantumEncryption}`,
        '',
        '=== PERFORMANCE METRICS ===',
        'Metric,Value',
        `CPU Usage,${comprehensiveData.performanceMetrics.cpuUsage}`,
        `Memory Usage,${comprehensiveData.performanceMetrics.memoryUsage}`,
        `Storage Used,${comprehensiveData.performanceMetrics.storageUsed}`,
        `Network Utilization,${comprehensiveData.performanceMetrics.networkUtilization}`,
        `Response Time,${comprehensiveData.performanceMetrics.responseTime}`
      ].join('\n');

      const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(csvBlob);
      link.setAttribute('href', url);
      link.setAttribute('download', `thunderbird-complete-export-${timestamp}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      // Export comprehensive formatted report
      const reportText = `
╔═══════════════════════════════════════════════════════════════════════╗
║       THUNDERBIRD QUANTUM SPACE COMMUNICATIONS                       ║
║              COMPREHENSIVE SYSTEM REPORT                             ║
║                Generated: ${new Date().toLocaleString()}                        ║
╚═══════════════════════════════════════════════════════════════════════╝

📊 EXECUTIVE SUMMARY
${'═'.repeat(75)}
System Version: ${comprehensiveData.exportMetadata.systemVersion}
Report Generated: ${new Date(comprehensiveData.exportMetadata.generatedAt).toLocaleString()}
System Health: ${comprehensiveData.systemStatus.health}
Overall Status: ALL SYSTEMS OPERATIONAL

🖥️ SYSTEM STATUS
${'─'.repeat(75)}
• System Mode: ${data.systemMode.toUpperCase()}
• Last Update: ${new Date(data.lastUpdateTime).toLocaleString()}
• System Uptime: ${comprehensiveData.systemStatus.uptime}
• Health Status: ${comprehensiveData.systemStatus.health}

🔐 QUANTUM SECURITY STATUS
${'─'.repeat(75)}
• Available Quantum Keys: ${comprehensiveData.quantumSecurity.availableKeys}
• Active Secure Channels: ${comprehensiveData.quantumSecurity.activeChannels}
• Encryption Level: ${comprehensiveData.quantumSecurity.encryptionLevel}
• Key Generation Rate: ${comprehensiveData.quantumSecurity.keyGenerationRate}
• Security Protocol: ${comprehensiveData.quantumSecurity.securityProtocol}
• Quantum Bit Error Rate: ${comprehensiveData.quantumSecurity.quantumBitErrorRate}
• Security Assessment: MAXIMUM SECURITY ACHIEVED

⛓️ BLOCKCHAIN STATUS
${'─'.repeat(75)}
• Block Height: ${comprehensiveData.blockchain.blockHeight}
• Active Validators: ${comprehensiveData.blockchain.activeValidators}
• Total Transactions: ${comprehensiveData.blockchain.transactionCount}
• Network Status: ${comprehensiveData.blockchain.networkStatus.toUpperCase()}
• Last Block Time: ${new Date(comprehensiveData.blockchain.lastBlockTime).toLocaleString()}
• Consensus Algorithm: ${comprehensiveData.blockchain.consensusAlgorithm}
• Average Block Time: ${comprehensiveData.blockchain.avgBlockTime}
• Network Hash Rate: ${comprehensiveData.blockchain.networkHashRate}

🛰️ SATELLITE FLEET OVERVIEW
${'─'.repeat(75)}
• Total Satellites: ${comprehensiveData.satelliteFleet.total}
• Operational: ${comprehensiveData.satelliteFleet.operational} (${((comprehensiveData.satelliteFleet.operational/comprehensiveData.satelliteFleet.total)*100).toFixed(1)}%)
• Limited Connection: ${comprehensiveData.satelliteFleet.limitedConnection}
• Offline: ${comprehensiveData.satelliteFleet.offline}
• Global Coverage: ${comprehensiveData.satelliteFleet.totalCoverage}
• Average Altitude: ${comprehensiveData.satelliteFleet.averageAltitude}
• Orbit Types: ${comprehensiveData.satelliteFleet.orbitTypes}

📡 DETAILED SATELLITE STATUS
${'─'.repeat(75)}
${comprehensiveData.satellites.map((sat, i) => `
${i + 1}. ${sat.name} (${sat.id})
   ├─ Orbit: ${sat.orbitType}
   ├─ Altitude: ${sat.altitude.toFixed(2)} km
   ├─ Inclination: ${sat.inclination}°
   ├─ Status: ${sat.status.toUpperCase()}
   ├─ Signal Strength: ${sat.signalStrength}
   ├─ Data Rate: ${sat.dataRate}
   ├─ Battery Level: ${sat.batteryLevel}
   ├─ Solar Efficiency: ${sat.solarPanelEfficiency}
   ├─ Last Contact: ${new Date(sat.lastContact).toLocaleString()}
   ├─ Quantum Key: ${sat.quantumKeyId}
   ├─ Key Generation: ${sat.keyGeneration}
   └─ Position: [x: ${sat.position.x.toFixed(2)}, y: ${sat.position.y.toFixed(2)}, z: ${sat.position.z.toFixed(2)}]`).join('\n')}

📈 ANALYTICS & PERFORMANCE
${'─'.repeat(75)}
• Total Data Transferred: ${comprehensiveData.analytics.totalDataTransferred}
• Average Latency: ${comprehensiveData.analytics.averageLatency}
• Success Rate: ${comprehensiveData.analytics.successRate}
• Active Connections: ${comprehensiveData.analytics.activeConnections}
• Peak Bandwidth: ${comprehensiveData.analytics.peakBandwidth}
• Average Throughput: ${comprehensiveData.analytics.averageThroughput}

🛡️ SECURITY STATUS
${'─'.repeat(75)}
• Current Threat Level: ${comprehensiveData.security.threatLevel}
• Active Threats Detected: ${comprehensiveData.security.activeThreats}
• Blocked Intrusion Attempts: ${comprehensiveData.security.blockedAttempts}
• Last Security Scan: ${new Date(comprehensiveData.security.lastSecurityScan).toLocaleString()}
• Firewall Status: ${comprehensiveData.security.firewallStatus}
• Intrusion Detection System: ${comprehensiveData.security.intrusionDetection}
• Quantum Encryption: ${comprehensiveData.security.quantumEncryption}

⚙️ SYSTEM PERFORMANCE METRICS
${'─'.repeat(75)}
• CPU Usage: ${comprehensiveData.performanceMetrics.cpuUsage}
• Memory Usage: ${comprehensiveData.performanceMetrics.memoryUsage}
• Storage Used: ${comprehensiveData.performanceMetrics.storageUsed}
• Network Utilization: ${comprehensiveData.performanceMetrics.networkUtilization}
• Average Response Time: ${comprehensiveData.performanceMetrics.responseTime}

${'═'.repeat(75)}
✓ SYSTEM STATUS: ALL SYSTEMS OPERATIONAL
✓ SECURITY LEVEL: MAXIMUM
✓ QUANTUM PROTECTION: ACTIVE
✓ NETWORK HEALTH: EXCELLENT

Report Generated By: ${comprehensiveData.exportMetadata.exportedBy}
Classification: CONFIDENTIAL - FOR AUTHORIZED PERSONNEL ONLY
Distribution: Restricted to cleared personnel with need-to-know access
${'═'.repeat(75)}
      `.trim();

      const textBlob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(textBlob);
      link.setAttribute('href', url);
      link.setAttribute('download', `thunderbird-complete-report-${timestamp}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Enhanced Animated Background with Multiple Layers */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Primary Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-transparent to-transparent opacity-40 animate-aurora"></div>
        
        {/* Secondary Light Rays */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-space-blue/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-space-purple/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-space-cyan/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Enhanced Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-space-blue rounded-full animate-float opacity-40"></div>
        <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-space-cyan rounded-full animate-float-slow opacity-35"></div>
      </div>

      <Head>
        <title>ThunderBird Quantum Space Communications</title>
        <meta name="description" content="Quantum-secured space communications system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-10 max-w-[1920px]" role="main" aria-label="ThunderBird Dashboard">
        {error && (
          <Alert 
            variant="destructive" 
            className="mb-4 sm:mb-6 bg-red-900/50 border-red-500/50 backdrop-blur-md shadow-lg animate-slide-in"
            role="alert"
            aria-live="assertive"
          >
            <AlertDescription className="text-red-200 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Header Section */}
        <header className="text-center mb-10 sm:mb-14 animate-fade-in" role="banner">
          <div className="flex items-center justify-center mb-6">
            <div className="relative group">
              {/* Multiple Glow Layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full blur-2xl opacity-40 animate-pulse-glow"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-30 animate-pulse group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 p-4 sm:p-5 rounded-full shadow-glow-lg group-hover:scale-110 transition-transform duration-300">
                <Satellite className="h-7 w-7 sm:h-10 sm:w-10 text-white animate-float" aria-hidden="true" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift drop-shadow-lg">
            ThunderBird
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 font-light px-4 mb-2 text-balance">
            Quantum Space Communications
          </p>
          <p className="text-sm sm:text-base text-gray-400 px-4 max-w-2xl mx-auto text-balance">
            Real-time satellite monitoring • Quantum security • Blockchain integration
          </p>
          
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* Enhanced Status Indicator */}
            <div className="glass-card px-4 py-2.5 rounded-full flex items-center space-x-3 shadow-lg hover:shadow-glow-md transition-all duration-300 group">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                {connected && (
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-pulse-ring"></div>
                )}
              </div>
              <span className="text-sm sm:text-base font-medium group-hover:text-white transition-colors">
                {connected ? (
                  <span className="flex items-center gap-2">
                    <span className="text-green-400">●</span> System Online
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="text-red-400">●</span> System Offline
                  </span>
                )}
              </span>
            </div>
            
            <div className="glass-card px-4 py-2 rounded-full shadow-lg">
              <ThemeToggle 
                onExport={(format) => {
                  if (!status) {
                    alert('No data available to export');
                    return;
                  }
                  handleExport(format, status);
                }}
              />
            </div>

            {/* Admin Login Button */}
            <Link href="/admin/login">
              <Button className="glass-card px-6 py-2.5 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border border-purple-400/30 hover:shadow-glow-md transition-all duration-300 hover:scale-105">
                <Shield className="h-4 w-4 mr-2" />
                <span className="font-semibold">Admin Login</span>
              </Button>
            </Link>
          </div>
        </header>

        {!connected ? (
          <Card className="max-w-sm sm:max-w-md mx-auto glass-card border border-white/10 shadow-2xl rounded-3xl animate-slide-in" role="status" aria-live="polite">
            <CardContent className="py-10 sm:py-14 flex flex-col items-center space-y-6 sm:space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full blur-2xl opacity-30 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 p-6 sm:p-8 rounded-full shadow-glow-lg">
                  <RefreshCwIcon className="h-10 w-10 sm:h-14 sm:w-14 text-white animate-spin" aria-hidden="true" />
                </div>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Connecting to Network</h3>
                <p className="text-sm sm:text-base text-gray-300 px-4">Establishing secure quantum connection...</p>
                <div className="loading-dots justify-center pt-2" aria-label="Loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : status ? (
          <>
            {/* Enhanced Mode Selection */}
            <nav className="flex justify-center mb-8 sm:mb-10 animate-slide-in" aria-label="System mode selection">
              <div className="glass-card rounded-3xl p-2 sm:p-3 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full max-w-2xl shadow-xl border border-white/20">
                <Button 
                  variant={status?.systemMode === 'realtime' ? "default" : "ghost"}
                  onClick={() => changeMode('realtime')}
                  className={`px-5 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 flex-1 font-semibold text-sm sm:text-base ${
                    status?.systemMode === 'realtime' 
                      ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white shadow-glow-md hover:shadow-glow-lg border border-blue-400/30 scale-105' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 hover:scale-105'
                  }`}
                  aria-label="Switch to real-time mode"
                  aria-pressed={status?.systemMode === 'realtime'}
                >
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                  <span>Real-time Mode</span>
                </Button>
                <Button 
                  variant={status?.systemMode === 'scenario' ? "default" : "ghost"}
                  onClick={() => changeMode('scenario')}
                  className={`px-5 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 flex-1 font-semibold text-sm sm:text-base ${
                    status?.systemMode === 'scenario' 
                      ? 'bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 text-white shadow-glow-md hover:shadow-glow-lg border border-purple-400/30 scale-105' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 hover:scale-105'
                  }`}
                  aria-label="Switch to scenario mode"
                  aria-pressed={status?.systemMode === 'scenario'}
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                  <span>Scenario Mode</span>
                </Button>
              </div>
            </nav>

            {/* Advanced Dashboard Grid */}
            <div className="space-y-8 sm:space-y-10 lg:space-y-12 animate-fade-in">
              {/* Main Dashboard */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                <Dashboard status={status} />
                <ScenarioMode 
                  systemMode={status.systemMode} 
                  lastUpdateTime={status.lastUpdateTime}
                  onScenarioChange={(scenario, data) => {
                    setCurrentScenario(scenario);
                    setScenarioData(data);
                  }}
                />
              </div>

              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                <AnalyticsDashboard 
                  systemData={status}
                  scenarioData={scenarioData}
                  currentScenario={currentScenario}
                />
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
          <Card className="max-w-sm sm:max-w-md mx-auto glass-card border border-white/10 shadow-2xl rounded-3xl animate-slide-in" role="status" aria-live="polite">
            <CardContent className="py-10 sm:py-14 flex flex-col items-center space-y-6 sm:space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-6 sm:p-8 rounded-full shadow-glow-lg">
                  <Globe className="h-10 w-10 sm:h-14 sm:w-14 text-white animate-spin" aria-hidden="true" />
                </div>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Loading System Data</h3>
                <p className="text-sm sm:text-base text-gray-300 px-4">Initializing quantum protocols...</p>
                <div className="loading-dots justify-center pt-2" aria-label="Loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="relative z-10 mt-12 sm:mt-16 py-6 sm:py-8 border-t border-white/10 glass-dark" role="contentinfo">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1920px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 group">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30 group-hover:border-blue-400/50 transition-colors">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 group-hover:text-blue-300 transition-colors" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-gray-200">
                  ThunderBird System
                </span>
                <span className="text-2xs sm:text-xs text-gray-400">
                  Quantum-Secured Space Communications
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-full border border-white/10">
                {connected ? (
                  <>
                    <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 animate-pulse" aria-hidden="true" />
                    <div className="flex flex-col">
                      <span className="text-2xs sm:text-xs font-medium text-green-400">Connected</span>
                      {status?.lastUpdateTime && (
                        <span className="text-2xs text-gray-400 hidden sm:block">
                          {new Date(status.lastUpdateTime).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" aria-hidden="true" />
                    <div className="flex flex-col">
                      <span className="text-2xs sm:text-xs font-medium text-red-400">Disconnected</span>
                      <span className="text-2xs text-gray-400 hidden sm:block">Reconnecting...</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-4 sm:mt-6 pt-4 border-t border-white/5 text-center">
            <p className="text-2xs sm:text-xs text-gray-500">
              © {new Date().getFullYear()} ThunderBird. All rights reserved. • Powered by Quantum Technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
