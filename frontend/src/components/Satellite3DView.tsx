'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import createGlobe from 'cobe';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  RotateCcw,
  Globe2,
  Satellite,
  Orbit
} from 'lucide-react';

interface Satellite3DViewProps {
  satellites?: Array<{
    id: string;
    name: string;
    position: { lat: number; lon: number; alt: number };
    status: 'operational' | 'limited_connection' | 'offline';
  }>;
}

const Satellite3DView: React.FC<Satellite3DViewProps> = ({ satellites = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedSatellite, setSelectedSatellite] = useState<string | null>(null);
  const phiRef = useRef(0);
  const [width, setWidth] = useState(0);
  const [r, setR] = useState(0);

  // Mock satellite data
  const mockSatellites = satellites.length > 0 ? satellites : [
    { id: 'sat-001', name: 'ThunderBird-1', position: { lat: 45, lon: -120, alt: 550 }, status: 'operational' as const },
    { id: 'sat-002', name: 'ThunderBird-2', position: { lat: -30, lon: 60, alt: 600 }, status: 'operational' as const },
    { id: 'sat-003', name: 'ThunderBird-3', position: { lat: 0, lon: 0, alt: 575 }, status: 'limited_connection' as const },
  ];

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
      phiRef.current += 0.003;
    }
    state.phi = phiRef.current + r;
    state.width = width * 2;
    state.height = width * 2;
  }, [r, width, isAnimating]);

  useEffect(() => {
    if (!canvasRef.current) return;

    let phi = 0;
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
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [0.1, 0.1, 0.2],
      markerColor: [0.1, 0.8, 1],
      glowColor: [0.1, 0.4, 0.8],
      markers: mockSatellites.map(sat => ({
        location: [sat.position.lat, sat.position.lon],
        size: sat.status === 'operational' ? 0.08 : 0.05,
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
  }, [onRender, mockSatellites]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetView = () => {
    phiRef.current = 0;
    setR(0);
    pointerInteractionMovement.current = 0;
  };

  return (
    <Card className={`glass-card border border-cyan-500/30 rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      <CardHeader className="bg-gradient-to-r from-cyan-900/60 via-blue-900/60 to-purple-900/60 border-b border-cyan-500/30 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-4 rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Globe2 className="h-7 w-7 text-white animate-spin" style={{ animationDuration: '20s' }} />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Live Satellite Tracking
              </CardTitle>
              <p className="text-sm text-gray-300 mt-1 flex items-center gap-2">
                <Orbit className="h-4 w-4 text-cyan-400" />
                Real-time orbital visualization • {mockSatellites.length} satellites active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/20 border-green-500/40 text-green-300 px-4 py-2 shadow-lg shadow-green-500/20">
              <Satellite className="h-4 w-4 mr-2 animate-pulse" />
              {mockSatellites.filter(s => s.status === 'operational').length} Online
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="glass-card border-cyan-500/40 hover:bg-cyan-500/20 hover:border-cyan-400/60 transition-all shadow-lg"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950">
        {/* Globe Container */}
        <div className="relative" style={{ height: isFullscreen ? 'calc(100vh - 200px)' : '700px' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                opacity: 0,
                transition: 'opacity 1s ease',
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
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                }}
              />
            ))}
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-6 left-6 flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAnimating(!isAnimating)}
              className="glass-card border-cyan-500/40 hover:bg-cyan-500/20 backdrop-blur-xl shadow-xl"
            >
              {isAnimating ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              className="glass-card border-cyan-500/40 hover:bg-cyan-500/20 backdrop-blur-xl shadow-xl"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>

          {/* Satellite List Panel */}
          <div className="absolute bottom-6 right-6 glass-card border border-cyan-500/30 rounded-2xl p-5 max-w-sm backdrop-blur-2xl shadow-2xl">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
              <Satellite className="h-5 w-5 text-cyan-400" />
              Active Satellites
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
              {mockSatellites.map((sat) => (
                <button
                  key={sat.id}
                  onClick={() => setSelectedSatellite(sat.id === selectedSatellite ? null : sat.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    sat.id === selectedSatellite 
                      ? 'bg-gradient-to-r from-purple-500/40 to-pink-500/40 border-2 border-purple-400/60 shadow-lg shadow-purple-500/30' 
                      : 'bg-black/30 hover:bg-black/50 border border-cyan-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-white">{sat.name}</span>
                    <div className={`w-3 h-3 rounded-full shadow-lg ${
                      sat.status === 'operational' ? 'bg-green-400 shadow-green-400/50 animate-pulse' :
                      sat.status === 'limited_connection' ? 'bg-yellow-400 shadow-yellow-400/50' :
                      'bg-red-400 shadow-red-400/50'
                    }`}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Altitude: <span className="text-cyan-300 font-mono">{sat.position.alt}km</span></span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sat.status === 'operational' ? 'bg-green-500/20 text-green-300' :
                      sat.status === 'limited_connection' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {sat.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Lat: {sat.position.lat}° • Lon: {sat.position.lon}°
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info Display */}
          <div className="absolute top-6 right-6 glass-card border border-cyan-500/30 rounded-2xl p-5 backdrop-blur-2xl shadow-2xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-6">
                <span className="text-sm text-gray-400">Status:</span>
                <Badge className={`${isAnimating ? 'bg-green-500/20 text-green-300 border-green-500/40' : 'bg-gray-500/20 text-gray-300 border-gray-500/40'} shadow-lg`}>
                  {isAnimating ? 'Live' : 'Paused'}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-sm text-gray-400">Coverage:</span>
                <span className="text-cyan-300 font-mono text-sm">Global</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-sm text-gray-400">Mode:</span>
                <span className="text-purple-300 font-mono text-sm">3D View</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Satellite3DView;
