import React from "react";
import type { AdminMedia } from "../../../lib/adminApi";

interface MediaTabProps {
  mediaList: AdminMedia[];
}

export const MediaTab: React.FC<MediaTabProps> = ({ mediaList }) => {
  return (
    <div>
      {mediaList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "var(--color-paper)", borderRadius: "var(--radius-lg)" }}>
          <p style={{ color: "var(--color-text-soft)", margin: 0 }}>Nenhuma foto enviada ainda.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
          {mediaList.map((m) => (
            <div key={m.id} style={{ background: "var(--color-paper)", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--color-pink-soft)" }}>
              <div style={{ padding: "0.75rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text)" }}>{m.original_filename}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--color-text-light)" }}>{new Date(m.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};