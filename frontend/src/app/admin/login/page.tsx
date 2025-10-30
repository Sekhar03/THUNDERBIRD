'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  LogIn
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Default admin credentials
  const adminUsers = [
    { email: 'admin@thunderbird.com', password: 'admin123', role: 'super_admin', name: 'Super Admin' },
    { email: 'operator@thunderbird.com', password: 'operator123', role: 'admin', name: 'Admin User' },
    { email: 'user@thunderbird.com', password: 'user123', role: 'operator', name: 'Operator User' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const user = adminUsers.find(
        u => u.email === email && u.password === password
      );

      if (user) {
        // Store user info in localStorage
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('isAuthenticated', 'true');

        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleDemoLogin = (userType: 'super_admin' | 'admin' | 'operator') => {
    const user = adminUsers.find(u => u.role === userType);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/10 to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Login Card */}
        <Card className="glass-card border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 border-b border-purple-500/30 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 rounded-full blur-2xl opacity-40 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-br from-purple-500 via-pink-600 to-purple-600 p-4 rounded-full shadow-glow-lg">
                  <Shield className="h-12 w-12 text-white animate-float" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold gradient-text-quantum mb-2">
              ThunderBird Admin
            </CardTitle>
            <p className="text-gray-300 text-sm">
              Quantum Space Communications System
            </p>
          </CardHeader>

          <CardContent className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 animate-shake">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 block flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@thunderbird.com"
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 py-3 text-white font-semibold rounded-xl transition-all hover:shadow-glow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In to Admin Panel
                  </>
                )}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-purple-500/20">
              <p className="text-xs text-gray-400 mb-4 text-center">Quick Login (Demo Accounts)</p>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin('super_admin')}
                  className="w-full glass-card border-purple-500/30 hover:bg-purple-500/20 justify-start"
                >
                  <Shield className="h-4 w-4 mr-2 text-purple-400" />
                  <div className="flex-1 text-left">
                    <div className="text-sm text-white">Super Admin</div>
                    <div className="text-xs text-gray-400">admin@thunderbird.com</div>
                  </div>
                  <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-400 text-xs">
                    Full Access
                  </Badge>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin('admin')}
                  className="w-full glass-card border-blue-500/30 hover:bg-blue-500/20 justify-start"
                >
                  <Shield className="h-4 w-4 mr-2 text-blue-400" />
                  <div className="flex-1 text-left">
                    <div className="text-sm text-white">Admin</div>
                    <div className="text-xs text-gray-400">operator@thunderbird.com</div>
                  </div>
                  <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-400 text-xs">
                    Admin
                  </Badge>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin('operator')}
                  className="w-full glass-card border-green-500/30 hover:bg-green-500/20 justify-start"
                >
                  <Shield className="h-4 w-4 mr-2 text-green-400" />
                  <div className="flex-1 text-left">
                    <div className="text-sm text-white">Operator</div>
                    <div className="text-xs text-gray-400">user@thunderbird.com</div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-400 text-xs">
                    Limited
                  </Badge>
                </Button>
              </div>
            </div>

            {/* Login Credentials Info */}
            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-300">
                  <p className="font-semibold mb-1">Default Credentials:</p>
                  <p>Email: <code className="bg-black/30 px-2 py-0.5 rounded">admin@thunderbird.com</code></p>
                  <p>Password: <code className="bg-black/30 px-2 py-0.5 rounded">admin123</code></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
