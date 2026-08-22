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
      <div className="hero-ornament-frame">
        {/* Cantos Ornamentais de Papelaria */}
        <div className="hero-corner-tl" aria-hidden="true" />
        <div className="hero-corner-tr" aria-hidden="true" />
        <div className="hero-corner-bl" aria-hidden="true" />
        <div className="hero-corner-br" aria-hidden="true" />

        {/* Coroa Real com Resplendor */}
        <div className="hero-crown-wrapper">
          <div className="hero-crown-glow" aria-hidden="true" />
          <Crown size={84} color="var(--color-gold)" accentColor="var(--color-gold-soft)" />
        </div>

        {/* Pre-título */}
        <span className="hero-pretitle">
          {hero.preTitle}
        </span>

        {/* Nome Principal com Presença Dominante */}
        <h1 className="hero-title">
          {hero.babyName}
        </h1>

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
      </div>
    </section>
  );
};