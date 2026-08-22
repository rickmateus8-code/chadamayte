import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { SectionDivider } from "./SectionDivider";
import { invitationContent } from "../../config/invitationContent";

export const EventInfoSection: React.FC = () => {
  const { details } = invitationContent.sections;
  const { event } = invitationContent;

  return (
    <section className="invitation-section" aria-label="Detalhes do Evento">
      <div className="invitation-container">
        <div style={{ textAlign: "center" }}>
          <span className="section-eyebrow">
            Celebração
          </span>
          <h2 className="section-title">
            {details.title}
          </h2>
          <p className="section-subtitle">
            {details.subtitle}
          </p>
        </div>

        {/* Bloco Tripartite Bespoke em Estilo Papelaria */}
        <div className="event-info-strip">
          {/* Coluna Data */}
          <div className="info-strip-cell">
            <div className="info-cell-icon">
              <Calendar size={28} />
            </div>
            <span className="info-cell-label">{details.dateLabel}</span>
            <div className="info-cell-value">{event.dateFormatted}</div>
            <span className="info-cell-sub">Domingo de Festa</span>
          </div>

          {/* Coluna Horário */}
          <div className="info-strip-cell">
            <div className="info-cell-icon">
              <Clock size={28} />
            </div>
            <span className="info-cell-label">{details.timeLabel}</span>
            <div className="info-cell-value">{event.timeFormatted}</div>
            <span className="info-cell-sub">Recepção dos Convidados</span>
          </div>

          {/* Coluna Local */}
          <div className="info-strip-cell">
            <div className="info-cell-icon">
              <MapPin size={28} />
            </div>
            <span className="info-cell-label">{details.locationLabel}</span>
            <div className="info-cell-value">{event.locationName}</div>
            <span className="info-cell-sub">{event.locationCity}</span>
          </div>
        </div>

        <SectionDivider motif="diamond" />
      </div>
    </section>
  );
};