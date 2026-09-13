import React, { useState } from "react";
import { createAdminInvitation } from "../../../lib/adminApi";

interface CreateInvitationModalProps {
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateInvitationModal: React.FC<CreateInvitationModalProps> = ({
  token,
  onClose,
  onSuccess,
}) => {
  const [displayName, setDisplayName] = useState("");
  const [salutation, setSalutation] = useState("");
  const [guests, setGuests] = useState<string[]>([""]);
  const [allowAdditional, setAllowAdditional] = useState(false);
  const [maxAdditional, setMaxAdditional] = useState(1);
  const [saving, setSaving] = useState(false);

  const handleAddGuest = () => {
    setGuests([...guests, ""]);
  };

  const handleGuestChange = (index: number, val: string) => {
    const updated = [...guests];
    updated[index] = val;
    setGuests(updated);
  };

  const handleRemoveGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setSaving(true);
    const guestNames = guests.map((g) => g.trim()).filter(Boolean);
    const res = await createAdminInvitation(token, {
      displayName: displayName.trim(),
      salutation: salutation.trim() || undefined,
      guestNames,
      allowAdditionalGuests: allowAdditional,
      maxAdditionalGuests: allowAdditional ? maxAdditional : 0,
    });
    setSaving(false);

    if (res.success) {
      onSuccess();
    } else {
      alert(res.message || "Erro ao cadastrar convite.");
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        className="floral-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "500px", width: "100%", textAlign: "left" }}
      >
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", marginBottom: "1rem", color: "var(--color-text)" }}>
          Cadastrar Novo Convite
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Nome da Família / Convidado *
            </label>
            <input
              type="text"
              placeholder="Ex: Família Silva ou Carlos e Ana"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-pink-soft)" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Saudação Personalizada (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Querida Família Silva"
              value={salutation}
              onChange={(e) => setSalutation(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-pink-soft)" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Convidados Nominais
            </label>
            {guests.map((g, idx) => (
              <div key={idx} style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                <input
                  type="text"
                  placeholder={`Nome do convidado ${idx + 1}`}
                  value={g}
                  onChange={(e) => handleGuestChange(idx, e.target.value)}
                  style={{ flex: 1, padding: "0.65rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-pink-soft)" }}
                />
                {guests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveGuest(idx)}
                    style={{ color: "#e74c3c", padding: "0.5rem", background: "none", border: "none", cursor: "pointer" }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddGuest}
              style={{ fontSize: "0.8rem", color: "var(--color-pink-deep)", fontWeight: 600, marginTop: "4px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              + Adicionar outro convidado
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "0.5rem" }}>
            <input
              type="checkbox"
              id="chkAllowAdd"
              checked={allowAdditional}
              onChange={(e) => setAllowAdditional(e.target.checked)}
            />
            <label htmlFor="chkAllowAdd" style={{ fontSize: "0.85rem", cursor: "pointer" }}>
              Permitir acompanhantes adicionais no RSVP
            </label>
          </div>

          {allowAdditional && (
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                Máximo de acompanhantes adicionais
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={maxAdditional}
                onChange={(e) => setMaxAdditional(parseInt(e.target.value) || 1)}
                style={{ width: "100px", padding: "0.5rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-pink-soft)" }}
              />
            </div>
          )}

          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "0.75rem 1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-pink-soft)", background: "none", cursor: "pointer" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-floral-gold"
              style={{ padding: "0.75rem 1.5rem" }}
            >
              {saving ? "Salvando..." : "Salvar Convite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};