import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Sparkles, CalendarCheck, Gift, MapPin, MailOpen, Heart } from "lucide-react";
import { invitationContent } from "../../config/invitationContent";
import { useEventContext } from "../../context/EventContext";
import { GoldenParticlesCanvas } from "./GoldenParticlesCanvas";
import { RoyalCrestOrnament, RoyalNumericText } from "../brand/RoyalOrnaments";

const CROWN_BLESSINGS = [
  "👑 Princesa Maytê • Nosso Maior Tesouro ✨",
  "🌸 Cada detalhe foi preparado com muito amor! 🌸",
  "✨ Toque na Coroa Real para espalhar brilho! ✨",
  "💖 Sua presença tornará este reino completo! 💖",
];

export const HeroSection: React.FC = () => {
  const { hero } = invitationContent.sections;
  const { eventSettings, portalConfig, invitationData, reopenEnvelope } = useEventContext();

  const activeCrownBlessings =
    portalConfig.crownBlessings.filter((b) => b.enabled).map((b) => b.text);
  const blessingsList =
    activeCrownBlessings.length > 0 ? activeCrownBlessings : CROWN_BLESSINGS;

  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scrollYOffset, setScrollYOffset] = useState<number>(0);
  const [crownBurst, setCrownBurst] = useState(false);
  const [blessingIdx, setBlessingIdx] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const isInteractingRef = useRef(false);

  // Subtle scroll-driven parallax for royal depth
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < 900) {
            setScrollYOffset(Math.min(28, y * 0.07));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Autonomous gentle 3D figure-8 motion on mobile/idle so the crown is always alive
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let frameId: number;
    let startTime = performance.now();

    const animateIdle = (now: number) => {
      if (!isInteractingRef.current) {
        const elapsed = (now - startTime) / 1000;
        const idleX = Math.sin(elapsed * 1.3) * 5.5;
        const idleY = Math.cos(elapsed * 0.9) * 4.2;
        setTilt({ x: idleX, y: idleY });
      }
      frameId = requestAnimationFrame(animateIdle);
    };

    frameId = requestAnimationFrame(animateIdle);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const updateTiltFromPoint = (clientX: number, clientY: number) => {
    if (!heroRef.current) return;
    isInteractingRef.current = true;
    const rect = heroRef.current.getBoundingClientRect();
    const dx = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setTilt({
      x: Math.max(-14, Math.min(14, dx * 11)),
      y: Math.max(-14, Math.min(14, dy * 11)),
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    updateTiltFromPoint(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    isInteractingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    const touch = e.touches[0];
    if (touch) {
      updateTiltFromPoint(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    window.setTimeout(() => {
      isInteractingRef.current = false;
    }, 600);
  };

  const handleCrownTap = () => {
    setCrownBurst(true);
    setBlessingIdx((prev) => (prev + 1) % blessingsList.length);
    window.setTimeout(() => {
      setCrownBurst(false);
    }, 950);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero-top"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="hero-section"
      aria-label="Capa do Convite"
    >
      {/* Pétalas de Rosa de Seda, Estrelas Douradas e Bokeh */}
      <GoldenParticlesCanvas count={46} />

      {/* Selo de Personalização Real no Topo */}
      <div className="hero-top-bar">
        <div className="hero-royal-pill">
          <Sparkles size={13} color="var(--color-gold-deep)" />
          <span>
            {invitationData?.invitation?.displayName
              ? `Convite Real • ${invitationData.invitation.displayName}`
              : `${eventSettings.name} • Princesa ${eventSettings.babyName}`}
          </span>
          <Sparkles size={13} color="var(--color-gold-deep)" />
        </div>

        <button
          type="button"
          onClick={reopenEnvelope}
          className="hero-reopen-envelope-btn"
          title="Rever cerimônia de abertura do envelope"
        >
          <MailOpen size={13} />
          <span>Ver Envelope 3D</span>
        </button>
      </div>

      <RoyalCrestOrnament width={230} />

      {/* Coroa Real Interativa (Desktop & Mobile Touch + Orbit Sparkles + Tap Burst) */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleCrownTap}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCrownTap();
          }
        }}
        aria-label="Coroa Real Interativa da Maytê — Toque para interagir"
        className={`hero-crown-container is-interactive-crown ${crownBurst ? "is-crown-bursting" : ""}`}
        style={{
          transform: `perspective(900px) rotateY(${tilt.x * 1.1}deg) rotateX(${-tilt.y * 1.1}deg) translate3d(${tilt.x * 0.95}px, ${tilt.y * 0.95 + scrollYOffset * 0.55}px, 0) scale(${crownBurst ? 1.08 : 1})`,
        }}
      >
        <div className="hero-crown-glow" aria-hidden="true" />
        <div className="hero-sunburst-halo" aria-hidden="true" />
        <div className="hero-crown-ring" aria-hidden="true" />

        {/* Joias e Estrelas Orbitando a Coroa */}
        <span className="crown-orbit-sparkle sparkle-1" aria-hidden="true">✦</span>
        <span className="crown-orbit-sparkle sparkle-2" aria-hidden="true">✧</span>
        <span className="crown-orbit-sparkle sparkle-3" aria-hidden="true">✦</span>
        <span className="crown-orbit-sparkle sparkle-4" aria-hidden="true">♥</span>

        <img
          src="/images/mayte-royal-crown.png"
          alt="Coroa Real com Rosas da Maytê"
          className="hero-royal-crown-img"
        />

        {/* Pílula Interativa Flutuante da Coroa */}
        <div className="hero-crown-interactive-badge">
          <Sparkles size={11} />
          <span>{blessingsList[blessingIdx % blessingsList.length]}</span>
          <Heart size={11} fill="var(--color-pink)" />
        </div>
      </div>

      {/* Lettering Nobre Chá de Fraldas de Maytê com Buquês */}
      <div
        id="main-invitation-heading"
        tabIndex={-1}
        className="hero-title-container"
        style={{
          outline: "none",
          transform: `translate3d(${tilt.x * -0.45}px, ${tilt.y * -0.45 + scrollYOffset * 0.3}px, 0)`,
        }}
      >
        <img
          src="/images/mayte-title-header.png"
          alt="Chá de Fraldas da Maytê"
          className="hero-title-header-img"
        />
      </div>

      {/* Frase de Convite / Tagline + Faixa Ornamentada */}
      <div className="hero-caption-block">
        <p className="hero-tagline-text">
          “{invitationContent.event.tagline}”
        </p>

        {/* Faixa Resumo Data & Hora em Ouro e Rosa Blush Preenchida com Números de Alta Visibilidade */}
        <div className="hero-date-ribbon">
          <span className="hero-date-segment">
            <span className="hero-date-ornament" aria-hidden="true">♛</span>
            <RoyalNumericText text={eventSettings.dateFormatted} className="hero-date-text" />
          </span>
          <span className="hero-date-dot" aria-hidden="true">✦</span>
          <span className="hero-date-segment">
            <RoyalNumericText text={eventSettings.timeFormatted} className="hero-date-text" />
            <span className="hero-date-ornament" aria-hidden="true">♛</span>
          </span>
        </div>

        {/* Atalhos Interativos Rápidos */}
        <div className="hero-quick-actions">
          <button
            type="button"
            onClick={() => scrollToSection("rsvp-section")}
            className="hero-action-chip hero-action-chip-primary btn-shimmer-gold"
          >
            <CalendarCheck size={16} />
            <span>Confirmar Presença</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("gifts-section")}
            className="hero-action-chip hero-action-chip-rose"
          >
            <Gift size={16} />
            <span>Boutique de Mimos</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("details-section")}
            className="hero-action-chip hero-action-chip-pearl"
          >
            <MapPin size={16} />
            <span>Local & Agenda</span>
          </button>
        </div>
      </div>

      {/* Indicador de Rolagem Poético */}
      <button
        type="button"
        onClick={() => scrollToSection("welcome-section")}
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
