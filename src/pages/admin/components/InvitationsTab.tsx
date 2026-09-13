import React, { useState } from "react";
import { Plus, Search, Check, Copy, MessageCircle, Trash2 } from "lucide-react";
import type { AdminInvitation } from "../../../lib/adminApi";

interface InvitationsTabProps {
  invitations: AdminInvitation[];
  onOpenCreateModal: () => void;
  onDeleteInvitation: (id: string, name: string) => void;
}

export const InvitationsTab: React.FC<InvitationsTabProps> = ({
  invitations,
  onOpenCreateModal,
  onDeleteInvitation,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyInvitationLink = (publicToken: string) => {
    const url = `${window.location.origin}/i/${publicToken}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(publicToken);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const openWhatsApp = (inv: AdminInvitation) => {
    const url = `${window.location.origin}/i/${inv.public_token}`;
    const text = encodeURIComponent(
      `Olá ${inv.display_name}! Preparamos com muito carinho o convite para o Chá de Fraldas da nossa Maitê. Acesse seu convite exclusivo e confirme sua presença pelo link:\n\n${url}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const filtered = invitations.filter((inv) =>
    inv.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--color-paper)", padding: "0.6rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-pink-soft)", flex: 1, minWidth: "240px" }}>
          <Search size={16} color="var(--color-text-light)" />
          <input
            type="text"
            placeholder="Buscar por nome da família ou convidado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: "none", outline: "none", width: "100%", background: "transparent", fontSize: "0.9rem" }}
          />
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="btn-floral-gold"
          style={{ padding: "0.75rem 1.5rem" }}
        >
          <Plus size={16} /> Novo Convite
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "var(--color-paper)", borderRadius: "var(--radius-lg)" }}>
          <p style={{ color: "var(--color-text-soft)", margin: 0 }}>Nenhum convite encontrado.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {filtered.map((inv) => {
            const isCopied = copiedToken === inv.public_token;
            return (
              <div
                key={inv.id}
                style={{
                  background: "var(--color-paper)",
                  border: "1px solid var(--color-pink-soft)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.25rem",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
                      {inv.display_name}
                    </h3>

                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor:
                          inv.rsvp_status === "CONFIRMED"
                            ? "#d4edda"
                            : inv.rsvp_status === "DECLINED"
                            ? "#f8d7da"
                            : inv.rsvp_status === "PARTIAL"
                            ? "#d1ecf1"
                            : "#fff3cd",
                        color:
                          inv.rsvp_status === "CONFIRMED"
                            ? "#155724"
                            : inv.rsvp_status === "DECLINED"
                            ? "#721c24"
                            : inv.rsvp_status === "PARTIAL"
                            ? "#0c5460"
                            : "#856404",
                      }}
                    >
                      {inv.rsvp_status === "CONFIRMED"
                        ? `Confirmado (${inv.rsvp_guest_count} p.)`
                        : inv.rsvp_status === "DECLINED"
                        ? "Não poderá ir"
                        : inv.rsvp_status === "PARTIAL"
                        ? `Parcial (${inv.rsvp_guest_count} p.)`
                        : "Pendente"}
                    </span>
                  </div>

                  {inv.salutation && (
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-soft)", fontStyle: "italic", marginBottom: "4px" }}>
                      "{inv.salutation}"
                    </div>
                  )}

                  <div style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>
                    <strong>Convidados:</strong> {inv.guests.map((g) => g.name).join(", ") || "Sem nomes nominais"}
                    {inv.allow_additional_guests ? ` (+ até ${inv.max_additional_guests} extra)` : ""}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => copyInvitationLink(inv.public_token)}
                    title="Copiar Link Exclusivo"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "0.55rem 0.85rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-gold)",
                      background: isCopied ? "var(--color-gold-light)" : "var(--color-paper)",
                      color: "var(--color-gold-deep)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    {isCopied ? "Copiado!" : "Copiar Link"}
                  </button>

                  <button
                    type="button"
                    onClick={() => openWhatsApp(inv)}
                    title="Enviar no WhatsApp"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "0.55rem 0.85rem",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      background: "#25D366",
                      color: "#fff",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <MessageCircle size={14} />
                    WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteInvitation(inv.id, inv.display_name)}
                    title="Excluir Convite"
                    style={{
                      padding: "0.55rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid #f5c6cb",
                      background: "#fff",
                      color: "#e74c3c",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};