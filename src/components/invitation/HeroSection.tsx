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
      {/* Imagem do Brasão Floral da Princesa Maytê */}
      <div className="hero-emblem-wrapper">
        <div className="hero-emblem-glow" aria-hidden="true" />
        <img
          src="/images/mayte-floral-crown-emblem.png"
          alt="Brasão Floral da Princesa Maytê — Chá de Bebê da Nossa Pequena Princesa"
          className="hero-emblem-img"
        />
      </div>

      {/* Frase de Convite */}
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