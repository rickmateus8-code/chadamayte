import React from "react";
import { LaceBorder } from "../brand/LaceBorder";
import { invitationContent } from "../../config/invitationContent";

export const ClosingSection: React.FC = () => {
  const { closing } = invitationContent.sections;

  return (
    <footer className="closing-section" aria-label="Encerramento do Convite">
      <div className="invitation-container-narrow">
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
          margin: "var(--space-xl) auto var(--space-md) auto",
          maxWidth: "400px",
        }}>
          <LaceBorder />
        </div>

        <div style={{
          fontSize: "var(--text-xs)",
          color: "var(--color-text-light)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}>
          {invitationContent.event.name} • {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};