import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Heart, Volume2, Sparkle } from "lucide-react";
import { useEventContext } from "../../context/EventContext";
import { GoldenParticlesCanvas } from "./GoldenParticlesCanvas";
import { RoyalCornerFiligree, RoyalCrestOrnament, RoyalNumericText } from "../brand/RoyalOrnaments";

export const RoyalEnvelopeIntro: React.FC = () => {
  const { invitationData, eventSettings, openEnvelope } = useEventContext();
  const [unsealingStage, setUnsealingStage] = useState<0 | 1 | 2>(0);
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const envelopeRef = useRef<HTMLDivElement | null>(null);
  const isInteractingRef = useRef(false);

  // Dynamic living 3D motion on mobile & idle desktop
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let frameId: number;
    const start = performance.now();

    const loop = (now: number) => {
      if (!isInteractingRef.current && unsealingStage === 0) {
        const t = (now - start) / 1000;
        setTilt({
          rx: Math.sin(t * 1.1) * 3.2,
          ry: Math.cos(t * 0.85) * 4.0,
        });
        setGlare({
          x: 50 + Math.cos(t * 0.9) * 25,
          y: 45 + Math.sin(t * 1.1) * 20,
          opacity: 0.18 + Math.sin(t * 1.5) * 0.08,
        });
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [unsealingStage]);

  const updateTiltFromClient = (clientX: number, clientY: number) => {
    if (unsealingStage > 0 || !envelopeRef.current) return;
    isInteractingRef.current = true;
    const rect = envelopeRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (clientX - cx) / (rect.width / 2);
    const dy = (clientY - cy) / (rect.height / 2);

    setTilt({
      rx: Math.max(-11, Math.min(11, -dy * 8.5)),
      ry: Math.max(-11, Math.min(11, dx * 8.5)),
    });

    const px = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const py = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setGlare({ x: px, y: py, opacity: 0.35 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateTiltFromClient(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    isInteractingRef.current = false;
    setGlare((prev) => ({ ...prev, opacity: 0.15 }));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touch) {
      updateTiltFromClient(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    window.setTimeout(() => {
      isInteractingRef.current = false;
    }, 600);
  };

  const handleOpen = (withMusic: boolean) => {
    if (unsealingStage > 0) return;
    isInteractingRef.current = true;
    setTilt({ rx: 0, ry: 0 });
    setUnsealingStage(1);

    if (withMusic) {
      window.dispatchEvent(new CustomEvent("mayte:start-music"));
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      openEnvelope();
      return;
    }

    // Stage 2: Card rises dynamically from the envelope pocket
    window.setTimeout(() => {
      setUnsealingStage(2);
    }, 420);

    // Final stage: Smooth transition to the opened invitation stationery
    window.setTimeout(() => {
      openEnvelope();
      window.setTimeout(() => {
        const heading = document.getElementById("main-invitation-heading");
        if (heading) {
          heading.focus({ preventScroll: true });
        }
      }, 60);
    }, 1280);
  };

  const recipientTitle = invitationData?.invitation?.displayName
    ? invitationData.invitation.displayName
    : "Você & Sua Família";

  const recipientSalutation = invitationData?.invitation?.salutation
    ? invitationData.invitation.salutation
    : "Com todo o nosso amor, preparamos um momento mágico para celebrar a chegada da nossa princesinha.";

  return (
    <div
      className={`royal-envelope-stage ${unsealingStage > 0 ? "is-unsealing" : ""}`}
      role="region"
      aria-label="Abertura do Convite Real da Maytê"
      style={{ perspective: "1400px" }}
    >
      <GoldenParticlesCanvas count={64} />

      <div className="royal-envelope-wrapper">
        {/* Cabeçalho Nobre Acima do Envelope */}
        <div className="royal-envelope-preheader">
          <RoyalCrestOrnament width={190} />
          <span className="royal-envelope-eyebrow">
            <Sparkles size={13} />
            Correspondência Real • {eventSettings.name}
            <Sparkles size={13} />
          </span>
        </div>

        {/* O Envelope 3D em Branco Pérola, Rosa Blush e Folha de Ouro */}
        <div
          ref={envelopeRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`royal-envelope-3d ${unsealingStage >= 1 ? "is-open" : ""} ${unsealingStage >= 2 ? "is-rising" : ""}`}
          style={{
            transform:
              unsealingStage === 0
                ? `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
                : undefined,
            transition: isInteractingRef.current ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          {/* Reflexo de Luz Especular Dourada Dinâmica */}
          <div
            className="royal-envelope-glare"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              borderRadius: "inherit",
              zIndex: 10,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 235, 175, ${glare.opacity}) 0%, transparent 60%)`,
              transition: "opacity 0.25s ease",
            }}
            aria-hidden="true"
          />

          {/* Interior em Veludo Rosa & Ouro */}
          <div className="royal-envelope-velvet-lining" aria-hidden="true" />

          {/* Aba Superior Triangular 3D com Dobra Real */}
          <div
            className="royal-envelope-flap"
            aria-hidden="true"
            style={{
              transformOrigin: "top center",
              transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1), z-index 0.3s ease",
              transform: unsealingStage >= 1 ? "rotateX(-180deg)" : "rotateX(0deg)",
              zIndex: unsealingStage >= 1 ? 1 : 5,
            }}
          >
            <div className="royal-envelope-flap-trim" />
          </div>

          {/* Cartão Interno que sobe ao abrir */}
          <div className="royal-envelope-letter-preview">
            <RoyalCornerFiligree position="tl" size={46} />
            <RoyalCornerFiligree position="tr" size={46} />
            <RoyalCornerFiligree position="bl" size={46} />
            <RoyalCornerFiligree position="br" size={46} />

            <div className="royal-envelope-inner-gold-border">
              <div className="royal-envelope-crown-halo">
                <img
                  src="/images/mayte-royal-crown.png"
                  alt="Coroa Real da Maytê"
                  className="royal-envelope-mini-crown"
                />
              </div>

              <span className="royal-envelope-for-label">
                ✦ Convite Especialmente Endereçado a ✦
              </span>
              <h1 className="royal-envelope-recipient">
                {recipientTitle}
              </h1>
              <p className="royal-envelope-salutation">
                “{recipientSalutation}”
              </p>

              {/* Data Nobre com Tipografia Fluida (Sem Moldura Branca) */}
              <div
                className="royal-envelope-date-pill"
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  color: "#2e151d",
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  marginTop: "0.35rem",
                }}
              >
                <Sparkle size={13} color="var(--color-gold-deep)" />
                <span>
                  <RoyalNumericText text={`${eventSettings.dateFormatted} • ${eventSettings.timeFormatted}`} />
                </span>
                <Sparkle size={13} color="var(--color-gold-deep)" />
              </div>
            </div>
          </div>

          {/* Abas Laterais e Bolso Frontal em Papelaria Rosê & Dourado */}
          <div className="royal-envelope-side-left" aria-hidden="true" />
          <div className="royal-envelope-side-right" aria-hidden="true" />
          <div className="royal-envelope-pocket" aria-hidden="true" />

          {/* Lacre de Cera Dourado 3D Interativo */}
          <div className="royal-wax-seal-Anchor">
            <button
              type="button"
              onClick={() => handleOpen(true)}
              className={`royal-wax-seal-btn ${unsealingStage >= 1 ? "is-broken" : ""}`}
              aria-label="Tocar no lacre real dourado para abrir o convite da Maytê"
              style={{
                cursor: "pointer",
                filter: "drop-shadow(0 6px 16px rgba(184, 134, 11, 0.45))",
                transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <span className="royal-wax-seal-glow-ring" aria-hidden="true" />
              <span className="royal-wax-seal-ring">
                <img
                  src="/images/mayte-royal-crown.png"
                  alt=""
                  className="royal-wax-seal-crown"
                />
                <span className="royal-wax-seal-monogram">M</span>
              </span>
            </button>
          </div>
        </div>

        {/* Ações de Abertura abaixo do Envelope */}
        <div className="royal-envelope-actions">
          <button
            type="button"
            onClick={() => handleOpen(true)}
            className="btn-open-royal-envelope btn-shimmer-gold"
          >
            <Sparkles size={17} />
            <span>
              {unsealingStage > 0
                ? "Revelando o Convite Real..."
                : "TOQUE NO LACRE PARA ABRIR O CONVITE"}
            </span>
            <Volume2 size={16} style={{ opacity: 0.92 }} />
          </button>

          <button
            type="button"
            onClick={() => handleOpen(false)}
            className="btn-open-silent"
          >
            <Heart size={12} fill="var(--color-pink)" color="var(--color-pink-deep)" />
            <span>Abrir convite em modo silencioso</span>
          </button>
        </div>
      </div>
    </div>
  );
};
