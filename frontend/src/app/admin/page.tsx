'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminDashboard from '@/components/admin/AdminDashboard';
import KeyManagement from '@/components/admin/KeyManagement';
import DataTransferControl from '@/components/admin/DataTransferControl';
import UserManagement from '@/components/admin/UserManagement';
import SecurityAudit from '@/components/admin/SecurityAudit';
import SystemConfiguration from '@/components/admin/SystemConfiguration';
import {
  LayoutDashboard,
  Key,
  Database,
  Users,
  Shield,
  Settings,
  LogOut,
  User
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');

    if (!isAuthenticated || isAuthenticated !== 'true') {
      router.push('/admin/login');
    } else {
      setUserName(name || 'Admin');
      setUserRole(role || 'admin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAuthenticated');
    router.push('/admin/login');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="container mx-auto max-w-7xl">
        {/* User Info & Logout */}
        <div className="glass-card border border-purple-500/30 rounded-3xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-full">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">{userName}</p>
              <p className="text-xs text-gray-400 capitalize">{userRole.replace('_', ' ')}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="glass-card border-red-500/30 hover:bg-red-500/20 text-red-400"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="glass-card border border-purple-500/30 rounded-3xl p-2 sticky top-4 z-40 backdrop-blur-xl">
            <TabsList className="grid w-full grid-cols-6 gap-2 bg-transparent">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 rounded-xl"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="keys"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 rounded-xl"
              >
                <Key className="h-4 w-4" />
                <span className="hidden md:inline">Keys</span>
              </TabsTrigger>
              <TabsTrigger
                value="transfers"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 rounded-xl"
              >
                <Database className="h-4 w-4" />
                <span className="hidden md:inline">Transfers</span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 rounded-xl"
              >
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-600 data-[state=active]:text-white transition-all duration-300 rounded-xl"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden md:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 rounded-xl"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="animate-fade-in">
            <AdminDashboard onNavigate={setActiveTab} />
          </TabsContent>

          <TabsContent value="keys" className="animate-fade-in">
            <KeyManagement />
          </TabsContent>

          <TabsContent value="transfers" className="animate-fade-in">
            <DataTransferControl />
          </TabsContent>

          <TabsContent value="users" className="animate-fade-in">
            <UserManagement />
          </TabsContent>

          <TabsContent value="security" className="animate-fade-in">
            <SecurityAudit />
          </TabsContent>

          <TabsContent value="settings" className="animate-fade-in">
            <SystemConfiguration />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
