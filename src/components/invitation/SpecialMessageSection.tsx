import React from "react";
import { Sparkles } from "lucide-react";
import { SectionDivider } from "./SectionDivider";
import { Crown } from "../brand/Crown";
import { invitationContent } from "../../config/invitationContent";

export const SpecialMessageSection: React.FC = () => {
  const { specialMessage } = invitationContent.sections;

  return (
    <section className="invitation-section" aria-label="Mensagem Especial">
      <div className="invitation-container-narrow">
        <div className="intro-card" style={{ padding: "var(--space-2xl) var(--space-xl)" }}>
          <div style={{ marginBottom: "var(--space-sm)" }}>
            <Crown size={32} color="var(--color-gold)" />
          </div>

          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            color: "var(--color-text)",
            fontWeight: 700,
            marginBottom: "var(--space-md)",
          }}>
            {specialMessage.title}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            {specialMessage.content.map((paragraph, index) => (
              <p
                key={index}
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--color-text-soft)",
                  lineHeight: 1.7,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div style={{
            marginTop: "var(--space-lg)",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--color-gold-deep)",
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            <Sparkles size={14} />
            Esperamos por você
            <Sparkles size={14} />
          </div>
        </div>

        <SectionDivider />
      </div>
    </section>
  );
};