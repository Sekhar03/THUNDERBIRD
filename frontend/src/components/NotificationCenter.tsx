'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  BellOff, 
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  AlertCircle,
  Settings,
  Filter,
  Archive,
  Trash2,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  actionable: boolean;
}

interface NotificationCenterProps {
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  position = 'top-right' 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Mock notification generator
  useEffect(() => {
    const types: Notification['type'][] = ['success', 'warning', 'error', 'info'];
    const priorities: Notification['priority'][] = ['low', 'medium', 'high', 'critical'];
    const sources = ['Satellite-001', 'Quantum Network', 'AI Detector', 'Blockchain', 'System'];
    
    const titles = {
      success: ['Connection Established', 'Task Completed', 'Update Successful'],
      warning: ['Low Signal Detected', 'High Latency', 'Resource Usage Warning'],
      error: ['Connection Failed', 'System Error', 'Authentication Failed'],
      info: ['New Update Available', 'Scheduled Maintenance', 'System Information']
    };

    const messages = {
      success: ['Operation completed successfully', 'All systems operating normally'],
      warning: ['Please check system status', 'Attention required'],
      error: ['Immediate action required', 'Critical system failure detected'],
      info: ['For more information, check the dashboard', 'No action needed']
    };

    const generateNotification = (): Notification => {
      const type = types[Math.floor(Math.random() * types.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      return {
        id: `notif-${Date.now()}-${Math.random()}`,
        type,
        title: titles[type][Math.floor(Math.random() * titles[type].length)],
        message: messages[type][Math.floor(Math.random() * messages[type].length)],
        timestamp: new Date(),
        read: false,
        priority,
        source: sources[Math.floor(Math.random() * sources.length)],
        actionable: Math.random() > 0.5
      };
    };

    // Add initial notifications
    const initial = Array.from({ length: 5 }, generateNotification);
    setNotifications(initial);

    // Simulate new notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotif = generateNotification();
        setNotifications(prev => [newNotif, ...prev].slice(0, 50));
        
        // Play sound for critical notifications
        if (soundEnabled && newNotif.priority === 'critical') {
          // You could add actual sound here
          console.log('🔔 Critical notification sound');
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'critical') return n.priority === 'critical';
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'info': return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'error': return 'border-red-500/30 bg-red-500/10';
      case 'info': return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    const colors = {
      low: 'bg-gray-500/20 border-gray-500/30 text-gray-400',
      medium: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
      high: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
      critical: 'bg-red-500/20 border-red-500/30 text-red-400 animate-pulse'
    };
    return colors[priority];
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <>
      {/* Notification Bell Button */}
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsOpen(!isOpen)}
          className="relative glass-card border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-110 hover:shadow-glow-md"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5 text-purple-400" />
          {unreadCount > 0 && (
            <>
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-purple-500 items-center justify-center text-2xs font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </span>
            </>
          )}
          {criticalCount > 0 && (
            <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
          )}
        </Button>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className={`fixed ${position.includes('right') ? 'right-4' : 'left-4'} ${position.includes('top') ? 'top-20' : 'bottom-20'} z-50 w-full max-w-md animate-slide-in`}>
            <Card className="glass-card border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 border-b border-purple-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-40 animate-pulse-glow"></div>
                      <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-2.5 rounded-full shadow-glow-sm">
                        <Bell className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-white">
                        Notifications
                      </CardTitle>
                      <p className="text-xs text-gray-300">
                        {unreadCount} unread • {criticalCount} critical
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="h-8 w-8 p-0"
                      aria-label="Toggle sound"
                    >
                      {soundEnabled ? 
                        <Volume2 className="h-4 w-4 text-purple-400" /> : 
                        <VolumeX className="h-4 w-4 text-gray-400" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(!showSettings)}
                      className="h-8 w-8 p-0"
                    >
                      <Settings className="h-4 w-4 text-purple-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mt-4">
                  {(['all', 'unread', 'critical'] as const).map((f) => (
                    <Button
                      key={f}
                      variant={filter === f ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter(f)}
                      className={`capitalize text-xs ${
                        filter === f
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                          : 'border-purple-500/30'
                      }`}
                    >
                      {f}
                    </Button>
                  ))}
                </div>

                {/* Actions */}
                {notifications.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAsRead}
                      className="flex-1 text-xs border-purple-500/30"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mark all read
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAll}
                      className="flex-1 text-xs border-purple-500/30"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear all
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <BellOff className="h-12 w-12 mx-auto mb-3 text-gray-500 opacity-50" />
                    <p className="text-gray-400">No notifications</p>
                    <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-2xl border transition-all duration-200 ${
                          getTypeColor(notification.type)
                        } ${
                          !notification.read ? 'border-l-4' : ''
                        } hover:scale-[1.02] cursor-pointer group`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            {getTypeIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-white truncate">
                                  {notification.title}
                                </h4>
                                <Badge 
                                  variant="outline" 
                                  className={`text-2xs px-2 py-0 ${getPriorityBadge(notification.priority)}`}
                                >
                                  {notification.priority}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-300 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-3 text-2xs text-gray-400">
                                <span>{notification.source}</span>
                                <span>•</span>
                                <span>{notification.timestamp.toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {notification.actionable && (
                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              className="text-xs bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30"
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs border-purple-500/30"
                            >
                              Dismiss
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default NotificationCenter;
