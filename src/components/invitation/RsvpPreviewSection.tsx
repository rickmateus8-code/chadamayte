import React, { useState } from "react";
import { CheckCircle, XCircle, Sparkles, X } from "lucide-react";
import { Crown } from "../brand/Crown";
import { invitationContent } from "../../config/invitationContent";

export const RsvpPreviewSection: React.FC = () => {
  const { rsvp } = invitationContent.sections;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<"yes" | "no" | null>(null);

  const handleButtonClick = (responseType: "yes" | "no") => {
    setSelectedResponse(responseType);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedResponse(null);
  };

  return (
    <section className="invitation-section" aria-label="Confirmação de Presença">
      <div className="invitation-container-narrow">
        <div style={{ textAlign: "center" }}>
          <span className="section-eyebrow">
            R. S. V. P.
          </span>
          <h2 className="section-title">
            {rsvp.title}
          </h2>
          <p className="section-subtitle">
            {rsvp.subtitle}
          </p>
        </div>

        {/* Cartão de Resposta / Papelaria de Confirmação */}
        <div className="rsvp-stationery-card">
          <div style={{ marginBottom: "var(--space-md)" }}>
            <Crown size={40} color="var(--color-gold)" />
          </div>

          <h3 className="rsvp-prompt">
            {rsvp.confirmPrompt}
          </h3>

          <div className="rsvp-actions">
            <button
              type="button"
              onClick={() => handleButtonClick("yes")}
              className="btn-royal"
              aria-label={rsvp.acceptButtonText}
            >
              <CheckCircle size={18} />
              {rsvp.acceptButtonText}
            </button>

            <button
              type="button"
              onClick={() => handleButtonClick("no")}
              className="btn-royal-outline"
              aria-label={rsvp.declineButtonText}
            >
              <XCircle size={18} />
              {rsvp.declineButtonText}
            </button>
          </div>

          <div style={{
            marginTop: "var(--space-xl)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            letterSpacing: "0.05em",
          }}>
            <Sparkles size={13} color="var(--color-gold)" />
            <span>Confirmação digital exclusiva para convidados</span>
          </div>
        </div>
      </div>

      {/* Modal Dialog de Preview */}
      {modalOpen && (
        <div
          className="modal-backdrop"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "var(--space-xs)" }}>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{ color: "var(--color-text-soft)", padding: "4px" }}
                aria-label="Fechar modal"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: "var(--space-md)" }}>
              <Crown size={44} color="var(--color-gold)" />
            </div>

            <h3
              id="modal-title"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "var(--text-2xl)",
                color: "var(--color-text)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {rsvp.modalTitle}
            </h3>

            <p style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-soft)",
              lineHeight: 1.65,
              marginBottom: "var(--space-xl)",
            }}>
              {selectedResponse === "yes" ? (
                <>
                  Ficamos imensamente felizes com a sua intenção de vir celebrar conosco!{" "}
                  {rsvp.modalMessage}
                </>
              ) : (
                <>
                  Sentiremos sua falta nesse momento tão especial.{" "}
                  {rsvp.modalMessage}
                </>
              )}
            </p>

            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-royal"
              style={{ width: "100%" }}
            >
              {rsvp.closeModalText}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};