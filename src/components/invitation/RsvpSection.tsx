import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Check, X as CloseIcon, Heart, CheckCircle2 } from "lucide-react";
import { FloralDivider } from "../brand/FloralDivider";
import { invitationContent } from "../../config/invitationContent";

interface InvitationData {
  invitation: {
    id: string;
    displayName: string;
    salutation?: string;
    allowAdditionalGuests: boolean;
    maxAdditionalGuests: number;
  };
  guests: Array<{
    id: string;
    name: string;
    isPrimary: boolean;
  }>;
  rsvp: {
    data: {
      status: string;
      contactName: string;
      guestCount: number;
    };
  } | null;
}

export const RsvpSection: React.FC = () => {
  const { token } = useParams<{ token?: string }>();
  const { rsvp } = invitationContent.sections;

  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<"yes" | "no" | null>(null);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  // Load invitation details if token is present
  useEffect(() => {
    if (token) {
      fetch(`/api/invitations/${token}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: InvitationData | null) => {
          if (data) {
            setInvitationData(data);
            const primaryGuest = data.guests[0];
            if (primaryGuest) {
              setName(primaryGuest.name);
            }
            if (data.rsvp) {
              setSubmittedStatus(data.rsvp.data.status);
            }
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const handleSubmit = async (responseType: "yes" | "no") => {
    if (!name.trim()) {
      alert("Por favor, preencha seu nome completo antes de confirmar.");
      return;
    }

    setSelectedResponse(responseType);
    setSubmitting(true);

    if (token) {
      try {
        const members = invitationData && invitationData.guests.length > 0
          ? invitationData.guests.map((g) => ({
              guestId: g.id,
              displayName: g.name,
              attendanceStatus: responseType === "yes" ? "CONFIRMED" : "DECLINED",
            }))
          : [
              {
                displayName: name.trim(),
                attendanceStatus: responseType === "yes" ? "CONFIRMED" : "DECLINED",
              },
            ];

        const res = await fetch(`/api/invitations/${token}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contactName: name.trim(),
            contactWhatsapp: whatsapp.trim(),
            notes: notes.trim() || undefined,
            members,
          }),
        });

        if (res.ok) {
          setSubmittedStatus(responseType === "yes" ? "CONFIRMED" : "DECLINED");
          setModalOpen(true);
        } else {
          const err = await res.json();
          alert(err.message || "Erro ao registrar confirmação.");
        }
      } catch {
        alert("Erro ao conectar ao servidor.");
      } finally {
        setSubmitting(false);
      }
    } else {
      // General invitation confirmation
      setSubmittedStatus(responseType === "yes" ? "CONFIRMED" : "DECLINED");
      setModalOpen(true);
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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

        {/* Mensagem Personalizada do Convite se houver token */}
        {invitationData && (
          <div style={{
            background: "var(--color-pink-light)",
            border: "1px solid var(--color-gold)",
            borderRadius: "var(--radius-lg)",
            padding: "1rem",
            textAlign: "center",
            marginBottom: "1rem",
          }}>
            <span style={{ fontSize: "0.85rem", color: "var(--color-gold-deep)", fontWeight: 600 }}>
              Convite Especial
            </span>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--color-text)", margin: "0.25rem 0" }}>
              {invitationData.invitation.displayName}
            </h3>
            {invitationData.invitation.salutation && (
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-soft)", fontStyle: "italic", margin: 0 }}>
                "{invitationData.invitation.salutation}"
              </p>
            )}
            {submittedStatus && (
              <div style={{
                marginTop: "0.5rem",
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.75rem",
                fontWeight: 700,
                backgroundColor: submittedStatus === "CONFIRMED" ? "#d4edda" : "#f8d7da",
                color: submittedStatus === "CONFIRMED" ? "#155724" : "#721c24",
              }}>
                {submittedStatus === "CONFIRMED" ? "✓ Presença Confirmada" : "✕ Não Poderá Ir"}
              </div>
            )}
          </div>
        )}

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

          <div className="rsvp-form-field">
            <label className="rsvp-field-label">Mensagem ou Recadinho para a Maitê (Opcional)</label>
            <input
              type="text"
              className="rsvp-field-input"
              placeholder="Deixe um recado com carinho..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="rsvp-buttons-stack">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit("yes")}
              className="btn-rsvp-confirm"
              aria-label={rsvp.acceptButtonText}
            >
              <Check size={20} />
              {submitting ? "Confirmando..." : rsvp.acceptButtonText}
            </button>

            <button
              type="button"
              disabled={submitting}
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
                style={{ color: "var(--color-text-soft)", padding: "4px", background: "none", border: "none", cursor: "pointer" }}
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
              backgroundColor: selectedResponse === "yes" ? "#d4edda" : "#f8d7da",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: selectedResponse === "yes" ? "#155724" : "#721c24",
            }}>
              {selectedResponse === "yes" ? (
                <CheckCircle2 size={30} />
              ) : (
                <Heart size={28} fill="var(--color-pink-deep)" />
              )}
            </div>

            <h3 id="rsvp-modal-title" className="modal-title">
              {selectedResponse === "yes" ? "Presença Confirmada!" : "Resposta Registrada"}
            </h3>

            <p className="modal-description">
              {selectedResponse === "yes" ? (
                <>
                  Ficamos imensamente felizes com a sua presença! O dia da Maitê será ainda mais especial ao seu lado. ❤️
                </>
              ) : (
                <>
                  Sentiremos muito a sua falta, mas agradecemos de coração pelo carinho e pela consideração! ❤️
                </>
              )}
            </p>

            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-floral-gold"
              style={{ width: "100%" }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};