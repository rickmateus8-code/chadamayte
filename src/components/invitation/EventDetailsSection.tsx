import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Info,
  CalendarPlus,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { FloralDivider } from "../brand/FloralDivider";
import { RoyalCornerFiligree, RoyalCrestOrnament, RoyalNumericText } from "../brand/RoyalOrnaments";
import { InteractiveRoyalMap } from "./InteractiveRoyalMap";
import { invitationContent } from "../../config/invitationContent";
import { useEventContext } from "../../context/EventContext";

export const EventDetailsSection: React.FC = () => {
  const { details } = invitationContent.sections;
  const { eventSettings } = useEventContext();
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = async () => {
    const fullAddress = `${eventSettings.locationName} — ${eventSettings.locationAddress}, ${eventSettings.locationCity}`;
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handleGoogleCalendar = () => {
    const startDate = new Date(eventSettings.targetDate);
    const validStart = isNaN(startDate.getTime()) ? new Date("2026-11-22T15:30:00") : startDate;
    const endDate = new Date(validStart.getTime() + 4 * 60 * 60 * 1000);

    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const title = encodeURIComponent(`${eventSettings.name} da Princesa ${eventSettings.babyName}`);
    const detailsText = encodeURIComponent(
      `Celebração especial do ${eventSettings.name} da ${eventSettings.babyName}! Local: ${eventSettings.locationName} (${eventSettings.locationAddress}).`
    );
    const location = encodeURIComponent(
      `${eventSettings.locationName}, ${eventSettings.locationAddress}, ${eventSettings.locationCity}`
    );

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(validStart)}/${fmt(endDate)}&details=${detailsText}&location=${location}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadIcs = () => {
    const startDate = new Date(eventSettings.targetDate);
    const validStart = isNaN(startDate.getTime()) ? new Date("2026-11-22T15:30:00") : startDate;
    const endDate = new Date(validStart.getTime() + 4 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Cha da Mayte//Convite Real//PT",
      "BEGIN:VEVENT",
      `DTSTART:${fmt(validStart)}`,
      `DTEND:${fmt(endDate)}`,
      `SUMMARY:${eventSettings.name} da Princesa ${eventSettings.babyName}`,
      `DESCRIPTION:${eventSettings.observations}`,
      `LOCATION:${eventSettings.locationName} - ${eventSettings.locationAddress}, ${eventSettings.locationCity}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "cha-de-fraldas-mayte.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="details-section" className="invitation-section reveal-on-scroll" aria-label="Informações do Evento">
      <div className="invitation-container">
        <div style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}>
          <RoyalCrestOrnament width={190} />
          <span className="section-eyebrow">
            Programação Real
          </span>
          <h2 className="section-title">
            {details.title}
          </h2>
          <p className="section-subtitle">
            {details.subtitle}
          </p>
        </div>

        {/* Card Principal de Informações em Papel Pérola & Ouro */}
        <div className="event-details-card" style={{ position: "relative" }}>
          <RoyalCornerFiligree position="tl" size={48} />
          <RoyalCornerFiligree position="tr" size={48} />
          <RoyalCornerFiligree position="bl" size={48} />
          <RoyalCornerFiligree position="br" size={48} />
          {/* Linha Data + Botões de Agenda */}
          <div className="event-detail-row">
            <div className="event-icon-box">
              <Calendar size={24} color="var(--color-gold-deep)" />
            </div>
            <div className="event-text-box">
              <span className="event-row-label">{details.dateLabel}</span>
              <div className="event-row-value">
                <RoyalNumericText text={eventSettings.dateFormatted} />
              </div>
              <div className="event-calendar-actions">
                <button
                  type="button"
                  onClick={handleGoogleCalendar}
                  className="btn-mini-luxury"
                >
                  <CalendarPlus size={13} />
                  Google Agenda
                </button>
                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="btn-mini-luxury"
                >
                  <Sparkles size={13} />
                  Apple / Lembrar (.ics)
                </button>
              </div>
            </div>
          </div>

          {/* Linha Horário */}
          <div className="event-detail-row">
            <div className="event-icon-box">
              <Clock size={24} color="var(--color-gold-deep)" />
            </div>
            <div className="event-text-box">
              <span className="event-row-label">{details.timeLabel}</span>
              <div className="event-row-value">
                <RoyalNumericText text={eventSettings.timeFormatted} />
              </div>
              <div className="event-row-sub">Pontualidade real para aproveitarmos cada instante juntos</div>
            </div>
          </div>

          {/* Linha Local */}
          <div className="event-detail-row" style={{ borderBottom: "none", paddingBottom: 0 }}>
            <div className="event-icon-box">
              <MapPin size={24} color="var(--color-gold-deep)" />
            </div>
            <div className="event-text-box">
              <span className="event-row-label">{details.locationLabel}</span>
              <div className="event-row-value">{eventSettings.locationName}</div>
              <div className="event-row-sub">
                {eventSettings.locationAddress} • {eventSettings.locationCity}
              </div>

              <div className="event-calendar-actions" style={{ marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="btn-mini-luxury"
                >
                  {copiedAddress ? <Check size={13} color="#1e8449" /> : <Copy size={13} />}
                  {copiedAddress ? "Endereço Copiado!" : "Copiar Endereço"}
                </button>
              </div>
            </div>
          </div>

          {/* Mapa Interativo Nobre & Traçador de Rotas com 1 Toque */}
          <InteractiveRoyalMap
            locationName={eventSettings.locationName}
            locationAddress={eventSettings.locationAddress}
            locationCity={eventSettings.locationCity}
            mapUrl={eventSettings.mapUrl}
          />

          {/* Bloco de Observações */}
          {eventSettings.observations && (
            <div className="event-observations-box">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-gold-deep)", fontWeight: 700, marginBottom: "6px", fontSize: "var(--text-sm)" }}>
                <Info size={17} />
                <span>{details.observationsLabel}</span>
              </div>
              <p className="event-observations-text">
                {eventSettings.observations}
              </p>
            </div>
          )}
        </div>

        <FloralDivider />
      </div>
    </section>
  );
};
