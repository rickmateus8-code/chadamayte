import React, { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { FloralDivider } from "../brand/FloralDivider";
import { invitationContent } from "../../config/invitationContent";

export const MemoriesSection: React.FC = () => {
  const { memories } = invitationContent.sections;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="invitation-section" aria-label="Fotos e Memórias">
      <div className="invitation-container-narrow">
        <div style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}>
          <span className="section-eyebrow">
            Memórias & Lembranças
          </span>
          <h2 className="section-title">
            {memories.title}
          </h2>
        </div>

        {/* Card Convidativo de Envio de Fotos */}
        <div className="memories-interactive-card">
          <div className="memories-camera-badge">
            <Camera size={38} color="var(--color-pink-deep)" />
          </div>

          <h3 className="memories-headline">
            {memories.headline}
          </h3>

          <p className="memories-text">
            {memories.description}
          </p>

          <p className="memories-privacy">
            {memories.privacyNote}
          </p>

          <div style={{ marginTop: "var(--space-lg)" }}>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-send-photos"
              aria-label={memories.buttonText}
            >
              <Camera size={18} />
              {memories.buttonText}
            </button>
          </div>
        </div>

        <FloralDivider />
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="floral-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ color: "var(--color-text-soft)", padding: "4px" }}
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              width: "56px",
              height: "56px",
              margin: "0 auto var(--space-md) auto",
              borderRadius: "50%",
              backgroundColor: "var(--color-pink-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-pink-deep)",
            }}>
              <Upload size={28} />
            </div>

            <h3 className="modal-title">
              {memories.modalTitle}
            </h3>

            <p className="modal-description">
              {memories.modalMessage}
            </p>

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-floral-gold"
              style={{ width: "100%" }}
            >
              Entendido!
            </button>
          </div>
        </div>
      )}
    </section>
  );
};