import React from "react";

export interface FloralDividerProps {
  className?: string;
  style?: React.CSSProperties;
}

export const FloralDivider: React.FC<FloralDividerProps> = ({ className = "", style }) => {
  return (
    <div
      className={`floral-divider ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        width: "100%",
        maxWidth: "320px",
        margin: "var(--space-xl) auto",
        ...style,
      }}
      role="separator"
      aria-hidden="true"
    >
      <svg width="100%" height="24" viewBox="0 0 280 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Linha Esquerda com Arabesco */}
        <path d="M10 12 H100 Q112 12 118 8 Q124 4 128 4" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="20" cy="12" r="1.5" fill="var(--color-gold)" />
        <circle cx="45" cy="12" r="2" fill="var(--color-pink)" />
        
        {/* Florzinha Central com Pétalas Rosadas e Miolo Dourado */}
        <g transform="translate(140, 12)">
          {/* Folhinhas verdes suaves */}
          <path d="M-10 -2 Q-14 -7 -8 -9 Q-4 -7 -6 -3" fill="#a8bfa9" opacity="0.8" />
          <path d="M10 -2 Q14 -7 8 -9 Q4 -7 6 -3" fill="#a8bfa9" opacity="0.8" />
          
          {/* Pétalas Rosas */}
          <circle cx="-5" cy="0" r="4.5" fill="#f4b5c4" />
          <circle cx="5" cy="0" r="4.5" fill="#f4b5c4" />
          <circle cx="0" cy="-5" r="4.5" fill="#f8c3cf" />
          <circle cx="0" cy="5" r="4.5" fill="#f09fb2" />
          <circle cx="0" cy="0" r="5" fill="#d9748b" />
          {/* Miolo Dourado */}
          <circle cx="0" cy="0" r="2.2" fill="#d4af37" />
        </g>

        {/* Linha Direita com Arabesco */}
        <path d="M270 12 H180 Q168 12 162 8 Q156 4 152 4" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="260" cy="12" r="1.5" fill="var(--color-gold)" />
        <circle cx="235" cy="12" r="2" fill="var(--color-pink)" />
      </svg>
    </div>
  );
};