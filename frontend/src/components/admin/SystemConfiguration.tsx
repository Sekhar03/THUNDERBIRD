'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Save,
  RefreshCw,
  Server,
  Database,
  Shield,
  Key,
  Bell,
  Mail,
  Globe,
  Lock,
  Zap,
  Clock,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SystemConfig {
  general: {
    systemName: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  security: {
    mfaRequired: boolean;
    sessionTimeout: number;
    passwordPolicy: 'standard' | 'strict' | 'custom';
    ipWhitelist: boolean;
  };
  quantum: {
    keyGeneration: 'automatic' | 'manual' | 'scheduled';
    keyRotationDays: number;
    maxKeysPerUser: number;
    encryptionLevel: 'standard' | 'high' | 'maximum';
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    alertThreshold: 'low' | 'medium' | 'high';
  };
  dataTransfer: {
    maxConcurrentTransfers: number;
    autoRetry: boolean;
    compressionEnabled: boolean;
    bandwidthLimit: number;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'hourly' | 'daily' | 'weekly';
    retentionDays: number;
    encryptBackups: boolean;
  };
}

const SystemConfiguration: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>({
    general: {
      systemName: 'ThunderBird Quantum System',
      timezone: 'UTC',
      language: 'en-US',
      maintenanceMode: false
    },
    security: {
      mfaRequired: true,
      sessionTimeout: 30,
      passwordPolicy: 'strict',
      ipWhitelist: true
    },
    quantum: {
      keyGeneration: 'automatic',
      keyRotationDays: 90,
      maxKeysPerUser: 10,
      encryptionLevel: 'maximum'
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      alertThreshold: 'medium'
    },
    dataTransfer: {
      maxConcurrentTransfers: 10,
      autoRetry: true,
      compressionEnabled: true,
      bandwidthLimit: 1000
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      encryptBackups: true
    }
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setHasChanges(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);
  };

  const handleReset = () => {
    // Reset to default values
    setSaveStatus('idle');
    setHasChanges(false);
  };

  const updateConfig = (section: keyof SystemConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (val: boolean) => void; label: string }> = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between py-3 px-4 bg-black/20 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className="relative"
      >
        {enabled ? (
          <ToggleRight className="h-6 w-6 text-green-400 hover:scale-110 transition-transform" />
        ) : (
          <ToggleLeft className="h-6 w-6 text-gray-500 hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border border-purple-500/30 rounded-3xl">
        <CardHeader className="border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-40 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-full shadow-glow-lg group-hover:rotate-180 transition-transform duration-500">
                  <Settings className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold gradient-text-quantum">
                  System Configuration
                </CardTitle>
                <p className="text-sm text-gray-300 mt-1">
                  Global system settings and preferences
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500/30 text-yellow-400">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
              <Button
                onClick={handleReset}
                variant="outline"
                className="glass-card border-purple-500/30"
                disabled={!hasChanges}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleSave}
                className={`${
                  saveStatus === 'saving' ? 'opacity-50' :
                  saveStatus === 'saved' ? 'bg-green-600' :
                  'bg-gradient-to-r from-purple-500 to-pink-600'
                } hover:from-purple-600 hover:to-pink-700`}
                disabled={!hasChanges || saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="glass-card border border-blue-500/30 rounded-2xl">
          <CardHeader className="border-b border-blue-500/30">
            <CardTitle className="text-xl font-bold text-blue-300 flex items-center gap-2">
              <Server className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">System Name</label>
              <input
                type="text"
                value={config.general.systemName}
                onChange={(e) => updateConfig('general', 'systemName', e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Timezone</label>
              <select
                value={config.general.timezone}
                onChange={(e) => updateConfig('general', 'timezone', e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400/50"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
              </select>
            </div>
            <ToggleSwitch
              enabled={config.general.maintenanceMode}
              onChange={(val) => updateConfig('general', 'maintenanceMode', val)}
              label="Maintenance Mode"
            />
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glass-card border border-red-500/30 rounded-2xl">
          <CardHeader className="border-b border-red-500/30">
            <CardTitle className="text-xl font-bold text-red-300 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <ToggleSwitch
              enabled={config.security.mfaRequired}
              onChange={(val) => updateConfig('security', 'mfaRequired', val)}
              label="Require Two-Factor Authentication"
            />
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Session Timeout (minutes)</label>
              <input
                type="number"
                value={config.security.sessionTimeout}
                onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-black/30 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-400/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Password Policy</label>
              <select
                value={config.security.passwordPolicy}
                onChange={(e) => updateConfig('security', 'passwordPolicy', e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-400/50"
              >
                <option value="standard">Standard</option>
                <option value="strict">Strict</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <ToggleSwitch
              enabled={config.security.ipWhitelist}
              onChange={(val) => updateConfig('security', 'ipWhitelist', val)}
              label="IP Whitelist"
            />
          </CardContent>
        </Card>

        {/* Quantum Settings */}
        <Card className="glass-card border border-purple-500/30 rounded-2xl">
          <CardHeader className="border-b border-purple-500/30">
            <CardTitle className="text-xl font-bold text-purple-300 flex items-center gap-2">
              <Key className="h-5 w-5" />
              Quantum Key Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Key Generation Mode</label>
              <select
                value={config.quantum.keyGeneration}
                onChange={(e) => updateConfig('quantum', 'keyGeneration', e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400/50"
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Key Rotation (days)</label>
              <input
                type="number"
                value={config.quantum.keyRotationDays}
                onChange={(e) => updateConfig('quantum', 'keyRotationDays', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Max Keys Per User</label>
              <input
                type="number"
                value={config.quantum.maxKeysPerUser}
                onChange={(e) => updateConfig('quantum', 'maxKeysPerUser', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Encryption Level</label>
              <select
                value={config.quantum.encryptionLevel}
                onChange={(e) => updateConfig('quantum', 'encryptionLevel', e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400/50"
              >
                <option value="standard">Standard</option>
                <option value="high">High</option>
                <option value="maximum">Maximum</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass-card border border-yellow-500/30 rounded-2xl">
          <CardHeader className="border-b border-yellow-500/30">
            <CardTitle className="text-xl font-bold text-yellow-300 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <ToggleSwitch
              enabled={config.notifications.emailEnabled}
              onChange={(val) => updateConfig('notifications', 'emailEnabled', val)}
              label="Email Notifications"
            />
            <ToggleSwitch
              enabled={config.notifications.smsEnabled}
              onChange={(val) => updateConfig('notifications', 'smsEnabled', val)}
              label="SMS Notifications"
            />
            <ToggleSwitch
              enabled={config.notifications.pushEnabled}
              onChange={(val) => updateConfig('notifications', 'pushEnabled', val)}
              label="Push Notifications"
            />
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Alert Threshold</label>
              <select
                value={config.notifications.alertThreshold}
                onChange={(e) => updateConfig('notifications', 'alertThreshold', e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-yellow-500/30 rounded-xl text-white focus:outline-none focus:border-yellow-400/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Data Transfer */}
        <Card className="glass-card border border-cyan-500/30 rounded-2xl">
          <CardHeader className="border-b border-cyan-500/30">
            <CardTitle className="text-xl font-bold text-cyan-300 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Transfer Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Max Concurrent Transfers</label>
              <input
                type="number"
                value={config.dataTransfer.maxConcurrentTransfers}
                onChange={(e) => updateConfig('dataTransfer', 'maxConcurrentTransfers', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-black/30 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Bandwidth Limit (Mbps)</label>
              <input
                type="number"
                value={config.dataTransfer.bandwidthLimit}
                onChange={(e) => updateConfig('dataTransfer', 'bandwidthLimit', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-black/30 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400/50"
              />
            </div>
            <ToggleSwitch
              enabled={config.dataTransfer.autoRetry}
              onChange={(val) => updateConfig('dataTransfer', 'autoRetry', val)}
              label="Auto-Retry Failed Transfers"
            />
            <ToggleSwitch
              enabled={config.dataTransfer.compressionEnabled}
              onChange={(val) => updateConfig('dataTransfer', 'compressionEnabled', val)}
              label="Enable Compression"
            />
          </CardContent>
        </Card>

        {/* Backup Settings */}
        <Card className="glass-card border border-green-500/30 rounded-2xl">
          <CardHeader className="border-b border-green-500/30">
            <CardTitle className="text-xl font-bold text-green-300 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Backup Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <ToggleSwitch
              enabled={config.backup.autoBackup}
              onChange={(val) => updateConfig('backup', 'autoBackup', val)}
              label="Automatic Backups"
            />
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Backup Frequency</label>
              <select
                value={config.backup.backupFrequency}
                onChange={(e) => updateConfig('backup', 'backupFrequency', e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-green-500/30 rounded-xl text-white focus:outline-none focus:border-green-400/50"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Retention Period (days)</label>
              <input
                type="number"
                value={config.backup.retentionDays}
                onChange={(e) => updateConfig('backup', 'retentionDays', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-black/30 border border-green-500/30 rounded-xl text-white focus:outline-none focus:border-green-400/50"
              />
            </div>
            <ToggleSwitch
              enabled={config.backup.encryptBackups}
              onChange={(val) => updateConfig('backup', 'encryptBackups', val)}
              label="Encrypt Backups"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemConfiguration;
