import React from "react";
import { Gift, Heart, Sparkles, HelpCircle } from "lucide-react";
import { SectionDivider } from "./SectionDivider";
import { invitationContent } from "../../config/invitationContent";

export const GiftsSection: React.FC = () => {
  const { gifts } = invitationContent.sections;

  const renderIcon = (iconName: "Gift" | "Sparkles" | "Heart") => {
    switch (iconName) {
      case "Sparkles":
        return <Sparkles size={24} />;
      case "Heart":
        return <Heart size={24} />;
      case "Gift":
      default:
        return <Gift size={24} />;
    }
  };

  return (
    <section className="invitation-section" aria-label="Sugestões de Presentes">
      <div className="invitation-container">
        <div style={{ textAlign: "center" }}>
          <span className="section-eyebrow">
            Mimos & Carinho
          </span>
          <h2 className="section-title">
            {gifts.title}
          </h2>
          <p className="section-subtitle">
            {gifts.subtitle}
          </p>
        </div>

        <div className="gifts-grid">
          {gifts.suggestions.map((sug, index) => (
            <div key={index} className="gift-card">
              <div className="gift-icon-bubble">
                {renderIcon(sug.iconName)}
              </div>
              <h3 className="gift-category">{sug.category}</h3>
              <p className="gift-description">{sug.description}</p>
            </div>
          ))}
        </div>

        <div className="gifts-notice-strip">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "6px", fontWeight: 600, color: "var(--color-gold-deep)" }}>
            <HelpCircle size={16} />
            {gifts.pixNotice}
          </div>
          <div>{gifts.message}</div>
        </div>

        <SectionDivider motif="diamond" />
      </div>
    </section>
  );
};