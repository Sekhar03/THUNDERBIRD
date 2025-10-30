'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare,
  Video,
  MousePointer,
  Eye,
  Send,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  User,
  Crown,
  Shield
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  status: 'online' | 'away' | 'busy';
  cursorPosition?: { x: number; y: number };
  currentView: string;
  color: string;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'alert';
}

const CollaborationHub: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCursors, setShowCursors] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockUsers: User[] = [
      { id: '1', name: 'John Doe', role: 'admin', status: 'online', currentView: 'Dashboard', color: '#3B82F6' },
      { id: '2', name: 'Jane Smith', role: 'operator', status: 'online', currentView: '3D View', color: '#8B5CF6' },
      { id: '3', name: 'Bob Johnson', role: 'viewer', status: 'away', currentView: 'Analytics', color: '#10B981' },
      { id: '4', name: 'Alice Williams', role: 'operator', status: 'busy', currentView: 'AI Threats', color: '#F59E0B' },
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        message: 'Satellite-003 showing unusual patterns. Can someone check?',
        timestamp: new Date(Date.now() - 300000),
        type: 'text'
      },
      {
        id: '2',
        userId: '2',
        userName: 'Jane Smith',
        message: 'On it. Running diagnostics now.',
        timestamp: new Date(Date.now() - 240000),
        type: 'text'
      },
      {
        id: '3',
        userId: 'system',
        userName: 'System',
        message: 'Alert: High priority threat detected on Quantum Network',
        timestamp: new Date(Date.now() - 120000),
        type: 'alert'
      },
    ];

    setActiveUsers(mockUsers);
    setMessages(mockMessages);

    // Simulate cursor movements
    const cursorInterval = setInterval(() => {
      setActiveUsers(prev => prev.map(user => ({
        ...user,
        cursorPosition: {
          x: Math.random() * 100,
          y: Math.random() * 100
        }
      })));
    }, 2000);

    return () => clearInterval(cursorInterval);
  }, []);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      message: inputMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin': return <Crown className="h-3 w-3 text-yellow-400" />;
      case 'operator': return <Shield className="h-3 w-3 text-blue-400" />;
      case 'viewer': return <Eye className="h-3 w-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Users Panel */}
      <Card className="glass-card border border-blue-500/30 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-blue-900/40 border-b border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-40 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full shadow-glow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white animate-float" aria-hidden="true" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold gradient-text-quantum">
                  Collaboration Hub
                </CardTitle>
                <p className="text-sm text-gray-300 mt-1">
                  {activeUsers.filter(u => u.status === 'online').length} online • Real-time coordination
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCursors(!showCursors)}
                className={`glass-card ${showCursors ? 'border-blue-500/50' : 'border-gray-500/30'}`}
              >
                <MousePointer className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVideoCall(!isVideoCall)}
                className={`glass-card ${isVideoCall ? 'border-green-500/50 bg-green-500/20' : 'border-gray-500/30'}`}
              >
                {isVideoCall ? <Video className="h-4 w-4 text-green-400" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="glass-card"
              >
                {isMuted ? <MicOff className="h-4 w-4 text-red-400" /> : <Mic className="h-4 w-4 text-green-400" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Active Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeUsers.map((user) => (
              <div
                key={user.id}
                className="glass-card border border-blue-500/30 rounded-2xl p-4 hover:shadow-glow-sm transition-all duration-300 group"
                style={{ borderLeftColor: user.color, borderLeftWidth: '4px' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-slate-900`}></div>
                    </div>
                  </div>
                  {getRoleIcon(user.role)}
                </div>

                <h4 className="font-semibold text-white text-sm mb-1">{user.name}</h4>
                <p className="text-xs text-gray-400 mb-2 capitalize">{user.role}</p>

                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Eye className="h-3 w-3" />
                  <span>{user.currentView}</span>
                </div>

                <Badge
                  variant="outline"
                  className={`text-xs ${
                    user.status === 'online' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                    user.status === 'away' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' :
                    'bg-red-500/20 border-red-500/30 text-red-400'
                  }`}
                >
                  {user.status}
                </Badge>
              </div>
            ))}
          </div>

          {/* Video Call Grid (when active) */}
          {isVideoCall && (
            <div className="mt-6 glass-card border border-green-500/30 rounded-2xl p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {activeUsers.filter(u => u.status === 'online').map((user) => (
                  <div key={user.id} className="relative aspect-video bg-black/50 rounded-xl overflow-hidden border border-green-500/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 text-xs text-white bg-black/70 px-2 py-1 rounded">
                      {user.name}
                    </div>
                    {!isMuted && (
                      <div className="absolute top-2 right-2">
                        <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Chat */}
      <Card className="glass-card border border-purple-500/30 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              Team Chat
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-400">
                {messages.length} messages
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="glass-card border-purple-500/30"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages */}
          <div className="p-6 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.type === 'alert' ? 'bg-red-500/10 -mx-6 px-6 py-3' : ''
                } ${msg.type === 'system' ? 'bg-blue-500/10 -mx-6 px-6 py-3' : ''}`}
              >
                {msg.type === 'text' && msg.userId !== 'current-user' && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {msg.userName.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                {msg.userId === 'current-user' && (
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    YOU
                  </div>
                )}
                {msg.type === 'alert' && (
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{msg.userName}</span>
                    <span className="text-xs text-gray-400">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-purple-500/30 bg-black/20">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-purple-500/30 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 transition-colors"
              />
              <Button
                onClick={sendMessage}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shared Cursors Overlay (when enabled) */}
      {showCursors && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {activeUsers.filter(u => u.id !== 'current-user' && u.cursorPosition).map((user) => (
            <div
              key={user.id}
              className="absolute transition-all duration-200"
              style={{
                left: `${user.cursorPosition!.x}%`,
                top: `${user.cursorPosition!.y}%`,
              }}
            >
              <MousePointer
                className="h-5 w-5"
                style={{ color: user.color }}
              />
              <span
                className="text-xs font-semibold px-2 py-1 rounded-full ml-2"
                style={{ backgroundColor: user.color, color: 'white' }}
              >
                {user.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaborationHub;
