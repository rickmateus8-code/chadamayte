import React from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { invitationContent } from "../../config/invitationContent";

export const HeroSection: React.FC = () => {
  const { hero } = invitationContent.sections;

  const handleScrollDown = () => {
    const nextSection = document.getElementById("welcome-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section" aria-label="Capa do Convite">
      {/* Coroa Real com Rosas e Pérolas (PNG com transparência) */}
      <div className="hero-crown-container">
        <div className="hero-crown-glow" aria-hidden="true" />
        <img
          src="/images/mayte-royal-crown.png"
          alt="Coroa Real com Rosas da Maitê"
          className="hero-royal-crown-img"
        />
      </div>

      {/* Lettering Nobre Chá de Fraldas de Maytê com Buquês (PNG com transparência) */}
      <div className="hero-title-container">
        <img
          src="/images/mayte-title-header.png"
          alt="Chá de Fraldas de Maytê"
          className="hero-title-header-img"
        />
      </div>

      {/* Frase de Convite / Tagline */}
      <div className="hero-caption-block">
        <p className="hero-tagline-text">
          {invitationContent.event.tagline}
        </p>
      </div>

      {/* Indicador de Rolagem Poético */}
      <button
        type="button"
        onClick={handleScrollDown}
        className="hero-scroll-btn"
        aria-label={hero.scrollHint}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={13} />
          {hero.scrollHint}
          <Sparkles size={13} />
        </span>
        <ChevronDown size={18} />
      </button>
    </section>
  );
};