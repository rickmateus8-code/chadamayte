import React from "react";
import { Crown } from "../brand/Crown";

export interface SectionDividerProps {
  showCrown?: boolean;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ showCrown = true }) => {
  return (
    <div className="section-divider" role="separator" aria-hidden="true">
      <span className="section-divider-line" />
      {showCrown && <Crown size={16} color="var(--color-gold-soft)" />}
      <span className="section-divider-line" />
    </div>
  );
};