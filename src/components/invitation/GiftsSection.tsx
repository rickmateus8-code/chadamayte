import React from "react";
import { Gift, Heart, Sparkles, HelpCircle } from "lucide-react";
import { SectionDivider } from "./SectionDivider";
import { invitationContent } from "../../config/invitationContent";

export const GiftsSection: React.FC = () => {
  const { gifts } = invitationContent.sections;

  const renderIcon = (iconName: "Gift" | "Sparkles" | "Heart") => {
    switch (iconName) {
      case "Sparkles":
        return <Sparkles size={22} />;
      case "Heart":
        return <Heart size={22} />;
      case "Gift":
      default:
        return <Gift size={22} />;
    }
  };

  return (
    <section className="invitation-section" aria-label="Sugestões de Presentes">
      <div className="invitation-container">
        <div style={{ textAlign: "center" }}>
          <span className="section-badge">
            <Gift size={13} />
            Mimos para a Princesa
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

        <div className="gifts-notice-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "4px", fontWeight: 600, color: "var(--color-gold-deep)" }}>
            <HelpCircle size={15} />
            {gifts.pixNotice}
          </div>
          <div>{gifts.message}</div>
        </div>

        <SectionDivider />
      </div>
    </section>
  );
};