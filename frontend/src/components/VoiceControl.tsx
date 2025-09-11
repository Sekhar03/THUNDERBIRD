'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Settings,
  MessageSquare,
  Brain,
  Zap,
  
} from 'lucide-react';

interface VoiceControlProps {
  onCommand?: (command: string) => void;
}

interface VoiceCommand {
  id: string;
  command: string;
  response: string;
  timestamp: Date;
  status: 'success' | 'error' | 'processing';
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [language, setLanguage] = useState('en-US');

  const voiceCommands = {
    'switch to realtime mode': () => {
      onCommand?.('realtime');
      return 'Switching to real-time mode';
    },
    'switch to scenario mode': () => {
      onCommand?.('scenario');
      return 'Switching to scenario mode';
    },
    'show satellite status': () => {
      return 'Displaying satellite fleet status';
    },
    'check system health': () => {
      return 'Analyzing system health metrics';
    },
    'activate quantum security': () => {
      return 'Enabling quantum security protocols';
    },
    'run threat detection': () => {
      return 'Initiating AI threat detection scan';
    },
    'export data': () => {
      return 'Preparing data export';
    },
    'emergency shutdown': () => {
      return '⚠️ Emergency shutdown initiated';
    },
    'system status': () => {
      return 'Retrieving system status information';
    },
    'clear all': () => {
      setCommands([]);
      return 'Cleared command history';
    }
  };

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SR: typeof window extends { webkitSpeechRecognition: infer T } ? new () => SpeechRecognition : any = (window as any).webkitSpeechRecognition;
      const recognition = new SR();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          processCommand(transcript.trim());
        }
      };

      setRecognition(recognition);
      setIsEnabled(true);
    }
  }, [language]);

  const processCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase();
    let response = 'Command not recognized';
    let status: 'success' | 'error' | 'processing' = 'error';

    // Check for exact matches first
    for (const [key, handler] of Object.entries(voiceCommands)) {
      if (lowerCommand.includes(key.toLowerCase())) {
        try {
          response = handler();
          status = 'success';
          break;
        } catch {
          response = 'Error executing command';
          status = 'error';
        }
      }
    }

    // Add command to history
    const newCommand: VoiceCommand = {
      id: Date.now().toString(),
      command,
      response,
      timestamp: new Date(),
      status
    };

    setCommands(prev => [newCommand, ...prev.slice(0, 9)]);
    setTranscript('');
  }, [voiceCommands]);

  const startListening = () => {
    if (recognition && isEnabled) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const getStatusColor = (status: VoiceCommand['status']) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'error': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'processing': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
    }
  };

  const getStatusIcon = (status: VoiceCommand['status']) => {
    switch (status) {
      case 'success': return <Zap className="h-4 w-4 text-green-400" />;
      case 'error': return <VolumeX className="h-4 w-4 text-red-400" />;
      case 'processing': return <Brain className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Control Panel */}
      <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-md border border-indigo-500/20 rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-indigo-300">Voice Control</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  isEnabled ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-red-500/20 border-red-500/30 text-red-400'
                }`}
              >
                {isEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEnabled(!isEnabled)}
                className="flex items-center space-x-1"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Voice Recognition Status */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={isListening ? "destructive" : "default"}
              size="lg"
              onClick={isListening ? stopListening : startListening}
              disabled={!isEnabled}
              className={`flex items-center space-x-2 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
              }`}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              <span>{isListening ? 'Stop Listening' : 'Start Listening'}</span>
            </Button>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="bg-black/20 rounded-lg p-4 border border-indigo-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium text-indigo-300">Recognized Speech:</span>
              </div>
              <p className="text-gray-200">{transcript}</p>
            </div>
          )}

          {/* Available Commands */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-black/20 rounded-lg p-3 border border-indigo-500/20">
              <h4 className="text-sm font-medium text-indigo-300 mb-2">Available Commands:</h4>
              <div className="space-y-1 text-xs text-gray-400">
                <div>• &quot;Switch to realtime mode&quot;</div>
                <div>• &quot;Switch to scenario mode&quot;</div>
                <div>• &quot;Show satellite status&quot;</div>
                <div>• &quot;Check system health&quot;</div>
                <div>• &quot;Activate quantum security&quot;</div>
                <div>• &quot;Run threat detection&quot;</div>
                <div>• &quot;Export data&quot;</div>
                <div>• &quot;System status&quot;</div>
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-3 border border-indigo-500/20">
              <h4 className="text-sm font-medium text-indigo-300 mb-2">Voice Settings:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Language:</span>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-black/20 border border-indigo-500/20 rounded px-2 py-1 text-xs"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Status:</span>
                  <span className={`text-xs ${
                    isListening ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {isListening ? 'Listening...' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Command History */}
      <Card className="bg-gradient-to-br from-slate-900/30 to-gray-900/30 backdrop-blur-md border border-gray-500/20 rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-slate-500 to-gray-500 p-2 rounded-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-300">Command History</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs bg-slate-500/20 border-slate-500/30 text-slate-400">
              {commands.length}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {commands.map((cmd) => (
              <div
                key={cmd.id}
                className="p-3 rounded-lg border bg-black/20 hover:bg-black/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(cmd.status)}
                    <span className="text-sm font-medium text-gray-200">
                      "{cmd.command}"
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(cmd.status)}`}
                  >
                    {cmd.status}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-400 mb-2">{cmd.response}</p>
                
                <div className="text-xs text-gray-500">
                  {cmd.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            
            {commands.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Volume2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No commands yet. Start speaking to see your command history.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceControl; 