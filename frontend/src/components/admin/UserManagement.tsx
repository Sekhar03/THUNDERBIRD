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
  Users,
  UserPlus,
  Shield,
  Crown,
  Eye,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Key,
  Filter,
  Search
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'operator' | 'viewer';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  permissions: string[];
  lastLogin: Date;
  createdAt: Date;
  mfaEnabled: boolean;
  keysAssigned: number;
  activityLevel: 'high' | 'medium' | 'low';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Administrator',
      email: 'john.admin@thunderbird.com',
      role: 'super_admin',
      status: 'active',
      permissions: ['all'],
      lastLogin: new Date(Date.now() - 3600000),
      createdAt: new Date('2023-01-15'),
      mfaEnabled: true,
      keysAssigned: 15,
      activityLevel: 'high'
    },
    {
      id: '2',
      name: 'Sarah Operations',
      email: 'sarah.ops@thunderbird.com',
      role: 'admin',
      status: 'active',
      permissions: ['user_management', 'key_management', 'data_transfer', 'reports'],
      lastLogin: new Date(Date.now() - 7200000),
      createdAt: new Date('2023-03-20'),
      mfaEnabled: true,
      keysAssigned: 8,
      activityLevel: 'high'
    },
    {
      id: '3',
      name: 'Mike Operator',
      email: 'mike.op@thunderbird.com',
      role: 'operator',
      status: 'active',
      permissions: ['satellite_control', 'data_transfer', 'reports'],
      lastLogin: new Date(Date.now() - 14400000),
      createdAt: new Date('2023-06-10'),
      mfaEnabled: false,
      keysAssigned: 3,
      activityLevel: 'medium'
    },
    {
      id: '4',
      name: 'Lisa Viewer',
      email: 'lisa.view@thunderbird.com',
      role: 'viewer',
      status: 'active',
      permissions: ['view_only'],
      lastLogin: new Date(Date.now() - 86400000),
      createdAt: new Date('2024-01-05'),
      mfaEnabled: false,
      keysAssigned: 0,
      activityLevel: 'low'
    },
    {
      id: '5',
      name: 'Tom Pending',
      email: 'tom.pending@thunderbird.com',
      role: 'operator',
      status: 'pending',
      permissions: [],
      lastLogin: new Date('1970-01-01'),
      createdAt: new Date(Date.now() - 172800000),
      mfaEnabled: false,
      keysAssigned: 0,
      activityLevel: 'low'
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | User['role']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | User['status']>('all');
  const [showEditModal, setShowEditModal] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
      case 'admin': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      case 'operator': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'viewer': return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4 text-purple-400" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-400" />;
      case 'operator': return <Key className="h-4 w-4 text-green-400" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'inactive': return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
      case 'suspended': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'pending': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
    }
  };

  const getActivityColor = (level: User['activityLevel']) => {
    switch (level) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-gray-400';
    }
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'suspended' as const } : u
    ));
  };

  const handleActivateUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'active' as const } : u
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border border-blue-500/30 rounded-3xl">
        <CardHeader className="border-b border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-40 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full shadow-glow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold gradient-text-quantum">
                  User Management & Access Control
                </CardTitle>
                <p className="text-sm text-gray-300 mt-1">
                  Manage users, roles, and permissions
                </p>
              </div>
            </div>

            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border border-blue-500/30 rounded-2xl hover:shadow-glow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-blue-400" />
              <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-400 text-xs">
                Total
              </Badge>
            </div>
            <p className="text-2xl font-bold text-blue-400">{stats.total}</p>
            <p className="text-xs text-gray-400 mt-1">Total Users</p>
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
            <p className="text-xs text-gray-400 mt-1">Active Users</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-yellow-500/30 rounded-2xl hover:shadow-glow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
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
                Suspended
              </Badge>
            </div>
            <p className="text-2xl font-bold text-red-400">{stats.suspended}</p>
            <p className="text-xs text-gray-400 mt-1">Suspended</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="glass-card border border-purple-500/30 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50"
              />
            </div>

            {/* Role Filter */}
            <div className="flex gap-2">
              {(['all', 'super_admin', 'admin', 'operator', 'viewer'] as const).map((role) => (
                <Button
                  key={role}
                  variant={filterRole === role ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRole(role)}
                  className={`capitalize text-xs ${
                    filterRole === role
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                      : 'border-blue-500/30'
                  }`}
                >
                  {role === 'all' ? 'All' : role.replace('_', ' ')}
                </Button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {(['all', 'active', 'pending', 'suspended'] as const).map((status) => (
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

      {/* Users Table */}
      <Card className="glass-card border border-blue-500/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-b border-blue-500/30">
                <TableHead className="text-blue-300 font-bold">User</TableHead>
                <TableHead className="text-blue-300 font-bold">Role</TableHead>
                <TableHead className="text-blue-300 font-bold">Status</TableHead>
                <TableHead className="text-blue-300 font-bold">Activity</TableHead>
                <TableHead className="text-blue-300 font-bold">Security</TableHead>
                <TableHead className="text-blue-300 font-bold">Keys</TableHead>
                <TableHead className="text-blue-300 font-bold">Last Login</TableHead>
                <TableHead className="text-blue-300 font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className={`border-b border-blue-500/20 hover:bg-white/5 transition-all ${
                    selectedUser === user.id ? 'bg-blue-500/10' : ''
                  }`}
                  onClick={() => setSelectedUser(user.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getRoleColor(user.role)} text-xs capitalize flex items-center gap-1 w-fit`}>
                      {getRoleIcon(user.role)}
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(user.status)} text-xs capitalize`}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Activity className={`h-4 w-4 ${getActivityColor(user.activityLevel)}`} />
                      <span className={`text-xs capitalize ${getActivityColor(user.activityLevel)}`}>
                        {user.activityLevel}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {user.mfaEnabled ? (
                        <>
                          <Lock className="h-3 w-3 text-green-400" />
                          <span className="text-xs text-green-400">2FA On</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3 w-3 text-orange-400" />
                          <span className="text-xs text-orange-400">2FA Off</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-300">{user.keysAssigned}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div className="text-gray-300">{user.lastLogin.toLocaleDateString()}</div>
                      <div className="text-gray-500">{user.lastLogin.toLocaleTimeString()}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {user.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-green-500/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivateUser(user.id);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-500/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEditModal(user);
                        }}
                      >
                        <Edit className="h-4 w-4 text-blue-400" />
                      </Button>
                      {user.status === 'active' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-orange-500/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSuspendUser(user.id);
                          }}
                        >
                          <Lock className="h-4 w-4 text-orange-400" />
                        </Button>
                      ) : user.status === 'suspended' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-green-500/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivateUser(user.id);
                          }}
                        >
                          <Unlock className="h-4 w-4 text-green-400" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-500/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
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

export default UserManagement;
