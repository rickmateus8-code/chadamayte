import React from "react";
import type { AdminRsvp } from "../../../lib/adminApi";

interface RsvpsTabProps {
  rsvps: AdminRsvp[];
}

export const RsvpsTab: React.FC<RsvpsTabProps> = ({ rsvps }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {rsvps.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "var(--color-paper)", borderRadius: "var(--radius-lg)" }}>
          <p style={{ color: "var(--color-text-soft)", margin: 0 }}>Ainda não há respostas registradas.</p>
        </div>
      ) : (
        rsvps.map((r) => (
          <div
            key={r.id}
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-pink-soft)",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
                  {r.contact_name}
                </h3>
                <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                  Convite: <strong>{r.invitation_name}</strong> • Tel: {r.contact_whatsapp || "Não informado"}
                </span>
              </div>

              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: r.status === "CONFIRMED" ? "#d4edda" : "#f8d7da",
                  color: r.status === "CONFIRMED" ? "#155724" : "#721c24",
                }}
              >
                {r.status === "CONFIRMED" ? `Confirmado (${r.guest_count} p.)` : "Recusado"}
              </span>
            </div>

            {r.notes && (
              <div style={{ background: "var(--color-canvas-soft)", padding: "0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", color: "var(--color-text)", fontStyle: "italic", marginBottom: "0.75rem" }}>
                "{r.notes}"
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {r.members.map((m) => (
                <span
                  key={m.id}
                  style={{
                    fontSize: "0.75rem",
                    padding: "3px 8px",
                    borderRadius: "var(--radius-sm)",
                    background: m.attendance_status === "CONFIRMED" ? "#e8f8f0" : "#fde8e8",
                    color: m.attendance_status === "CONFIRMED" ? "#27ae60" : "#c0392b",
                    border: "1px solid currentColor",
                  }}
                >
                  {m.attendance_status === "CONFIRMED" ? "✓" : "✕"} {m.display_name} {m.is_additional_guest ? "(extra)" : ""}
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};