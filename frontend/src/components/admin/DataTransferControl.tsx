'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import {
  Database,
  Upload,
  Download,
  Lock,
  Unlock,
  Play,
  Pause,
  StopCircle,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  Key,
  Satellite,
  ArrowRightLeft,
  Eye,
  Filter,
  Plus,
  RefreshCw,
  Activity
} from 'lucide-react';

interface DataTransfer {
  id: string;
  transferId: string;
  source: string;
  destination: string;
  dataType: 'satellite_telemetry' | 'quantum_keys' | 'blockchain_data' | 'system_logs' | 'encrypted_payload';
  size: number; // in GB
  transferred: number; // in GB
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'failed' | 'locked';
  keyId: string | null;
  keyRequired: boolean;
  startTime: Date;
  estimatedCompletion: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  encryption: 'quantum' | 'aes256' | 'none';
  approvedBy: string | null;
  errorMessage?: string;
}

const DataTransferControl: React.FC = () => {
  const [transfers, setTransfers] = useState<DataTransfer[]>([
    {
      id: '1',
      transferId: 'TRF-2024-001',
      source: 'Satellite-001',
      destination: 'Ground Station Alpha',
      dataType: 'satellite_telemetry',
      size: 45.2,
      transferred: 45.2,
      status: 'completed',
      keyId: 'QK-2024-001-A7F3',
      keyRequired: true,
      startTime: new Date(Date.now() - 3600000),
      estimatedCompletion: new Date(Date.now() - 600000),
      priority: 'high',
      encryption: 'quantum',
      approvedBy: 'admin@thunderbird.com'
    },
    {
      id: '2',
      transferId: 'TRF-2024-002',
      source: 'Quantum Network Node 1',
      destination: 'Quantum Network Node 2',
      dataType: 'quantum_keys',
      size: 0.05,
      transferred: 0.035,
      status: 'in_progress',
      keyId: 'QK-2024-002-B8E4',
      keyRequired: true,
      startTime: new Date(Date.now() - 1800000),
      estimatedCompletion: new Date(Date.now() + 600000),
      priority: 'critical',
      encryption: 'quantum',
      approvedBy: 'admin@thunderbird.com'
    },
    {
      id: '3',
      transferId: 'TRF-2024-003',
      source: 'Blockchain Validator 1',
      destination: 'Archive Storage',
      dataType: 'blockchain_data',
      size: 125.6,
      transferred: 0,
      status: 'locked',
      keyId: null,
      keyRequired: true,
      startTime: new Date(),
      estimatedCompletion: new Date(Date.now() + 7200000),
      priority: 'medium',
      encryption: 'quantum',
      approvedBy: null
    },
    {
      id: '4',
      transferId: 'TRF-2024-004',
      source: 'System Logs Database',
      destination: 'Compliance Archive',
      dataType: 'system_logs',
      size: 34.8,
      transferred: 15.2,
      status: 'paused',
      keyId: 'QK-2024-003-C9F5',
      keyRequired: false,
      startTime: new Date(Date.now() - 5400000),
      estimatedCompletion: new Date(Date.now() + 3600000),
      priority: 'low',
      encryption: 'aes256',
      approvedBy: 'operator@thunderbird.com'
    },
  ]);

  const [selectedTransfer, setSelectedTransfer] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | DataTransfer['status']>('all');
  const [showUnlockModal, setShowUnlockModal] = useState<string | null>(null);
  const [unlockKeyId, setUnlockKeyId] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState<string | null>(null);
  const [showNewTransferModal, setShowNewTransferModal] = useState(false);
  const [newTransfer, setNewTransfer] = useState({
    source: '',
    destination: '',
    dataType: 'satellite_telemetry' as DataTransfer['dataType'],
    size: 0,
    priority: 'medium' as DataTransfer['priority'],
    encryption: 'quantum' as DataTransfer['encryption'],
    keyId: ''
  });
  
  // Mock raw file/text data for transfer visualization
  const getTransferRawData = (transferId: string) => {
    const transfer = transfers.find(t => t.id === transferId);
    if (!transfer) return null;
    
    const fileTypes = {
      'satellite_telemetry': ['telemetry_data.json', 'orbital_params.csv', 'sensor_readings.bin'],
      'quantum_keys': ['qkey_bundle.qkd', 'entropy_pool.dat', 'verification.sig'],
      'blockchain_data': ['block_0001.blk', 'transaction_log.db', 'consensus_state.json'],
      'system_logs': ['system.log', 'access.log', 'error.log'],
      'encrypted_payload': ['payload.enc', 'metadata.json', 'checksum.sha256']
    };
    
    const sampleData = {
      'satellite_telemetry': `{
  "timestamp": "${new Date().toISOString()}",
  "satellite_id": "SAT-001",
  "altitude": 408.5,
  "velocity": 7.66,
  "temperature": -45.2,
  "power_level": 92.3,
  "signal_strength": -87.5,
  "orientation": [0.125, 0.874, -0.468]
}`,
      'quantum_keys': `QKD-PROTOCOL-v2.1\nKEY-LENGTH: 256\nENTROPY: 7.999834\nVERIFICATION: PASSED\n\n[ENCRYPTED KEY DATA]\n0x4A7F8E2B9C1D3F6E8A0B2C4D5E6F7A8B\n0xC9D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5\n0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D`,
      'blockchain_data': `BLOCK HEADER:\nVersion: 1\nPrevious Hash: 0x00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048\nMerkle Root: 0x4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b\nTimestamp: ${Date.now()}\nDifficulty: 0x1d00ffff\nNonce: 2083236893\n\nTRANSACTIONS: 247`,
      'system_logs': `[${new Date().toISOString()}] INFO: Data transfer initiated\n[${new Date().toISOString()}] INFO: Quantum key authentication successful\n[${new Date().toISOString()}] INFO: Encryption layer active: AES-256-GCM\n[${new Date().toISOString()}] INFO: Transfer rate: 125.3 MB/s\n[${new Date().toISOString()}] INFO: Packets transmitted: 45,231\n[${new Date().toISOString()}] INFO: Packet loss: 0.02%`,
      'encrypted_payload': `-----BEGIN ENCRYPTED DATA-----\nProtocol: Quantum-Resistant AES-256\nKey-ID: ${transfer.keyId || 'PENDING'}\nIV: 0x7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D\n\n[ENCRYPTED BINARY DATA - 2048 BYTES]\n4a7f8e2b9c1d3f6e8a0b2c4d5e6f7a8bc9d1e2f3a4b5c6d7\ne8f9a0b1c2d3e4f51a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d\n...\n-----END ENCRYPTED DATA-----`
    };
    
    return {
      files: fileTypes[transfer.dataType] || ['data.bin'],
      rawData: sampleData[transfer.dataType] || 'Binary data stream...',
      packets: Math.floor(Math.random() * 50000 + 10000),
      throughput: (Math.random() * 200 + 50).toFixed(1)
    };
  };

  const filteredTransfers = transfers.filter(t => 
    filterStatus === 'all' || t.status === filterStatus
  );

  const getStatusColor = (status: DataTransfer['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'in_progress': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      case 'paused': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'failed': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'locked': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      case 'pending': return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  const getPriorityColor = (priority: DataTransfer['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-gray-400';
    }
  };

  const getDataTypeIcon = (type: DataTransfer['dataType']) => {
    switch (type) {
      case 'satellite_telemetry': return <Satellite className="h-4 w-4" />;
      case 'quantum_keys': return <Key className="h-4 w-4" />;
      case 'blockchain_data': return <Database className="h-4 w-4" />;
      case 'system_logs': return <Clock className="h-4 w-4" />;
      case 'encrypted_payload': return <Shield className="h-4 w-4" />;
    }
  };

  const handleUnlockTransfer = (transferId: string) => {
    // Validate key ID
    if (!unlockKeyId.trim()) {
      alert('Please enter a valid key ID');
      return;
    }

    setTransfers(prev => prev.map(t => 
      t.id === transferId
        ? { ...t, status: 'pending' as const, keyId: unlockKeyId, approvedBy: 'current_admin' }
        : t
    ));

    setShowUnlockModal(null);
    setUnlockKeyId('');
  };

  const handleStartTransfer = (transferId: string) => {
    setTransfers(prev => prev.map(t => 
      t.id === transferId ? { ...t, status: 'in_progress' as const } : t
    ));
  };

  const handlePauseTransfer = (transferId: string) => {
    setTransfers(prev => prev.map(t => 
      t.id === transferId ? { ...t, status: 'paused' as const } : t
    ));
  };

  const handleStopTransfer = (transferId: string) => {
    setTransfers(prev => prev.map(t => 
      t.id === transferId ? { ...t, status: 'failed' as const, errorMessage: 'Manually stopped by admin' } : t
    ));
  };

  const handleCreateTransfer = () => {
    if (!newTransfer.source || !newTransfer.destination || newTransfer.size <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const transfer: DataTransfer = {
      id: Date.now().toString(),
      transferId: `TRF-${new Date().getFullYear()}-${String(transfers.length + 1).padStart(3, '0')}`,
      source: newTransfer.source,
      destination: newTransfer.destination,
      dataType: newTransfer.dataType,
      size: newTransfer.size,
      transferred: 0,
      status: newTransfer.keyId ? 'pending' : 'locked',
      keyId: newTransfer.keyId || null,
      keyRequired: true,
      startTime: new Date(),
      estimatedCompletion: new Date(Date.now() + (newTransfer.size * 60000)), // 1 min per GB
      priority: newTransfer.priority,
      encryption: newTransfer.encryption,
      approvedBy: newTransfer.keyId ? 'admin@thunderbird.com' : null
    };

    setTransfers(prev => [transfer, ...prev]);
    setShowNewTransferModal(false);
    setNewTransfer({
      source: '',
      destination: '',
      dataType: 'satellite_telemetry',
      size: 0,
      priority: 'medium',
      encryption: 'quantum',
      keyId: ''
    });
  };

  const stats = {
    total: transfers.length,
    inProgress: transfers.filter(t => t.status === 'in_progress').length,
    locked: transfers.filter(t => t.status === 'locked').length,
    completed: transfers.filter(t => t.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border border-cyan-500/30 rounded-3xl">
        <CardHeader className="border-b border-cyan-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-xl opacity-40 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-full shadow-glow-lg group-hover:scale-110 transition-transform duration-300">
                  <Database className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold gradient-text-quantum">
                  Data Transfer & Migration Control
                </CardTitle>
                <p className="text-sm text-gray-300 mt-1">
                  Secure data transfer with quantum key authentication
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={() => setShowNewTransferModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Transfer
              </Button>
              <Button 
                variant="outline" 
                className="glass-card border-cyan-500/30"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border border-blue-500/30 rounded-2xl hover:shadow-glow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Database className="h-5 w-5 text-blue-400" />
              <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-400 text-xs">
                Total
              </Badge>
            </div>
            <p className="text-2xl font-bold text-blue-400">{stats.total}</p>
            <p className="text-xs text-gray-400 mt-1">Total Transfers</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-cyan-500/30 rounded-2xl hover:shadow-glow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <ArrowRightLeft className="h-5 w-5 text-cyan-400 animate-pulse" />
              <Badge variant="outline" className="bg-cyan-500/20 border-cyan-500/30 text-cyan-400 text-xs">
                Active
              </Badge>
            </div>
            <p className="text-2xl font-bold text-cyan-400">{stats.inProgress}</p>
            <p className="text-xs text-gray-400 mt-1">In Progress</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-orange-500/30 rounded-2xl hover:shadow-glow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Lock className="h-5 w-5 text-orange-400" />
              <Badge variant="outline" className="bg-orange-500/20 border-orange-500/30 text-orange-400 text-xs">
                Locked
              </Badge>
            </div>
            <p className="text-2xl font-bold text-orange-400">{stats.locked}</p>
            <p className="text-xs text-gray-400 mt-1">Awaiting Keys</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-green-500/30 rounded-2xl hover:shadow-glow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-400 text-xs">
                Done
              </Badge>
            </div>
            <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
            <p className="text-xs text-gray-400 mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card border border-purple-500/30 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-300">Filter by status:</span>
            {(['all', 'in_progress', 'locked', 'pending', 'paused', 'completed', 'failed'] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={`capitalize text-xs ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                    : 'border-purple-500/30'
                }`}
              >
                {status === 'all' ? 'All' : status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transfers Table */}
      <Card className="glass-card border border-cyan-500/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-b border-cyan-500/30">
                <TableHead className="text-cyan-300 font-bold">Transfer ID</TableHead>
                <TableHead className="text-cyan-300 font-bold">Route</TableHead>
                <TableHead className="text-cyan-300 font-bold">Data Type</TableHead>
                <TableHead className="text-cyan-300 font-bold">Progress</TableHead>
                <TableHead className="text-cyan-300 font-bold">Status</TableHead>
                <TableHead className="text-cyan-300 font-bold">Priority</TableHead>
                <TableHead className="text-cyan-300 font-bold">Key Auth</TableHead>
                <TableHead className="text-cyan-300 font-bold">Encryption</TableHead>
                <TableHead className="text-cyan-300 font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.map((transfer) => {
                const progress = (transfer.transferred / transfer.size) * 100;
                return (
                  <TableRow
                    key={transfer.id}
                    className={`border-b border-cyan-500/20 hover:bg-white/5 transition-all ${
                      selectedTransfer === transfer.id ? 'bg-cyan-500/10' : ''
                    }`}
                    onClick={() => setSelectedTransfer(transfer.id)}
                  >
                    <TableCell className="font-mono text-sm text-white">
                      {transfer.transferId}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Upload className="h-3 w-3 text-blue-400" />
                          <span className="text-gray-300">{transfer.source}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Download className="h-3 w-3 text-green-400" />
                          <span className="text-gray-300">{transfer.destination}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDataTypeIcon(transfer.dataType)}
                        <span className="text-xs text-gray-300 capitalize">
                          {transfer.dataType.replace('_', ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-300">
                          {transfer.transferred.toFixed(1)} / {transfer.size.toFixed(1)} GB
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              transfer.status === 'completed' ? 'bg-green-500' :
                              transfer.status === 'in_progress' ? 'bg-blue-500 animate-pulse' :
                              transfer.status === 'failed' ? 'bg-red-500' :
                              'bg-gray-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="text-2xs text-gray-400">{progress.toFixed(0)}%</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(transfer.status)} text-xs capitalize`}>
                        {transfer.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-semibold capitalize ${getPriorityColor(transfer.priority)}`}>
                        {transfer.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      {transfer.keyRequired ? (
                        transfer.keyId ? (
                          <div className="flex items-center gap-1">
                            <Unlock className="h-3 w-3 text-green-400" />
                            <span className="text-xs text-green-400 font-mono">{transfer.keyId}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Lock className="h-3 w-3 text-orange-400" />
                            <span className="text-xs text-orange-400">Required</span>
                          </div>
                        )
                      ) : (
                        <span className="text-xs text-gray-400">Not required</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          transfer.encryption === 'quantum' ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' :
                          transfer.encryption === 'aes256' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' :
                          'bg-gray-500/20 border-gray-500/30 text-gray-400'
                        }`}
                      >
                        {transfer.encryption.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {transfer.status === 'locked' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-orange-500/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowUnlockModal(transfer.id);
                            }}
                          >
                            <Unlock className="h-4 w-4 text-orange-400" />
                          </Button>
                        )}
                        {transfer.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-green-500/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartTransfer(transfer.id);
                            }}
                          >
                            <Play className="h-4 w-4 text-green-400" />
                          </Button>
                        )}
                        {transfer.status === 'in_progress' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-yellow-500/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePauseTransfer(transfer.id);
                            }}
                          >
                            <Pause className="h-4 w-4 text-yellow-400" />
                          </Button>
                        )}
                        {(transfer.status === 'in_progress' || transfer.status === 'paused') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-500/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStopTransfer(transfer.id);
                            }}
                          >
                            <StopCircle className="h-4 w-4 text-red-400" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-500/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDetailsModal(transfer.id);
                          }}
                        >
                          <Eye className="h-4 w-4 text-blue-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Unlock Modal */}
      {showUnlockModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowUnlockModal(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <Card className="glass-card border border-orange-500/30 rounded-2xl w-full max-w-md animate-slide-in">
              <CardHeader className="border-b border-orange-500/30">
                <CardTitle className="text-xl font-bold text-orange-300 flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Unlock Transfer with Quantum Key
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-300 mb-4">
                    This transfer requires quantum key authentication. Enter a valid key ID to unlock and authorize the transfer.
                  </p>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Quantum Key ID:</label>
                    <input
                      type="text"
                      value={unlockKeyId}
                      onChange={(e) => setUnlockKeyId(e.target.value)}
                      placeholder="e.g., QK-2024-003-C9F5"
                      className="w-full px-4 py-2 bg-black/30 border border-orange-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400/50 font-mono"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    onClick={() => handleUnlockTransfer(showUnlockModal)}
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Unlock Transfer
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-orange-500/30"
                    onClick={() => setShowUnlockModal(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* New Transfer Modal */}
      {showNewTransferModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowNewTransferModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <Card className="glass-card border border-cyan-500/30 rounded-2xl w-full max-w-2xl animate-slide-in">
              <CardHeader className="border-b border-cyan-500/30">
                <CardTitle className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Data Transfer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Source */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-semibold">Source *</label>
                    <input
                      type="text"
                      value={newTransfer.source}
                      onChange={(e) => setNewTransfer(prev => ({ ...prev, source: e.target.value }))}
                      placeholder="e.g., Satellite-001"
                      className="w-full px-4 py-2 bg-black/30 border border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                    />
                  </div>

                  {/* Destination */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-semibold">Destination *</label>
                    <input
                      type="text"
                      value={newTransfer.destination}
                      onChange={(e) => setNewTransfer(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder="e.g., Ground Station Alpha"
                      className="w-full px-4 py-2 bg-black/30 border border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Data Type */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-semibold">Data Type *</label>
                    <select
                      value={newTransfer.dataType}
                      onChange={(e) => setNewTransfer(prev => ({ ...prev, dataType: e.target.value as DataTransfer['dataType'] }))}
                      className="w-full px-4 py-2 bg-black/30 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400/50"
                    >
                      <option value="satellite_telemetry">Satellite Telemetry</option>
                      <option value="quantum_keys">Quantum Keys</option>
                      <option value="blockchain_data">Blockchain Data</option>
                      <option value="system_logs">System Logs</option>
                      <option value="encrypted_payload">Encrypted Payload</option>
                    </select>
                  </div>

                  {/* Size */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-semibold">Data Size (GB) *</label>
                    <input
                      type="number"
                      value={newTransfer.size || ''}
                      onChange={(e) => setNewTransfer(prev => ({ ...prev, size: parseFloat(e.target.value) || 0 }))}
                      placeholder="e.g., 45.2"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 bg-black/30 border border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Priority */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-semibold">Priority</label>
                    <select
                      value={newTransfer.priority}
                      onChange={(e) => setNewTransfer(prev => ({ ...prev, priority: e.target.value as DataTransfer['priority'] }))}
                      className="w-full px-4 py-2 bg-black/30 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400/50"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  {/* Encryption */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-semibold">Encryption</label>
                    <select
                      value={newTransfer.encryption}
                      onChange={(e) => setNewTransfer(prev => ({ ...prev, encryption: e.target.value as DataTransfer['encryption'] }))}
                      className="w-full px-4 py-2 bg-black/30 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400/50"
                    >
                      <option value="quantum">Quantum</option>
                      <option value="aes256">AES-256</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>

                {/* Quantum Key ID */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 font-semibold">Quantum Key ID (Optional)</label>
                  <input
                    type="text"
                    value={newTransfer.keyId}
                    onChange={(e) => setNewTransfer(prev => ({ ...prev, keyId: e.target.value }))}
                    placeholder="e.g., QK-2024-003-C9F5 (leave empty to lock transfer)"
                    className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 font-mono"
                  />
                  <p className="text-xs text-gray-400">
                    If no key is provided, transfer will be created in LOCKED status
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    onClick={handleCreateTransfer}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Transfer
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-cyan-500/30"
                    onClick={() => setShowNewTransferModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Transfer Details Modal - Raw Files & Text Viewer */}
      {showDetailsModal && (() => {
        const transfer = transfers.find(t => t.id === showDetailsModal);
        const rawData = getTransferRawData(showDetailsModal);
        if (!transfer || !rawData) return null;
        
        return (
          <>
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setShowDetailsModal(null)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <Card className="glass-card border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-in">
                <CardHeader className="border-b border-cyan-500/30 bg-gradient-to-r from-cyan-900/40 to-blue-900/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Transfer Details: {transfer.transferId}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDetailsModal(null)}
                      className="hover:bg-cyan-500/20"
                    >
                      <XCircle className="h-5 w-5 text-cyan-400" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="outline" className={getStatusColor(transfer.status)}>
                      {transfer.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-400">
                      {transfer.encryption.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {transfer.source} → {transfer.destination}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
                  {/* Transfer Statistics */}
                  <div className="grid grid-cols-4 gap-4">
                    <Card className="glass-card border border-blue-500/30 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Data Size</p>
                      <p className="text-lg font-bold text-blue-400">{transfer.size.toFixed(1)} GB</p>
                    </Card>
                    <Card className="glass-card border border-green-500/30 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Transferred</p>
                      <p className="text-lg font-bold text-green-400">{transfer.transferred.toFixed(1)} GB</p>
                    </Card>
                    <Card className="glass-card border border-purple-500/30 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Packets</p>
                      <p className="text-lg font-bold text-purple-400">{rawData.packets.toLocaleString()}</p>
                    </Card>
                    <Card className="glass-card border border-cyan-500/30 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Throughput</p>
                      <p className="text-lg font-bold text-cyan-400">{rawData.throughput} MB/s</p>
                    </Card>
                  </div>

                  {/* Files Being Transferred */}
                  <Card className="glass-card border border-purple-500/30 rounded-xl">
                    <CardHeader className="border-b border-purple-500/30 p-4">
                      <CardTitle className="text-sm font-bold text-purple-300 flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Files in Transfer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {rawData.files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              {getDataTypeIcon(transfer.dataType)}
                              <span className="text-sm text-white font-mono">{file}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-400 text-xs">
                                {transfer.status === 'completed' ? 'Complete' : 
                                 transfer.status === 'in_progress' ? `${Math.floor((index + 1) / rawData.files.length * 100)}%` : 
                                 'Pending'}
                              </Badge>
                              <CheckCircle className={`h-4 w-4 ${
                                transfer.status === 'completed' || (transfer.status === 'in_progress' && index < rawData.files.length - 1)
                                  ? 'text-green-400'
                                  : 'text-gray-600'
                              }`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Raw Data Stream Viewer */}
                  <Card className="glass-card border border-cyan-500/30 rounded-xl">
                    <CardHeader className="border-b border-cyan-500/30 p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Raw Data Stream
                          {transfer.status === 'in_progress' && (
                            <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-400 text-xs animate-pulse ml-2">
                              LIVE
                            </Badge>
                          )}
                        </CardTitle>
                        <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-400 text-xs">
                          {transfer.dataType.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="relative">
                        <pre className="bg-black/50 border border-cyan-500/30 rounded-lg p-4 text-xs text-cyan-300 font-mono overflow-x-auto max-h-64 overflow-y-auto">
                          {rawData.rawData}
                        </pre>
                        {transfer.status === 'in_progress' && (
                          <div className="absolute bottom-4 right-4">
                            <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-1">
                              <Activity className="h-3 w-3 text-blue-400 animate-pulse" />
                              <span className="text-xs text-blue-400">Streaming...</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Additional metadata */}
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400">Encryption Key</p>
                          <p className="text-xs text-purple-300 font-mono">
                            {transfer.keyId || 'No key assigned'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400">Approved By</p>
                          <p className="text-xs text-green-300">
                            {transfer.approvedBy || 'Pending approval'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transfer Log */}
                  <Card className="glass-card border border-green-500/30 rounded-xl">
                    <CardHeader className="border-b border-green-500/30 p-4">
                      <CardTitle className="text-sm font-bold text-green-300 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Transfer Log
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400 mt-0.5" />
                          <span className="text-gray-300">
                            [{transfer.startTime.toLocaleString()}] Transfer initiated
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400 mt-0.5" />
                          <span className="text-gray-300">
                            [{new Date(transfer.startTime.getTime() + 1000).toLocaleString()}] Quantum key verified
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400 mt-0.5" />
                          <span className="text-gray-300">
                            [{new Date(transfer.startTime.getTime() + 2000).toLocaleString()}] Encryption established
                          </span>
                        </div>
                        {transfer.status === 'in_progress' && (
                          <div className="flex items-start gap-2">
                            <Activity className="h-3 w-3 text-blue-400 mt-0.5 animate-pulse" />
                            <span className="text-blue-300">
                              [{new Date().toLocaleString()}] Transfer in progress...
                            </span>
                          </div>
                        )}
                        {transfer.status === 'completed' && (
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-400 mt-0.5" />
                            <span className="text-green-300">
                              [{transfer.estimatedCompletion.toLocaleString()}] Transfer completed successfully
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </>
        );
      })()}
    </div>
  );
};

export default DataTransferControl;
