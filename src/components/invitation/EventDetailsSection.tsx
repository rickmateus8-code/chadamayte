import React, { useState } from "react";
import { Calendar, Clock, MapPin, Info, Navigation } from "lucide-react";
import { FloralDivider } from "../brand/FloralDivider";
import { invitationContent } from "../../config/invitationContent";

export const EventDetailsSection: React.FC = () => {
  const { details } = invitationContent.sections;
  const { event } = invitationContent;
  const [showNotice, setShowNotice] = useState(false);

  const handleOpenMap = () => {
    if (event.mapUrl && event.mapUrl.trim() !== "") {
      window.open(event.mapUrl, "_blank", "noopener,noreferrer");
    } else {
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 4000);
    }
  };

  return (
    <section className="invitation-section" aria-label="Informações do Evento">
      <div className="invitation-container">
        <div style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}>
          <span className="section-eyebrow">
            Detalhes do Evento
          </span>
          <h2 className="section-title">
            {details.title}
          </h2>
          <p className="section-subtitle">
            {details.subtitle}
          </p>
        </div>

        {/* Card Principal de Informações */}
        <div className="event-details-card">
          {/* Linha Data */}
          <div className="event-detail-row">
            <div className="event-icon-box">
              <Calendar size={26} color="var(--color-pink-deep)" />
            </div>
            <div className="event-text-box">
              <span className="event-row-label">{details.dateLabel}</span>
              <div className="event-row-value">{event.dateFormatted}</div>
            </div>
          </div>

          {/* Linha Horário */}
          <div className="event-detail-row">
            <div className="event-icon-box">
              <Clock size={26} color="var(--color-pink-deep)" />
            </div>
            <div className="event-text-box">
              <span className="event-row-label">{details.timeLabel}</span>
              <div className="event-row-value">{event.timeFormatted}</div>
            </div>
          </div>

          {/* Linha Local */}
          <div className="event-detail-row">
            <div className="event-icon-box">
              <MapPin size={26} color="var(--color-pink-deep)" />
            </div>
            <div className="event-text-box">
              <span className="event-row-label">{details.locationLabel}</span>
              <div className="event-row-value">{event.locationName}</div>
              <div className="event-row-sub">{event.locationAddress} • {event.locationCity}</div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "var(--space-md)" }}>
            <button
              type="button"
              onClick={handleOpenMap}
              className="btn-floral-gold"
              aria-label="Abrir localização no mapa"
            >
              <Navigation size={16} />
              VER NO MAPA
            </button>
          </div>

          {showNotice && (
            <div className="info-notice-banner">
              <Info size={15} color="var(--color-gold-deep)" />
              O link exato do GPS será disponibilizado mais próximo da data do evento.
            </div>
          )}

          {/* Bloco de Observações */}
          {event.observations && (
            <div className="event-observations-box">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-pink-dark)", fontWeight: 600, marginBottom: "4px", fontSize: "var(--text-sm)" }}>
                <Info size={18} />
                <span>{details.observationsLabel}</span>
              </div>
              <p className="event-observations-text">
                {event.observations}
              </p>
            </div>
          )}
        </div>

        <FloralDivider />
      </div>
    </section>
  );
};