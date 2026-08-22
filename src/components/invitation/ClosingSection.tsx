import React from "react";
import { Crown } from "../brand/Crown";
import { invitationContent } from "../../config/invitationContent";

export const ClosingSection: React.FC = () => {
  const { closing } = invitationContent.sections;

  return (
    <footer className="closing-section" aria-label="Encerramento do Convite">
      <div className="invitation-container-narrow">
        <div style={{ marginBottom: "var(--space-md)" }}>
          <Crown size={32} color="var(--color-gold)" />
        </div>

        <blockquote className="closing-quote">
          “{closing.message}”
        </blockquote>

        <div className="closing-signature">
          {closing.signature}
        </div>

        <div className="closing-name">
          {closing.babyName}
        </div>

        <div style={{
          marginTop: "var(--space-2xl)",
          fontSize: "var(--text-xs)",
          color: "var(--color-text-soft)",
          opacity: 0.75,
        }}>
          {invitationContent.event.name} • {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};