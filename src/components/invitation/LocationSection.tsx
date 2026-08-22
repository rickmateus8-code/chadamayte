import React, { useState } from "react";
import { Navigation, MapPin, Info } from "lucide-react";
import { invitationContent } from "../../config/invitationContent";

export const LocationSection: React.FC = () => {
  const { location } = invitationContent.sections;
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
    <section className="invitation-section" aria-label="Localização do Evento">
      <div className="invitation-container-narrow">
        <div style={{ textAlign: "center" }}>
          <span className="section-badge">
            <Navigation size={13} />
            Endereço
          </span>
          <h2 className="section-title">
            {location.title}
          </h2>
          <p className="section-subtitle">
            {location.subtitle}
          </p>
        </div>

        <div className="location-card">
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "var(--radius-full)",
            background: "var(--color-bg-soft)",
            color: "var(--color-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto var(--space-md) auto",
            border: "1px solid var(--color-gold-soft)",
          }}>
            <MapPin size={28} />
          </div>

          <h3 className="location-name">{event.locationName}</h3>
          <p className="location-address">{event.locationAddress}</p>
          <p className="location-city">{event.locationCity}</p>

          <div style={{ marginTop: "var(--space-md)" }}>
            <button
              type="button"
              onClick={handleOpenMap}
              className="btn-royal"
              aria-label={`${location.buttonText} para ${event.locationName}`}
            >
              <Navigation size={16} />
              {location.buttonText}
            </button>
          </div>

          {showNotice && (
            <div style={{
              marginTop: "var(--space-md)",
              padding: "var(--space-sm)",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-bg-soft)",
              color: "var(--color-text)",
              fontSize: "var(--text-xs)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}>
              <Info size={14} color="var(--color-gold-deep)" />
              O link exato do GPS será disponibilizado mais próximo da data do evento.
            </div>
          )}

          {location.note && (
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-soft)", marginTop: "var(--space-md)" }}>
              {location.note}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};