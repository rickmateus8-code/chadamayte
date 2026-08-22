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
        <Crown size={72} color="var(--color-gold)" accentColor="var(--color-gold-soft)" />
      </div>

      {/* Pre-título */}
      <span className="hero-pretitle">
        {hero.preTitle}
      </span>

      {/* Nome Principal em Destaque */}
      <h1 className="hero-title">
        {hero.babyName}
      </h1>

      {/* Subtítulo / Tagline */}
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
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Sparkles size={13} />
          {hero.scrollHint}
          <Sparkles size={13} />
        </span>
        <ChevronDown size={18} />
      </button>
    </section>
  );
};