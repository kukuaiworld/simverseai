"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sliders, HelpCircle, Activity } from "lucide-react";

interface MiniSmartCity3DProps {
  locationName?: string;
  weatherCondition?: string;
  aqiLevel?: number;
  rainfall?: number;
}

export default function MiniSmartCity3D({ locationName, weatherCondition, aqiLevel = 45, rainfall = 0 }: MiniSmartCity3DProps) {
  const [tilt, setTilt] = useState({ x: 55, z: 45 });
  const [isRotating, setIsRotating] = useState(false);
  const startDrag = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Drag listener to rotate the isometric 3D city scene
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsRotating(true);
    startDrag.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isRotating) return;
    const dx = e.clientX - startDrag.current.x;
    const dy = e.clientY - startDrag.current.y;
    setTilt(prev => ({
      x: Math.max(30, Math.min(80, prev.x - dy * 0.4)),
      z: prev.z + dx * 0.4
    }));
    startDrag.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsRotating(false);

  // Render weather / traffic overlays on 2D base canvas overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    const width = (canvas.width = 400);
    const height = (canvas.height = 400);

    // Weather Particles (Rain / Storm)
    interface RainDrop {
      x: number;
      y: number;
      len: number;
      speed: number;
    }

    const rainDrops: RainDrop[] = [];
    if (rainfall > 0 || weatherCondition?.toLowerCase().includes("rain")) {
      for (let i = 0; i < 40; i++) {
        rainDrops.push({
          x: Math.random() * width,
          y: Math.random() * height - height,
          len: 12 + Math.random() * 8,
          speed: 6 + Math.random() * 5
        });
      }
    }

    // Traffic vehicle nodes traversing the diagonal street lines
    interface Vehicle {
      progress: number;
      speed: number;
      color: string;
      lane: number;
    }

    const vehicles: Vehicle[] = [];
    for (let i = 0; i < 8; i++) {
      vehicles.push({
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        color: Math.random() > 0.5 ? "#06b6d4" : "#10b981",
        lane: Math.floor(Math.random() * 3)
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Grid Streets background overlay
      ctx.strokeStyle = "rgba(6, 182, 212, 0.04)";
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 25) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Draw active main highway grids
      ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
      ctx.lineWidth = 2.5;
      
      // Highway A (Horizontal diagonal)
      ctx.beginPath();
      ctx.moveTo(50, 100);
      ctx.lineTo(350, 100);
      ctx.stroke();

      // Highway B (Vertical diagonal)
      ctx.beginPath();
      ctx.moveTo(200, 50);
      ctx.lineTo(200, 350);
      ctx.stroke();

      // Animate Vehicles on the highways
      vehicles.forEach(v => {
        v.progress = (v.progress + v.speed) % 1.0;
        ctx.fillStyle = v.color;
        ctx.shadowColor = v.color;
        ctx.shadowBlur = 6;

        if (v.lane === 0) {
          // Highway A
          const vx = 50 + v.progress * 300;
          ctx.fillRect(vx, 98, 4, 4);
        } else if (v.lane === 1) {
          // Highway B
          const vy = 50 + v.progress * 300;
          ctx.fillRect(198, vy, 4, 4);
        } else {
          // Inner Loop
          const angle = v.progress * Math.PI * 2;
          const cx = 200 + Math.cos(angle) * 70;
          const cy = 200 + Math.sin(angle) * 70;
          ctx.fillRect(cx - 2, cy - 2, 4, 4);
        }
        ctx.shadowBlur = 0;
      });

      // Animate dynamic rain particles
      if (rainDrops.length > 0) {
        ctx.strokeStyle = "rgba(6, 182, 212, 0.45)";
        ctx.lineWidth = 1;
        rainDrops.forEach(drop => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x, drop.y + drop.len);
          ctx.stroke();

          drop.y += drop.speed;
          if (drop.y > height) {
            drop.y = -drop.len;
            drop.x = Math.random() * width;
          }
        });
      }

      // Draw Pollution atmospheric cloud (translucent drifting radial mist)
      if (aqiLevel > 80) {
        const cloudGrad = ctx.createRadialGradient(200, 200, 20, 200, 200, 160);
        const intensity = Math.min(0.35, (aqiLevel - 50) * 0.002);
        cloudGrad.addColorStop(0, `rgba(245, 158, 11, ${intensity})`);
        cloudGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.arc(200, 200, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw dynamic flood zones overlay
      if (rainfall > 10) {
        ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
        ctx.beginPath();
        ctx.arc(200, 200, 90 + Math.sin(Date.now() * 0.002) * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animFrameId);
  }, [weatherCondition, aqiLevel, rainfall]);

  return (
    <div 
      className="relative w-full h-[400px] bg-slate-950/20 border border-slate-900 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3D scene controls watermark */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-slate-500 leading-normal pointer-events-none">
        <div>SECTOR CORE: {locationName || "Ajmer Junction"}</div>
        <div>VIEWPORT TILT: {tilt.x.toFixed(0)}° / ROTATE: {tilt.z.toFixed(0)}°</div>
        <div>COMPLIANCE GUIDELINES: MoRTH & CPCB ACTIVE</div>
      </div>

      {/* 3D Perspective CSS Container */}
      <div 
        className="w-full h-full flex items-center justify-center pointer-events-none"
        style={{
          perspective: "600px",
          perspectiveOrigin: "50% 50%"
        }}
      >
        {/* Isometric Rotatable Base Grid */}
        <div 
          className="relative w-[300px] h-[300px] transition-transform duration-75 ease-out"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateZ(${tilt.z}deg)`,
            transformStyle: "preserve-3d"
          }}
        >
          {/* Base Grid surface */}
          <div className="absolute inset-0 bg-slate-950/90 border border-cyan-500/20 rounded shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <canvas ref={canvasRef} className="w-full h-full block rounded opacity-80" />
          </div>

          {/* 3D Building Prisms Grid */}
          
          {/* Building 1 (Center Power Substation - Emerald Green) */}
          <div 
            className="absolute"
            style={{
              left: "135px",
              top: "135px",
              width: "30px",
              height: "30px",
              transform: "translateZ(0px)",
              transformStyle: "preserve-3d"
            }}
          >
            <BuildingPrism height={60} color="rgba(16, 185, 129, 0.4)" strokeColor="#10b981" />
          </div>

          {/* Building 2 (Hospital/Medical Center - Blue) */}
          <div 
            className="absolute"
            style={{
              left: "60px",
              top: "70px",
              width: "35px",
              height: "35px",
              transform: "translateZ(0px)",
              transformStyle: "preserve-3d"
            }}
          >
            <BuildingPrism height={45} color="rgba(59, 130, 246, 0.4)" strokeColor="#3b82f6" />
          </div>

          {/* Building 3 (Govt Command Center - Cyan) */}
          <div 
            className="absolute"
            style={{
              left: "200px",
              top: "70px",
              width: "40px",
              height: "40px",
              transform: "translateZ(0px)",
              transformStyle: "preserve-3d"
            }}
          >
            <BuildingPrism height={80} color="rgba(6, 182, 212, 0.4)" strokeColor="#06b6d4" />
          </div>

          {/* Building 4 (Residential Complexes - Purple) */}
          <div 
            className="absolute"
            style={{
              left: "70px",
              top: "200px",
              width: "30px",
              height: "30px",
              transform: "translateZ(0px)",
              transformStyle: "preserve-3d"
            }}
          >
            <BuildingPrism height={50} color="rgba(139, 92, 246, 0.35)" strokeColor="#8b5cf6" />
          </div>

          {/* Building 5 (Schools/Academic Zone - Magenta) */}
          <div 
            className="absolute"
            style={{
              left: "210px",
              top: "210px",
              width: "30px",
              height: "30px",
              transform: "translateZ(0px)",
              transformStyle: "preserve-3d"
            }}
          >
            <BuildingPrism height={40} color="rgba(236, 72, 153, 0.35)" strokeColor="#ec4899" />
          </div>
          
        </div>
      </div>

      {/* Legend Map Indicators */}
      <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-slate-950/90 border border-slate-900 p-2 rounded-lg text-[8px] font-mono leading-none">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span>POWER</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
          <span>HOSPITALS</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />
          <span>GOVT GRID</span>
        </div>
      </div>
    </div>
  );
}

// 3D CSS Building face renderer helper
interface BuildingPrismProps {
  height: number;
  color: string;
  strokeColor: string;
}

function BuildingPrism({ height, color, strokeColor }: BuildingPrismProps) {
  return (
    <div 
      className="absolute inset-0"
      style={{
        transformStyle: "preserve-3d",
        width: "100%",
        height: "100%"
      }}
    >
      {/* Front Face */}
      <div 
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: `${height}px`,
          backgroundColor: color,
          border: `1px solid ${strokeColor}`,
          transform: `rotateX(-90deg) translateZ(0px)`,
          transformOrigin: "bottom center"
        }}
      />
      {/* Back Face */}
      <div 
        className="absolute top-0 left-0 w-full"
        style={{
          height: `${height}px`,
          backgroundColor: color,
          border: `1px solid ${strokeColor}`,
          transform: `rotateX(90deg) translateZ(0px)`,
          transformOrigin: "top center"
        }}
      />
      {/* Left Face */}
      <div 
        className="absolute top-0 left-0 h-full"
        style={{
          width: `${height}px`,
          backgroundColor: color,
          border: `1px solid ${strokeColor}`,
          transform: `rotateY(-90deg) translateZ(0px)`,
          transformOrigin: "center left"
        }}
      />
      {/* Right Face */}
      <div 
        className="absolute top-0 right-0 h-full"
        style={{
          width: `${height}px`,
          backgroundColor: color,
          border: `1px solid ${strokeColor}`,
          transform: `rotateY(90deg) translateZ(0px)`,
          transformOrigin: "center right"
        }}
      />
      {/* Top Face */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: color,
          border: `1px solid ${strokeColor}`,
          transform: `translateZ(${height}px)`
        }}
      />
    </div>
  );
}
