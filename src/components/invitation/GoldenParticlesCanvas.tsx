import React, { useEffect, useRef } from "react";

type ElementKind = "petal" | "star" | "bokeh";

interface LuxuryParticle {
  kind: ElementKind;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  swayPhase: number;
  swaySpeed: number;
  alpha: number;
  alphaDelta: number;
  color: string;
}

const PETAL_COLORS = [
  "rgba(244, 178, 196, 0.72)",
  "rgba(232, 141, 165, 0.62)",
  "rgba(250, 214, 224, 0.78)",
  "rgba(247, 230, 196, 0.68)",
];

const GOLD_STAR_COLORS = [
  "#d4af37",
  "#cfa439",
  "#f4dc9b",
  "#e28299",
];

const BOKEH_COLORS = [
  "212, 175, 55",
  "226, 130, 153",
  "255, 248, 231",
];

export const GoldenParticlesCanvas: React.FC<{ count?: number }> = ({ count = 42 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 680);

    let pointerX = -9999;
    let pointerY = -9999;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    const particles: LuxuryParticle[] = Array.from({ length: count }, (_, idx) => {
      const kind: ElementKind =
        idx % 3 === 0 ? "petal" : idx % 3 === 1 ? "star" : "bokeh";

      return {
        kind,
        x: Math.random() * width,
        y: Math.random() * height,
        size:
          kind === "petal"
            ? Math.random() * 7 + 5.5
            : kind === "star"
              ? Math.random() * 5.5 + 3.5
              : Math.random() * 14 + 6,
        vx: (Math.random() - 0.5) * 0.35,
        vy:
          kind === "petal"
            ? Math.random() * 0.45 + 0.22 // petals drift gently downward
            : -Math.random() * 0.32 - 0.1, // stars & bokeh float upward
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.018,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.008,
        alpha: Math.random() * 0.55 + 0.3,
        alphaDelta: (Math.random() * 0.007 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        color:
          kind === "petal"
            ? (PETAL_COLORS[idx % PETAL_COLORS.length] ?? "rgba(244, 178, 196, 0.72)")
            : kind === "star"
              ? (GOLD_STAR_COLORS[idx % GOLD_STAR_COLORS.length] ?? "#d4af37")
              : (BOKEH_COLORS[idx % BOKEH_COLORS.length] ?? "212, 175, 55"),
      };
    });

    const drawPetal = (p: LuxuryParticle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const scaleY = 0.65 + 0.35 * Math.sin(p.swayPhase);
      ctx.scale(1, scaleY);
      ctx.globalAlpha = p.alpha;

      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(
        p.size * 0.95,
        -p.size * 0.6,
        p.size * 0.85,
        p.size * 0.75,
        0,
        p.size
      );
      ctx.bezierCurveTo(
        -p.size * 0.85,
        p.size * 0.75,
        -p.size * 0.95,
        -p.size * 0.6,
        0,
        -p.size
      );
      ctx.fillStyle = p.color;
      ctx.fill();

      ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    };

    const drawFourPointStar = (p: LuxuryParticle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle * 0.5);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      const s = p.size;
      const inner = s * 0.26;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(inner, -inner, s, 0);
      ctx.quadraticCurveTo(inner, inner, 0, s);
      ctx.quadraticCurveTo(-inner, inner, -s, 0);
      ctx.quadraticCurveTo(-inner, -inner, 0, -s);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawBokeh = (p: LuxuryParticle) => {
      ctx.save();
      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, `rgba(${p.color}, ${p.alpha * 0.55})`);
      grad.addColorStop(0.5, `rgba(${p.color}, ${p.alpha * 0.22})`);
      grad.addColorStop(1, `rgba(${p.color}, 0)`);
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (!prefersReducedMotion) {
          p.swayPhase += p.swaySpeed;
          p.angle += p.spin;
          p.x += p.vx + Math.sin(p.swayPhase) * 0.28;
          p.y += p.vy;
          p.alpha += p.alphaDelta;

          // Subtle interactive breeze away from cursor
          const dx = p.x - pointerX;
          const dy = p.y - pointerY;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14000 && distSq > 1) {
            const dist = Math.sqrt(distSq);
            p.x += (dx / dist) * 0.85;
            p.y += (dy / dist) * 0.85;
          }

          if (p.alpha <= 0.2 || p.alpha >= 0.92) {
            p.alphaDelta = -p.alphaDelta;
          }

          if (p.kind === "petal") {
            if (p.y > height + 20) {
              p.y = -20;
              p.x = Math.random() * width;
            }
          } else {
            if (p.y < -20) {
              p.y = height + 20;
              p.x = Math.random() * width;
            }
          }
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
        }

        if (p.kind === "petal") {
          drawPetal(p);
        } else if (p.kind === "star") {
          drawFourPointStar(p);
        } else {
          drawBokeh(p);
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};
