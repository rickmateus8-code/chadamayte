import React from "react";
import { Sparkles } from "lucide-react";
import { SectionDivider } from "./SectionDivider";
import { invitationContent } from "../../config/invitationContent";

export const SpecialMessageSection: React.FC = () => {
  const { specialMessage } = invitationContent.sections;

  return (
    <section className="invitation-section" aria-label="Mensagem Especial">
      <div className="invitation-container-narrow">
        <div className="special-letter-block">
          <span className="section-eyebrow">
            Com Amor
          </span>

          <h2 className="section-title" style={{ marginBottom: "var(--space-xl)" }}>
            {specialMessage.title}
          </h2>

          <div className="special-letter-paragraphs">
            {specialMessage.content.map((paragraph, index) => (
              <p key={index} className="special-letter-p">
                {paragraph}
              </p>
            ))}
          </div>

          <div style={{
            marginTop: "var(--space-2xl)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--color-gold-deep)",
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}>
            <Sparkles size={14} />
            Esperamos por você
            <Sparkles size={14} />
          </div>
        </div>

        <SectionDivider motif="diamond" />
      </div>
    </section>
  );
};