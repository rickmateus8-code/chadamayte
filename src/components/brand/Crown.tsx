import React from "react";

export interface CrownProps {
  size?: number | string;
  className?: string;
  color?: string;
  accentColor?: string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
}

/**
 * Crown — Assinatura vetorial da Pequena Princesa Maytê
 * Design delicado com picos graciosos, pérolas superiores e base detalhada.
 */
export const Crown: React.FC<CrownProps> = ({
  size = 40,
  className = "",
  color = "var(--color-gold)",
  accentColor = "var(--color-gold-soft)",
  style,
  "aria-hidden": ariaHidden = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      aria-hidden={ariaHidden}
    >
      <defs>
        <linearGradient id="mayteCrownGradient" x1="8" y1="12" x2="56" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor="var(--color-gold-deep)" />
        </linearGradient>
        <radialGradient id="pearlGlow" cx="0.5" cy="0.5" r="0.5" fx="0.3" fy="0.3">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor={accentColor} />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>

      {/* Pérolas / Joias dos 5 Picos */}
      <circle cx="8" cy="24" r="3" fill="url(#pearlGlow)" />
      <circle cx="20" cy="17" r="3" fill="url(#pearlGlow)" />
      <circle cx="32" cy="11" r="3.8" fill="url(#pearlGlow)" />
      <circle cx="44" cy="17" r="3" fill="url(#pearlGlow)" />
      <circle cx="56" cy="24" r="3" fill="url(#pearlGlow)" />

      {/* Corpo da Coroa com Arcos Suaves */}
      <path
        d="M8 27 L14 43 Q32 46 50 43 L56 27 L44 20 L32 30 L20 20 Z"
        fill="url(#mayteCrownGradient)"
        fillOpacity="0.88"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Faixa Base com Curvatura Elegante */}
      <path
        d="M13 44 Q32 48 51 44 L51 49 Q32 53 13 49 Z"
        fill="url(#mayteCrownGradient)"
        stroke="var(--color-gold-deep)"
        strokeWidth="1"
      />

      {/* Detalhes de Pedras Preciosas na Base */}
      <circle cx="22" cy="46.5" r="1.5" fill="#ffffff" fillOpacity="0.9" />
      <circle cx="32" cy="48" r="1.8" fill="#ffffff" fillOpacity="0.9" />
      <circle cx="42" cy="46.5" r="1.5" fill="#ffffff" fillOpacity="0.9" />
    </svg>
  );
};