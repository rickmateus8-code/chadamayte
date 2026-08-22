import React from "react";
import { Heart } from "lucide-react";
import { SectionDivider } from "./SectionDivider";
import { invitationContent } from "../../config/invitationContent";

export const IntroSection: React.FC = () => {
  const { intro } = invitationContent.sections;

  return (
    <section id="intro-section" className="invitation-section" aria-label="Mensagem de Abertura">
      <div className="invitation-container-narrow">
        <div className="intro-stationery-block">
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "var(--radius-full)",
            background: "var(--color-bg-soft)",
            color: "var(--color-pink-deep)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto var(--space-md) auto",
            border: "1px solid var(--color-border-delicate)",
          }}>
            <Heart size={16} fill="var(--color-pink-deep)" />
          </div>

          <blockquote className="intro-quote">
            “{intro.quote}”
          </blockquote>

          <cite className="intro-author">
            {intro.author}
          </cite>
        </div>

        <SectionDivider motif="diamond" />
      </div>
    </section>
  );
};