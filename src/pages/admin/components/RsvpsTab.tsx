import React, { useState } from "react";
import {
  Gift,
  Sparkles,
  MessageSquareHeart,
  Download,
  Printer,
  Search,
  Phone,
} from "lucide-react";
import type { AdminRsvp } from "../../../lib/adminApi";
import { stripStructuredRsvpTags } from "../../../context/EventContext";

interface RsvpsTabProps {
  rsvps: AdminRsvp[];
}

function parseRsvpNotes(raw: string | null): {
  cleanMessage: string;
  mimos: string[];
  customAnswers: string[];
} {
  if (!raw) return { cleanMessage: "", mimos: [], customAnswers: [] };

  const mimoMatch = raw.match(/\[Mimos?:\s*([^\]]+)\]/i);
  const mimos = mimoMatch?.[1]
    ? mimoMatch[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const ansMatch = raw.match(/\[Respostas?:\s*([^\]]+)\]/i);
  const customAnswers = ansMatch?.[1]
    ? ansMatch[1]
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const cleanMessage = stripStructuredRsvpTags(raw);
  return { cleanMessage, mimos, customAnswers };
}

export const RsvpsTab: React.FC<RsvpsTabProps> = ({ rsvps }) => {
  const [filterStatus, setFilterStatus] = useState<"ALL" | "CONFIRMED" | "DECLINED">("ALL");
  const [search, setSearch] = useState("");

  const filtered = rsvps.filter((r) => {
    const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;
    const matchesSearch =
      r.contact_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.notes || "").toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportCsv = () => {
    const headers = [
      "Responsavel",
      "WhatsApp",
      "Status",
      "Total_Pessoas",
      "Membros",
      "Mimos_Escolhidos",
      "Respostas_Formulario",
      "Mensagem_Capsula",
      "Data_Envio",
    ];
    const rows = rsvps.map((r) => {
      const parsed = parseRsvpNotes(r.notes);
      const membersStr = r.members
        .map((m) => `${m.display_name} (${m.attendance_status === "CONFIRMED" ? "Sim" : "Nao"})`)
        .join("; ");
      return [
        `"${r.contact_name.replace(/"/g, '""')}"`,
        `"${(r.contact_whatsapp || "").replace(/"/g, '""')}"`,
        r.status,
        String(r.guest_count),
        `"${membersStr.replace(/"/g, '""')}"`,
        `"${parsed.mimos.join(", ").replace(/"/g, '""')}"`,
        `"${parsed.customAnswers.join(" | ").replace(/"/g, '""')}"`,
        `"${parsed.cleanMessage.replace(/"/g, '""')}"`,
        r.submitted_at,
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lista-real-cha-da-mayte-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Barra Superior de Filtros e Exportação */}
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
            padding: "0.6rem 1rem",
            borderRadius: "var(--radius-full)",
            border: "1.5px solid rgba(212, 169, 89, 0.45)",
            flex: 1,
            minWidth: "220px",
          }}
        >
          <Search size={16} color="var(--color-gold-deep)" />
          <input
            type="text"
            placeholder="Buscar por nome, mimo ou recado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", width: "100%", background: "transparent", fontSize: "0.9rem" }}
          />
        </div>

        <div className="royal-companion-type-pills">
          {[
            { id: "ALL", label: `Todas (${rsvps.length})` },
            { id: "CONFIRMED", label: "Confirmados" },
            { id: "DECLINED", label: "Ausentes" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterStatus(f.id as any)}
              className={`companion-type-pill ${filterStatus === f.id ? "is-active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" onClick={exportCsv} className="btn-mini-luxury">
            <Download size={14} /> Exportar CSV
          </button>
          <button type="button" onClick={() => window.print()} className="btn-mini-luxury">
            <Printer size={14} /> Imprimir Lista
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="floral-welcome-card" style={{ padding: "3rem", textAlign: "center" }}>
          <p style={{ color: "var(--color-text-soft)", margin: 0 }}>
            Nenhuma resposta encontrada para este filtro.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map((r) => {
            const parsed = parseRsvpNotes(r.notes);
            return (
              <div
                key={r.id}
                className="admin-draggable-card"
                style={{ textAlign: "left", padding: "1.35rem" }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
                      {r.contact_name}
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <Phone size={12} /> {r.contact_whatsapp || "WhatsApp não informado"} • Convite: <strong>{r.invitation_name}</strong>
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: "var(--radius-full)",
                      backgroundColor: r.status === "CONFIRMED" ? "#d4edda" : "#fce8ef",
                      color: r.status === "CONFIRMED" ? "#155724" : "#943554",
                    }}
                  >
                    {r.status === "CONFIRMED"
                      ? `✨ Confirmado (${r.guest_count} ${r.guest_count === 1 ? "pessoa" : "pessoas"})`
                      : "🤍 Não poderá comparecer"}
                  </span>
                </div>

                {/* Mimos Escolhidos */}
                {parsed.mimos.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "0.65rem" }}>
                    {parsed.mimos.map((mimo, i) => (
                      <span
                        key={i}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 10px",
                          borderRadius: "var(--radius-full)",
                          background: "linear-gradient(135deg, #fff6dd 0%, #fde9f0 100%)",
                          border: "1px solid var(--color-gold)",
                          color: "var(--color-gold-deep)",
                          fontSize: "0.76rem",
                          fontWeight: 700,
                        }}
                      >
                        <Gift size={12} /> {mimo}
                      </span>
                    ))}
                  </div>
                )}

                {/* Respostas às Perguntas Personalizadas */}
                {parsed.customAnswers.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "0.65rem" }}>
                    {parsed.customAnswers.map((ans, i) => (
                      <span
                        key={i}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 10px",
                          borderRadius: "var(--radius-full)",
                          background: "#fff",
                          border: "1px solid rgba(212, 169, 89, 0.45)",
                          color: "var(--color-text)",
                          fontSize: "0.76rem",
                          fontWeight: 600,
                        }}
                      >
                        <Sparkles size={12} color="var(--color-gold-deep)" /> {ans}
                      </span>
                    ))}
                  </div>
                )}

                {/* Mensagem da Cápsula do Tempo */}
                {parsed.cleanMessage && (
                  <div
                    style={{
                      background: "linear-gradient(180deg, #fffdf9 0%, #fdf3f6 100%)",
                      borderLeft: "3px solid var(--color-gold)",
                      padding: "0.85rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.9rem",
                      color: "var(--color-text)",
                      fontStyle: "italic",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <MessageSquareHeart size={14} color="var(--color-pink-deep)" style={{ marginRight: "6px", verticalAlign: "middle" }} />
                    “{parsed.cleanMessage}”
                  </div>
                )}

                {/* Membros Confirmados */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {r.members.map((m) => (
                    <span
                      key={m.id}
                      style={{
                        fontSize: "0.75rem",
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full)",
                        background: m.attendance_status === "CONFIRMED" ? "#e8f8f0" : "#fde8e8",
                        color: m.attendance_status === "CONFIRMED" ? "#155724" : "#c0392b",
                        fontWeight: 600,
                      }}
                    >
                      {m.attendance_status === "CONFIRMED" ? "✓" : "✕"} {m.display_name}{" "}
                      {m.guest_type === "CHILD" ? "(Criança)" : ""}{" "}
                      {m.is_additional_guest ? "• Acompanhante" : ""}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
