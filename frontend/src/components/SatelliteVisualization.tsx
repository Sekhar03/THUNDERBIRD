'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Orbit, RotateCcw, Play, Pause, Satellite as SatelliteIcon } from 'lucide-react';
import * as THREE from 'three';

interface SatelliteVisualizationProps {
  satellites: Array<{ id: string; name: string; status: string; altitude?: number; quantumKeyId?: string }>;
}

type OrbitingSatellite = {
  id: string;
  name: string;
  status: string;
  radius: number;
  speed: number;
  phase: number;
};

const SatelliteVisualization: React.FC<SatelliteVisualizationProps> = ({ satellites }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const satsGroupRef = useRef<THREE.Group | null>(null);
  const labelsGroupRef = useRef<THREE.Group | null>(null);
  const arrowsGroupRef = useRef<THREE.Group | null>(null);
  
  const rafRef = useRef<number | null>(null);
  const maxRadiusRef = useRef<number>(6);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // We compute height from the container's CSS aspect ratio to keep it responsive

  const orbitingSatellites: OrbitingSatellite[] = useMemo(() => {
    return satellites.map((s, i) => ({
      id: s.id,
      name: s.name,
      status: s.status,
      radius: (3.0 + i * 0.7) * 0.8,
      speed: 0.4 + i * 0.12,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [satellites]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b1020');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / 420, 0.1, 1000);
    camera.position.set(0, 6, 12);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power', preserveDrawingBuffer: false, logarithmicDepthBuffer: false });
    renderer.setPixelRatio(1);
    renderer.setSize(container.clientWidth, container.clientHeight || 420);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const light = new THREE.DirectionalLight('#ffffff', 1.2);
    light.position.set(5, 8, 5);
    light.castShadow = true;
    scene.add(light);
    scene.add(new THREE.AmbientLight('#667', 0.7));

    // Subtle stars background
    const starsGeom = new THREE.BufferGeometry();
    const starCount = 100;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 80;
      starPositions[i * 3 + 0] = (Math.random() - 0.5) * r;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * r;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * r;
    }
    starsGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: '#ffffff', size: 0.02, sizeAttenuation: true });
    scene.add(new THREE.Points(starsGeom, starsMat));

    const earthGeom = new THREE.SphereGeometry(2, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({
      color: '#1f3b8f',
      emissive: '#0b1a44',
      roughness: 0.8,
      metalness: 0.1,
    });
    const earth = new THREE.Mesh(earthGeom, earthMat);
    earth.castShadow = false;
    earth.receiveShadow = true;
    scene.add(earth);
    earthRef.current = earth;

    // Atmosphere glow
    const glowGeom = new THREE.SphereGeometry(2.06, 48, 48);
    const glowMat = new THREE.MeshBasicMaterial({ color: '#60a5fa', transparent: true, opacity: 0.06 });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    scene.add(glow);

    const satsGroup = new THREE.Group();
    scene.add(satsGroup);
    satsGroupRef.current = satsGroup;

    const labelsGroup = new THREE.Group();
    scene.add(labelsGroup);
    labelsGroupRef.current = labelsGroup;

    const arrowsGroup = new THREE.Group();
    scene.add(arrowsGroup);
    arrowsGroupRef.current = arrowsGroup;

    const createSatelliteMesh = (status: string) => {
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.25, 0.5),
        new THREE.MeshStandardMaterial({ color: status === 'operational' ? '#10b981' : status === 'limited_connection' ? '#f59e0b' : '#ef4444' })
      );
      const panelMat = new THREE.MeshStandardMaterial({ color: '#60a5fa', emissive: '#1d4ed8', emissiveIntensity: 0.3 });
      const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.6, 0.9), panelMat);
      leftPanel.position.x = -0.2;
      const rightPanel = leftPanel.clone();
      rightPanel.position.x = 0.2;
      const sat = new THREE.Group();
      sat.add(body);
      sat.add(leftPanel);
      sat.add(rightPanel);
      return sat;
    };

    // Helper to create orbit ring for each satellite
    const makeOrbitRing = (radius: number) => {
      const pts: THREE.Vector3[] = [];
      for (let a = 0; a <= 360; a += 2) {
        const rad = (a * Math.PI) / 180;
        pts.push(new THREE.Vector3(Math.cos(rad) * radius, 0, Math.sin(rad) * radius));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineDashedMaterial({ color: 0x4b5563, dashSize: 0.3, gapSize: 0.2 });
      const line = new THREE.Line(geom, mat);
      
      if (typeof (line as any).computeLineDistances === 'function') {
        (line as any).computeLineDistances();
      }
      return line;
    };

    // Create label sprite from canvas
    const makeLabel = (lines: string[]) => {
      const padding = 6;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      ctx.font = '12px Arial';
      const width = Math.max(...lines.map((l) => ctx.measureText(l).width)) + padding * 2;
      const lineHeight = 16;
      const heightPx = lineHeight * lines.length + padding * 2;
      canvas.width = Math.ceil(width);
      canvas.height = Math.ceil(heightPx);
      // Background
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
      // Text
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '12px Arial';
      lines.forEach((l, i) => ctx.fillText(l, padding, padding + (i + 0.8) * lineHeight));
      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      const mat = new THREE.SpriteMaterial({ map: tex, depthWrite: false });
      const sprite = new THREE.Sprite(mat);
      const scale = 0.007 * Math.max(canvas.width, canvas.height);
      sprite.scale.set(scale * (canvas.width / canvas.height), scale, 1);
      return sprite;
    };

    // Track max orbit radius for responsive camera framing
    maxRadiusRef.current = Math.max(orbitingSatellites.reduce((m, s) => Math.max(m, s.radius), 0), 3.5) + 1.2;

    orbitingSatellites.forEach((s, idx) => {
      const satMesh = createSatelliteMesh(s.status);
      satMesh.userData = { id: s.id, name: s.name };
      satsGroup.add(satMesh);

      // Orbit ring per satellite
      const ring = makeOrbitRing(s.radius);
      scene.add(ring);

      // Label with detailed data
      const dataLines = [
        `${s.name} (${s.id})`,
        `Status: ${s.status.replace('_',' ')}`,
        `Altitude: ${Math.round((satellites[idx]?.altitude || s.radius * 100))} km`,
        `Key: ${satellites[idx]?.quantumKeyId || 'N/A'}`,
      ];
      const label = makeLabel(dataLines);
      labelsGroup.add(label);

      // Arrow pointing to Earth
      const dir = new THREE.Vector3();
      const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), 1.5, 0x60a5fa, 0.3, 0.18);
      arrowsGroup.add(arrow);
    });

    // Initial camera framing
    const frameCamera = () => {
      const maxR = maxRadiusRef.current;
      // Zoom in ~40% by reducing distance multipliers
      camera.position.set(0, maxR * 0.54, maxR * 2.04);
      camera.lookAt(0, 0, 0);
    };
    frameCamera();

    const resize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const h = container.clientHeight || 420;
      rendererRef.current.setSize(width, h);
      cameraRef.current.aspect = width / h;
      cameraRef.current.updateProjectionMatrix();
      frameCamera();
    };
    let ro: ResizeObserver | null = null;
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      ro = new ResizeObserver(() => resize());
      ro.observe(container);
    }
    window.addEventListener('resize', resize);

    let t = 0;
    let frame = 0;
    const tmpOrigin = new THREE.Vector3();
    const tmpDir = new THREE.Vector3();
    const animate = () => {
      if (!document.hidden && isPlaying) {
        t += 0.016;
        earth.rotation.y += 0.0008;
        satsGroup.children.forEach((child, idx) => {
          const s = orbitingSatellites[idx];
          const angle = s.phase + t * s.speed;
          const x = Math.cos(angle) * s.radius;
          const z = Math.sin(angle) * s.radius;
          const y = Math.sin(angle * 0.6) * 0.6;
          child.position.set(x, y, z);
          // Orient less frequently
          if ((frame & 7) === 0) child.lookAt(0, 0, 0);

          if ((frame & 7) === 0) {
            const label = labelsGroup.children[idx] as THREE.Sprite;
            if (label) {
              label.position.set(x, y + 0.9, z);
              label.lookAt(camera.position);
            }

            const arrow = arrowsGroup.children[idx] as THREE.ArrowHelper;
            if (arrow) {
              tmpOrigin.set(x, y, z);
              tmpDir.copy(tmpOrigin).multiplyScalar(-1).normalize();
              arrow.setDirection(tmpDir);
              arrow.position.copy(tmpOrigin);
              arrow.setLength(Math.max(0.6, Math.min(1.2, tmpOrigin.length() - 2.1)), 0.24, 0.14);
            }
          }
        });
        frame++;
      }
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    resize();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      if (ro) {
        ro.disconnect();
      }
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      scene.clear();
    };
  }, [orbitingSatellites, isPlaying, satellites]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'limited_connection': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      default: return 'bg-red-500/20 border-red-500/30 text-red-400';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-900/40 to-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-blue-300">3D Satellite Fleet</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsPlaying((v) => !v)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedId(null)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-xl border border-white/10 bg-black/30 shadow-inner overflow-hidden">
            <div
              ref={containerRef}
              className="w-full aspect-[16/10] sm:aspect-[2/1]"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {orbitingSatellites.map((sat) => (
              <div
                key={sat.id}
                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                  selectedId === sat.id ? 'bg-blue-500/20 border-blue-500/50' : 'bg-gray-800/20 border-gray-600/30'
                }`}
                onClick={() => setSelectedId(selectedId === sat.id ? null : sat.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      sat.status === 'operational' ? 'bg-green-400' : sat.status === 'limited_connection' ? 'bg-orange-400' : 'bg-red-400'
                    }`} />
                    <span className="text-sm font-medium text-gray-200">{sat.name}</span>
                  </div>
                  <Badge variant="outline" className={`text-xs sm:text-sm rounded-full ${getStatusColor(sat.status)}`}>{sat.status.replace('_', ' ')}</Badge>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <div>Orbit: {sat.radius.toFixed(1)} Mm</div>
                  <div>Speed: {(sat.speed).toFixed(2)} rad/s</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-md border border-green-500/20 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Satellites</p>
                <p className="text-2xl font-bold text-green-400">{orbitingSatellites.length}</p>
              </div>
              <SatelliteIcon className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-md border border-blue-500/20 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Operational</p>
                <p className="text-2xl font-bold text-blue-400">{satellites.filter(s => s.status === 'operational').length}</p>
              </div>
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-md border border-orange-500/20 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Limited Connection</p>
                <p className="text-2xl font-bold text-orange-400">{satellites.filter(s => s.status === 'limited_connection').length}</p>
              </div>
              <div className="w-2 h-2 bg-orange-400 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md border border-purple-500/20 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Coverage Area</p>
                <p className="text-2xl font-bold text-purple-400">{(satellites.length * 15).toFixed(0)}%</p>
              </div>
              <Orbit className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SatelliteVisualization; 