import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { SectionDivider } from "./SectionDivider";
import { Crown } from "../brand/Crown";
import { invitationContent } from "../../config/invitationContent";

export const GallerySection: React.FC = () => {
  const { gallery } = invitationContent.sections;

  return (
    <section className="invitation-section" aria-label="Galeria de Fotos">
      <div className="invitation-container">
        <div style={{ textAlign: "center" }}>
          <span className="section-eyebrow">
            Memórias
          </span>
          <h2 className="section-title">
            {gallery.title}
          </h2>
          <p className="section-subtitle">
            {gallery.subtitle}
          </p>
        </div>

        <div className="gallery-grid">
          {gallery.placeholders.map((item, idx) => (
            <div key={item.id} className="gallery-mount-card">
              <div className="gallery-matting-frame" role="img" aria-label={item.title}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(255, 255, 255, 0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-gold)",
                  boxShadow: "var(--shadow-subtle)",
                }}>
                  {idx === 0 ? <Crown size={24} color="var(--color-gold)" /> : <ImageIcon size={22} color="var(--color-gold)" />}
                </div>
                <span style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-pink-deep)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}>
                  Registro Especial
                </span>
              </div>

              <div className="gallery-caption-wrapper">
                <h3 className="gallery-card-title">{item.title}</h3>
                <p className="gallery-card-caption">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <SectionDivider motif="diamond" />
      </div>
    </section>
  );
};