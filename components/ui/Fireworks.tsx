"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  trail: { x: number; y: number }[];
}

interface Rocket {
  x: number;
  y: number;
  vy: number;
  burstY: number;
  color: string;
}

const palette = [
  "#ff5288",
  "#ff7aa0",
  "#ffd35c",
  "#a77dff",
  "#ffae82",
  "#55aad4",
];

export default function Fireworks({
  active = true,
  density = 1,
}: {
  active?: boolean;
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const rockets: Rocket[] = [];
    const particles: Particle[] = [];
    let lastLaunch = 0;
    let raf = 0;

    const launch = () => {
      const x = canvas.width * (0.15 + Math.random() * 0.7);
      rockets.push({
        x,
        y: canvas.height + 10,
        vy: -(10 + Math.random() * 6) * dpr,
        burstY: canvas.height * (0.18 + Math.random() * 0.35),
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    };

    const burst = (x: number, y: number, color: string) => {
      const n = 50 + Math.floor(Math.random() * 25);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = (2 + Math.random() * 5) * dpr;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          color: Math.random() < 0.3
            ? palette[Math.floor(Math.random() * palette.length)]
            : color,
          trail: [],
        });
      }
    };

    const render = (t: number) => {
      // subtle fade instead of full clear for trails
      ctx.fillStyle = "rgba(255, 228, 236, 0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (t - lastLaunch > 900 / density) {
        launch();
        lastLaunch = t;
      }

      // rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy += 0.08 * dpr;
        // sparkle trail
        ctx.fillStyle = r.color;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2 * dpr, 0, Math.PI * 2);
        ctx.fill();
        if (r.y <= r.burstY) {
          burst(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // particles
      ctx.globalAlpha = 1;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04 * dpr;
        p.vx *= 0.995;
        p.life -= 0.012;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 * dpr, 0, Math.PI * 2);
        ctx.fill();
        // glow
        ctx.globalAlpha = Math.max(0, p.life) * 0.35;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active, density]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[40]"
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}
