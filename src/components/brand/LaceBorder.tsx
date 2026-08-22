import React from "react";

export interface LaceBorderProps {
  className?: string;
  style?: React.CSSProperties;
}

export const LaceBorder: React.FC<LaceBorderProps> = ({ className = "", style }) => {
  return (
    <div
      className={`lace-border-bar ${className}`}
      style={{
        width: "100%",
        overflow: "hidden",
        lineHeight: 0,
        ...style,
      }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="36"
        viewBox="0 0 600 36"
        preserveAspectRatio="repeat-x"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="laceRepeat" width="60" height="36" patternUnits="userSpaceOnUse">
            {/* Linha Superior Dupla */}
            <line x1="0" y1="4" x2="60" y2="4" stroke="var(--color-gold)" strokeWidth="1" />
            <line x1="0" y1="8" x2="60" y2="8" stroke="var(--color-pink-soft)" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Arabescos e Flores da Renda */}
            <path
              d="M0 24 Q15 12 30 24 Q45 12 60 24"
              stroke="var(--color-pink)"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M15 20 Q30 32 45 20"
              stroke="var(--color-gold)"
              strokeWidth="1"
              fill="none"
            />
            <circle cx="30" cy="18" r="2.5" fill="var(--color-pink-deep)" />
            <circle cx="15" cy="20" r="1.5" fill="var(--color-gold)" />
            <circle cx="45" cy="20" r="1.5" fill="var(--color-gold)" />

            {/* Pequenos Picos Inferiores com Pontilhado */}
            <circle cx="0" cy="24" r="1.8" fill="var(--color-pink-soft)" />
            <circle cx="30" cy="30" r="2" fill="var(--color-gold)" />
            <circle cx="60" cy="24" r="1.8" fill="var(--color-pink-soft)" />
          </pattern>
        </defs>
        <rect width="100%" height="36" fill="url(#laceRepeat)" />
      </svg>
    </div>
  );
};