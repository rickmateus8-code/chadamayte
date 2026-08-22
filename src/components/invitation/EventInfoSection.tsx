import React from "react";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { SectionDivider } from "./SectionDivider";
import { invitationContent } from "../../config/invitationContent";

export const EventInfoSection: React.FC = () => {
  const { details } = invitationContent.sections;
  const { event } = invitationContent;

  return (
    <section className="invitation-section" aria-label="Detalhes do Evento">
      <div className="invitation-container">
        <div style={{ textAlign: "center" }}>
          <span className="section-badge">
            <Sparkles size={13} />
            Detalhes da Celebração
          </span>
          <h2 className="section-title">
            {details.title}
          </h2>
          <p className="section-subtitle">
            {details.subtitle}
          </p>
        </div>

        <div className="event-info-grid">
          {/* Card Data */}
          <div className="info-card">
            <div className="info-icon-wrapper">
              <Calendar size={24} />
            </div>
            <span className="info-card-title">{details.dateLabel}</span>
            <div className="info-card-value">{event.dateFormatted}</div>
            <span className="info-card-sub">Domingo de Festa</span>
          </div>

          {/* Card Horário */}
          <div className="info-card">
            <div className="info-icon-wrapper">
              <Clock size={24} />
            </div>
            <span className="info-card-title">{details.timeLabel}</span>
            <div className="info-card-value">{event.timeFormatted}</div>
            <span className="info-card-sub">Recepção dos Convidados</span>
          </div>

          {/* Card Local */}
          <div className="info-card">
            <div className="info-icon-wrapper">
              <MapPin size={24} />
            </div>
            <span className="info-card-title">{details.locationLabel}</span>
            <div className="info-card-value">{event.locationName}</div>
            <span className="info-card-sub">{event.locationCity}</span>
          </div>
        </div>

        <SectionDivider />
      </div>
    </section>
  );
};