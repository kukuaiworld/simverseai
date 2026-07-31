"use client";

import React, { useState, useEffect, useRef } from "react";

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogo, setShowLogo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const BOOT_LOGS = [
    "SIMVERSE OS v4.0.2 - INITIALIZING SECURE KERNEL...",
    "CONNECTING TO GEOSPATIAL INTELLIGENCE ORBITAL GRID...",
    "LOADING COPERNICUS & OPEN-METEO WEATHER API AGENTS...",
    "ESTABLISHING CPCB AIR QUALITY TELEMETRY CORRIDORS...",
    "COMPILING NDMA MONSOON & CATCHMENT PREDICTION MODELS...",
    "SYNCHRONIZING MORTH ROAD SPEED INFRASTRUCTURE CODES...",
    "ACTIVATING 15-FACTOR MULTI-AGENT DECISION MATRIX...",
    "NEURAL DECIPHER ORB ONLINE [CERTAINTY INDEX VERIFIED]...",
    "SIMVERSE AI SYSTEM OPERATIONAL - SECURE ACCESS GRANTED."
  ];

  useEffect(() => {
    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < BOOT_LOGS.length) {
        setLogs(prev => [...prev, BOOT_LOGS[logIdx]]);
        logIdx++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => setShowLogo(true), 400);
      }
    }, 380);

    return () => clearInterval(logInterval);
  }, []);

  // Architectural Blueprint Logo Plotter Animation
  useEffect(() => {
    if (!showLogo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = 460);
    let height = (canvas.height = 140);

    interface Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      alpha: number;
      phase: number;
    }

    const particles: Particle[] = [];
    const logoText = "SIMVERSE AI";

    ctx.font = "bold 44px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText(logoText, width / 2, height / 2);

    const imgData = ctx.getImageData(0, 0, width, height);
    ctx.clearRect(0, 0, width, height);

    // Filter pixels to build vector plotting nodes
    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const idx = (y * width + x) * 4;
        if (imgData.data[idx + 3] > 128) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            targetX: x,
            targetY: y,
            vx: 0,
            vy: 0,
            alpha: 0,
            phase: Math.random() * Math.PI * 2
          });
        }
      }
    }

    let animationFrameId: number;
    let progress = 0;
    let compassAngle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // 1. Draw Architectural Grid base
      ctx.strokeStyle = "rgba(99, 102, 241, 0.05)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      let finished = true;
      let leadingParticle = particles[0];
      let minDistance = Infinity;

      // 2. Plotting nodes animation
      particles.forEach(p => {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0.4) {
          finished = false;
          // Slowly accelerate drawing nodes toward targeted vector positions
          p.vx = dx * 0.06;
          p.vy = dy * 0.06;
          p.x += p.vx;
          p.y += p.vy;
          
          if (dist < minDistance) {
            minDistance = dist;
            leadingParticle = p;
          }
        } else {
          p.x = p.targetX;
          p.y = p.targetY;
        }

        if (p.alpha < 1) p.alpha += 0.03;

        // Draw node points as blueprint blue ink points
        ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha * 0.85})`;
        ctx.fillRect(p.x, p.y, 1.8, 1.8);
      });

      // 3. Draw Architectural Blueprint construction guides & compass
      if (leadingParticle && !finished) {
        compassAngle += 0.15;
        const lx = leadingParticle.x;
        const ly = leadingParticle.y;

        // Draw horizontal/vertical infinite constructor guide lines
        ctx.strokeStyle = "rgba(99, 102, 241, 0.12)";
        ctx.setLineDash([2, 4]);
        ctx.lineWidth = 0.8;
        
        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(width, ly);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Compass Circle around the drawing tip
        ctx.strokeStyle = "rgba(99, 102, 241, 0.25)";
        ctx.beginPath();
        ctx.arc(lx, ly, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Draw tangent compass angle line
        ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx + Math.cos(compassAngle) * 16, ly + Math.sin(compassAngle) * 16);
        ctx.stroke();

        // Label blueprint dimension tags
        ctx.fillStyle = "rgba(99, 102, 241, 0.6)";
        ctx.font = "7px monospace";
        ctx.fillText(`X:${lx.toFixed(1)} Y:${ly.toFixed(1)}`, lx + 22, ly - 6);
        ctx.fillText(`R:16.0mm`, lx + 22, ly + 6);
      }

      if (finished) {
        progress++;
        // Fade in outer design frame when logo assembly is completed
        ctx.strokeStyle = "rgba(99, 102, 241, 0.3)";
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, width - 20, height - 20);

        ctx.fillStyle = "rgba(99, 102, 241, 0.02)";
        ctx.fillRect(10, 10, width - 20, height - 20);

        if (progress > 50) {
          setFadeOut(true);
          setTimeout(onComplete, 1000);
          return;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [showLogo]);

  return (
    <div className={`fixed inset-0 z-50 bg-[#f5f7fa] flex flex-col items-center justify-center font-mono p-6 transition-opacity duration-1000 ${
      fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
    }`}>
      {/* Light soft blueprint grid pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:120px_120px] pointer-events-none" />

      {/* Professional architectural glass panel */}
      <div className="w-full max-w-2xl bg-white/70 border border-slate-200/60 rounded-2xl p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
        
        {/* Architectural Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-bold tracking-wider">PROJECT Sentinel TWIN ARCHITECTURE INITIALIZATION</span>
          </div>
          <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100/50">PLOTTER ACTIVE</span>
        </div>

        {/* Boot Terminal Logs */}
        <div className="space-y-2 h-44 overflow-y-auto text-[10px] text-slate-500/90 leading-relaxed scrollbar-none font-mono">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-indigo-400 font-semibold select-none">&gt;&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* Logo Assembly Container */}
        {showLogo && (
          <div className="mt-6 flex flex-col items-center justify-center border-t border-slate-100 pt-6 animate-fade-in">
            <canvas ref={canvasRef} className="max-w-full" />
            <span className="text-[10px] text-indigo-400 tracking-[0.4em] uppercase mt-4 animate-pulse font-bold">
              Rendering Smart Grid Layouts
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
