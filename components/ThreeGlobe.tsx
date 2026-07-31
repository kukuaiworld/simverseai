"use client";

import React, { useRef, useEffect, useState } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface GlobeLocation {
  name: string;
  lat: number;
  lng: number;
}

interface ThreeGlobeProps {
  latitude?: number;
  longitude?: number;
  selectedLocationName?: string;
  onSelectLocation?: (name: string, lat: number, lng: number) => void;
}

export default function ThreeGlobe({ latitude, longitude, selectedLocationName, onSelectLocation }: ThreeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction States
  const [rotation, setRotation] = useState({ x: 0.3, y: 0.8 });
  const [zoom, setZoom] = useState(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Indian Smart City Nodes coordinates preset
  const PRESET_CITIES = [
    { name: "New Delhi Core", lat: 28.6139, lng: 77.2090 },
    { name: "Ajmer Junction", lat: 26.4499, lng: 74.6399 },
    { name: "Mumbai Central", lat: 18.9750, lng: 72.8258 },
    { name: "Bengaluru Tech Hub", lat: 12.9716, lng: 77.5946 },
    { name: "Kolkata Port", lat: 22.5726, lng: 88.3639 }
  ];

  // Mouse drag listeners to rotate the globe
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotation(prev => ({
      x: prev.x + dy * 0.005,
      y: prev.y + dx * 0.005
    }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom listener
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.6, Math.min(2.5, prev - e.deltaY * 0.001)));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = 400);
    let height = (canvas.height = 400);

    const handleResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = Math.max(300, rect.height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Coordinate projection helpers
    const R = 110 * zoom;

    const to3D = (lat: number, lng: number): Point3D => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return {
        x: -R * Math.sin(phi) * Math.sin(theta),
        y: R * Math.cos(phi),
        z: R * Math.sin(phi) * Math.cos(theta)
      };
    };

    // Rotate point around X and Y axes
    const rotatePoint = (p: Point3D, rx: number, ry: number): Point3D => {
      // Y-axis rotation
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;

      // X-axis rotation
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      return { x: x1, y: y2, z: z2 };
    };

    // Generate procedural grid of dots (Earth continents representation)
    const generateGlobeDots = () => {
      const dots: Point3D[] = [];
      // Simple procedural continental maps
      for (let lat = -80; lat <= 80; lat += 4) {
        const radLat = lat * (Math.PI / 180);
        const circumference = Math.cos(radLat);
        const steps = Math.max(8, Math.round(100 * circumference));
        for (let i = 0; i < steps; i++) {
          const lng = (i / steps) * 360 - 180;

          // Simple landmass detection (heuristics to shape continents)
          const isLand = 
            (lng > -120 && lng < -30 && lat > -50 && lat < 70) || // Americas
            (lng > -20 && lng < 50 && lat > -35 && lat < 70) ||  // Africa / Europe
            (lng > 50 && lng < 150 && lat > -10 && lat < 75) ||  // Asia
            (lng > 110 && lng < 155 && lat > -40 && lat < -10);  // Australia

          if (isLand) {
            dots.push(to3D(lat, lng));
          }
        }
      }
      return dots;
    };

    const globeDots = generateGlobeDots();
    let pulseProgress = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Atmosphere Outer Glow
      const glow = ctx.createRadialGradient(cx, cy, R * 0.95, cx, cy, R * 1.25);
      glow.addColorStop(0, "rgba(99, 102, 241, 0.15)");
      glow.addColorStop(0.5, "rgba(99, 102, 241, 0.05)");
      glow.addColorStop(1, "rgba(99, 102, 241, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Globe Base shading (premium soft circular mask)
      ctx.fillStyle = "#eef2f7";
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric edge ring
      ctx.strokeStyle = "rgba(99, 102, 241, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // Sort and render continental dots
      globeDots.forEach(dot => {
        const rotated = rotatePoint(dot, rotation.x, rotation.y);
        
        // Back-face culling (hide dots on the dark side of the globe)
        if (rotated.z < 0) return;

        // Perspective scaling
        const scale = (R + rotated.z) / R;
        const screenX = cx + rotated.x;
        const screenY = cy - rotated.y;

        // Render dot in premium soft slate indigo
        ctx.fillStyle = `rgba(99, 102, 241, ${0.25 + scale * 0.45})`;
        ctx.fillRect(screenX, screenY, scale * 1.5, scale * 1.5);
      });

      // Orbiting satellites
      const time = Date.now() * 0.0008;
      const orbitRadius = R * 1.35;
      const satPos = {
        x: orbitRadius * Math.cos(time),
        y: orbitRadius * Math.sin(time) * 0.3,
        z: orbitRadius * Math.sin(time)
      };
      const rotatedSat = rotatePoint(satPos, rotation.x, rotation.y);
      if (rotatedSat.z >= 0) {
        ctx.fillStyle = "#6366f1";
        ctx.shadowColor = "#6366f1";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(cx + rotatedSat.x, cy - rotatedSat.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
        
        // Orbital path line back to surface
        ctx.strokeStyle = "rgba(99, 102, 241, 0.2)";
        ctx.beginPath();
        ctx.moveTo(cx + rotatedSat.x, cy - rotatedSat.y);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      }

      // Draw Preset Indian City Pins
      PRESET_CITIES.forEach(city => {
        const p3d = to3D(city.lat, city.lng);
        const rotated = rotatePoint(p3d, rotation.x, rotation.y);

        if (rotated.z < 0) return;

        const screenX = cx + rotated.x;
        const screenY = cy - rotated.y;

        const isSelected = selectedLocationName?.toLowerCase().includes(city.name.split(" ")[0].toLowerCase()) ||
                           (latitude && Math.abs(latitude - city.lat) < 0.5);

        // Ping wave animation
        if (isSelected) {
          pulseProgress = (pulseProgress + 0.15) % 15;
          ctx.strokeStyle = `rgba(16, 185, 129, ${1 - pulseProgress / 15})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(screenX, screenY, pulseProgress, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Pin Core
        ctx.fillStyle = isSelected ? "#10b981" : "#a855f7";
        ctx.shadowColor = isSelected ? "#10b981" : "#a855f7";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(screenX, screenY, isSelected ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label offset text
        ctx.fillStyle = isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.6)";
        ctx.font = "8px 'Outfit', sans-serif";
        ctx.fillText(city.name, screenX + 6, screenY + 3);
      });

      // Connect Cities dynamically with data arcs
      ctx.strokeStyle = "rgba(139, 92, 246, 0.3)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([2, 4]);

      for (let i = 0; i < PRESET_CITIES.length - 1; i++) {
        const c1 = to3D(PRESET_CITIES[i].lat, PRESET_CITIES[i].lng);
        const c2 = to3D(PRESET_CITIES[i + 1].lat, PRESET_CITIES[i + 1].lng);

        const r1 = rotatePoint(c1, rotation.x, rotation.y);
        const r2 = rotatePoint(c2, rotation.x, rotation.y);

        if (r1.z < 0 || r2.z < 0) continue;

        ctx.beginPath();
        ctx.moveTo(cx + r1.x, cy - r1.y);
        // Draw quad curve representing atmospheric data transfer
        const midX = (r1.x + r2.x) / 2;
        const midY = (r1.y + r2.y) / 2 + 30;
        ctx.quadraticCurveTo(cx + midX, cy - midY, cx + r2.x, cy - r2.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [rotation, zoom, selectedLocationName, latitude, longitude]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full min-h-[350px] bg-slate-950/20 border border-slate-900 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Dynamic FUI Watermark panel */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-slate-500 leading-normal pointer-events-none">
        <div>ORBITAL STATUS: SYNCED</div>
        <div>LATITUDE REF: {latitude ? latitude.toFixed(4) : "28.6139"}</div>
        <div>LONGITUDE REF: {longitude ? longitude.toFixed(4) : "77.2090"}</div>
      </div>

      <div className="absolute top-4 right-4 font-mono text-[9px] text-slate-500 leading-normal text-right pointer-events-none">
        <div>TERRAIN MESH: RESOLVING</div>
        <div>DECISION SECTOR: SMART GRID</div>
      </div>

      <canvas ref={canvasRef} className="block" />

      {/* Manual zoom panel overlay */}
      <div className="absolute bottom-4 left-4 flex gap-1.5 z-10">
        <button 
          onClick={() => setZoom(prev => Math.min(2.5, prev + 0.15))}
          className="w-6 h-6 rounded border border-slate-800 bg-slate-900/80 text-[10px] text-slate-400 hover:border-cyan-500 hover:text-cyan-400 transition-colors flex items-center justify-center font-bold"
        >
          +
        </button>
        <button 
          onClick={() => setZoom(prev => Math.max(0.6, prev - 0.15))}
          className="w-6 h-6 rounded border border-slate-800 bg-slate-900/80 text-[10px] text-slate-400 hover:border-cyan-500 hover:text-cyan-400 transition-colors flex items-center justify-center font-bold"
        >
          -
        </button>
      </div>

      {/* Hotspots preset list */}
      <div className="absolute bottom-4 right-4 flex gap-1 bg-slate-950/90 border border-slate-900 p-1 rounded-lg">
        {PRESET_CITIES.map(city => (
          <button
            key={city.name}
            onClick={() => onSelectLocation?.(city.name, city.lat, city.lng)}
            className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-all ${
              selectedLocationName?.includes(city.name.split(" ")[0])
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-slate-500 hover:text-slate-300 border border-transparent"
            }`}
          >
            {city.name.split(" ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
