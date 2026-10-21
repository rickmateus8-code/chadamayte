import React, { useState, useEffect } from "react";
import { Crown, Heart, Sparkles, Baby, Scale, Ruler, MapPin, Calendar } from "lucide-react";
import { useEventContext } from "../../context/EventContext";
import { RoyalCornerFiligree, RoyalCrestOrnament } from "../brand/RoyalOrnaments";

export const MayteBornBanner: React.FC = () => {
  const { portalConfig, eventSettings } = useEventContext();
  const { lifecycleStage, birthInfo, expectedBirthFormatted } = portalConfig;

  const [lifeDurationText, setLifeDurationText] = useState<string>("");

  useEffect(() => {
    if (lifecycleStage !== "MAYTE_BORN") return;

    const updateTimer = () => {
      const birthTime = new Date(birthInfo.birthDateIso).getTime();
      if (Number.isNaN(birthTime)) {
        setLifeDurationText("Recém-chegada ao nosso reino de amor ✨");
        return;
      }
      const now = Date.now();
      const diffMs = Math.max(0, now - birthTime);
      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;

      if (days === 0) {
        setLifeDurationText(`${ Math.max(1, hours) } horas de vida iluminando nossa família ✨`);
      } else if (days === 1) {
        setLifeDurationText(`1 dia e ${hours}h de vida iluminando nossa família ✨`);
      } else {
        setLifeDurationText(`${days} dias e ${hours}h de vida iluminando nossa família ✨`);
      }
    };

    updateTimer();
    const timer = window.setInterval(updateTimer, 60000);
    return () => window.clearInterval(timer);
  }, [lifecycleStage, birthInfo.birthDateIso]);

  if (lifecycleStage === "BABY_SHOWER") {
    return null;
  }

  if (lifecycleStage === "WAITING_BIRTH") {
    return (
      <section className="invitation-section reveal-on-scroll is-visible" aria-label="Pós-Chá de Bebê e Doce Espera">
        <div className="invitation-container-narrow">
          <div className="floral-welcome-card" style={{ position: "relative" }}>
            <RoyalCornerFiligree position="tl" size={48} />
            <RoyalCornerFiligree position="tr" size={48} />
            <RoyalCornerFiligree position="bl" size={48} />
            <RoyalCornerFiligree position="br" size={48} />

            <RoyalCrestOrnament width={170} />

            <span className="welcome-badge">
              <Sparkles size={13} />
              Obrigado pelo Chá de Fraldas Inesquecível!
            </span>

            <h2 className="section-title" style={{ marginTop: "var(--space-xs)" }}>
              Agora contamos os dias para o nascimento da {eventSettings.babyName}!
            </h2>

            <p className="welcome-paragraph" style={{ marginTop: "var(--space-sm)" }}>
              Nosso coração transborda de gratidão por cada abraço, cada fralda, cada mimo e cada mensagem deixada no Chá da nossa princesinha.
              Previsão de chegada: <strong>{expectedBirthFormatted}</strong>. Continue enviando fotos e recados na Cápsula do Tempo abaixo!
            </p>
          </div>
        </div>
      </section>
    );
  }

  // lifecycleStage === "MAYTE_BORN"
  return (
    <section className="invitation-section reveal-on-scroll is-visible" aria-label="Anúncio Real de Nascimento da Maytê">
      <div className="invitation-container">
        <div
          className="floral-welcome-card"
          style={{
            position: "relative",
            border: "2px solid var(--color-gold)",
            background: "linear-gradient(180deg, #fffdf9 0%, #fdf2f5 100%)",
            boxShadow: "0 24px 60px rgba(201, 155, 59, 0.22)",
          }}
        >
          <RoyalCornerFiligree position="tl" size={56} />
          <RoyalCornerFiligree position="tr" size={56} />
          <RoyalCornerFiligree position="bl" size={56} />
          <RoyalCornerFiligree position="br" size={56} />

          <RoyalCrestOrnament width={200} />

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.45rem 1.25rem",
              borderRadius: "var(--radius-full)",
              background: "linear-gradient(135deg, #fff6dd 0%, #fce8ef 100%)",
              border: "1.5px solid var(--color-gold)",
              color: "var(--color-gold-deep)",
              fontWeight: 700,
              fontSize: "0.82rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "var(--space-sm)",
            }}
          >
            <Crown size={15} />
            {birthInfo.announcementBadge}
          </div>

          <h2 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "0.5rem" }}>
            {birthInfo.announcementTitle}
          </h2>

          {lifeDurationText && (
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "1.15rem",
                color: "var(--color-pink-deep)",
                fontWeight: 600,
                marginBottom: "var(--space-md)",
              }}
            >
              {lifeDurationText}
            </p>
          )}

          <p className="welcome-paragraph" style={{ maxWidth: "680px", margin: "0 auto var(--space-lg) auto" }}>
            {birthInfo.announcementMessage}
          </p>

          {/* Ficha Real de Nascimento */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
              gap: "0.9rem",
              marginTop: "var(--space-md)",
              textAlign: "left",
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--color-gold-soft)",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div className="royal-input-icon" style={{ position: "static", transform: "none", flexShrink: 0 }}>
                <Calendar size={18} />
              </div>
              <div>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-light)", display: "block" }}>
                  Nascimento
                </span>
                <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", color: "var(--color-text)" }}>
                  {birthInfo.birthDateFormatted}
                </strong>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid var(--color-gold-soft)",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div className="royal-input-icon" style={{ position: "static", transform: "none", flexShrink: 0 }}>
                <Scale size={18} />
              </div>
              <div>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-light)", display: "block" }}>
                  Peso ao Nascer
                </span>
                <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", color: "var(--color-text)" }}>
                  {birthInfo.weightGrams}
                </strong>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid var(--color-gold-soft)",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div className="royal-input-icon" style={{ position: "static", transform: "none", flexShrink: 0 }}>
                <Ruler size={18} />
              </div>
              <div>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-light)", display: "block" }}>
                  Comprimento
                </span>
                <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", color: "var(--color-text)" }}>
                  {birthInfo.heightCm}
                </strong>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid var(--color-gold-soft)",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div className="royal-input-icon" style={{ position: "static", transform: "none", flexShrink: 0 }}>
                <MapPin size={18} />
              </div>
              <div>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-light)", display: "block" }}>
                  Maternidade & Cidade
                </span>
                <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "var(--color-text)" }}>
                  {birthInfo.hospitalName} • {birthInfo.cityState}
                </strong>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "var(--space-md)",
              padding: "0.75rem 1.25rem",
              borderRadius: "var(--radius-full)",
              background: "rgba(212, 169, 89, 0.1)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.85rem",
              color: "var(--color-gold-deep)",
              fontWeight: 600,
            }}
          >
            <Baby size={16} />
            <span>Acervo Oficial do Chá de Fraldas & Cápsula do Tempo preservados abaixo</span>
            <Heart size={14} fill="var(--color-pink)" color="var(--color-pink-deep)" />
          </div>
        </div>
      </div>
    </section>
  );
};
