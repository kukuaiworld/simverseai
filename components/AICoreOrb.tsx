"use client";

import React, { useRef, useEffect } from "react";

interface AICoreOrbProps {
  isThinking?: boolean;
}

export default function AICoreOrb({ isThinking = false }: AICoreOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    const size = (canvas.width = canvas.height = 140);

    interface OrbParticle {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      color: string;
    }

    const particles: OrbParticle[] = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 35 + Math.random() * 25,
        speed: 0.02 + Math.random() * 0.03,
        size: 1 + Math.random() * 2,
        color: Math.random() > 0.5 ? "rgba(6, 182, 212, 0.7)" : "rgba(139, 92, 246, 0.7)"
      });
    }

    let pulseVal = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;

      const currentPulseRate = isThinking ? 0.08 : 0.03;
      pulseVal = (pulseVal + currentPulseRate) % (Math.PI * 2);
      const pulseMultiplier = 1 + Math.sin(pulseVal) * (isThinking ? 0.15 : 0.06);

      // 1. Atmosphere backglow
      const glowGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 55 * pulseMultiplier);
      glowGrad.addColorStop(0, "rgba(6, 182, 212, 0.35)");
      glowGrad.addColorStop(0.4, "rgba(139, 92, 246, 0.15)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 60 * pulseMultiplier, 0, Math.PI * 2);
      ctx.fill();

      // 2. Translucent glowing core sphere
      const coreGrad = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, 22 * pulseMultiplier);
      coreGrad.addColorStop(0, "#ffffff");
      coreGrad.addColorStop(0.2, "#6366f1");
      coreGrad.addColorStop(0.8, "#a855f7");
      coreGrad.addColorStop(1, "rgba(224, 231, 255, 0.85)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 24 * pulseMultiplier, 0, Math.PI * 2);
      ctx.fill();

      // Atmosphere border ring
      ctx.strokeStyle = isThinking ? "rgba(6, 182, 212, 0.45)" : "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 24 * pulseMultiplier, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Orbiting FUI particle ring
      particles.forEach(p => {
        const orbitSpeed = isThinking ? p.speed * 2.5 : p.speed;
        p.angle = (p.angle + orbitSpeed) % (Math.PI * 2);
        
        // Calculate coordinate offsets
        const px = cx + Math.cos(p.angle) * p.radius * pulseMultiplier;
        const py = cy + Math.sin(p.angle) * p.radius * 0.4 * pulseMultiplier;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect orbiting nodes to center core during thinking state
        if (isThinking && Math.random() > 0.82) {
          ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(cx, cy);
          ctx.stroke();
        }
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrameId);
  }, [isThinking]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Wave glow wrapper rings */}
      <div className={`absolute w-36 h-36 rounded-full border border-cyan-500/10 pointer-events-none transition-all duration-1000 ${
        isThinking ? "animate-ping opacity-60 scale-110" : "scale-100 opacity-20"
      }`} />
      <canvas ref={canvasRef} className="block relative z-10" />
    </div>
  );
}
