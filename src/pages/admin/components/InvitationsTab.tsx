import React, { useState } from "react";
import {
  Plus,
  Search,
  Check,
  Copy,
  MessageCircle,
  Trash2,
  GripVertical,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  updateAdminInvitationStatus,
  type AdminInvitation,
} from "../../../lib/adminApi";

interface InvitationsTabProps {
  token: string;
  invitations: AdminInvitation[];
  onOpenCreateModal: () => void;
  onDeleteInvitation: (id: string, name: string) => void;
  onRefresh: () => void;
}

type KanbanColumnKey = "PENDING" | "CONFIRMED" | "DECLINED";

export const InvitationsTab: React.FC<InvitationsTabProps> = ({
  token,
  invitations,
  onOpenCreateModal,
  onDeleteInvitation,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [draggedInvId, setDraggedInvId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<KanbanColumnKey | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  const copyInvitationLink = (publicToken: string) => {
    const url = `${window.location.origin}/i/${publicToken}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(publicToken);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const openWhatsApp = (inv: AdminInvitation) => {
    const url = `${window.location.origin}/i/${inv.public_token}`;
    const text = encodeURIComponent(
      `Olá ${inv.display_name}! 👑✨ Preparamos com muito carinho o convite para o Chá de Fraldas da nossa princesinha Maytê. Acesse seu convite exclusivo e confirme sua presença pelo link:\n\n${url}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleMoveStatus = async (invId: string, targetStatus: KanbanColumnKey) => {
    setMovingId(invId);
    await updateAdminInvitationStatus(token, invId, targetStatus);
    setMovingId(null);
    onRefresh();
  };

  const filtered = invitations.filter((inv) =>
    inv.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBucket = (inv: AdminInvitation): KanbanColumnKey => {
    if (inv.rsvp_status === "CONFIRMED" || inv.rsvp_status === "PARTIAL") {
      return "CONFIRMED";
    }
    if (inv.rsvp_status === "DECLINED") {
      return "DECLINED";
    }
    return "PENDING";
  };

  const columns: Array<{
    key: KanbanColumnKey;
    title: string;
    subtitle: string;
    badgeBg: string;
    badgeColor: string;
  }> = [
    {
      key: "PENDING",
      title: "⏳ Aguardando Resposta",
      subtitle: "Arraste para cá ou envie o link",
      badgeBg: "#fff6dd",
      badgeColor: "#8c6518",
    },
    {
      key: "CONFIRMED",
      title: "✨ Presença Confirmada",
      subtitle: "Convidados confirmados para o Chá",
      badgeBg: "#d4edda",
      badgeColor: "#155724",
    },
    {
      key: "DECLINED",
      title: "🤍 Não Poderão Comparecer",
      subtitle: "Ausências justificadas com carinho",
      badgeBg: "#fce8ef",
      badgeColor: "#943554",
    },
  ];

  return (
    <div>
      {/* Barra de Busca + Alternador Kanban Arrastável / Lista + Botão Novo Convite */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.85rem",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#fff",
            padding: "0.65rem 1rem",
            borderRadius: "var(--radius-full)",
            border: "1.5px solid rgba(212, 169, 89, 0.45)",
            flex: 1,
            minWidth: "240px",
          }}
        >
          <Search size={16} color="var(--color-gold-deep)" />
          <input
            type="text"
            placeholder="Buscar por nome da família ou convidado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              background: "transparent",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <div className="royal-companion-type-pills" role="group" aria-label="Modo de visualização">
          <button
            type="button"
            onClick={() => setViewMode("kanban")}
            className={`companion-type-pill ${viewMode === "kanban" ? "is-active" : ""}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <LayoutGrid size={14} />
            <span>Kanban Arrastável</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`companion-type-pill ${viewMode === "list" ? "is-active" : ""}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <List size={14} />
            <span>Lista Real</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="btn-floral-gold btn-shimmer-gold"
          style={{ padding: "0.75rem 1.4rem" }}
        >
          <Plus size={16} /> Novo Convite Nominal
        </button>
      </div>

      {/* MODO 1: QUADRO KANBAN ARRASTÁVEL DE RECEPÇÃO */}
      {viewMode === "kanban" ? (
        <div className="admin-kanban-board">
          {columns.map((col) => {
            const colItems = filtered.filter((inv) => getBucket(inv) === col.key);
            const isOver = dragOverCol === col.key;
            return (
              <div
                key={col.key}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverCol(col.key);
                }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setDragOverCol(null);
                  if (draggedInvId) {
                    await handleMoveStatus(draggedInvId, col.key);
                    setDraggedInvId(null);
                  }
                }}
                className={`admin-kanban-column ${isOver ? "is-kanban-over" : ""}`}
              >
                <div className="admin-kanban-col-header">
                  <div>
                    <h3 className="admin-kanban-col-title">{col.title}</h3>
                    <span className="admin-kanban-col-sub">{col.subtitle}</span>
                  </div>
                  <span
                    className="admin-kanban-count"
                    style={{ background: col.badgeBg, color: col.badgeColor }}
                  >
                    {colItems.length}
                  </span>
                </div>

                <div className="admin-kanban-cards">
                  {colItems.length === 0 ? (
                    <div className="admin-kanban-empty">
                      Arraste um convite para esta coluna
                    </div>
                  ) : (
                    colItems.map((inv) => {
                      const isCopied = copiedToken === inv.public_token;
                      const isMoving = movingId === inv.id;
                      return (
                        <div
                          key={inv.id}
                          draggable
                          onDragStart={() => setDraggedInvId(inv.id)}
                          onDragEnd={() => {
                            setDraggedInvId(null);
                            setDragOverCol(null);
                          }}
                          className="admin-kanban-card"
                          style={{ opacity: isMoving ? 0.55 : 1 }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span
                                className="drag-handle"
                                title="Arraste para outra coluna"
                                aria-label="Alça para arrastar convite entre colunas"
                              >
                                <GripVertical size={16} />
                              </span>
                              <div>
                                <strong
                                  style={{
                                    fontFamily: "var(--font-serif)",
                                    fontSize: "1.15rem",
                                    color: "var(--color-text)",
                                    display: "block",
                                  }}
                                >
                                  {inv.display_name}
                                </strong>
                                <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>
                                  {inv.guests.map((g) => g.name).join(", ") || "Convite Geral"}
                                  {inv.rsvp_guest_count ? ` • ${inv.rsvp_guest_count} p.` : ""}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => onDeleteInvitation(inv.id, inv.display_name)}
                              className="btn-remove-companion"
                              style={{ width: "28px", height: "28px" }}
                              title="Excluir convite"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Botões de Ação e Transição Rápida */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "0.75rem" }}>
                            <button
                              type="button"
                              onClick={() => copyInvitationLink(inv.public_token)}
                              className="btn-mini-luxury"
                              style={{ fontSize: "0.73rem", padding: "0.35rem 0.65rem" }}
                            >
                              {isCopied ? <Check size={12} /> : <Copy size={12} />}
                              {isCopied ? "Copiado!" : "Link"}
                            </button>

                            <button
                              type="button"
                              onClick={() => openWhatsApp(inv)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "0.35rem 0.65rem",
                                borderRadius: "var(--radius-full)",
                                border: "none",
                                background: "#25D366",
                                color: "#fff",
                                fontSize: "0.73rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              <MessageCircle size={12} /> WhatsApp
                            </button>

                            {col.key !== "CONFIRMED" && (
                              <button
                                type="button"
                                onClick={() => handleMoveStatus(inv.id, "CONFIRMED")}
                                style={{
                                  padding: "0.35rem 0.65rem",
                                  borderRadius: "var(--radius-full)",
                                  border: "1px solid #27ae60",
                                  background: "#e8f8f0",
                                  color: "#155724",
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                ✓ Confirmar
                              </button>
                            )}

                            {col.key !== "PENDING" && (
                              <button
                                type="button"
                                onClick={() => handleMoveStatus(inv.id, "PENDING")}
                                style={{
                                  padding: "0.35rem 0.65rem",
                                  borderRadius: "var(--radius-full)",
                                  border: "1px solid var(--color-gold)",
                                  background: "#fff9eb",
                                  color: "#8c6518",
                                  fontSize: "0.72rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                ⏳ Pendente
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* MODO 2: LISTA REAL DETALHADA */
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {filtered.map((inv) => {
            const isCopied = copiedToken === inv.public_token;
            return (
              <div
                key={inv.id}
                className="admin-draggable-card"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
                      {inv.display_name}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        padding: "2px 10px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor:
                          inv.rsvp_status === "CONFIRMED"
                            ? "#d4edda"
                            : inv.rsvp_status === "DECLINED"
                            ? "#f8d7da"
                            : "#fff3cd",
                        color:
                          inv.rsvp_status === "CONFIRMED"
                            ? "#155724"
                            : inv.rsvp_status === "DECLINED"
                            ? "#721c24"
                            : "#856404",
                      }}
                    >
                      {inv.rsvp_status === "CONFIRMED"
                        ? `Confirmado (${inv.rsvp_guest_count} p.)`
                        : inv.rsvp_status === "DECLINED"
                        ? "Não poderá ir"
                        : "Pendente"}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>
                    <strong>Convidados:</strong> {inv.guests.map((g) => g.name).join(", ") || "Sem nomes nominais"}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => copyInvitationLink(inv.public_token)}
                    className="btn-mini-luxury"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    {isCopied ? "Copiado!" : "Copiar Link"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openWhatsApp(inv)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "0.55rem 0.95rem",
                      borderRadius: "var(--radius-full)",
                      border: "none",
                      background: "#25D366",
                      color: "#fff",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteInvitation(inv.id, inv.display_name)}
                    className="btn-remove-companion"
                    title="Excluir Convite"
                  >
                    <Trash2 size={15} />
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
