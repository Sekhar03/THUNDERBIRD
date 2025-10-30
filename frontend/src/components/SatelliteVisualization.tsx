'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import createGlobe from 'cobe';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Orbit, RotateCcw, Play, Pause, Satellite as SatelliteIcon, Maximize2, Minimize2, Zap, Activity } from 'lucide-react';

interface SatelliteVisualizationProps {
  satellites: Array<{ id: string; name: string; status: string; altitude?: number; quantumKeyId?: string }>;
}

const SatelliteVisualization: React.FC<SatelliteVisualizationProps> = ({ satellites }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedSatellite, setSelectedSatellite] = useState<string | null>(null);
  const phiRef = useRef(0);
  const [width, setWidth] = useState(0);
  const [r, setR] = useState(0);
  const [satellitePositions, setSatellitePositions] = useState<Array<{x: number, y: number, visible: boolean}>>([]);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? 'grabbing' : 'grab';
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setR(delta / 200);
    }
  };

  const onRender = useCallback((state: any) => {
    if (!pointerInteracting.current && isAnimating) {
      phiRef.current += 0.004;
    }
    state.phi = phiRef.current + r;
    state.width = width * 2;
    state.height = width * 2;
  }, [r, width, isAnimating]);

  useEffect(() => {
    if (!canvasRef.current) return;

    let width = 0;
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
        setWidth(width);
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 2.5,
      mapSamples: 16000,
      mapBrightness: 2,
      baseColor: [0.1, 0.2, 0.4],
      markerColor: [0, 1, 1],
      glowColor: [0.3, 0.8, 1],
      markers: satellites.map((sat, idx) => ({
        location: [Math.sin(idx * 2) * 60, (idx * 60) % 360 - 180],
        size: sat.status === 'operational' ? 0.2 : 0.15,
      })),
      onRender,
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '1';
      }
    }, 0);

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [onRender, satellites]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetView = () => {
    phiRef.current = 0;
    setR(0);
    pointerInteractionMovement.current = 0;
  };

  return (
    <Card className={`glass-card border border-cyan-500/30 rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl hover:shadow-cyan-500/20 ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      <CardHeader className="bg-gradient-to-r from-cyan-900/60 via-blue-900/60 to-purple-900/60 border-b border-cyan-500/30 p-6 backdrop-blur-xl relative overflow-hidden">
        {/* Animated background accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-4 rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-7 w-7 text-white animate-spin" style={{ animationDuration: '20s' }} />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                3D Satellite Network
              </CardTitle>
              <p className="text-sm text-gray-300 mt-1 flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
                Live orbital tracking • {satellites.length} satellites
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/20 border-green-500/40 text-green-300 px-4 py-2 shadow-lg shadow-green-500/20 animate-pulse">
              <SatelliteIcon className="h-4 w-4 mr-2" />
              {satellites.filter(s => s.status === 'operational').length} Active
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="glass-card border-cyan-500/40 hover:bg-cyan-500/20 hover:border-cyan-400/60 transition-all shadow-lg hover:shadow-cyan-500/30"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 overflow-hidden">
        {/* Globe Container */}
        <div className="relative flex items-center justify-center" style={{ height: isFullscreen ? 'calc(100vh - 200px)' : '550px' }}>
          <div className="w-full h-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              style={{
                width: '550px',
                height: '550px',
                maxWidth: '100%',
                maxHeight: '100%',
                opacity: 0,
                transition: 'opacity 1.5s ease',
                aspectRatio: '1/1',
              }}
              onPointerDown={(e) => {
                updatePointerInteraction(
                  e.clientX - pointerInteractionMovement.current
                );
              }}
              onPointerUp={() => updatePointerInteraction(null)}
              onPointerOut={() => updatePointerInteraction(null)}
              onMouseMove={(e) => updateMovement(e.clientX)}
              onTouchMove={(e) =>
                e.touches[0] && updateMovement(e.touches[0].clientX)
              }
            />
          </div>

          {/* Animated particles/stars background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animation: `twinkle ${Math.random() * 5 + 3}s ease-in-out ${Math.random() * 3}s infinite`,
                }}
              />
            ))}
          </div>

          {/* 3D Satellite Icons Overlay */}
          <div className="absolute inset-0">
            {satellites.map((sat, idx) => {
              const angle = (idx * (360 / satellites.length)) + (phiRef.current * 50);
              const radius = 42; // percentage from center
              const x = 50 + Math.cos((angle * Math.PI) / 180) * radius;
              const y = 50 + Math.sin((angle * Math.PI) / 180) * radius * 0.5; // squash vertically for 3D effect
              
              // Check if satellite is on visible side (simple front-facing check)
              const isVisible = Math.cos((angle * Math.PI) / 180) > -0.3;
              
              return isVisible ? (
                <div
                  key={sat.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 animate-float hover:scale-110 hover:z-50"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    animationDelay: `${idx * 0.2}s`,
                  }}
                >
                  {/* Satellite Body */}
                  <div className="relative group cursor-pointer" onClick={() => setSelectedSatellite(sat.id)}>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 blur-xl ${
                      sat.status === 'operational' ? 'bg-cyan-400' : 
                      sat.status === 'limited_connection' ? 'bg-yellow-400' : 'bg-red-400'
                    } opacity-60 animate-pulse`}></div>
                    
                    {/* Main satellite structure */}
                    <div className="relative flex items-center gap-1">
                      {/* Left solar panel */}
                      <div className="w-8 h-3 bg-gradient-to-r from-blue-600 to-blue-400 border border-blue-300/50 transform -skew-x-12 shadow-lg"></div>
                      
                      {/* Satellite body */}
                      <div className="relative">
                        <div className={`w-6 h-6 rounded-sm ${
                          sat.status === 'operational' ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300' : 
                          sat.status === 'limited_connection' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300' : 
                          'bg-gradient-to-br from-red-400 to-red-600 border-red-300'
                        } border-2 shadow-xl flex items-center justify-center`}>
                          <SatelliteIcon className="w-4 h-4 text-white drop-shadow-lg" />
                        </div>
                        {/* Antenna */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-gray-300"></div>
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80"></div>
                      </div>
                      
                      {/* Right solar panel */}
                      <div className="w-8 h-3 bg-gradient-to-r from-blue-400 to-blue-600 border border-blue-300/50 transform skew-x-12 shadow-lg"></div>
                    </div>

                    {/* Satellite label */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-black/80 border border-cyan-400/50 rounded px-2 py-1 shadow-xl backdrop-blur-sm">
                        <span className="text-xs font-bold text-cyan-300">{sat.name}</span>
                      </div>
                    </div>

                    {/* Signal beams */}
                    {sat.status === 'operational' && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                        <div className="w-0.5 h-16 bg-gradient-to-b from-cyan-400 to-transparent opacity-50"></div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null;
            })}
          </div>

          {/* Controls Overlay - Bottom Left */}
          <div className="absolute bottom-6 left-6 flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAnimating(!isAnimating)}
              className="glass-card border-cyan-500/40 hover:bg-cyan-500/20 backdrop-blur-xl shadow-xl hover:shadow-cyan-500/30 transition-all"
            >
              {isAnimating ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Play
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              className="glass-card border-cyan-500/40 hover:bg-cyan-500/20 backdrop-blur-xl shadow-xl hover:shadow-cyan-500/30 transition-all"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Interaction Hint - Bottom Center */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 glass-card border border-cyan-500/30 rounded-xl px-4 py-2 backdrop-blur-xl shadow-xl animate-pulse">
            <span className="text-xs text-cyan-300 font-medium">🖱️ Drag to rotate • 🛰️ Click satellites for details</span>
          </div>

          {/* Satellite List Panel - Right Side */}
          <div className="absolute top-6 right-6 bottom-6 glass-card border border-cyan-500/30 rounded-2xl p-5 w-80 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-cyan-500/30">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg">
                <SatelliteIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Active Satellites
              </h3>
            </div>
            
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {satellites.map((sat, idx) => (
                <button
                  key={sat.id}
                  onClick={() => setSelectedSatellite(sat.id === selectedSatellite ? null : sat.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                    sat.id === selectedSatellite 
                      ? 'bg-gradient-to-r from-purple-500/50 to-pink-500/50 border-2 border-purple-400/70 shadow-xl shadow-purple-500/30' 
                      : 'bg-black/40 hover:bg-black/60 border border-cyan-500/20 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-semibold text-white">{sat.name}</span>
                    <div className={`w-3 h-3 rounded-full shadow-lg ${
                      sat.status === 'operational' ? 'bg-green-400 shadow-green-400/60 animate-pulse' :
                      sat.status === 'limited_connection' ? 'bg-yellow-400 shadow-yellow-400/60' :
                      'bg-red-400 shadow-red-400/60'
                    }`}></div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">ID:</span>
                      <span className="text-cyan-300 font-mono">{sat.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Altitude:</span>
                      <span className="text-cyan-300 font-mono">{sat.altitude || 550}km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Quantum Key:</span>
                      <span className="text-purple-300 font-mono text-xs truncate max-w-32">{sat.quantumKeyId || 'N/A'}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-700/50">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        sat.status === 'operational' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        sat.status === 'limited_connection' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {sat.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info Display - Top Left */}
          <div className="absolute top-6 left-6 glass-card border border-cyan-500/30 rounded-2xl p-5 backdrop-blur-2xl shadow-2xl">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Orbit className="h-5 w-5 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-300">System Status</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-sm text-gray-400">Animation:</span>
                <Badge className={`${isAnimating ? 'bg-green-500/20 text-green-300 border-green-500/40' : 'bg-gray-500/20 text-gray-300 border-gray-500/40'} shadow-lg`}>
                  {isAnimating ? 'Live' : 'Paused'}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-sm text-gray-400">Coverage:</span>
                <span className="text-cyan-300 font-mono text-sm font-semibold">Global</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-sm text-gray-400">Network:</span>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-green-300 font-mono text-sm">Active</span>
                </div>
              </div>
              <div className="pt-3 mt-3 border-t border-cyan-500/30">
                <div className="flex items-center gap-2">
                  <SatelliteIcon className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-xs text-gray-400">Satellites orbiting Earth</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
          }
          @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
            50% { transform: translate(-50%, -50%) translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default SatelliteVisualization;
