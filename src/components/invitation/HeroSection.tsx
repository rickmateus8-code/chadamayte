import React from "react";
import { Crown } from "../brand/Crown";
import { ChevronDown, Sparkles } from "lucide-react";
import { invitationContent } from "../../config/invitationContent";

export const HeroSection: React.FC = () => {
  const { hero } = invitationContent.sections;

  const handleScrollDown = () => {
    const nextSection = document.getElementById("intro-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section" aria-label="Abertura do Convite">
      {/* Coroa Real com Resplendor */}
      <div className="hero-crown-wrapper">
        <div className="hero-crown-glow" aria-hidden="true" />
        <Crown size={92} color="var(--color-gold)" accentColor="var(--color-gold-light)" />
      </div>

      {/* Pre-título */}
      <span className="hero-pretitle">
        {hero.preTitle}
      </span>

      {/* Nome Principal com Presença Dominante */}
      <h1 className="hero-title">
        {hero.babyName}
      </h1>

      {/* Ornamento de Filigrana Dourada */}
      <svg className="hero-flourish" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M10 10 H85 Q92 10 95 6 Q98 2 100 2 Q102 2 105 6 Q108 10 115 10 H190" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="100" cy="10" r="2.5" fill="var(--color-gold)" />
      </svg>

      {/* Tagline Editorial */}
      <p className="hero-tagline">
        {hero.subtitle}
      </p>

      {/* Indicador de Scroll */}
      <button
        type="button"
        onClick={handleScrollDown}
        className="hero-scroll-indicator"
        aria-label={hero.scrollHint}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={12} />
          {hero.scrollHint}
          <Sparkles size={12} />
        </span>
        <ChevronDown size={18} />
      </button>
    </section>
  );
};