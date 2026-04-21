"use client";

import { useEffect, useState } from "react";

interface Tilt {
  x: number; // -1..1
  y: number; // -1..1
}

export function useTilt(maxAngle = 25): Tilt {
  const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0; // left/right
      const beta = e.beta ?? 0; // front/back
      const x = Math.max(-1, Math.min(1, gamma / maxAngle));
      const y = Math.max(-1, Math.min(1, (beta - 20) / maxAngle));
      setTilt({ x, y });
    };

    const onMouse = (e: MouseEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      setTilt({
        x: (e.clientX / w) * 2 - 1,
        y: (e.clientY / h) * 2 - 1,
      });
    };

    const hasOrientation =
      typeof DeviceOrientationEvent !== "undefined" &&
      "ontouchstart" in window;

    if (hasOrientation) {
      window.addEventListener("deviceorientation", onOrientation);
    } else {
      window.addEventListener("mousemove", onMouse, { passive: true });
    }
    return () => {
      if (hasOrientation) {
        window.removeEventListener("deviceorientation", onOrientation);
      } else {
        window.removeEventListener("mousemove", onMouse);
      }
    };
  }, [maxAngle]);

  return tilt;
}
