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
  Key,
  Lock,
  Unlock,
  Shield,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Search
} from 'lucide-react';

interface QuantumKey {
  id: string;
  keyId: string;
  type: 'encryption' | 'transfer' | 'satellite' | 'blockchain';
  status: 'active' | 'expired' | 'pending' | 'revoked';
  createdAt: Date;
  expiresAt: Date;
  usageCount: number;
  maxUsage: number;
  associatedData: string;
  securityLevel: 'high' | 'critical' | 'top_secret';
}

const KeyManagement: React.FC = () => {
  const [keys, setKeys] = useState<QuantumKey[]>([
    {
      id: '1',
      keyId: 'QK-2024-001-A7F3',
      type: 'encryption',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      expiresAt: new Date('2025-01-15'),
      usageCount: 234,
      maxUsage: 1000,
      associatedData: 'Satellite-001 Communications',
      securityLevel: 'critical'
    },
    {
      id: '2',
      keyId: 'QK-2024-002-B8E4',
      type: 'transfer',
      status: 'active',
      createdAt: new Date('2024-02-01'),
      expiresAt: new Date('2024-12-31'),
      usageCount: 89,
      maxUsage: 500,
      associatedData: 'Data Migration Protocol',
      securityLevel: 'high'
    },
    {
      id: '3',
      keyId: 'QK-2024-003-C9F5',
      type: 'satellite',
      status: 'pending',
      createdAt: new Date('2024-10-10'),
      expiresAt: new Date('2025-10-10'),
      usageCount: 0,
      maxUsage: 2000,
      associatedData: 'ThunderBird-3 Quantum Link',
      securityLevel: 'top_secret'
    },
    {
      id: '4',
      keyId: 'QK-2023-098-D5A2',
      type: 'blockchain',
      status: 'expired',
      createdAt: new Date('2023-10-01'),
      expiresAt: new Date('2024-10-01'),
      usageCount: 500,
      maxUsage: 500,
      associatedData: 'Blockchain Transaction Signing',
      securityLevel: 'critical'
    },
  ]);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | QuantumKey['type']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | QuantumKey['status']>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredKeys = keys.filter(key => {
    const matchesSearch = key.keyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         key.associatedData.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || key.type === filterType;
    const matchesStatus = filterStatus === 'all' || key.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: QuantumKey['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'expired': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'pending': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'revoked': return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  const getTypeColor = (type: QuantumKey['type']) => {
    switch (type) {
      case 'encryption': return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
      case 'transfer': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      case 'satellite': return 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400';
      case 'blockchain': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
    }
  };

  const getSecurityColor = (level: QuantumKey['securityLevel']) => {
    switch (level) {
      case 'high': return 'text-yellow-400';
      case 'critical': return 'text-orange-400';
      case 'top_secret': return 'text-red-400';
    }
  };

  const handleCopyKey = (keyId: string) => {
    navigator.clipboard.writeText(keyId);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRevokeKey = (keyId: string) => {
    setKeys(prev => prev.map(k => 
      k.id === keyId ? { ...k, status: 'revoked' as const } : k
    ));
  };

  const handleApproveKey = (keyId: string) => {
    setKeys(prev => prev.map(k => 
      k.id === keyId ? { ...k, status: 'active' as const } : k
    ));
  };

  const handleGenerateKey = () => {
    const newKey: QuantumKey = {
      id: Date.now().toString(),
      keyId: `QK-${new Date().getFullYear()}-${String(keys.length + 1).padStart(3, '0')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      type: 'encryption',
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageCount: 0,
      maxUsage: 1000,
      associatedData: 'New Quantum Key',
      securityLevel: 'high'
    };
    setKeys(prev => [newKey, ...prev]);
  };

  const stats = {
    total: keys.length,
    active: keys.filter(k => k.status === 'active').length,
    pending: keys.filter(k => k.status === 'pending').length,
    expired: keys.filter(k => k.status === 'expired').length
  };

  // Download individual key data
  const handleDownloadKey = (key: QuantumKey) => {
    const keyData = {
      keyId: key.keyId,
      type: key.type,
      status: key.status,
      securityLevel: key.securityLevel,
      createdAt: key.createdAt.toISOString(),
      expiresAt: key.expiresAt.toISOString(),
      usageCount: key.usageCount,
      maxUsage: key.maxUsage,
      associatedData: key.associatedData,
      quantumKeyData: {
        algorithm: 'QKD-BB84',
        keyLength: 256,
        entropySource: 'Quantum Random Number Generator',
        distributionProtocol: 'BB84 with decoy states',
        errorRate: '0.02%',
        securityParameter: '2^-128'
      },
      cryptographicData: {
        publicKey: `-----BEGIN QUANTUM PUBLIC KEY-----\n${btoa(key.keyId + Date.now())}\n-----END QUANTUM PUBLIC KEY-----`,
        keyFingerprint: btoa(key.keyId).substring(0, 40),
        encryptionAlgorithm: 'AES-256-GCM with Quantum Key',
        hashFunction: 'SHA3-256'
      },
      metadata: {
        generatedBy: 'Thunderbird Quantum Key Management System',
        exportedAt: new Date().toISOString(),
        exportedBy: 'admin@thunderbird.com',
        version: '2.0'
      }
    };

    // Create formatted text file
    const textContent = `
╔═══════════════════════════════════════════════════════════════╗
║        THUNDERBIRD QUANTUM KEY EXPORT                         ║
║        Key ID: ${key.keyId}                            ║
╚═══════════════════════════════════════════════════════════════╝

🔐 KEY INFORMATION
${'─'.repeat(64)}
Key ID: ${keyData.keyId}
Type: ${keyData.type.toUpperCase()}
Status: ${keyData.status.toUpperCase()}
Security Level: ${keyData.securityLevel.replace('_', ' ').toUpperCase()}
Created: ${new Date(keyData.createdAt).toLocaleString()}
Expires: ${new Date(keyData.expiresAt).toLocaleString()}
Usage: ${keyData.usageCount} / ${keyData.maxUsage}
Associated Data: ${keyData.associatedData}

🌌 QUANTUM KEY DATA
${'─'.repeat(64)}
Algorithm: ${keyData.quantumKeyData.algorithm}
Key Length: ${keyData.quantumKeyData.keyLength} bits
Entropy Source: ${keyData.quantumKeyData.entropySource}
Distribution Protocol: ${keyData.quantumKeyData.distributionProtocol}
Quantum Bit Error Rate: ${keyData.quantumKeyData.errorRate}
Security Parameter: ${keyData.quantumKeyData.securityParameter}

🔑 CRYPTOGRAPHIC DATA
${'─'.repeat(64)}
${keyData.cryptographicData.publicKey}

Key Fingerprint: ${keyData.cryptographicData.keyFingerprint}
Encryption: ${keyData.cryptographicData.encryptionAlgorithm}
Hash Function: ${keyData.cryptographicData.hashFunction}

📋 METADATA
${'─'.repeat(64)}
Generated By: ${keyData.metadata.generatedBy}
Exported At: ${new Date(keyData.metadata.exportedAt).toLocaleString()}
Exported By: ${keyData.metadata.exportedBy}
Version: ${keyData.metadata.version}

${'═'.repeat(64)}
⚠️  WARNING: This file contains sensitive cryptographic material.
    Store securely and transmit only through encrypted channels.
${'═'.repeat(64)}
    `.trim();

    // Download text file
    const textBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const textLink = document.createElement('a');
    const textUrl = URL.createObjectURL(textBlob);
    textLink.setAttribute('href', textUrl);
    textLink.setAttribute('download', `quantum-key-${key.keyId}.txt`);
    textLink.style.visibility = 'hidden';
    document.body.appendChild(textLink);
    textLink.click();
    document.body.removeChild(textLink);

    // Also download JSON version
    const jsonBlob = new Blob([JSON.stringify(keyData, null, 2)], { type: 'application/json;charset=utf-8;' });
    const jsonLink = document.createElement('a');
    const jsonUrl = URL.createObjectURL(jsonBlob);
    jsonLink.setAttribute('href', jsonUrl);
    jsonLink.setAttribute('download', `quantum-key-${key.keyId}.json`);
    jsonLink.style.visibility = 'hidden';
    document.body.appendChild(jsonLink);
    setTimeout(() => {
      jsonLink.click();
      document.body.removeChild(jsonLink);
    }, 100);
  };

  // Export all keys
  const handleExportAllKeys = () => {
    const allKeysData = filteredKeys.map(key => ({
      keyId: key.keyId,
      type: key.type,
      status: key.status,
      securityLevel: key.securityLevel,
      createdAt: key.createdAt.toISOString(),
      expiresAt: key.expiresAt.toISOString(),
      usageCount: key.usageCount,
      maxUsage: key.maxUsage,
      associatedData: key.associatedData
    }));

    const csv = [
      ['Key ID', 'Type', 'Status', 'Security Level', 'Created', 'Expires', 'Usage', 'Max Usage', 'Associated Data'].join(','),
      ...allKeysData.map(key => [
        key.keyId,
        key.type,
        key.status,
        key.securityLevel,
        key.createdAt,
        key.expiresAt,
        key.usageCount,
        key.maxUsage,
        `"${key.associatedData.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `quantum-keys-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border border-purple-500/30 rounded-3xl">
        <CardHeader className="border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-40 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-full shadow-glow-lg group-hover:rotate-12 transition-transform duration-300">
                  <Key className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold gradient-text-quantum">
                  Quantum Key Management
                </CardTitle>
                <p className="text-sm text-gray-300 mt-1">
                  Secure key generation, distribution, and lifecycle management
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleGenerateKey}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate Key
              </Button>
              <Button 
                variant="outline" 
                className="glass-card border-purple-500/30"
                onClick={handleExportAllKeys}
              >
                <Download className="h-4 w-4 mr-2" />
                Export All
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
              <Key className="h-5 w-5 text-blue-400" />
              <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-400 text-xs">
                Total
              </Badge>
            </div>
            <p className="text-2xl font-bold text-blue-400">{stats.total}</p>
            <p className="text-xs text-gray-400 mt-1">Total Keys</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-green-500/30 rounded-2xl hover:shadow-glow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-400 text-xs">
                Active
              </Badge>
            </div>
            <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            <p className="text-xs text-gray-400 mt-1">Active Keys</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-yellow-500/30 rounded-2xl hover:shadow-glow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500/30 text-yellow-400 text-xs">
                Pending
              </Badge>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            <p className="text-xs text-gray-400 mt-1">Pending Approval</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-red-500/30 rounded-2xl hover:shadow-glow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="h-5 w-5 text-red-400" />
              <Badge variant="outline" className="bg-red-500/20 border-red-500/30 text-red-400 text-xs">
                Expired
              </Badge>
            </div>
            <p className="text-2xl font-bold text-red-400">{stats.expired}</p>
            <p className="text-xs text-gray-400 mt-1">Expired Keys</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="glass-card border border-cyan-500/30 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search keys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              {(['all', 'encryption', 'transfer', 'satellite', 'blockchain'] as const).map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className={`capitalize text-xs ${
                    filterType === type
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                      : 'border-cyan-500/30'
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {(['all', 'active', 'pending', 'expired', 'revoked'] as const).map((status) => (
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
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keys Table */}
      <Card className="glass-card border border-purple-500/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-b border-purple-500/30">
                <TableHead className="text-purple-300 font-bold">Key ID</TableHead>
                <TableHead className="text-purple-300 font-bold">Type</TableHead>
                <TableHead className="text-purple-300 font-bold">Status</TableHead>
                <TableHead className="text-purple-300 font-bold">Security</TableHead>
                <TableHead className="text-purple-300 font-bold">Usage</TableHead>
                <TableHead className="text-purple-300 font-bold">Expires</TableHead>
                <TableHead className="text-purple-300 font-bold">Associated Data</TableHead>
                <TableHead className="text-purple-300 font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeys.map((key) => (
                <TableRow
                  key={key.id}
                  className={`border-b border-purple-500/20 hover:bg-white/5 transition-all ${
                    selectedKey === key.id ? 'bg-purple-500/10' : ''
                  }`}
                  onClick={() => setSelectedKey(key.id)}
                >
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-purple-400" />
                      <span className="text-white">{showKey[key.id] ? key.keyId : '••••••••'}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowKey(prev => ({ ...prev, [key.id]: !prev[key.id] }));
                        }}
                      >
                        {showKey[key.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyKey(key.keyId);
                        }}
                      >
                        {copiedKey === key.keyId ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getTypeColor(key.type)} text-xs capitalize`}>
                      {key.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(key.status)} text-xs capitalize`}>
                      {key.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Shield className={`h-4 w-4 ${getSecurityColor(key.securityLevel)}`} />
                      <span className={`text-xs capitalize ${getSecurityColor(key.securityLevel)}`}>
                        {key.securityLevel.replace('_', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-300">{key.usageCount} / {key.maxUsage}</div>
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full ${
                            (key.usageCount / key.maxUsage) > 0.8 ? 'bg-red-500' :
                            (key.usageCount / key.maxUsage) > 0.5 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(key.usageCount / key.maxUsage) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div className="text-gray-300">{key.expiresAt.toLocaleDateString()}</div>
                      <div className="text-gray-500">{Math.ceil((key.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-300">{key.associatedData}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {key.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-green-500/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveKey(key.id);
                          }}
                        >
                          <Unlock className="h-4 w-4 text-green-400" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-500/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadKey(key);
                        }}
                        title="Download Key Data"
                      >
                        <Download className="h-4 w-4 text-blue-400" />
                      </Button>
                      {key.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-500/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRevokeKey(key.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default KeyManagement;
