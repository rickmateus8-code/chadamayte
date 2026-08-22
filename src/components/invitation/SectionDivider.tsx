import React from "react";

export interface SectionDividerProps {
  motif?: "diamond" | "dot" | "line";
  spacing?: "sm" | "md" | "lg";
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  motif = "diamond",
  spacing = "md",
}) => {
  const spacingStyles = {
    sm: "var(--space-md)",
    md: "var(--space-xl)",
    lg: "var(--space-2xl)",
  }[spacing];

  return (
    <div
      className="section-divider"
      style={{ margin: `${spacingStyles} auto` }}
      role="separator"
      aria-hidden="true"
    >
      <span className="section-divider-line" />
      {motif === "diamond" && (
        <span style={{ color: "var(--color-gold)", fontSize: "0.625rem", opacity: 0.85 }}>
          ◆
        </span>
      )}
      {motif === "dot" && (
        <span style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: "var(--color-gold)",
          opacity: 0.8,
          display: "inline-block",
        }} />
      )}
      <span className="section-divider-line" />
    </div>
  );
};