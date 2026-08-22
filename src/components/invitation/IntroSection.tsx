import React from "react";
import { Heart } from "lucide-react";
import { SectionDivider } from "./SectionDivider";
import { invitationContent } from "../../config/invitationContent";

export const IntroSection: React.FC = () => {
  const { intro } = invitationContent.sections;

  return (
    <section id="intro-section" className="invitation-section" aria-label="Mensagem de Introdução">
      <div className="invitation-container-narrow">
        <div className="intro-card">
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "var(--radius-full)",
            background: "var(--color-bg-soft)",
            color: "var(--color-pink-deep)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto var(--space-md) auto",
          }}>
            <Heart size={20} fill="var(--color-pink-deep)" />
          </div>

          <blockquote className="intro-quote">
            “{intro.quote}”
          </blockquote>

          <cite className="intro-author">
            {intro.author}
          </cite>
        </div>

        <SectionDivider />
      </div>
    </section>
  );
};