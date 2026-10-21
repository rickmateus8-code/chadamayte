import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Heart, Volume2 } from "lucide-react";
import { useEventContext } from "../../context/EventContext";
import { GoldenParticlesCanvas } from "./GoldenParticlesCanvas";
import { RoyalCornerFiligree, RoyalCrestOrnament, RoyalNumericText } from "../brand/RoyalOrnaments";

export const RoyalEnvelopeIntro: React.FC = () => {
  const { invitationData, eventSettings, openEnvelope } = useEventContext();
  const [unsealingStage, setUnsealingStage] = useState<0 | 1 | 2>(0);
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const envelopeRef = useRef<HTMLDivElement | null>(null);
  const isInteractingRef = useRef(false);

  // Subtle living 3D motion on mobile & idle desktop
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
          rx: Math.sin(t * 1.1) * 2.8,
          ry: Math.cos(t * 0.85) * 3.4,
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
      rx: Math.max(-9, Math.min(9, -dy * 6.5)),
      ry: Math.max(-9, Math.min(9, dx * 6.5)),
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateTiltFromClient(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    isInteractingRef.current = false;
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
    }, 500);
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

    // Stage 2: Card rises from pocket
    window.setTimeout(() => {
      setUnsealingStage(2);
    }, 380);

    // Final stage: Transition to full invitation
    window.setTimeout(() => {
      openEnvelope();
      window.setTimeout(() => {
        const heading = document.getElementById("main-invitation-heading");
        if (heading) {
          heading.focus({ preventScroll: true });
        }
      }, 60);
    }, 1250);
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
    >
      <GoldenParticlesCanvas count={52} />

      <div className="royal-envelope-wrapper">
        {/* Cabeçalho Sutil Acima do Envelope */}
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
          }}
        >
          {/* Interior em Veludo Rosa & Ouro */}
          <div className="royal-envelope-velvet-lining" aria-hidden="true" />

          {/* Aba Superior Triangular 3D */}
          <div className="royal-envelope-flap" aria-hidden="true">
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

              <div className="royal-envelope-date-pill">
                <Sparkles size={12} />
                <span>
                  <RoyalNumericText text={`${eventSettings.dateFormatted} • ${eventSettings.timeFormatted}`} />
                </span>
                <Sparkles size={12} />
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
