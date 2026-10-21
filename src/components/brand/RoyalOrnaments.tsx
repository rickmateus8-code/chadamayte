import React from "react";

export const RoyalCornerFiligree: React.FC<{
  position: "tl" | "tr" | "bl" | "br";
  size?: number;
}> = ({ position, size = 68 }) => {
  const rotationMap = {
    tl: "rotate(0deg)",
    tr: "scaleX(-1)",
    bl: "scaleY(-1)",
    br: "scale(-1, -1)",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`royal-filigree-corner royal-filigree-${position}`}
      style={{ transform: rotationMap[position] }}
    >
      <defs>
        <linearGradient id={`goldGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5e1a4" />
          <stop offset="35%" stopColor="#d4af37" />
          <stop offset="70%" stopColor="#b58922" />
          <stop offset="100%" stopColor="#8c671b" />
        </linearGradient>
      </defs>
      {/* Outer regal corner frame */}
      <path
        d="M4 94V22C4 12.0589 12.0589 4 22 4H94"
        stroke={`url(#goldGrad-${position})`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M10 82V26C10 17.1634 17.1634 10 26 10H82"
        stroke={`url(#goldGrad-${position})`}
        strokeWidth="1.2"
        strokeDasharray="3 3"
        strokeLinecap="round"
      />
      {/* Ornamental Arabesque Scrollwork */}
      <path
        d="M4 46C4 28 18 18 32 18C40 18 44 23 41 29C38 35 30 34 28 28C26 22 33 14 46 10C58 6 70 4 78 4"
        stroke={`url(#goldGrad-${position})`}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M46 4C28 4 18 18 18 32C18 40 23 44 29 41C35 38 34 30 28 28"
        stroke={`url(#goldGrad-${position})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Corner Diamond & Pearl Finials */}
      <path
        d="M16 16L22 19L19 22L16 16Z"
        fill={`url(#goldGrad-${position})`}
      />
      <circle cx="12" cy="12" r="3.2" fill={`url(#goldGrad-${position})`} />
      <circle cx="28" cy="28" r="2.2" fill="#e28299" />
      <circle cx="48" cy="12" r="2" fill={`url(#goldGrad-${position})`} />
      <circle cx="12" cy="48" r="2" fill={`url(#goldGrad-${position})`} />
    </svg>
  );
};

export const RoyalCrestOrnament: React.FC<{ width?: number }> = ({ width = 220 }) => (
  <svg
    width={width}
    height={34}
    viewBox="0 0 240 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ display: "block", margin: "0 auto 6px auto", overflow: "visible" }}
  >
    <defs>
      <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(212,175,55,0.1)" />
        <stop offset="25%" stopColor="#cfa439" />
        <stop offset="50%" stopColor="#8c671b" />
        <stop offset="75%" stopColor="#cfa439" />
        <stop offset="100%" stopColor="rgba(212,175,55,0.1)" />
      </linearGradient>
    </defs>
    {/* Left & Right Filigree Wings */}
    <path
      d="M8 22C38 22 56 10 82 14C96 16 102 24 94 27C88 29 82 24 86 19C90 14 104 12 120 12C136 12 150 14 154 19C158 24 152 29 146 27C138 24 144 16 158 14C184 10 202 22 232 22"
      stroke="url(#crestGold)"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    {/* Center Crown Jewel & Rosebud */}
    <path
      d="M120 3L125 11L133 7L129 17H111L107 7L115 11L120 3Z"
      fill="#d4af37"
      stroke="#8c671b"
      strokeWidth="1"
    />
    <circle cx="120" cy="13" r="2.6" fill="#e28299" />
    <circle cx="102" cy="18" r="2" fill="#d4af37" />
    <circle cx="138" cy="18" r="2" fill="#d4af37" />
    <circle cx="66" cy="19" r="1.8" fill="#e28299" />
    <circle cx="174" cy="19" r="1.8" fill="#e28299" />
  </svg>
);

export const RoyalNumericText: React.FC<{ text: string; className?: string }> = ({
  text,
  className,
}) => {
  const parts = (text || "").split(/(\d+(?:[h:]\d+)?)/gi);
  return (
    <span className={className}>
      {parts.map((part, idx) =>
        /^\d+(?:[h:]\d+)?$/i.test(part) ? (
          <strong key={idx} className="royal-num-highlight">
            {part}
          </strong>
        ) : (
          <React.Fragment key={idx}>{part}</React.Fragment>
        )
      )}
    </span>
  );
};
