import React from "react";
import { Gift, Heart, Sparkles, HelpCircle } from "lucide-react";
import { FloralDivider } from "../brand/FloralDivider";
import { invitationContent } from "../../config/invitationContent";

export const GiftsSection: React.FC = () => {
  const { gifts } = invitationContent.sections;

  const renderIcon = (iconName: "Gift" | "Sparkles" | "Heart") => {
    switch (iconName) {
      case "Sparkles":
        return <Sparkles size={24} color="var(--color-pink-deep)" />;
      case "Heart":
        return <Heart size={24} color="var(--color-pink-deep)" />;
      case "Gift":
      default:
        return <Gift size={24} color="var(--color-pink-deep)" />;
    }
  };

  return (
    <section className="invitation-section" aria-label="Sugestões de Presentes">
      <div className="invitation-container">
        <div style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}>
          <span className="section-eyebrow">
            Mimos para a Maytê
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
            <div key={index} className="floral-gift-card">
              <div className="gift-icon-bubble">
                {renderIcon(sug.iconName)}
              </div>
              <h3 className="gift-category">{sug.category}</h3>
              <p className="gift-description">{sug.description}</p>
            </div>
          ))}
        </div>

        <div className="gifts-notice-strip">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "6px", fontWeight: 600, color: "var(--color-pink-dark)" }}>
            <HelpCircle size={17} />
            {gifts.pixNotice}
          </div>
          <div>{gifts.message}</div>
        </div>

        <FloralDivider />
      </div>
    </section>
  );
};