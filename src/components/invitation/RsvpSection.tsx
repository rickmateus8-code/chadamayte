import React, { useState } from "react";
import { Check, X as CloseIcon, Heart } from "lucide-react";
import { FloralDivider } from "../brand/FloralDivider";
import { invitationContent } from "../../config/invitationContent";

export const RsvpSection: React.FC = () => {
  const { rsvp } = invitationContent.sections;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<"yes" | "no" | null>(null);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const handleSubmit = (responseType: "yes" | "no") => {
    setSelectedResponse(responseType);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedResponse(null);
  };

  return (
    <section className="invitation-section" aria-label="Confirmar Presença">
      <div className="invitation-container-narrow">
        <div style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}>
          <span className="section-eyebrow">
            Sua Presença é Especial
          </span>
          <h2 className="section-title">
            {rsvp.title}
          </h2>
          <p className="section-subtitle">
            {rsvp.subtitle}
          </p>
        </div>

        {/* Card em Destaque de Confirmação */}
        <div className="floral-rsvp-card">
          <div className="rsvp-form-field">
            <label className="rsvp-field-label">Nome Completo</label>
            <input
              type="text"
              className="rsvp-field-input"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="rsvp-form-field">
            <label className="rsvp-field-label">WhatsApp com DDD</label>
            <input
              type="tel"
              className="rsvp-field-input"
              placeholder="(00) 00000-0000"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div className="rsvp-buttons-stack">
            <button
              type="button"
              onClick={() => handleSubmit("yes")}
              className="btn-rsvp-confirm"
              aria-label={rsvp.acceptButtonText}
            >
              <Check size={20} />
              {rsvp.acceptButtonText}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit("no")}
              className="btn-rsvp-decline"
              aria-label={rsvp.declineButtonText}
            >
              <CloseIcon size={18} />
              {rsvp.declineButtonText}
            </button>
          </div>
        </div>

        <FloralDivider />
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div
          className="modal-backdrop"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rsvp-modal-title"
        >
          <div className="floral-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{ color: "var(--color-text-soft)", padding: "4px" }}
                aria-label="Fechar"
              >
                <CloseIcon size={20} />
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
              <Heart size={28} fill="var(--color-pink-deep)" />
            </div>

            <h3 id="rsvp-modal-title" className="modal-title">
              {rsvp.modalTitle}
            </h3>

            <p className="modal-description">
              {selectedResponse === "yes" ? (
                <>
                  Ficamos muito felizes com a sua confirmação! {rsvp.modalMessage}
                </>
              ) : (
                <>
                  Sentiremos sua falta nesse momento tão especial. {rsvp.modalMessage}
                </>
              )}
            </p>

            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-floral-gold"
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