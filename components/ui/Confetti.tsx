"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  size: number;
  color: string;
  shape: "heart" | "rect" | "circle" | "star";
  life: number;
}

const palette = [
  "#ff7aa0",
  "#ffc6d7",
  "#ffd35c",
  "#a77dff",
  "#ffae82",
  "#fff0f5",
  "#ff5288",
];

interface Props {
  fire?: number; // increment to trigger a burst
  continuous?: boolean;
  intensity?: number;
}

export default function Confetti({
  fire = 0,
  continuous = false,
  intensity = 1,
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(devicePixelRatio, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const shapes: Particle["shape"][] = ["heart", "rect", "circle", "star"];

    const burst = (count: number) => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 8 + Math.random() * 18;
        particles.push({
          x: cx + (Math.random() - 0.5) * 100 * dpr,
          y: cy + (Math.random() - 0.5) * 60 * dpr,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 6,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.4,
          size: (5 + Math.random() * 10) * dpr,
          color: palette[Math.floor(Math.random() * palette.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          life: 1,
        });
      }
    };

    const drift = () => {
      // continuous gentle rain from top
      const n = Math.floor(2 * intensity);
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * 2,
          vy: 2 + Math.random() * 3,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.15,
          size: (5 + Math.random() * 8) * dpr,
          color: palette[Math.floor(Math.random() * palette.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          life: 1,
        });
      }
    };

    if (fire > 0) burst(Math.floor(140 * intensity));

    let rafId = 0;
    let paused = document.hidden;
    const onVisibility = () => {
      paused = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const render = () => {
      if (paused) {
        rafId = requestAnimationFrame(render);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (continuous) drift();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.3;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        p.life -= 0.005;
        if (p.y > canvas.height + 40 || p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        switch (p.shape) {
          case "rect":
            ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size / 1.6);
            break;
          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "heart": {
            const s = p.size / 20;
            ctx.beginPath();
            ctx.moveTo(0, 6 * s);
            ctx.bezierCurveTo(-12 * s, -4 * s, -8 * s, -16 * s, 0, -8 * s);
            ctx.bezierCurveTo(8 * s, -16 * s, 12 * s, -4 * s, 0, 6 * s);
            ctx.fill();
            break;
          }
          case "star": {
            const s = p.size / 2;
            ctx.beginPath();
            for (let k = 0; k < 5; k++) {
              const ang = (k / 5) * Math.PI * 2 - Math.PI / 2;
              ctx.lineTo(Math.cos(ang) * s, Math.sin(ang) * s);
              const inAng = ang + Math.PI / 5;
              ctx.lineTo(Math.cos(inAng) * s * 0.45, Math.sin(inAng) * s * 0.45);
            }
            ctx.closePath();
            ctx.fill();
            break;
          }
        }
        ctx.restore();
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fire, continuous, intensity]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[55]"
      aria-hidden
    />
  );
}
