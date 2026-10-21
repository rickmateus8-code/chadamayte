import React, { useEffect, useRef } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: "circle" | "rect";
}

const CONFETTI_COLORS = [
  "#d4af37", // Royal Gold
  "#cfa439", // Champagne Gold
  "#f7ebd0", // Light Gold Foil
  "#e28299", // Blush Rose
  "#f7d5de", // Soft Pink
  "#ffffff", // Pearl White
];

export const ConfettiBurst: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: ConfettiPiece[] = Array.from({ length: 85 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      return {
        x: canvas.width / 2 + (Math.random() - 0.5) * 180,
        y: canvas.height * 0.45 + (Math.random() - 0.5) * 80,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        size: Math.random() * 8 + 5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ?? "#d4af37",
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 11,
        shape: Math.random() > 0.4 ? "rect" : "circle",
      };
    });

    let frameId: number;
    let opacity = 1;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      opacity -= 0.007;

      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, opacity);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (opacity > 0) {
        frameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
};
