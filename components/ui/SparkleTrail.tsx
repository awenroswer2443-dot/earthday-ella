"use client";

import { useEffect, useRef } from "react";

interface Sparkle {
  x: number;
  y: number;
  size: number;
  life: number;
  hue: number;
  vy: number;
  vx: number;
}

/**
 * Cursor + touch sparkle trail rendered on a full-screen canvas.
 * Lightweight: caps sparkle count, runs rAF only when active.
 */
export default function SparkleTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth * devicePixelRatio);
    let height = (canvas.height = window.innerHeight * devicePixelRatio);
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const sparkles: Sparkle[] = [];
    const maxSparkles = 120;
    let rafId = 0;
    let lastX = 0;
    let lastY = 0;
    let needsFrame = true;

    const resize = () => {
      width = canvas.width = window.innerWidth * devicePixelRatio;
      height = canvas.height = window.innerHeight * devicePixelRatio;
    };

    const spawn = (x: number, y: number, n = 2) => {
      for (let i = 0; i < n; i++) {
        if (sparkles.length >= maxSparkles) sparkles.shift();
        sparkles.push({
          x: x * devicePixelRatio + (Math.random() - 0.5) * 10,
          y: y * devicePixelRatio + (Math.random() - 0.5) * 10,
          size: 2 + Math.random() * 4,
          life: 1,
          hue: 330 + Math.random() * 40 - 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -0.5 - Math.random() * 1.5,
        });
      }
      needsFrame = true;
    };

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (dx * dx + dy * dy > 6) {
        spawn(e.clientX, e.clientY, 2);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const onTouch = (e: TouchEvent) => {
      for (const t of Array.from(e.touches)) spawn(t.clientX, t.clientY, 3);
    };

    const onClick = (e: MouseEvent) => spawn(e.clientX, e.clientY, 10);

    const render = () => {
      if (!sparkles.length) {
        needsFrame = false;
        rafId = requestAnimationFrame(render);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.life -= 0.025;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.03;
        if (s.life <= 0) {
          sparkles.splice(i, 1);
          continue;
        }
        const r = s.size * s.life;
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 4);
        grad.addColorStop(0, `hsla(${s.hue}, 90%, 80%, ${s.life})`);
        grad.addColorStop(1, `hsla(${s.hue}, 90%, 80%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `hsla(${s.hue}, 100%, 90%, ${s.life})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("resize", resize);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
      // quiet the unused flag
      void needsFrame;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden
    />
  );
}
