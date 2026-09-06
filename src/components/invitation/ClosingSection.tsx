import React from "react";
import { LaceBorder } from "../brand/LaceBorder";
import { invitationContent } from "../../config/invitationContent";

export const ClosingSection: React.FC = () => {
  const { closing } = invitationContent.sections;

  return (
    <footer className="closing-section" aria-label="Encerramento do Convite">
      <div className="invitation-container-narrow">
        {/* Selo da Coroa Real em Escala Suave */}
        <div style={{
          width: "76px",
          margin: "0 auto var(--space-md) auto",
          opacity: 0.9,
          filter: "drop-shadow(0 4px 10px rgba(179, 71, 100, 0.15))",
        }}>
          <img
            src="/images/mayte-royal-crown.png"
            alt="Coroa da Maitê"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
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