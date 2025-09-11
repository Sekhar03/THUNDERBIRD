'use client';
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Satellite, 
  Shield, 
  Activity, 
  Globe, 
  Wifi, 
  Zap, 
  Clock, 
  Key,
  Signal,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// Interface definitions
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

interface DashboardProps {
  status: SystemStatus;
}

const Dashboard: React.FC<DashboardProps> = ({ status }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />;
      case 'limited_connection':
        return <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />;
      default:
        return <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'limited_connection':
        return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      default:
        return 'bg-red-500/20 border-red-500/30 text-red-400';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Main Dashboard Card */}
      <Card className="bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-white/10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-5 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-3 rounded-full">
                  <Satellite className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ThunderBird Quantum Space Communications
                </CardTitle>
                <p className="text-sm sm:text-base text-gray-300 mt-2">Real-time satellite monitoring & quantum security</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="text-right">
                <p className="text-xs sm:text-sm text-gray-400">System Mode</p>
                <Badge 
                  variant={status.systemMode === 'realtime' ? 'default' : 'secondary'} 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full"
                >
                  {status.systemMode === 'realtime' ? 'Real-time' : 'Scenario'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* Status Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Quantum Security Card */}
            <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-md border border-blue-500/20 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1.5 sm:p-2 rounded-lg">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <CardTitle className="text-sm sm:text-lg font-semibold text-blue-300">Quantum Security</CardTitle>
                  </div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
                    <div className="flex items-center space-x-2">
                      <Key className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                      <span className="text-xs sm:text-sm text-gray-300">Available Keys</span>
                    </div>
                    <span className="font-mono text-blue-400 font-bold text-xs sm:text-sm">{status.quantumKeyPool}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                      <span className="text-xs sm:text-sm text-gray-300">Active Channels</span>
                    </div>
                    <span className="font-mono text-blue-400 font-bold text-xs sm:text-sm">{status.activeChannels}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                      <span className="text-xs sm:text-sm text-gray-300">Last Update</span>
                    </div>
                    <span className="text-xs text-blue-400">{new Date(status.lastUpdateTime).toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Status Card */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md border border-purple-500/20 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 sm:p-2 rounded-lg">
                      <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <CardTitle className="text-sm sm:text-lg font-semibold text-purple-300">Blockchain Status</CardTitle>
                  </div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                      <span className="text-xs sm:text-sm text-gray-300">Block Height</span>
                    </div>
                    <span className="font-mono text-purple-400 font-bold text-xs sm:text-sm">{status.blockchainData.blockHeight}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <div className="flex items-center space-x-2">
                      <Signal className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                      <span className="text-xs sm:text-sm text-gray-300">Validators</span>
                    </div>
                    <span className="font-mono text-purple-400 font-bold text-xs sm:text-sm">{status.blockchainData.activeValidators}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                      <span className="text-xs sm:text-sm text-gray-300">Transactions</span>
                    </div>
                    <span className="font-mono text-purple-400 font-bold text-xs sm:text-sm">{status.blockchainData.transactionCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                      <span className="text-xs sm:text-sm text-gray-300">Network</span>
                    </div>
                    <Badge 
                      variant="default" 
                      className={`capitalize text-xs ${status.blockchainData.networkStatus === 'active' ? 'bg-green-500/80' : status.blockchainData.networkStatus === 'degraded' ? 'bg-orange-500/80' : 'bg-red-500/80'}`}
                    >
                      {status.blockchainData.networkStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Satellite Fleet Card */}
            <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-md border border-green-500/20 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1.5 sm:p-2 rounded-lg">
                      <Satellite className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <CardTitle className="text-sm sm:text-lg font-semibold text-green-300">Satellite Fleet</CardTitle>
                  </div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                      <span className="text-xs sm:text-sm text-gray-300">Total Satellites</span>
                    </div>
                    <span className="font-mono text-green-400 font-bold text-xs sm:text-sm">{status.satellites.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                      <span className="text-xs sm:text-sm text-gray-300">Operational</span>
                    </div>
                    <Badge variant="default" className="bg-green-500/80 text-xs">
                      {status.satellites.filter(s => s.status === 'operational').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                      <span className="text-xs sm:text-sm text-gray-300">Limited Connection</span>
                    </div>
                    <Badge variant="destructive" className="bg-orange-500/80 text-xs">
                      {status.satellites.filter(s => s.status === 'limited_connection').length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Satellite Status Table */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-1.5 sm:p-2 rounded-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-cyan-300">Satellite Status</h3>
            </div>
            
            <div className="bg-gradient-to-br from-black/40 to-cyan-900/20 backdrop-blur-md border border-cyan-500/20 rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-b border-cyan-500/20">
                      {['ID', 'Name', 'Altitude', 'Status', 'Last Contact', 'Key ID'].map((header) => (
                        <TableHead key={header} className="text-cyan-300 font-semibold text-center py-4 sm:py-5 text-xs sm:text-sm">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {status.satellites.map((sat) => (
                      <TableRow
                        key={sat.id}
                        className={`transition-all duration-300 hover:bg-white/5 ${
                          sat.status === 'operational'
                            ? 'bg-green-500/5 border-l-4 border-l-green-500/50'
                            : sat.status === 'limited_connection'
                            ? 'bg-orange-500/5 border-l-4 border-l-orange-500/50'
                            : 'bg-red-500/5 border-l-4 border-l-red-500/50'
                        }`}
                      >
                        <TableCell className="text-center text-xs sm:text-sm font-mono text-gray-200 break-words">
                          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                            {getStatusIcon(sat.status)}
                            <span className="break-words">{sat.id}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-xs sm:text-sm text-gray-200 break-words">{sat.name}</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm text-cyan-200 font-mono">
                          {Math.round(sat.altitude)} km
                        </TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">
                          <Badge 
                            variant="outline" 
                            className={`capitalize border text-xs sm:text-sm ${getStatusColor(sat.status)} rounded-full px-3 py-1`}
                          >
                            {sat.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-xs sm:text-sm text-gray-200 break-words">
                          {new Date(sat.lastContact).toLocaleTimeString()}
                        </TableCell>
                        <TableCell className="text-center text-xs sm:text-sm font-mono text-gray-200 break-words">
                          {sat.quantumKeyId}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;